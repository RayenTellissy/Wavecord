"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { useServersQueryClient, SERVERS_QUERY_KEY, type ServerWithChannel } from "@/hooks/useServers";
import axios from "axios";

export function CreateServerModal() {
  const { isOpen, type, close } = useModal();
  const router = useRouter();
  const queryClient = useServersQueryClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = isOpen && type === "createServer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post<ServerWithChannel>("/api/servers", { name });
      queryClient.setQueryData<ServerWithChannel[]>(SERVERS_QUERY_KEY, (old = []) => [...old, data]);
      close();
      setName("");
      router.push(`/servers/${data.id}/channels/${data.channels[0]?.id ?? ""}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.name?.[0] ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={open} onClose={close} title="Create a Server">
      <style>{inputStyle}</style>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
        Give your server a name to get started. You can always change it later.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--surface-2)",
          border: "2px dashed var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          color: "var(--text-muted)",
          fontSize: "0.75rem",
          cursor: "pointer",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Upload
        <br />
        Icon
      </motion.div>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Server Name</label>
        <input
          className="modal-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder="My Awesome Server"
          required
          maxLength={100}
          autoFocus
        />
        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem", marginTop: "0.35rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={close} style={ghostBtn}>Cancel</button>
          <button type="submit" disabled={loading || !name.trim()} style={primaryBtn(loading || !name.trim())}>
            {loading ? "Creating…" : "Create Server"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputStyle = `
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
`;

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

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  padding: "0.6rem 1.25rem",
  borderRadius: "6px",
  background: disabled ? "var(--surface-2)" : "var(--accent)",
  color: disabled ? "var(--text-muted)" : "#fff",
  fontWeight: 600,
  fontSize: "0.9rem",
  opacity: disabled ? 0.6 : 1,
  transition: "background 0.15s",
});
