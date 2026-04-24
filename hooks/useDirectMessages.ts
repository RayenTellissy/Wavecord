"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { SocketEvents } from "@/lib/socket";
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
  const { socket } = useSocket();
  const queryKey = ["direct-messages", conversationId];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchDirectMessages(conversationId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    if (!socket) return;

    function onNewMessage(message: DMWithRelations) {
      if (message.conversationId !== conversationId) return;
      queryClient.setQueryData<DMQueryData>(queryKey, (old) => {
        if (!old) return old;
        // Dedup in case the sender's optimistic insert already added it
        const alreadyInCache = old.pages.some((p) =>
          p.messages.some((m) => m.id === message.id)
        );
        if (alreadyInCache) return old;
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, messages: [message, ...page.messages] } : page
          ),
        };
      });
    }

    function onUpdateMessage(message: DMWithRelations) {
      if (message.conversationId !== conversationId) return;
      queryClient.setQueryData<DMQueryData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) =>
              m.id === message.id ? message : m
            ),
          })),
        };
      });
    }

    socket.on(SocketEvents.DM_MESSAGE_NEW, onNewMessage);
    socket.on(SocketEvents.DM_MESSAGE_UPDATE, onUpdateMessage);
    socket.on(SocketEvents.DM_MESSAGE_DELETE, onUpdateMessage);

    return () => {
      socket.off(SocketEvents.DM_MESSAGE_NEW, onNewMessage);
      socket.off(SocketEvents.DM_MESSAGE_UPDATE, onUpdateMessage);
      socket.off(SocketEvents.DM_MESSAGE_DELETE, onUpdateMessage);
    };
  }, [socket, conversationId, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  const messages =
    query.data?.pages
      .flatMap((p) => p.messages)
      .slice()
      .reverse() ?? [];

  return { ...query, messages };
}
