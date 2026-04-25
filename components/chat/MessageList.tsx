"use client";

import { useEffect, useRef, useCallback } from "react";
import { MessageItem } from "./MessageItem";
import { useMessages } from "@/hooks/useMessages";
import { differenceInMinutes } from "date-fns";
import { HashIcon } from "@/components/icons";
import type { Message, User } from "@prisma/client";

interface MessageListProps {
  channelId: string;
  channelName: string;
  currentUserId: string;
  isModOrAdmin: boolean;
}

export function MessageList({ channelId, channelName, currentUserId, isModOrAdmin }: MessageListProps) {
  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMessages(channelId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const prevMessageCountRef = useRef(0);

  // Auto-scroll to bottom on initial load and new messages
  useEffect(() => {
    if (messages.length > 0 && isInitialLoad.current) {
      bottomRef.current?.scrollIntoView();
      isInitialLoad.current = false;
    }
  }, [messages.length]);

  // Scroll to bottom only when a genuinely new message is added (not when an
  // optimistic message is swapped out for the real one — same count, different id).
  useEffect(() => {
    if (!containerRef.current || isInitialLoad.current) return;
    if (messages.length <= prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      return;
    }
    prevMessageCountRef.current = messages.length;
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // IntersectionObserver for infinite scroll (load older messages)
  const handleTopVisible = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        const container = containerRef.current;
        const prevScrollHeight = container?.scrollHeight ?? 0;

        fetchNextPage().then(() => {
          // Preserve scroll position after loading older messages
          if (container) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop += newScrollHeight - prevScrollHeight;
          }
        });
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleTopVisible, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleTopVisible]);

  if (isLoading) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top sentinel for infinite scroll */}
      <div ref={topRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <div style={{ padding: "0.75rem", display: "flex", justifyContent: "center" }}>
          <LoadingSpinner size={20} />
        </div>
      )}

      {/* Channel welcome header (shown when no more pages) */}
      {!hasNextPage && (
        <div style={{
          padding: "1.5rem 1rem 0.75rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "0.5rem",
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-bright)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "var(--accent-glow-sm)",
            marginBottom: "1rem",
          }}>
            <HashIcon size={32} />
          </div>
          <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.35rem" }}>
            Welcome to #{channelName}!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            This is the beginning of the #{channelName} channel.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, i) => {
        const prev = messages[i - 1];
        const isGrouped =
          !!prev &&
          prev.authorId === message.authorId &&
          differenceInMinutes(
            new Date(message.createdAt),
            new Date(prev.createdAt)
          ) < 5 &&
          !prev.deleted;

        return (
          <MessageItem
            key={message.id}
            message={message as Parameters<typeof MessageItem>[0]["message"]}
            isGrouped={isGrouped}
            currentUserId={currentUserId}
            channelId={channelId}
            isModOrAdmin={isModOrAdmin}
          />
        );
      })}

      {messages.length === 0 && !isLoading && (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          paddingBottom: "2rem",
        }}>
          No messages yet. Be the first to say something!
        </div>
      )}

      {/* Bottom anchor */}
      <div ref={bottomRef} style={{ height: 16 }} />
    </div>
  );
}

function LoadingSpinner({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
      <path d="M12 2C6.477 2 2 6.477 2 12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
