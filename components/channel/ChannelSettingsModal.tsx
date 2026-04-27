"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { useVoiceStore } from "@/stores/voiceStore";
import { HashIcon, VolumeIcon, TrashIcon } from "@/components/icons";
import axios from "axios";

type AllowedRole = "GUEST" | "MODERATOR" | "ADMIN";

const ROLE_OPTIONS: { value: AllowedRole; label: string; description: string }[] = [
  { value: "GUEST", label: "Everyone", description: "All server members can access this channel" },
  { value: "MODERATOR", label: "Moderators & Admins", description: "Only moderators and admins can access this channel" },
  { value: "ADMIN", label: "Admins Only", description: "Only server admins can access this channel" },
];

export function ChannelSettingsModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const params = useParams();
  const voiceLeave = useVoiceStore((s) => s.leave);
  const voiceChannelId = useVoiceStore((s) => s.channelId);

  const [name, setName] = useState("");
  const [allowedRole, setAllowedRole] = useState<AllowedRole>("GUEST");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "channelSettings";
  const { serverId, channelId, channelName, channelType, allowedRole: initialRole } = data;

  useEffect(() => {
    if (open) {
      setName(channelName ?? "");
      setAllowedRole((initialRole as AllowedRole) ?? "GUEST");
      setError("");
      setConfirmDelete(false);
    }
  }, [open, channelName, initialRole]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!serverId || !channelId) return;
    setSaving(true);
    setError("");
    try {
      await axios.patch(`/api/servers/${serverId}/channels/${channelId}`, {
        name: name.toLowerCase().replace(/\s+/g, "-"),
        allowedRole,
      });
      close();
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.fieldErrors?.name?.[0] ?? "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!serverId || !channelId) return;
    setDeleting(true);
    setError("");
    try {
      await axios.delete(`/api/servers/${serverId}/channels/${channelId}`);
      if (voiceChannelId === channelId) voiceLeave();
      close();
      if (params?.channelId === channelId) {
        router.push(`/servers/${serverId}/channels`);
      }
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Something went wrong.");
      }
    } finally {
      setDeleting(false);
    }
  }

  const Icon = channelType === "VOICE" ? VolumeIcon : HashIcon;
  const typeLabel = channelType === "VOICE" ? "Voice" : "Text";

  return (
    <Modal isOpen={open} onClose={close} title={`${typeLabel} Channel Settings`} width={480}>
      <style>{`
        .cs-input {
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
        .cs-input:focus { border-color: var(--accent); }
        .cs-input::placeholder { color: var(--text-muted); }
        .cs-role-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: var(--surface-2);
        }
        .cs-role-option:hover { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.06); }
        .cs-role-option.selected { border-color: var(--accent); background: rgba(139,92,246,0.12); }
      `}</style>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Channel Name */}
        <section>
          <label style={labelStyle}>Channel Name</label>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: "0.75rem", top: "50%",
              transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
            }}>
              <Icon size={16} />
            </div>
            <input
              className="cs-input"
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
        </section>

        {/* Permissions */}
        <section>
          <label style={labelStyle}>Who Can Access</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {ROLE_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={`cs-role-option${allowedRole === opt.value ? " selected" : ""}`}
                onClick={() => setAllowedRole(opt.value)}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: allowedRole === opt.value ? "5px solid var(--accent)" : "2px solid var(--text-muted)",
                  flexShrink: 0,
                  transition: "border 0.15s",
                }} />
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                    {opt.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: "-0.5rem" }}>{error}</p>
        )}

        {/* Save */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={close} style={ghostBtn}>Cancel</button>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "6px",
              background: saving || !name.trim() ? "var(--surface-2)" : "var(--accent)",
              color: saving || !name.trim() ? "var(--text-muted)" : "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              opacity: saving || !name.trim() ? 0.6 : 1,
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{
          borderTop: "1px solid rgba(244,63,94,0.18)",
          paddingTop: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Danger Zone
          </div>
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                borderRadius: "6px",
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.25)",
                color: "var(--danger)",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                alignSelf: "flex-start",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.16)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.08)"; }}
            >
              <TrashIcon size={15} />
              Delete Channel
            </button>
          ) : (
            <div style={{
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.25)",
            }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                Are you sure? This will permanently delete <strong style={{ color: "var(--text-primary)" }}>#{channelName}</strong> and all its messages.
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  style={{ ...ghostBtn, fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "6px",
                    background: deleting ? "var(--surface-2)" : "var(--danger)",
                    color: deleting ? "var(--text-muted)" : "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    opacity: deleting ? 0.6 : 1,
                    cursor: deleting ? "default" : "pointer",
                  }}
                >
                  {deleting ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          )}
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
  cursor: "pointer",
};
