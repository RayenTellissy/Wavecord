"use client";

import { useEffect, useRef, useCallback } from "react";
import { differenceInMinutes } from "date-fns";
import { DMMessageItem } from "./DMMessageItem";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { PersonIcon } from "@/components/icons";
import type { User } from "@prisma/client";

interface DMMessageListProps {
  conversationId: string;
  recipient: Pick<User, "id" | "name" | "username" | "image">;
  currentUserId: string;
}

export function DMMessageList({ conversationId, recipient, currentUserId }: DMMessageListProps) {
  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useDirectMessages(conversationId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    if (messages.length > 0 && isInitialLoad.current) {
      bottomRef.current?.scrollIntoView();
      isInitialLoad.current = false;
    }
  }, [messages.length]);

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

  const handleTopVisible = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        const container = containerRef.current;
        const prevScrollHeight = container?.scrollHeight ?? 0;
        fetchNextPage().then(() => {
          if (container) {
            container.scrollTop += container.scrollHeight - prevScrollHeight;
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

  const recipientName = recipient.name ?? recipient.username ?? "User";

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
      <div ref={topRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <div style={{ padding: "0.75rem", display: "flex", justifyContent: "center" }}>
          <LoadingSpinner size={20} />
        </div>
      )}

      {/* Conversation start header */}
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
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            marginBottom: "1rem",
            overflow: "hidden",
          }}>
            {recipient.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={recipient.image}
                alt={recipientName}
                style={{ width: 64, height: 64, objectFit: "cover" }}
              />
            ) : (
              <PersonIcon size={32} />
            )}
          </div>
          <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.35rem" }}>
            {recipientName}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            This is the beginning of your direct message history with{" "}
            <strong>{recipientName}</strong>.
          </p>
        </div>
      )}

      {messages.map((message, i) => {
        const prev = messages[i - 1];
        const isGrouped =
          !!prev &&
          prev.senderId === message.senderId &&
          differenceInMinutes(new Date(message.createdAt), new Date(prev.createdAt)) < 5 &&
          !prev.deleted;

        return (
          <DMMessageItem
            key={message.id}
            message={message}
            isGrouped={isGrouped}
            currentUserId={currentUserId}
            conversationId={conversationId}
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
          No messages yet. Say hello!
        </div>
      )}

      <div ref={bottomRef} style={{ height: 16 }} />
    </div>
  );
}

function LoadingSpinner({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="2.5" />
      <path d="M12 2C6.477 2 2 6.477 2 12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
