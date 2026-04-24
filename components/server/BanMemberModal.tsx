"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { BanIcon } from "@/components/icons";
import axios from "axios";

export function BanMemberModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "banMember";
  const { serverId, targetUserId, memberName = "this member" } = data;

  function handleClose() {
    setReason("");
    setError("");
    close();
  }

  async function handleBan() {
    if (!serverId || !targetUserId) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`/api/servers/${serverId}/ban`, {
        userId: targetUserId,
        reason: reason.trim() || undefined,
      });
      handleClose();
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
    <Modal isOpen={open} onClose={handleClose} title="Ban Member" width={440}>
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
          <BanIcon size={24} />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}>
          Ban <span style={{ color: "var(--accent)" }}>{memberName}</span>?
        </p>

        <p style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          This will permanently prevent them from rejoining with any invite link.
        </p>

        <div>
          <label style={labelStyle}>Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're banning this member…"
            maxLength={500}
            rows={3}
            style={{
              width: "100%",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "0.65rem 0.75rem",
              color: "var(--text-primary)",
              outline: "none",
              resize: "none",
              fontSize: "0.92rem",
              lineHeight: 1.5,
              transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem", textAlign: "right" }}>
            {reason.length}/500
          </p>
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={handleClose} style={ghostBtn}>
            Cancel
          </button>
          <button
            onClick={handleBan}
            disabled={loading}
            style={dangerBtn(loading)}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#dc2626"); }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "var(--danger)"); }}
          >
            {loading ? "Banning…" : "Ban Member"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "0.35rem",
};

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
