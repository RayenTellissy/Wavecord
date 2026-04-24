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
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
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
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.15 }}
            style={{
              width: `min(${width}px, calc(100vw - 2rem))`,
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              overflow: "hidden",
              pointerEvents: "all",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--border)",
            }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>{title}</h2>
              <button
                onClick={onClose}
                style={{
                  color: "var(--text-secondary)",
                  padding: "0.25rem",
                  borderRadius: "4px",
                  transition: "color 0.15s",
                  display: "flex",
                }}
                onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--text-primary)"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-secondary)"); }}
              >
                <XIcon size={18} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "1.5rem" }}>{children}</div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
