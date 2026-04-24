"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  side?: "right" | "left" | "top" | "bottom";
  children: React.ReactNode;
}

export function Tooltip({ content, side = "right", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const offset = 10;

  function handleMouseEnter() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    switch (side) {
      case "right":
        setPos({ top: r.top + r.height / 2, left: r.right + offset });
        break;
      case "left":
        setPos({ top: r.top + r.height / 2, left: r.left - offset });
        break;
      case "top":
        setPos({ top: r.top - offset, left: r.left + r.width / 2 });
        break;
      case "bottom":
        setPos({ top: r.bottom + offset, left: r.left + r.width / 2 });
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
                style={{
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                  transform: transformMap[side],
                  background: "#0d1117",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 9999,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
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
