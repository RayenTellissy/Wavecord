"use client";

import { useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useVoiceStore } from "@/stores/voiceStore";
import type { Channel } from "@prisma/client";

interface ChatAreaProps {
  channel: Channel;
  currentUserId: string;
  isModOrAdmin: boolean;
}

export function ChatArea({ channel, currentUserId, isModOrAdmin }: ChatAreaProps) {
  const setLastTextChannel = useVoiceStore((s) => s.setLastTextChannel);
  useEffect(() => {
    setLastTextChannel(channel.id, channel.serverId);
  }, [channel.id, channel.serverId, setLastTextChannel]);

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-3)",
      minWidth: 0,
      overflow: "hidden",
    }}>
      <ChatHeader channel={channel} />
      <MessageList
        channelId={channel.id}
        channelName={channel.name}
        currentUserId={currentUserId}
        isModOrAdmin={isModOrAdmin}
      />
      <MessageInput
        channelId={channel.id}
        channelName={channel.name}
      />
    </div>
  );
}
