"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useParty, type PartyMessage } from "./useParty";
import { PartyEvents } from "@/party/types";
import { playNotificationSound } from "@/lib/sounds";
import { useNotificationStore } from "@/stores/notificationStore";
import { useDmUnreadStore } from "@/stores/dmUnreadStore";

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
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const mutedChannelIds = useRef<Set<string>>(new Set());
  const push = useNotificationStore((s) => s.push);
  const incrementUnread = useDmUnreadStore((s) => s.increment);
  const clearUnread = useDmUnreadStore((s) => s.clear);

  useEffect(() => {
    const match = pathname.match(/\/conversations\/([^/]+)/);
    if (match) clearUnread(match[1]);
  }, [pathname, clearUnread]);

  useEffect(() => { pathnameRef.current = pathname; });

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission();
  }, []);

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

  const onMessage = useCallback((msg: PartyMessage) => {
    if (!session?.user) return;

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

    if (msg.event === PartyEvents.CHANNEL_MESSAGE_NOTIFY) {
      const payload = msg.payload as ChannelNotifyPayload;
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
    } else if (msg.event === PartyEvents.DM_MESSAGE_NEW) {
      const message = msg.payload as DirectMessage;
      if (message.senderId === session.user.id) return;
      const onConvPage = pathnameRef.current.includes(`/conversations/${message.conversationId}`);
      if (!onConvPage) {
        incrementUnread({
          conversationId: message.conversationId,
          senderName: message.sender.name ?? message.sender.username,
          senderAvatar: message.sender.image,
          href: `/conversations/${message.conversationId}`,
        });
      }
      if (onConvPage) return;
      notify(
        message.sender.username,
        message.content || "Sent an attachment",
        message.sender.image,
        `/conversations/${message.conversationId}`,
        "dm",
      );
    }
  }, [session, push, incrementUnread]);

  useParty({ party: "user", room: session?.user?.id, userId: session?.user?.id, onMessage });
}
