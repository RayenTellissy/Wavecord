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

  const accentColor = "#a78bfa";
  const accentGlow =
    "0 0 8px rgba(139,92,246,0.4), 0 0 20px rgba(139,92,246,0.28), 0 0 48px rgba(139,92,246,0.14)";

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
        borderRadius: 14,
        background: `linear-gradient(rgba(16,10,26,0.38), rgba(10,6,18,0.44)) padding-box, linear-gradient(135deg, rgba(255,255,255,0.22) 0%, ${accentColor}66 40%, rgba(255,255,255,0.14) 100%) border-box`,
        border: "1px solid transparent",
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: `0 16px 48px rgba(0,0,0,0.65), ${accentGlow}, inset 0 2px 0 rgba(255,255,255,0.18)`,
        outline: `1px solid rgba(139,92,246,0.10)`,
        outlineOffset: "2px",
        cursor: "pointer",
        width: 320,
        maxWidth: "calc(100vw - 32px)",
        userSelect: "none",
        backdropFilter: "blur(80px) saturate(3) brightness(1.08)",
        WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.08)",
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
          background: "rgba(139,92,246,0.18)",
          border: `1px solid ${accentColor}80`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 600,
          color: accentColor,
          boxShadow: `0 0 8px rgba(139,92,246,0.4), 0 0 16px rgba(139,92,246,0.18)`,
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
