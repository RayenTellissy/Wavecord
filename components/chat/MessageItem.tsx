"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EditIcon, TrashIcon, ReplyIcon, PersonIcon } from "@/components/icons";
import Image from "next/image";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/stores/modalStore";
import type { ReplyTarget } from "./ChatArea";
import type { Message, User, Reaction, Attachment } from "@prisma/client";

type MessageWithRelations = Message & {
  author: Pick<User, "id" | "name" | "username" | "image">;
  reactions: (Reaction & { user: Pick<User, "id" | "name"> })[];
  replyTo: (Message & { author: Pick<User, "id" | "name" | "image"> }) | null;
  attachments: Attachment[];
};

interface MessageItemProps {
  message: MessageWithRelations;
  isGrouped: boolean; // same author as previous message within 5 min
  currentUserId: string;
  channelId: string;
  isModOrAdmin: boolean;
  onReply: (target: ReplyTarget) => void;
}

function formatTimestamp(date: Date): string {
  if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
  if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
  return format(date, "MMM d, yyyy h:mm a");
}

export function MessageItem({
  message,
  isGrouped,
  currentUserId,
  channelId,
  isModOrAdmin,
  onReply,
}: MessageItemProps) {
  const { open: openModal } = useModal();
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isPending = message.id.startsWith("optimistic-");
  const isOwn = message.authorId === currentUserId;
  const canDelete = isOwn || isModOrAdmin;
  const canEdit = isOwn && !message.deleted && !isPending;

  async function handleEdit() {
    const newContent = editContent.trim();
    if (!newContent || newContent === message.content) {
      setEditing(false);
      return;
    }

    const queryKey = ["messages", channelId];
    const snapshot = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (old: unknown) => {
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
            m.id === message.id
              ? { ...m, content: newContent, updatedAt: new Date().toISOString() }
              : m
          ),
        })),
      };
    });

    setEditing(false);

    try {
      await axios.patch(`/api/messages/${message.id}`, { content: newContent });
    } catch {
      queryClient.setQueryData(queryKey, snapshot);
      setEditContent(newContent);
      setEditing(true);
    }
  }

  function handleDelete() {
    openModal("deleteMessage", { messageId: message.id });
  }

  const createdAt = new Date(message.createdAt);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: `${isGrouped ? "0.1rem" : "0.75rem"} 1rem 0.1rem`,
        position: "relative",
        background: hovered && !isPending
          ? "rgba(139,92,246,0.055)"
          : "transparent",
        transition: "background 0.15s",
        borderLeft: hovered && !isPending
          ? "2px solid rgba(139,92,246,0.3)"
          : "2px solid transparent",
      }}
    >
      {/* Avatar column */}
      <div style={{ width: 40, flexShrink: 0 }}>
        {!isGrouped ? (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden",
            background: "rgba(139,92,246,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}>
            {message.author.image ? (
              <Image
                src={message.author.image}
                alt={message.author.name ?? ""}
                width={40}
                height={40}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <PersonIcon size={20} />
            )}
          </div>
        ) : hovered ? (
          <span style={{
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            paddingTop: "0.1rem",
          }}>
            {format(createdAt, "h:mm")}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {!isGrouped && (
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.15rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>
              {message.author.name ?? message.author.username ?? "User"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {formatTimestamp(createdAt)}
            </span>
          </div>
        )}

        {/* Reply indicator */}
        {message.replyTo && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.25rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
          }}>
            <ReplyIcon size={14} />
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              {message.replyTo.author.name}
            </span>
            <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 300,
            }}>
              {message.replyTo.content}
            </span>
          </div>
        )}

        {/* Message body */}
        {editing ? (
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEdit(); }
                if (e.key === "Escape") { setEditing(false); setEditContent(message.content); }
              }}
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(139,92,246,0.5)",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
                color: "var(--text-primary)",
                resize: "none",
                outline: "none",
                fontSize: "0.92rem",
                lineHeight: 1.5,
                minHeight: 60,
                boxShadow: "0 0 0 3px rgba(139,92,246,0.1)",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem", fontSize: "0.78rem" }}>
              <span style={{ color: "var(--text-muted)" }}>
                esc to <button onClick={() => { setEditing(false); setEditContent(message.content); }}
                  style={{ color: "var(--accent)", fontWeight: 500 }}>cancel</button>
                {" · "}enter to <button onClick={handleEdit}
                  style={{ color: "var(--accent)", fontWeight: 500 }}>save</button>
              </span>
            </div>
          </div>
        ) : (
          <div style={{
            color: message.deleted ? "var(--text-muted)" : "var(--text-primary)",
            fontSize: "0.92rem",
            lineHeight: 1.5,
            fontStyle: message.deleted ? "italic" : "normal",
          }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <span>{children}</span>,
                code: ({ children }) => (
                  <code style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    padding: "0.1em 0.35em",
                    borderRadius: "4px",
                    fontSize: "0.85em",
                    fontFamily: "monospace",
                    color: "var(--accent-bright)",
                  }}>{children}</code>
                ),
                pre: ({ children }) => (
                  <pre style={{
                    background: "rgba(10,10,15,0.8)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    overflow: "auto",
                    fontSize: "0.85em",
                    marginTop: "0.35rem",
                    backdropFilter: "blur(8px)",
                  }}>{children}</pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.updatedAt !== message.createdAt && !message.deleted && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "0.35rem" }}>
                (edited)
              </span>
            )}
          </div>
        )}

        {/* Legacy single fileUrl */}
        {message.fileUrl && !message.deleted && (
          <div style={{ marginTop: "0.5rem" }}>
            <Image
              src={message.fileUrl}
              alt="attachment"
              width={300}
              height={200}
              style={{ borderRadius: "8px", maxWidth: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Attachment records */}
        {!message.deleted && message.attachments.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.5rem" }}>
            {message.attachments.map((att) =>
              att.fileType.startsWith("image/") ? (
                <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={att.url}
                    alt={att.fileName}
                    width={360}
                    height={240}
                    style={{
                      borderRadius: "8px",
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </a>
              ) : (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: "8px",
                      padding: "0.5rem 0.75rem",
                      maxWidth: 320,
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)");
                      (e.currentTarget.style.boxShadow = "var(--accent-glow-sm)");
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");
                      (e.currentTarget.style.boxShadow = "none");
                    }}
                  >
                    <FileIcon fileType={att.fileType} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--accent)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 220,
                      }}>
                        {att.fileName}
                      </p>
                      {att.fileSize && (
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {formatBytes(att.fileSize)}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              )
            )}
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
            {Object.entries(
              message.reactions.reduce((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] ?? []).concat(r.user.name ?? "");
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([emoji, users]) => (
              <motion.div
                key={emoji}
                whileHover={{ scale: 1.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "12px",
                  background: users.includes(currentUserId)
                    ? "rgba(139,92,246,0.18)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${users.includes(currentUserId) ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.09)"}`,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  boxShadow: users.includes(currentUserId) ? "var(--accent-glow-sm)" : "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span>{emoji}</span>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{users.length}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hover action buttons — hidden on pending optimistic messages */}
      <AnimatePresence>
        {hovered && !editing && !isPending && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              top: "-1rem",
              right: "1rem",
              display: "flex",
              gap: "0.1rem",
              background: "linear-gradient(rgba(16,16,20,0.24), rgba(10,10,14,0.28)) padding-box, linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(167,139,250,0.30) 50%, rgba(255,255,255,0.16) 100%) border-box",
              border: "1px solid transparent",
              borderRadius: "10px",
              padding: "0.2rem",
              zIndex: 10,
              backdropFilter: "blur(60px) saturate(2.8) brightness(1.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.50), inset 0 1.5px 0 rgba(255,255,255,0.20)",
            }}
          >
            {[
              { icon: <ReplyIcon size={15} />, label: "Reply", action: () => onReply({ id: message.id, content: message.content, authorName: message.author.name ?? message.author.username ?? "User" }) },
              ...(canEdit ? [{ icon: <EditIcon size={15} />, label: "Edit", action: () => setEditing(true) }] : []),
              ...(canDelete ? [{ icon: <TrashIcon size={15} />, label: "Delete", action: handleDelete, danger: true }] : []),

            ].map(({ icon, label, action, danger }) => (
              <Tooltip key={label} content={label} side="top">
                <button
                  onClick={action}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: danger ? "var(--danger)" : "var(--text-secondary)",
                    transition: "background 0.1s, color 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget.style.background = danger ? "rgba(244,63,94,0.15)" : "rgba(139,92,246,0.15)");
                    (e.currentTarget.style.color = danger ? "var(--danger)" : "var(--accent-bright)");
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget.style.background = "transparent");
                    (e.currentTarget.style.color = danger ? "var(--danger)" : "var(--text-secondary)");
                  }}
                >
                  {icon}
                </button>
              </Tooltip>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ fileType }: { fileType: string }) {
  const color =
    fileType === "application/pdf"
      ? "var(--danger)"
      : fileType.startsWith("video/")
      ? "var(--accent)"
      : "var(--text-muted)";

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Import Tooltip inline to avoid circular dep issue
function Tooltip({ content, side = "top", children }: { content: string; side?: string; children: React.ReactNode }) {
  const [v, setV] = useState(false);
  const pos: Record<string, React.CSSProperties> = {
    top: { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
  };
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setV(true)} onMouseLeave={() => setV(false)}>
      {children}
      <AnimatePresence>
        {v && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              ...(pos[side] ?? pos.top),
              background: "rgba(10,10,18,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)",
              padding: "0.25rem 0.5rem",
              borderRadius: "5px",
              fontSize: "0.75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 1000,
              backdropFilter: "blur(12px)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
