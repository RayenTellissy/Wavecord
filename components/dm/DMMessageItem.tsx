"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EditIcon, TrashIcon } from "@/components/icons";
import Image from "next/image";
import axios from "axios";
import type { DMWithRelations } from "@/hooks/useDirectMessages";

interface DMMessageItemProps {
  message: DMWithRelations;
  isGrouped: boolean;
  currentUserId: string;
  conversationId: string;
}

function formatTimestamp(date: Date): string {
  if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
  if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
  return format(date, "MMM d, yyyy h:mm a");
}

export function DMMessageItem({
  message,
  isGrouped,
  currentUserId,
  conversationId: _conversationId,
}: DMMessageItemProps) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [saving, setSaving] = useState(false);

  const isPending = message.id.startsWith("optimistic-");
  const isOwn = message.senderId === currentUserId;
  const canEdit = isOwn && !message.deleted && !isPending;
  const canDelete = isOwn && !message.deleted && !isPending;

  async function handleEdit() {
    if (!editContent.trim() || editContent === message.content) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`/api/direct-messages/${message.id}`, { content: editContent });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this message?")) return;
    await axios.delete(`/api/direct-messages/${message.id}`);
  }

  const createdAt = new Date(message.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isPending ? 0.55 : 1, y: 0 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: `${isGrouped ? "0.1rem" : "0.75rem"} 1rem 0.1rem`,
        position: "relative",
        background: hovered && !isPending ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "background 0.1s",
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
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}>
            {message.sender.image ? (
              <Image
                src={message.sender.image}
                alt={message.sender.name ?? ""}
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
              {message.sender.name ?? message.sender.username ?? "User"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {formatTimestamp(createdAt)}
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
                background: "var(--surface-2)",
                border: "1px solid var(--accent)",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
                color: "var(--text-primary)",
                resize: "none",
                outline: "none",
                fontSize: "0.92rem",
                lineHeight: 1.5,
                minHeight: 60,
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem", fontSize: "0.78rem" }}>
              <span style={{ color: "var(--text-muted)" }}>
                esc to{" "}
                <button
                  onClick={() => { setEditing(false); setEditContent(message.content); }}
                  style={{ color: "var(--accent)", fontWeight: 500 }}
                >cancel</button>
                {" · "}enter to{" "}
                <button onClick={handleEdit} disabled={saving}
                  style={{ color: "var(--accent)", fontWeight: 500 }}
                >save</button>
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
                    background: "var(--bg)",
                    padding: "0.1em 0.35em",
                    borderRadius: "4px",
                    fontSize: "0.85em",
                    fontFamily: "monospace",
                  }}>{children}</code>
                ),
                pre: ({ children }) => (
                  <pre style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "0.75rem",
                    overflow: "auto",
                    fontSize: "0.85em",
                    marginTop: "0.35rem",
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

        {/* Attachments */}
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
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "0.5rem 0.75rem",
                      maxWidth: 320,
                      transition: "border-color 0.12s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "var(--accent)"); }}
                    onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "var(--border)"); }}
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
      </div>

      {/* Hover action buttons */}
      <AnimatePresence>
        {hovered && !editing && (canEdit || canDelete) && (
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
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.2rem",
              zIndex: 10,
            }}
          >
            {canEdit && (
              <ActionButton icon={<EditIcon size={15} />} label="Edit" onClick={() => setEditing(true)} />
            )}
            {canDelete && (
              <ActionButton icon={<TrashIcon size={15} />} label="Delete" onClick={handleDelete} danger />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ActionButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
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
        (e.currentTarget.style.background = danger ? "rgba(239,68,68,0.15)" : "var(--surface-3)");
        (e.currentTarget.style.color = danger ? "var(--danger)" : "var(--text-primary)");
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.background = "transparent");
        (e.currentTarget.style.color = danger ? "var(--danger)" : "var(--text-secondary)");
      }}
    >
      {icon}
    </button>
  );
}

function PersonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
