"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { PersonIcon, KickIcon, BanIcon, ShieldIcon, CheckIcon } from "@/components/icons";
import Image from "next/image";
import axios from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────

type MemberUser = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  status: string;
};

type Member = {
  id: string;
  role: "ADMIN" | "MODERATOR" | "GUEST";
  userId: string;
  user: MemberUser;
};

type BanRecord = {
  id: string;
  reason: string | null;
  createdAt: string;
  user: { id: string; name: string | null; username: string | null; image: string | null };
  issuer: { id: string; name: string | null };
};

type Tab = "General" | "Members" | "Bans";

const TABS: Tab[] = ["General", "Members", "Bans"];
const ROLE_LABELS: Record<string, string> = { ADMIN: "Admin", MODERATOR: "Moderator", GUEST: "Member" };
const ROLE_COLORS: Record<string, string> = {
  ADMIN: "var(--danger)",
  MODERATOR: "var(--warning, #f59e0b)",
  GUEST: "var(--text-muted)",
};

// ── Main Modal ────────────────────────────────────────────────────────────────

export function ServerSettingsModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();

  const open = isOpen && type === "serverSettings";
  const { serverId } = data;

  const [activeTab, setActiveTab] = useState<Tab>("General");

  // Reset tab on open
  useEffect(() => {
    if (open) setActiveTab("General");
  }, [open]);

  return (
    <Modal isOpen={open} onClose={close} title="Server Settings" width={700}>
      <div style={{ display: "flex", gap: "1.5rem", minHeight: 400 }}>
        {/* Sidebar tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", width: 140, flexShrink: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.55rem 0.75rem",
                borderRadius: "6px",
                textAlign: "left",
                fontSize: "0.88rem",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
                background: activeTab === tab ? "var(--surface-2)" : "transparent",
                transition: "background 0.12s, color 0.12s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (activeTab !== tab) (e.currentTarget.style.background = "var(--surface-2)"); }}
              onMouseLeave={(e) => { if (activeTab !== tab) (e.currentTarget.style.background = "transparent"); }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.12 }}
            >
              {activeTab === "General" && serverId && (
                <GeneralTab serverId={serverId} onSave={() => { close(); router.refresh(); }} />
              )}
              {activeTab === "Members" && serverId && (
                <MembersTab serverId={serverId} onAction={() => router.refresh()} />
              )}
              {activeTab === "Bans" && serverId && (
                <BansTab serverId={serverId} onAction={() => router.refresh()} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}

// ── General Tab ───────────────────────────────────────────────────────────────

function GeneralTab({ serverId, onSave }: { serverId: string; onSave: () => void }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios.get(`/api/servers/${serverId}`).then(({ data }) => {
      setName(data.name ?? "");
      setImageUrl(data.imageUrl ?? "");
    });
  }, [serverId]);

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("File exceeds 10 MB limit"); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post<{ url: string }>("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await axios.patch(`/api/servers/${serverId}`, {
        name: name.trim(),
        imageUrl: imageUrl || "",
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); onSave(); }, 800);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <style>{inputStyle}</style>
      <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Overview
      </h3>

      {/* Server icon */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "2px dashed var(--border)",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          {imageUrl ? (
            <Image src={imageUrl} alt="Server icon" width={72} height={72} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <PersonIcon size={28} />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleIconUpload} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ ...ghostBtn, fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
          >
            {uploading ? "Uploading…" : "Upload Image"}
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              style={{ background: "none", color: "var(--danger)", fontSize: "0.78rem", cursor: "pointer" }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Server name */}
      <div>
        <label style={labelStyle}>Server Name</label>
        <input
          className="settings-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder="My Awesome Server"
          required
          maxLength={100}
        />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          style={primaryBtn(saving || !name.trim(), saved)}
        >
          {saved ? <><CheckIcon size={14} /> Saved</> : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// ── Members Tab ───────────────────────────────────────────────────────────────

function MembersTab({ serverId, onAction }: { serverId: string; onAction: () => void }) {
  const { open: openModal } = useModal();
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState<string | null>(null);

  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    axios.get(`/api/servers/${serverId}`).then((res) => {
      setMembers(res.data.members ?? []);
    }).finally(() => setLoading(false));
  }, [serverId]);

  const currentRole = members.find((m) => m.user.id === currentUserId)?.role ?? "GUEST";

  const isAdmin = currentRole === "ADMIN";
  const isModOrAdmin = currentRole === "ADMIN" || currentRole === "MODERATOR";

  async function handleRoleChange(memberId: string, newRole: string) {
    setSavingRole(memberId);
    try {
      await axios.patch(`/api/servers/${serverId}/members/${memberId}`, { role: newRole });
      setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: newRole as Member["role"] } : m));
      onAction();
    } catch { /* silent */ }
    setSavingRole(null);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "var(--text-muted)" }}>
        Loading members…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.25rem" }}>
        Members — {members.length}
      </h3>

      <div style={{ maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {members.map((member) => {
          const isSelf = member.user.id === currentUserId;
          const displayName = member.user.name ?? member.user.username ?? "User";

          return (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 0.6rem",
                borderRadius: "6px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {member.user.image ? (
                  <Image src={member.user.image} alt={displayName} width={36} height={36} style={{ objectFit: "cover" }} />
                ) : (
                  <PersonIcon size={18} style={{ color: "var(--text-secondary)" }} />
                )}
              </div>

              {/* Name + role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {displayName}
                  {isSelf && <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 400 }}> (you)</span>}
                </p>
                <p style={{ fontSize: "0.72rem", color: ROLE_COLORS[member.role] ?? "var(--text-muted)", fontWeight: 600 }}>
                  {ROLE_LABELS[member.role]}
                </p>
              </div>

              {/* Role selector (admin only, not self) */}
              {isAdmin && !isSelf && (
                <div style={{ position: "relative" }}>
                  <select
                    value={member.role}
                    disabled={savingRole === member.id}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "0.3rem 0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      opacity: savingRole === member.id ? 0.5 : 1,
                    }}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="GUEST">Member</option>
                  </select>
                  {savingRole === member.id && (
                    <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }}>
                      <style>{`@keyframes spin2{to{transform:translateY(-50%) rotate(360deg)}}`}</style>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--accent)", animation: "spin2 0.7s linear infinite" }} />
                    </div>
                  )}
                </div>
              )}

              {/* Kick / Ban (mod+admin, not self) */}
              {isModOrAdmin && !isSelf && (
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <ActionButton
                    icon={<KickIcon size={15} />}
                    label="Kick"
                    danger
                    onClick={() => openModal("kickMember", { serverId, memberId: member.id, memberName: displayName })}
                  />
                  {isAdmin && (
                    <ActionButton
                      icon={<BanIcon size={15} />}
                      label="Ban"
                      danger
                      onClick={() => openModal("banMember", { serverId, memberId: member.id, targetUserId: member.user.id, memberName: displayName })}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Bans Tab ──────────────────────────────────────────────────────────────────

function BansTab({ serverId, onAction }: { serverId: string; onAction: () => void }) {
  const { data: session } = useSession();
  const [bans, setBans] = useState<BanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [unbanning, setUnbanning] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    Promise.all([
      axios.get<BanRecord[]>(`/api/servers/${serverId}/ban`),
      axios.get(`/api/servers/${serverId}`),
    ]).then(([bansRes, serverRes]) => {
      setBans(bansRes.data);
      const me = (serverRes.data.members as Member[]).find((m) => m.user.id === currentUserId);
      setIsAdmin(me?.role === "ADMIN");
    }).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  async function handleUnban(userId: string) {
    setUnbanning(userId);
    try {
      await axios.delete(`/api/servers/${serverId}/ban?userId=${userId}`);
      setBans((prev) => prev.filter((b) => b.user.id !== userId));
      onAction();
    } catch { /* silent */ }
    setUnbanning(null);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "var(--text-muted)" }}>
        Loading bans…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.25rem" }}>
        Banned Users — {bans.length}
      </h3>

      {bans.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, gap: "0.5rem", color: "var(--text-muted)" }}>
          <ShieldIcon size={36} style={{ opacity: 0.3 }} />
          <p style={{ fontSize: "0.88rem" }}>No banned users</p>
        </div>
      ) : (
        <div style={{ maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {bans.map((ban) => {
            const displayName = ban.user.name ?? ban.user.username ?? "Unknown User";
            return (
              <div
                key={ban.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem 0.6rem",
                  borderRadius: "6px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {ban.user.image ? (
                    <Image src={ban.user.image} alt={displayName} width={36} height={36} style={{ objectFit: "cover" }} />
                  ) : (
                    <PersonIcon size={18} style={{ color: "var(--text-secondary)" }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayName}
                  </p>
                  {ban.reason && (
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ban.reason}
                    </p>
                  )}
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    Banned by {ban.issuer.name ?? "Unknown"} · {new Date(ban.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Unban (admin only) */}
                {isAdmin && (
                  <button
                    onClick={() => handleUnban(ban.user.id)}
                    disabled={unbanning === ban.user.id}
                    style={{
                      padding: "0.3rem 0.7rem",
                      borderRadius: "5px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      cursor: unbanning === ban.user.id ? "not-allowed" : "pointer",
                      opacity: unbanning === ban.user.id ? 0.5 : 1,
                      transition: "border-color 0.12s, color 0.12s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { if (unbanning !== ban.user.id) { (e.currentTarget.style.borderColor = "var(--accent)"); (e.currentTarget.style.color = "var(--accent)"); } }}
                    onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "var(--border)"); (e.currentTarget.style.color = "var(--text-secondary)"); }}
                  >
                    {unbanning === ban.user.id ? "Unbanning…" : "Unban"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ActionButton({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: 28,
        height: 28,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: danger ? "var(--danger)" : "var(--text-secondary)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => { (e.currentTarget.style.background = danger ? "rgba(239,68,68,0.15)" : "var(--surface-3)"); }}
      onMouseLeave={(e) => { (e.currentTarget.style.background = "transparent"); }}
    >
      {icon}
    </button>
  );
}

const inputStyle = `
  .settings-input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.65rem 0.75rem;
    color: var(--text-primary);
    outline: none;
    font-size: 0.95rem;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .settings-input:focus { border-color: var(--accent); }
  .settings-input::placeholder { color: var(--text-muted); }
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
  cursor: "pointer",
};

const primaryBtn = (disabled: boolean, saved: boolean): React.CSSProperties => ({
  padding: "0.6rem 1.25rem",
  borderRadius: "6px",
  background: disabled ? "var(--surface-2)" : saved ? "var(--success)" : "var(--accent)",
  color: disabled ? "var(--text-muted)" : "#fff",
  fontWeight: 600,
  fontSize: "0.9rem",
  opacity: disabled ? 0.6 : 1,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background 0.15s",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
});
