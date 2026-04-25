"use client";

import { DMHeader } from "./DMHeader";
import { DMMessageList } from "./DMMessageList";
import { DMMessageInput } from "./DMMessageInput";
import type { User } from "@prisma/client";

interface DMChatAreaProps {
  conversationId: string;
  recipient: Pick<User, "id" | "name" | "username" | "image">;
  currentUserId: string;
}

export function DMChatArea({ conversationId, recipient, currentUserId }: DMChatAreaProps) {
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
      <DMHeader recipient={recipient} />
      <DMMessageList
        conversationId={conversationId}
        recipient={recipient}
        currentUserId={currentUserId}
      />
      <DMMessageInput
        conversationId={conversationId}
        recipientName={recipient.name ?? recipient.username ?? "User"}
      />
    </div>
  );
}
