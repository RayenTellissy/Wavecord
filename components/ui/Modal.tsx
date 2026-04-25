"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "@/components/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

export function Modal({ isOpen, onClose, title, children, width = 460 }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.20)",
              backdropFilter: "blur(4px) brightness(0.88)",
              WebkitBackdropFilter: "blur(4px) brightness(0.88)",
              zIndex: 200,
            }}
          />

          {/* Centering container */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 201,
              pointerEvents: "none",
            }}
          >
            {/* Outer wrapper — the prismatic border + blur */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", damping: 26, stiffness: 400, mass: 0.75 }}
              style={{
                width: `min(${width}px, calc(100vw - 2rem))`,
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(6,5,10,0.60)",
                backdropFilter: "blur(36px) saturate(1.35) brightness(0.90)",
                WebkitBackdropFilter: "blur(36px) saturate(1.35) brightness(0.90)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 12px 40px rgba(0,0,0,0.35)",
                pointerEvents: "all",
                overflow: "hidden",
              }}
            >
              <div>
                {/* Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.3rem 1.5rem 1.15rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <h2 style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "var(--text-primary)",
                  }}>
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    style={{
                      color: "var(--text-muted)",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s, color 0.15s, border-color 0.15s",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(244,63,94,0.20)";
                      e.currentTarget.style.color = "var(--danger)";
                      e.currentTarget.style.borderColor = "rgba(244,63,94,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    }}
                  >
                    <XIcon size={15} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: "1.5rem" }}>{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
