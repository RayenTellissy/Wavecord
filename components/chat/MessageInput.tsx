"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AttachIcon, EmojiIcon, XIcon, ImageIcon, ReplyIcon } from "@/components/icons";
import Image from "next/image";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import type { ReplyTarget } from "./ChatArea";

interface PendingFile {
  url: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

interface MessageInputProps {
  channelId: string;
  channelName: string;
  replyTo?: ReplyTarget | null;
  onClearReply?: () => void;
}

export function MessageInput({ channelId, channelName, replyTo, onClearReply }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [channelId]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  function handleEmojiClick(emojiData: EmojiClickData) {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart ?? content.length;
      const end = textarea.selectionEnd ?? content.length;
      const newContent = content.slice(0, start) + emojiData.emoji + content.slice(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        const pos = start + emojiData.emoji.length;
        textarea.setSelectionRange(pos, pos);
        autoResize();
      }, 0);
    } else {
      setContent((c) => c + emojiData.emoji);
    }
    setShowEmojiPicker(false);
  }

  const canSend =
    (content.trim().length > 0 || pendingFile !== null) && !sending && !uploading;

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File exceeds 10 MB limit");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post<PendingFile>("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPendingFile(res.data);
    } catch (err) {
      console.error("[UPLOAD]", err);
      alert("Upload failed — please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSend() {
    if (!canSend) return;

    const text = content.trim();
    const fileSnapshot = pendingFile;
    const replySnapshot = replyTo ?? null;

    setSending(true);
    setContent("");
    setPendingFile(null);
    onClearReply?.();
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Optimistic message — appears instantly while the request is in flight
    const optimisticId = `optimistic-${Date.now()}`;
    const now = new Date().toISOString();
    const optimistic = {
      id: optimisticId,
      content: text,
      channelId,
      authorId: session?.user?.id ?? "",
      author: {
        id: session?.user?.id ?? "",
        name: session?.user?.name ?? null,
        username: session?.user?.username ?? null,
        image: session?.user?.image ?? null,
      },
      reactions: [],
      replyTo: replySnapshot
        ? { id: replySnapshot.id, content: replySnapshot.content, author: { id: "", name: replySnapshot.authorName, image: null } }
        : null,
      replyToId: replySnapshot?.id ?? null,
      attachments: fileSnapshot
        ? [{
            id: `opt-att-${Date.now()}`,
            messageId: optimisticId,
            url: fileSnapshot.url,
            fileType: fileSnapshot.fileType,
            fileName: fileSnapshot.fileName,
            fileSize: fileSnapshot.fileSize,
            createdAt: now,
          }]
        : [],
      fileUrl: null,
      deleted: false,
      edited: false,
      createdAt: now,
      updatedAt: now,
    };

    type CacheShape = {
      pages: { messages: typeof optimistic[]; nextCursor: string | null }[];
      pageParams: unknown[];
    };

    queryClient.setQueryData(["messages", channelId], (old: unknown) => {
      if (!old) return old;
      const data = old as CacheShape;
      return {
        ...data,
        pages: data.pages.map((page, i) =>
          i === 0 ? { ...page, messages: [optimistic, ...page.messages] } : page
        ),
      };
    });

    function replaceOptimistic(real: typeof optimistic | null) {
      queryClient.setQueryData(["messages", channelId], (old: unknown) => {
        if (!old) return old;
        const data = old as CacheShape;
        const realAlreadyInCache =
          real !== null && data.pages.some((p) => p.messages.some((m) => m.id === real.id));
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            messages:
              real && !realAlreadyInCache
                ? page.messages.map((m) => (m.id === optimisticId ? real : m))
                : page.messages.filter((m) => m.id !== optimisticId),
          })),
        };
      });
    }

    try {
      const { data: newMessage } = await axios.post<typeof optimistic>("/api/messages", {
        content: text,
        channelId,
        replyToId: replySnapshot?.id,
        attachments: fileSnapshot
          ? [{
              url: fileSnapshot.url,
              fileType: fileSnapshot.fileType,
              fileName: fileSnapshot.fileName,
              fileSize: fileSnapshot.fileSize,
            }]
          : undefined,
      });
      replaceOptimistic(newMessage);
    } catch (err) {
      replaceOptimistic(null);
      setContent(text);
      setPendingFile(fileSnapshot);
      console.error("[MESSAGE_SEND]", err);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isImage = pendingFile?.fileType.startsWith("image/") ?? false;

  return (
    <div style={{ padding: "0 1rem 1rem", background: "transparent" }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,text/plain,application/zip,video/mp4,video/webm"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Reply banner */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              padding: "0.4rem 0.75rem",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}>
              <ReplyIcon size={13} />
              <span>Replying to <strong style={{ color: "var(--accent-bright)" }}>{replyTo.authorName}</strong></span>
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                color: "var(--text-muted)",
                maxWidth: 300,
              }}>
                {replyTo.content}
              </span>
              <button
                onClick={onClearReply}
                style={{
                  marginLeft: "auto",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.1rem",
                  borderRadius: "4px",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--text-primary)"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-muted)"); }}
              >
                <XIcon size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending file preview */}
      <AnimatePresence>
        {(pendingFile || uploading) && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: "0.5rem" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "8px",
                padding: "0.4rem 0.6rem",
                maxWidth: "100%",
                backdropFilter: "blur(12px)",
              }}
            >
              {uploading ? (
                <>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.08)",
                      borderTopColor: "var(--accent)",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Uploading…
                  </span>
                </>
              ) : pendingFile ? (
                <>
                  {isImage ? (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "6px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <Image
                        src={pendingFile.url}
                        alt={pendingFile.fileName}
                        width={48}
                        height={48}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                      <ImageIcon size={18} />
                    </span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 200,
                      }}
                    >
                      {pendingFile.fileName}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {formatBytes(pendingFile.fileSize)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPendingFile(null)}
                    style={{
                      display: "flex",
                      color: "var(--text-muted)",
                      padding: "0.1rem",
                      borderRadius: "4px",
                      marginLeft: "0.25rem",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--danger)"); }}
                    onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-muted)"); }}
                  >
                    <XIcon size={14} />
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input box */}
      <div
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.14), 0 0 24px rgba(139,92,246,0.08)";
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }
        }}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "0.5rem",
          background: "rgba(14,14,18,0.22)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "14px",
          padding: "0.5rem",
          transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
          backdropFilter: "blur(72px) saturate(2.8) brightness(1.06)",
          WebkitBackdropFilter: "blur(72px) saturate(2.8) brightness(1.06)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.16), 0 4px 24px rgba(0,0,0,0.35)",
        }}
      >
        {/* Attach button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            color: uploading ? "var(--text-muted)" : "var(--text-muted)",
            padding: "0.55rem 0.4rem",
            display: "flex",
            flexShrink: 0,
            alignSelf: "flex-end",
            marginBottom: "0.05rem",
            transition: "color 0.15s",
            opacity: uploading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!uploading)
              (e.currentTarget.style.color = "var(--text-secondary)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.color = "var(--text-muted)");
          }}
          title="Attach file"
        >
          <AttachIcon size={20} />
        </motion.button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={1}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            lineHeight: 1.5,
            padding: "0.55rem 0",
            maxHeight: 200,
            overflowY: "auto",
          }}
        />

        {/* Emoji button + picker */}
        <div style={{ position: "relative", flexShrink: 0, alignSelf: "flex-end" }} ref={emojiPickerRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker((v) => !v)}
            style={{
              color: showEmojiPicker ? "var(--warning)" : "var(--text-muted)",
              padding: "0.55rem 0.4rem",
              display: "flex",
              marginBottom: "0.05rem",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--warning)"); }}
            onMouseLeave={(e) => { if (!showEmojiPicker) (e.currentTarget.style.color = "var(--text-muted)"); }}
            title="Emoji"
          >
            <EmojiIcon size={20} />
          </motion.button>
          {showEmojiPicker && (
            <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, zIndex: 50 }}>
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} lazyLoadEmojis />
            </div>
          )}
        </div>

        {/* Send button */}
        <AnimatePresence>
          {canSend && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSend}
              disabled={!canSend}
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                alignSelf: "flex-end",
                marginBottom: "0.1rem",
                color: "#fff",
                transition: "box-shadow 0.15s",
                boxShadow: "var(--accent-glow-sm)",
              }}
            >
              <SendIcon />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p
        style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          marginTop: "0.35rem",
          paddingLeft: "0.25rem",
        }}
      >
        <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new
        line
      </p>
    </div>
  );
}

// Helpers

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
