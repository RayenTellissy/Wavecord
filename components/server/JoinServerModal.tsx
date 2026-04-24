"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { useServersQueryClient, SERVERS_QUERY_KEY } from "@/hooks/useServers";
import axios from "axios";

export function JoinServerModal() {
  const { isOpen, type, close } = useModal();
  const router = useRouter();
  const queryClient = useServersQueryClient();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "joinServer";

  // Extract invite code from full URL or raw code
  function parseCode(input: string) {
    const match = input.match(/\/invite\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const inviteCode = parseCode(code);
    if (!inviteCode) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`/api/join/${inviteCode}`);
      // Invalidate so sidebar refetches the joined server in the background
      queryClient.invalidateQueries({ queryKey: SERVERS_QUERY_KEY });
      close();
      setCode("");
      router.push(`/servers/${data.serverId}/channels/`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Invalid invite code.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={open} onClose={close} title="Join a Server">
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

      <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
        Enter an invite link or code to join an existing server.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Invite Link or Code</label>
        <input
          className="modal-input"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(""); }}
          placeholder="https://wavecord.app/invite/abc123"
          required
          autoFocus
        />
        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: "0.35rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={close} style={ghostBtn}>Cancel</button>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "6px",
              background: loading || !code.trim() ? "var(--surface-2)" : "var(--accent)",
              color: loading || !code.trim() ? "var(--text-muted)" : "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              opacity: loading || !code.trim() ? 0.6 : 1,
            }}
          >
            {loading ? "Joining…" : "Join Server"}
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
};
