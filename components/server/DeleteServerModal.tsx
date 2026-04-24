"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { TrashIcon } from "@/components/icons";
import axios from "axios";

export function DeleteServerModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "deleteServer";
  const { serverId } = data;

  async function handleDelete() {
    if (!serverId) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/servers/${serverId}`);
      close();
      router.push("/");
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
    <Modal isOpen={open} onClose={close} title="Delete Server" width={420}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid var(--danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--danger)",
            margin: "0 auto",
          }}
        >
          <TrashIcon size={24} />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}>
          Delete this server?
        </p>

        <p style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          This action <strong>cannot be undone</strong>. All channels, messages, and member data will be permanently deleted.
        </p>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem", textAlign: "center" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button onClick={close} style={ghostBtn}>
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={dangerBtn(loading)}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#dc2626"); }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "var(--danger)"); }}
          >
            {loading ? "Deleting…" : "Delete Server"}
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
  cursor: "pointer",
};

const dangerBtn = (disabled: boolean): React.CSSProperties => ({
  padding: "0.6rem 1.25rem",
  borderRadius: "6px",
  background: disabled ? "var(--surface-2)" : "var(--danger)",
  color: disabled ? "var(--text-muted)" : "#fff",
  fontWeight: 600,
  fontSize: "0.9rem",
  opacity: disabled ? 0.6 : 1,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background 0.15s",
});
