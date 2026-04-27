"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useParty, type PartyMessage } from "./useParty";
import { PartyEvents } from "@/party/types";
import type { Message, User, Reaction, Attachment } from "@prisma/client";

type MessageWithRelations = Message & {
  author: Pick<User, "id" | "name" | "username" | "image">;
  reactions: (Reaction & { user: Pick<User, "id" | "name"> })[];
  replyTo: (Message & { author: Pick<User, "id" | "name" | "image"> }) | null;
  attachments: Attachment[];
};

async function fetchMessages(channelId: string, cursor?: string) {
  const url = `/api/messages?channelId=${channelId}${cursor ? `&cursor=${cursor}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json() as Promise<{ messages: MessageWithRelations[]; nextCursor: string | null }>;
}

type CacheData = {
  pages: { messages: MessageWithRelations[]; nextCursor: string | null }[];
  pageParams: unknown[];
};

export function useMessages(channelId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["messages", channelId];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchMessages(channelId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const onMessage = useCallback((msg: PartyMessage) => {
    if (msg.event === PartyEvents.CHANNEL_MESSAGE_NEW) {
      const message = msg.payload as MessageWithRelations;
      queryClient.setQueryData<CacheData>(queryKey, (old) => {
        if (!old) return old;
        const alreadyInCache = old.pages.some((p) => p.messages.some((m) => m.id === message.id));
        if (alreadyInCache) return old;
        const optimisticMatch = old.pages
          .flatMap((p) => p.messages)
          .find(
            (m) =>
              m.id.startsWith("optimistic-") &&
              m.authorId === message.authorId &&
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
    } else if (msg.event === PartyEvents.CHANNEL_MESSAGE_UPDATE) {
      const message = msg.payload as MessageWithRelations;
      queryClient.setQueryData<CacheData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) => (m.id === message.id ? message : m)),
          })),
        };
      });
    } else if (msg.event === PartyEvents.CHANNEL_MESSAGE_DELETE) {
      const payload = msg.payload as { id: string };
      queryClient.setQueryData<CacheData>(queryKey, (old) => {
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
  }, [queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  useParty({ party: "channel", room: channelId, onMessage });

  const messages = query.data?.pages.flatMap((p) => p.messages).slice().reverse() ?? [];
  return { ...query, messages };
}
