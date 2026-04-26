"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { useVoiceStore } from "@/stores/voiceStore";
import { TrashIcon } from "@/components/icons";
import axios from "axios";

export function DeleteCategoryModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const voiceLeave = useVoiceStore((s) => s.leave);
  const voiceServerId = useVoiceStore((s) => s.serverId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "deleteCategory";
  const { serverId, categoryId, categoryName } = data;

  async function handleDelete() {
    if (!serverId || !categoryId) return;
    setLoading(true);
    setError("");

    try {
      await axios.delete(`/api/servers/${serverId}/categories/${categoryId}`);
      if (voiceServerId === serverId) voiceLeave();
      close();
      router.push(`/servers/${serverId}/channels`);
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={open} onClose={close} title="Delete Category" width={420}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          padding: "1rem",
          borderRadius: "8px",
          background: "rgba(244,63,94,0.08)",
          border: "1px solid rgba(244,63,94,0.2)",
        }}>
          <TrashIcon size={20} style={{ color: "var(--danger)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
              {categoryName}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              This will permanently delete this category and <strong>all channels and messages</strong> within it. This action cannot be undone.
            </p>
          </div>
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={close} style={ghostBtn}>Cancel</button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "6px",
              background: loading ? "var(--surface-2)" : "var(--danger)",
              color: loading ? "var(--text-muted)" : "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Deleting…" : "Delete Category"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const ghostBtn: React.CSSProperties = {
  padding: "0.6rem 1.25rem",
  borderRadius: "6px",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-secondary)",
  fontWeight: 500,
  fontSize: "0.9rem",
};
