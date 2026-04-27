"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useParty, type PartyMessage } from "./useParty";
import { PartyEvents } from "@/party/types";
import type { DirectMessage, User, Attachment } from "@prisma/client";

export type DMWithRelations = DirectMessage & {
  sender: Pick<User, "id" | "name" | "username" | "image">;
  attachments: Attachment[];
};

type DMPage = { messages: DMWithRelations[]; nextCursor: string | null };
type DMQueryData = { pages: DMPage[]; pageParams: unknown[] };

async function fetchDirectMessages(conversationId: string, cursor?: string) {
  const url = `/api/direct-messages?conversationId=${conversationId}${cursor ? `&cursor=${cursor}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json() as Promise<DMPage>;
}

export function useDirectMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["direct-messages", conversationId];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchDirectMessages(conversationId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const onMessage = useCallback((msg: PartyMessage) => {
    if (msg.event === PartyEvents.DM_MESSAGE_NEW) {
      const message = msg.payload as DMWithRelations;
      if (message.conversationId !== conversationId) return;
      queryClient.setQueryData<DMQueryData>(queryKey, (old) => {
        if (!old) return old;
        const alreadyInCache = old.pages.some((p) => p.messages.some((m) => m.id === message.id));
        if (alreadyInCache) return old;
        const optimisticMatch = old.pages
          .flatMap((p) => p.messages)
          .find(
            (m) =>
              m.id.startsWith("optimistic-") &&
              m.senderId === message.senderId &&
              m.content === message.content
          );
        if (optimisticMatch) {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) => (m.id === optimisticMatch.id ? message : m)),
            })),
          };
        }
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, messages: [message, ...page.messages] } : page
          ),
        };
      });
    } else if (msg.event === PartyEvents.DM_MESSAGE_UPDATE) {
      const message = msg.payload as DMWithRelations;
      if (message.conversationId !== conversationId) return;
      queryClient.setQueryData<DMQueryData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) => (m.id === message.id ? message : m)),
          })),
        };
      });
    } else if (msg.event === PartyEvents.DM_MESSAGE_DELETE) {
      const payload = msg.payload as { id: string; conversationId: string };
      if (payload.conversationId !== conversationId) return;
      queryClient.setQueryData<DMQueryData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.filter((m) => m.id !== payload.id),
          })),
        };
      });
    }
  }, [conversationId, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  useParty({ party: "dm", room: conversationId, onMessage });

  const messages = query.data?.pages.flatMap((p) => p.messages).slice().reverse() ?? [];
  return { ...query, messages };
}
