"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { HashIcon, VolumeIcon } from "@/components/icons";
import axios from "axios";

export function EditChannelModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "editChannel";
  const { serverId, channelId, channelName, channelType } = data;

  useEffect(() => {
    if (open) {
      setName(channelName ?? "");
      setError("");
    }
  }, [open, channelName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serverId || !channelId) return;
    setLoading(true);
    setError("");

    try {
      await axios.patch(`/api/servers/${serverId}/channels/${channelId}`, {
        name: name.toLowerCase().replace(/\s+/g, "-"),
      });
      close();
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.fieldErrors?.name?.[0] ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  const Icon = channelType === "VOICE" ? VolumeIcon : HashIcon;

  return (
    <Modal isOpen={open} onClose={close} title="Edit Channel">
      <style>{`
        .modal-input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.65rem 0.75rem;
          color: var(--text-primary);
          outline: none;
          font-size: 0.95rem;
          transition: border-color 0.15s;
        }
        .modal-input:focus { border-color: var(--accent); }
        .modal-input::placeholder { color: var(--text-muted); }
      `}</style>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Channel Name</label>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}>
            <Icon size={16} />
          </div>
          <input
            className="modal-input"
            style={{ paddingLeft: "2.25rem" }}
            value={name}
            onChange={(e) => {
              setName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""));
              setError("");
            }}
            placeholder="channel-name"
            required
            maxLength={100}
            autoFocus
          />
        </div>
        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: "0.35rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={close} style={ghostBtn}>Cancel</button>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "6px",
              background: loading || !name.trim() ? "var(--surface-2)" : "var(--accent)",
              color: loading || !name.trim() ? "var(--text-muted)" : "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              opacity: loading || !name.trim() ? 0.6 : 1,
            }}
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
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
  marginBottom: "0.5rem",
};

const ghostBtn: React.CSSProperties = {
  padding: "0.6rem 1.25rem",
  borderRadius: "6px",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-secondary)",
  fontWeight: 500,
  fontSize: "0.9rem",
};
