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

  const accentColor = toast.type === "dm" ? "#22d3ee" : "#8b5cf6";
  const accentGlow = toast.type === "dm"
    ? "0 0 20px rgba(34,211,238,0.15)"
    : "0 0 20px rgba(139,92,246,0.15)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => {
        router.push(toast.href);
        dismiss(toast.id);
      }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        paddingLeft: 18,
        borderRadius: 10,
        background: "rgba(12,12,20,0.88)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.55), ${accentGlow}`,
        cursor: "pointer",
        width: 320,
        maxWidth: "calc(100vw - 32px)",
        userSelect: "none",
        backdropFilter: "blur(20px)",
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
          background: toast.type === "dm"
            ? "rgba(34,211,238,0.12)"
            : "rgba(139,92,246,0.12)",
          border: `1px solid ${accentColor}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 600,
          color: accentColor,
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
            color: "#e2e8f0",
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
            color: "#94a3b8",
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
          color: "#475569",
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
