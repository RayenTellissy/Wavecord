"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { UserPanel } from "@/components/layout/UserPanel";
import { PersonIcon, PlusIcon, XIcon } from "@/components/icons";
import { useSocket } from "@/hooks/useSocket";
import { SocketEvents } from "@/lib/socket";
import type { DMWithRelations } from "@/hooks/useDirectMessages";
import type { Conversation, User } from "@prisma/client";

type ConversationWithMembers = Conversation & {
  memberOne: Pick<User, "id" | "name" | "username" | "image">;
  memberTwo: Pick<User, "id" | "name" | "username" | "image">;
  directMessages: { content: string; createdAt: Date; deleted: boolean }[];
};

interface DMSidebarProps {
  currentUserId: string;
  initialConversations: ConversationWithMembers[];
}

export function DMSidebar({ currentUserId, initialConversations }: DMSidebarProps) {
  const params = useParams();
  const router = useRouter();
  const activeConversationId = params?.conversationId as string | undefined;

  const [conversations, setConversations] = useState(initialConversations);
  const { socket } = useSocket();
  const [showNewDM, setShowNewDM] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Pick<User, "id" | "name" | "username" | "image">[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keep sidebar in sync with incoming DMs (preview + ordering)
  useEffect(() => {
    if (!socket) return;

    function bumpConversation(message: DMWithRelations) {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === message.conversationId);
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          updatedAt: new Date(message.createdAt),
          directMessages: [
            {
              content: message.content,
              createdAt: new Date(message.createdAt),
              deleted: message.deleted,
            },
          ],
        };
        const next = prev.slice();
        next.splice(idx, 1);
        return [updated, ...next];
      });
    }

    socket.on(SocketEvents.DM_MESSAGE_NEW, bumpConversation);
    return () => {
      socket.off(SocketEvents.DM_MESSAGE_NEW, bumpConversation);
    };
  }, [socket]);

  // Auto-focus search input when panel opens
  useEffect(() => {
    if (showNewDM) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
      setResults([]);
    }
  }, [showNewDM]);

  // Debounced user search
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await axios.get<Pick<User, "id" | "name" | "username" | "image">[]>(
          `/api/users/search?q=${encodeURIComponent(search)}`
        );
        setResults(res.data.filter((u) => u.id !== currentUserId));
      } catch {
        // ignore
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, currentUserId]);

  async function handleStartDM(targetUserId: string) {
    try {
      const res = await axios.post<ConversationWithMembers>("/api/conversations", { targetUserId });
      const conv = res.data;

      // Add to local list if not already present
      setConversations((prev) => {
        if (prev.find((c) => c.id === conv.id)) return prev;
        return [conv, ...prev];
      });

      setShowNewDM(false);
      router.push(`/conversations/${conv.id}`);
    } catch {
      // ignore
    }
  }

  return (
    <div style={{
      width: 240,
      minWidth: 240,
      background: "var(--surface-1)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "0.9rem 1rem",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Direct Messages</span>
        <button
          onClick={() => setShowNewDM(true)}
          style={{
            display: "flex",
            padding: "3px",
            borderRadius: "4px",
            color: "var(--text-muted)",
            transition: "color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.color = "var(--text-primary)");
            (e.currentTarget.style.background = "var(--surface-2)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.color = "var(--text-muted)");
            (e.currentTarget.style.background = "transparent");
          }}
          title="New Direct Message"
        >
          <PlusIcon size={16} />
        </button>
      </div>

      {/* New DM search panel */}
      <AnimatePresence>
        {showNewDM && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden", flexShrink: 0, borderBottom: "1px solid var(--border)" }}
          >
            <div style={{ padding: "0.6rem 0.75rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "0.3rem 0.5rem",
              }}>
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users…"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                  }}
                />
                <button
                  onClick={() => setShowNewDM(false)}
                  style={{ display: "flex", color: "var(--text-muted)", flexShrink: 0 }}
                >
                  <XIcon size={14} />
                </button>
              </div>

              {/* Search results */}
              {searching && (
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "0.5rem 0.25rem" }}>
                  Searching…
                </p>
              )}
              {!searching && results.length > 0 && (
                <div style={{ marginTop: "0.4rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {results.slice(0, 8).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartDM(user.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.4rem 0.4rem",
                        borderRadius: "6px",
                        textAlign: "left",
                        width: "100%",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget.style.background = "var(--surface-2)"); }}
                      onMouseLeave={(e) => { (e.currentTarget.style.background = "transparent"); }}
                    >
                      <UserAvatar user={user} size={28} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: "0.84rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {user.name ?? user.username}
                        </p>
                        {user.username && (
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {!searching && search.trim() && results.length === 0 && (
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "0.5rem 0.25rem" }}>
                  No users found
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
        {conversations.length === 0 && (
          <p style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "1.5rem 1rem",
            lineHeight: 1.5,
          }}>
            No conversations yet. Click <strong>+</strong> to start one.
          </p>
        )}

        {conversations.map((conv) => {
          const other = conv.memberOneId === currentUserId ? conv.memberTwo : conv.memberOne;
          const isActive = conv.id === activeConversationId;
          const lastMsg = conv.directMessages?.[0];

          return (
            <Link key={conv.id} href={`/conversations/${conv.id}`} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ x: 2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.5rem 0.4rem 0.75rem",
                  margin: "0.05rem 0.5rem",
                  borderRadius: "6px",
                  background: isActive ? "var(--surface-2)" : "transparent",
                  transition: "background 0.12s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget.style.background = "var(--surface-2)");
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget.style.background = "transparent");
                }}
              >
                <UserAvatar user={other} size={32} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {other.name ?? other.username ?? "User"}
                  </p>
                  {lastMsg && (
                    <p style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {lastMsg.deleted ? "Message deleted" : lastMsg.content}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <UserPanel />
    </div>
  );
}

function UserAvatar({ user, size }: { user: Pick<User, "name" | "image">; size: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      background: "var(--surface-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-secondary)",
      flexShrink: 0,
    }}>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name ?? ""}
          width={size}
          height={size}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <PersonIcon size={Math.floor(size * 0.5)} />
      )}
    </div>
  );
}
