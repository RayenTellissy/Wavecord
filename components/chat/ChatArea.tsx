"use client";

import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useVoiceStore } from "@/stores/voiceStore";
import type { Channel } from "@prisma/client";

export type ReplyTarget = {
  id: string;
  content: string;
  authorName: string;
};

interface ChatAreaProps {
  channel: Channel;
  currentUserId: string;
  isModOrAdmin: boolean;
}

export function ChatArea({ channel, currentUserId, isModOrAdmin }: ChatAreaProps) {
  const setLastTextChannel = useVoiceStore((s) => s.setLastTextChannel);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

  useEffect(() => {
    setLastTextChannel(channel.id, channel.serverId);
  }, [channel.id, channel.serverId, setLastTextChannel]);

  // Clear reply when switching channels
  useEffect(() => {
    setReplyTo(null);
  }, [channel.id]);

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "rgba(10,10,14,0.18)",
      backdropFilter: "blur(60px) saturate(2.6) brightness(1.04)",
      WebkitBackdropFilter: "blur(60px) saturate(2.6) brightness(1.04)",
      minWidth: 0,
      overflow: "hidden",
    }}>
      <ChatHeader channel={channel} />
      <MessageList
        channelId={channel.id}
        channelName={channel.name}
        currentUserId={currentUserId}
        isModOrAdmin={isModOrAdmin}
        onReply={setReplyTo}
        serverId={channel.serverId}
      />
      <MessageInput
        channelId={channel.id}
        channelName={channel.name}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />
    </div>
  );
}
