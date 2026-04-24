"use client";

import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import type { Channel } from "@prisma/client";

interface ChatAreaProps {
  channel: Channel;
  currentUserId: string;
  isModOrAdmin: boolean;
}

export function ChatArea({ channel, currentUserId, isModOrAdmin }: ChatAreaProps) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-1)",
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
