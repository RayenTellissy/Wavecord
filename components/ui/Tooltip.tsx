"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  side?: "right" | "left" | "top" | "bottom";
  adjustX?: number;
  adjustY?: number;
  children: React.ReactNode;
}

export function Tooltip({ content, side = "right", adjustX = 0, adjustY = 0, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const offset = 10;

  function handleMouseEnter() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    switch (side) {
      case "right":
        setPos({ top: r.top + r.height / 2 + adjustY, left: r.right + offset + adjustX });
        break;
      case "left":
        setPos({ top: r.top + r.height / 2 + adjustY, left: r.left - offset + adjustX });
        break;
      case "top":
        setPos({ top: r.top - offset + adjustY, left: r.left + r.width / 2 + adjustX });
        break;
      case "bottom":
        setPos({ top: r.bottom + offset + adjustY, left: r.left + r.width / 2 + adjustX });
        break;
    }
    setVisible(true);
  }

  const transformMap: Record<string, string> = {
    right: "translateY(-50%)",
    left: "translateY(-50%) translateX(-100%)",
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.1 }}
                transformTemplate={({ scale }) => `${transformMap[side]} scale(${scale ?? 1})`}
                style={{
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                  background: "rgba(8,8,16,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-primary)",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "7px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 9999,
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.06)",
                }}
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
