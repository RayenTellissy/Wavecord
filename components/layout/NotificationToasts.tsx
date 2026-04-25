"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNotificationStore, type NotificationToast } from "@/stores/notificationStore";

const AUTO_DISMISS_MS = 5000;

function Toast({ toast }: { toast: NotificationToast }) {
  const dismiss = useNotificationStore((s) => s.dismiss);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [toast.id, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        router.push(toast.href);
        dismiss(toast.id);
      }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 8,
        background: "var(--color-bg-secondary, #2b2d31)",
        border: "1px solid var(--color-border, rgba(255,255,255,0.06))",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        cursor: "pointer",
        width: 320,
        maxWidth: "calc(100vw - 32px)",
        userSelect: "none",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          overflow: "hidden",
          background: "var(--color-bg-tertiary, #1e1f22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {toast.avatarUrl ? (
          <Image
            src={toast.avatarUrl}
            alt=""
            width={36}
            height={36}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ) : (
          toast.title.charAt(0).toUpperCase()
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text-primary, #f2f3f5)",
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {toast.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--color-text-muted, #949ba4)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {toast.body}
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismiss(toast.id);
        }}
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-muted, #949ba4)",
          fontSize: 16,
          lineHeight: 1,
          padding: "0 2px",
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

export function NotificationToasts() {
  const toasts = useNotificationStore((s) => s.toasts);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "all" }}>
            <Toast toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
