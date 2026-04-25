"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSocket } from "./useSocket";
import { SocketEvents } from "@/lib/socket";
import { playNotificationSound } from "@/lib/sounds";
import { useNotificationStore } from "@/stores/notificationStore";

interface ChannelNotifyPayload {
  channelId: string;
  serverId: string;
  channelName: string;
  message: {
    id: string;
    content: string;
    authorId: string;
    author: { username: string; name: string | null; image: string | null };
  };
}

interface DirectMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  sender: { id: string; username: string; name: string | null; image: string | null };
}

export function useNotifications() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const mutedChannelIds = useRef<Set<string>>(new Set());
  const push = useNotificationStore((s) => s.push);

  useEffect(() => {
    pathnameRef.current = pathname;
  });

  // Request browser notification permission once
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Load muted channel IDs from the server once on mount
  useEffect(() => {
    fetch("/api/users/profile/notifications")
      .then((r) => r.json())
      .then((data: { servers?: { channels?: { id: string; muted: boolean }[] }[] }) => {
        const muted = new Set<string>();
        for (const server of data.servers ?? []) {
          for (const ch of server.channels ?? []) {
            if (ch.muted) muted.add(ch.id);
          }
        }
        mutedChannelIds.current = muted;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket || !session?.user) return;

    const notify = (
      title: string,
      body: string,
      avatarUrl: string | null,
      href: string,
      type: "channel" | "dm",
    ) => {
      playNotificationSound();
      push({ title, body, avatarUrl, href, type });

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted" &&
        !document.hasFocus()
      ) {
        const n = new Notification(title, { body, icon: "/favicon.ico", tag: href });
        n.onclick = () => { window.focus(); n.close(); };
      }
    };

    const handleChannelNotify = (payload: ChannelNotifyPayload) => {
      if (payload.message.authorId === session.user.id) return;
      if (mutedChannelIds.current.has(payload.channelId)) return;
      if (pathnameRef.current.includes(`/channels/${payload.channelId}`)) return;

      const { author } = payload.message;
      const body = payload.message.content || "Sent an attachment";
      notify(
        `#${payload.channelName}`,
        `${author.username}: ${body}`,
        author.image,
        `/servers/${payload.serverId}/channels/${payload.channelId}`,
        "channel",
      );
    };

    const handleDmNew = (message: DirectMessage) => {
      if (message.senderId === session.user.id) return;
      if (pathnameRef.current.includes(`/conversations/${message.conversationId}`)) return;

      notify(
        message.sender.username,
        message.content || "Sent an attachment",
        message.sender.image,
        `/conversations/${message.conversationId}`,
        "dm",
      );
    };

    socket.on(SocketEvents.CHANNEL_MESSAGE_NOTIFY, handleChannelNotify);
    socket.on(SocketEvents.DM_MESSAGE_NEW, handleDmNew);

    return () => {
      socket.off(SocketEvents.CHANNEL_MESSAGE_NOTIFY, handleChannelNotify);
      socket.off(SocketEvents.DM_MESSAGE_NEW, handleDmNew);
    };
  }, [socket, session, push]);
}
