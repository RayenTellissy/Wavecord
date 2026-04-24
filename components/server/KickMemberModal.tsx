"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { KickIcon } from "@/components/icons";
import axios from "axios";

export function KickMemberModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "kickMember";
  const { serverId, memberId, memberName = "this member" } = data;

  async function handleKick() {
    if (!serverId || !memberId) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/servers/${serverId}/members/${memberId}`);
      close();
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
    <Modal isOpen={open} onClose={close} title="Kick Member" width={420}>
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
          <KickIcon size={24} />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}>
          Kick <span style={{ color: "var(--accent)" }}>{memberName}</span>?
        </p>

        <p style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          They will be removed from the server but can rejoin with an invite link.
        </p>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem", textAlign: "center" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button
            onClick={close}
            style={ghostBtn}
          >
            Cancel
          </button>
          <button
            onClick={handleKick}
            disabled={loading}
            style={dangerBtn(loading)}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#dc2626"); }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "var(--danger)"); }}
          >
            {loading ? "Kicking…" : "Kick Member"}
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
