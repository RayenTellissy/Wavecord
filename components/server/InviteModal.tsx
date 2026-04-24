"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { CopyIcon, CheckIcon } from "@/components/icons";
import axios from "axios";

export function InviteModal() {
  const { isOpen, type, data, close } = useModal();
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const open = isOpen && type === "invite";
  const serverId = data.serverId;

  const inviteUrl = inviteCode
    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/invite/${inviteCode}`
    : "";

  useEffect(() => {
    if (!open || !serverId) return;
    axios.get(`/api/servers/${serverId}/invite`).then(({ data }) => {
      setInviteCode(data.inviteCode);
    });
  }, [open, serverId]);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerate() {
    if (!serverId) return;
    setRegenerating(true);
    try {
      const { data } = await axios.post(`/api/servers/${serverId}/invite`);
      setInviteCode(data.inviteCode);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <Modal isOpen={open} onClose={close} title="Invite People">
      <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1rem" }}>
        Share this link to invite people to your server.
      </p>

      <div style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "0.75rem",
      }}>
        <div style={{
          flex: 1,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "0.65rem 0.75rem",
          fontSize: "0.88rem",
          color: "var(--text-secondary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {inviteUrl || "Loading…"}
        </div>
        <button
          onClick={handleCopy}
          disabled={!inviteUrl}
          style={{
            padding: "0.65rem 1rem",
            background: copied ? "var(--success)" : "var(--accent)",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
            transition: "background 0.15s",
            opacity: !inviteUrl ? 0.6 : 1,
          }}
        >
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <button
        onClick={handleRegenerate}
        disabled={regenerating}
        style={{
          background: "none",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          textDecoration: "underline",
          opacity: regenerating ? 0.5 : 1,
        }}
      >
        {regenerating ? "Regenerating…" : "Generate a new link"}
      </button>

      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "1rem" }}>
        This link does not expire. Regenerate to invalidate old links.
      </p>
    </Modal>
  );
}
