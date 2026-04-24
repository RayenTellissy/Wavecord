"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AttachIcon, EmojiIcon, XIcon, ImageIcon } from "@/components/icons";
import Image from "next/image";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import type { DMWithRelations } from "@/hooks/useDirectMessages";

interface PendingFile {
  url: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

interface DMMessageInputProps {
  conversationId: string;
  recipientName: string;
}

export function DMMessageInput({ conversationId, recipientName }: DMMessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const canSend = (content.trim().length > 0 || pendingFile !== null) && !sending && !uploading;

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
    } catch {
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
    setSending(true);
    setContent("");
    setPendingFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const { data: newMessage } = await axios.post<DMWithRelations>("/api/direct-messages", {
        content: text,
        conversationId,
        attachments: fileSnapshot
          ? [{ url: fileSnapshot.url, fileType: fileSnapshot.fileType, fileName: fileSnapshot.fileName, fileSize: fileSnapshot.fileSize }]
          : undefined,
      });
      // Immediately add to cache so sender sees their message without waiting for socket
      queryClient.setQueryData(
        ["direct-messages", conversationId],
        (old: { pages: { messages: DMWithRelations[]; nextCursor: string | null }[]; pageParams: unknown[] } | undefined) => {
          if (!old) return old;
          const alreadyInCache = old.pages.some((p) => p.messages.some((m) => m.id === newMessage.id));
          if (alreadyInCache) return old;
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0 ? { ...page, messages: [newMessage, ...page.messages] } : page
            ),
          };
        }
      );
    } catch {
      setContent(text);
      setPendingFile(fileSnapshot);
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
    <div style={{ padding: "0 1rem 1rem", background: "var(--surface-1)" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,text/plain,application/zip,video/mp4,video/webm"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <AnimatePresence>
        {(pendingFile || uploading) && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: "0.5rem" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.4rem 0.6rem",
              maxWidth: "100%",
            }}>
              {uploading ? (
                <>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <div style={{
                    width: 16, height: 16,
                    border: "2px solid var(--border)",
                    borderTopColor: "var(--accent)",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Uploading…</span>
                </>
              ) : pendingFile ? (
                <>
                  {isImage ? (
                    <div style={{ width: 48, height: 48, borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "var(--surface-3)" }}>
                      <Image src={pendingFile.url} alt={pendingFile.fileName} width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-muted)", flexShrink: 0 }}><ImageIcon size={18} /></span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                      {pendingFile.fileName}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{formatBytes(pendingFile.fileSize)}</p>
                  </div>
                  <button
                    onClick={() => setPendingFile(null)}
                    style={{ display: "flex", color: "var(--text-muted)", padding: "0.1rem", borderRadius: "4px", marginLeft: "0.25rem", flexShrink: 0 }}
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

      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "0.5rem",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "0 0.5rem 0.5rem",
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ color: "var(--text-muted)", padding: "0.55rem 0.4rem", display: "flex", flexShrink: 0, alignSelf: "flex-end", marginBottom: "0.05rem", opacity: uploading ? 0.5 : 1 }}
          onMouseEnter={(e) => { if (!uploading) (e.currentTarget.style.color = "var(--text-secondary)"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-muted)"); }}
          title="Attach file"
        >
          <AttachIcon size={20} />
        </motion.button>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          placeholder={`Message @${recipientName}`}
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

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ color: "var(--text-muted)", padding: "0.55rem 0.4rem", display: "flex", flexShrink: 0, alignSelf: "flex-end", marginBottom: "0.05rem" }}
          onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--warning)"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-muted)"); }}
          title="Emoji"
        >
          <EmojiIcon size={20} />
        </motion.button>

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
              style={{
                width: 32, height: 32, borderRadius: "8px",
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, alignSelf: "flex-end", marginBottom: "0.1rem",
                color: "#fff",
              }}
            >
              <SendIcon />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem", paddingLeft: "0.25rem" }}>
        <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line
      </p>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
