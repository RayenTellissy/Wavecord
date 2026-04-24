"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { SocketEvents } from "@/lib/socket";
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
  return res.json() as Promise<{
    messages: MessageWithRelations[];
    nextCursor: string | null;
  }>;
}

export function useMessages(channelId: string) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const queryKey = ["messages", channelId];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchMessages(channelId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    if (!socket) return;

    function joinRoom() {
      socket!.emit("join-channel", channelId);
    }

    joinRoom();
    socket.on("connect", joinRoom);

    function onNewMessage(message: MessageWithRelations) {
      queryClient.setQueryData(queryKey, (old: Parameters<typeof queryClient.setQueryData>[1]) => {
        if (!old) return old;
        const data = old as {
          pages: { messages: MessageWithRelations[]; nextCursor: string | null }[];
          pageParams: unknown[];
        };
        const alreadyInCache = data.pages.some((p) =>
          p.messages.some((m) => m.id === message.id)
        );
        if (alreadyInCache) return old;
        return {
          ...data,
          pages: data.pages.map((page, i) =>
            i === 0
              ? { ...page, messages: [message, ...page.messages] }
              : page
          ),
        };
      });
    }

    function onUpdateMessage(message: MessageWithRelations) {
      queryClient.setQueryData(queryKey, (old: Parameters<typeof queryClient.setQueryData>[1]) => {
        if (!old) return old;
        const data = old as {
          pages: { messages: MessageWithRelations[]; nextCursor: string | null }[];
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

    socket.on(SocketEvents.CHANNEL_MESSAGE_NEW, onNewMessage);
    socket.on(SocketEvents.CHANNEL_MESSAGE_UPDATE, onUpdateMessage);
    socket.on(SocketEvents.CHANNEL_MESSAGE_DELETE, onUpdateMessage);

    return () => {
      socket.emit("leave-channel", channelId);
      socket.off("connect", joinRoom);
      socket.off(SocketEvents.CHANNEL_MESSAGE_NEW, onNewMessage);
      socket.off(SocketEvents.CHANNEL_MESSAGE_UPDATE, onUpdateMessage);
      socket.off(SocketEvents.CHANNEL_MESSAGE_DELETE, onUpdateMessage);
    };
  }, [socket, channelId, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flatten pages into a chronological list (oldest first for display)
  const messages =
    query.data?.pages
      .flatMap((p) => p.messages)
      .slice()
      .reverse() ?? [];

  return { ...query, messages };
}
