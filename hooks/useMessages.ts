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
        // If the sender's optimistic copy is still in the cache, swap it in place
        // so the full-color real message doesn't appear alongside the grayed-out one.
        const optimisticMatch = data.pages
          .flatMap((p) => p.messages)
          .find(
            (m) =>
              m.id.startsWith("optimistic-") &&
              m.authorId === message.authorId &&
              m.content === message.content
          );
        if (optimisticMatch) {
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m.id === optimisticMatch.id ? message : m
              ),
            })),
          };
        }
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

    function onDeleteMessage(payload: { id: string }) {
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
            messages: page.messages.filter((m) => m.id !== payload.id),
          })),
        };
      });
    }

    socket.on(SocketEvents.CHANNEL_MESSAGE_NEW, onNewMessage);
    socket.on(SocketEvents.CHANNEL_MESSAGE_UPDATE, onUpdateMessage);
    socket.on(SocketEvents.CHANNEL_MESSAGE_DELETE, onDeleteMessage);

    return () => {
      socket.emit("leave-channel", channelId);
      socket.off("connect", joinRoom);
      socket.off(SocketEvents.CHANNEL_MESSAGE_NEW, onNewMessage);
      socket.off(SocketEvents.CHANNEL_MESSAGE_UPDATE, onUpdateMessage);
      socket.off(SocketEvents.CHANNEL_MESSAGE_DELETE, onDeleteMessage);
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
