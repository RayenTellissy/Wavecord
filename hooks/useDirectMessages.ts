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

async function fetchDirectMessages(conversationId: string, cursor?: string) {
  const url = `/api/direct-messages?conversationId=${conversationId}${cursor ? `&cursor=${cursor}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json() as Promise<{
    messages: DMWithRelations[];
    nextCursor: string | null;
  }>;
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

    function joinRoom() {
      socket!.emit("join-dm", conversationId);
    }

    joinRoom();
    socket.on("connect", joinRoom);

    function onNewMessage(message: DMWithRelations) {
      queryClient.setQueryData(queryKey, (old: Parameters<typeof queryClient.setQueryData>[1]) => {
        if (!old) return old;
        const data = old as {
          pages: { messages: DMWithRelations[]; nextCursor: string | null }[];
          pageParams: unknown[];
        };
        return {
          ...data,
          pages: data.pages.map((page, i) =>
            i === 0 ? { ...page, messages: [message, ...page.messages] } : page
          ),
        };
      });
    }

    function onUpdateMessage(message: DMWithRelations) {
      queryClient.setQueryData(queryKey, (old: Parameters<typeof queryClient.setQueryData>[1]) => {
        if (!old) return old;
        const data = old as {
          pages: { messages: DMWithRelations[]; nextCursor: string | null }[];
          pageParams: unknown[];
        };
        return {
          ...data,
          pages: data.pages.map((page) => ({
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
      socket.emit("leave-dm", conversationId);
      socket.off("connect", joinRoom);
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
