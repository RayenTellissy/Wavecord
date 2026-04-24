"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  side?: "right" | "left" | "top" | "bottom";
  children: React.ReactNode;
}

export function Tooltip({ content, side = "right", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const offset = 10;
  const sideStyles: Record<string, React.CSSProperties> = {
    right: { left: `calc(100% + ${offset}px)`, top: "50%", transform: "translateY(-50%)" },
    left: { right: `calc(100% + ${offset}px)`, top: "50%", transform: "translateY(-50%)" },
    top: { bottom: `calc(100% + ${offset}px)`, left: "50%", transform: "translateX(-50%)" },
    bottom: { top: `calc(100% + ${offset}px)`, left: "50%", transform: "translateX(-50%)" },
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              ...sideStyles[side],
              background: "#0d1117",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "0.35rem 0.65rem",
              borderRadius: "6px",
              fontSize: "0.82rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 1000,
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
