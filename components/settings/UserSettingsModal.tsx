"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import {
  PersonIcon,
  BellIcon,
  BellOffIcon,
  CheckIcon,
  ImageIcon,
} from "@/components/icons";
import Image from "next/image";
import axios from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────

type UserProfile = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  status: "ONLINE" | "IDLE" | "DND" | "OFFLINE";
};

type NotificationChannel = {
  id: string;
  name: string;
  type: "TEXT" | "VOICE";
  muted: boolean;
};

type NotificationServer = {
  id: string;
  name: string;
  image: string | null;
  channels: NotificationChannel[];
};

type Tab = "My Account" | "Notifications";

const TABS: Tab[] = ["My Account", "Notifications"];

const STATUS_OPTIONS: { value: UserProfile["status"]; label: string; color: string }[] = [
  { value: "ONLINE", label: "Online", color: "var(--online)" },
  { value: "IDLE", label: "Idle", color: "var(--idle)" },
  { value: "DND", label: "Do Not Disturb", color: "var(--dnd)" },
  { value: "OFFLINE", label: "Invisible", color: "var(--offline)" },
];

// ── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({ initialProfile }: { initialProfile: UserProfile }) {
  const { update: updateSession } = useSession();

  const [name, setName] = useState(initialProfile.name ?? "");
  const [username, setUsername] = useState(initialProfile.username ?? "");
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [status, setStatus] = useState<UserProfile["status"]>(initialProfile.status);
  const [imageUrl, setImageUrl] = useState<string | null>(initialProfile.image);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post<{ url: string }>("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
    } catch {
      setError("Avatar upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await axios.patch<UserProfile>("/api/users/profile", {
        name: name.trim() || undefined,
        username: username.trim().toLowerCase() || undefined,
        bio: bio.trim() || null,
        image: imageUrl,
        status,
      });
      // Refresh the NextAuth session so UserPanel reflects changes immediately
      await updateSession({
        name: res.data.name,
        image: res.data.image,
        username: res.data.username,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Failed to save changes.");
      } else {
        setError("Failed to save changes.");
      }
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.55rem 0.75rem",
    background: "var(--surface-3)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.4rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              background: "var(--surface-3)",
              border: "3px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Avatar"
                width={80}
                height={80}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <PersonIcon size={32} style={{ color: "var(--text-muted)" }} />
            )}
            {/* Hover overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.15s",
              borderRadius: "50%",
              gap: "0.2rem",
            }}
              onMouseEnter={(e) => { (e.currentTarget.style.opacity = "1"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.opacity = "0"); }}
            >
              <ImageIcon size={18} style={{ color: "#fff" }} />
              <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
                {uploading ? "Uploading…" : "Change\nAvatar"}
              </span>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Click the avatar to upload a new image.
          </div>
          {imageUrl && (
            <button
              onClick={() => setImageUrl(null)}
              style={{
                marginTop: "0.4rem",
                fontSize: "0.8rem",
                color: "var(--danger)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Remove avatar
            </button>
          )}
        </div>
      </div>

      {/* Display name */}
      <div>
        <label style={labelStyle}>Display Name</label>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your display name"
          maxLength={100}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
      </div>

      {/* Username */}
      <div>
        <label style={labelStyle}>Username</label>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            pointerEvents: "none",
          }}>@</span>
          <input
            style={{ ...inputStyle, paddingLeft: "1.6rem" }}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder="your_username"
            maxLength={32}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
          Lowercase letters, numbers, and underscores only.
        </div>
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {STATUS_OPTIONS.map((opt) => {
            const active = status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  background: active ? "var(--surface-3)" : "transparent",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: opt.color,
                  flexShrink: 0,
                }} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>Bio</label>
        <textarea
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: 80,
            maxHeight: 160,
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell people a little about yourself…"
          maxLength={500}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", textAlign: "right" }}>
          {bio.length}/500
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "0.6rem 0.9rem",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid var(--danger)",
          borderRadius: "6px",
          fontSize: "0.85rem",
          color: "var(--danger)",
        }}>
          {error}
        </div>
      )}

      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving || uploading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 1.4rem",
            borderRadius: "8px",
            background: saved ? "var(--success)" : "var(--accent)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: saving || uploading ? "not-allowed" : "pointer",
            opacity: saving || uploading ? 0.7 : 1,
            transition: "background 0.2s",
          }}
        >
          {saved && <CheckIcon size={15} />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </div>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────

function NotificationsTab() {
  const [servers, setServers] = useState<NotificationServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<NotificationServer[]>("/api/users/profile/notifications")
      .then((res) => setServers(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(serverId: string, channelId: string, currentMuted: boolean) {
    setToggling(channelId);
    try {
      await axios.patch(`/api/channels/${channelId}/notifications`, {
        muted: !currentMuted,
      });
      setServers((prev) =>
        prev.map((s) =>
          s.id !== serverId
            ? s
            : {
                ...s,
                channels: s.channels.map((ch) =>
                  ch.id === channelId ? { ...ch, muted: !currentMuted } : ch
                ),
              }
        )
      );
    } finally {
      setToggling(null);
    }
  }

  if (loading) {
    return (
      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "2rem 0", textAlign: "center" }}>
        Loading…
      </div>
    );
  }

  if (!servers.length) {
    return (
      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "2rem 0", textAlign: "center" }}>
        You're not in any servers yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
        Mute individual channels to stop receiving notifications from them.
      </p>
      {servers.map((server) => (
        <div key={server.id}>
          {/* Server header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.6rem",
          }}>
            {server.image ? (
              <Image
                src={server.image}
                alt={server.name}
                width={22}
                height={22}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "var(--surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
              }}>
                {server.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {server.name}
            </span>
          </div>

          {/* Channels */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
            paddingLeft: "0.75rem",
            borderLeft: "2px solid var(--border)",
          }}>
            {server.channels.map((ch) => (
              <div
                key={ch.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "6px",
                  background: ch.muted ? "rgba(239,68,68,0.06)" : "transparent",
                  transition: "background 0.12s",
                }}
              >
                <span style={{
                  fontSize: "0.88rem",
                  color: ch.muted ? "var(--text-muted)" : "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {ch.type === "VOICE" ? "🔊" : "#"}
                  </span>
                  {ch.name}
                </span>
                <button
                  onClick={() => handleToggle(server.id, ch.id, ch.muted)}
                  disabled={toggling === ch.id}
                  title={ch.muted ? "Unmute channel" : "Mute channel"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: ch.muted ? "var(--danger)" : "var(--text-muted)",
                    background: ch.muted ? "rgba(239,68,68,0.12)" : "var(--surface-2)",
                    border: `1px solid ${ch.muted ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                    cursor: toggling === ch.id ? "not-allowed" : "pointer",
                    opacity: toggling === ch.id ? 0.6 : 1,
                    transition: "all 0.12s",
                  }}
                >
                  {ch.muted ? <BellOffIcon size={13} /> : <BellIcon size={13} />}
                  {ch.muted ? "Muted" : "Mute"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export function UserSettingsModal() {
  const { isOpen, type, close } = useModal();
  const open = isOpen && type === "editProfile";

  const [activeTab, setActiveTab] = useState<Tab>("My Account");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!open) return;
    setActiveTab("My Account");
    setLoadingProfile(true);
    axios
      .get<UserProfile>("/api/users/profile")
      .then((res) => setProfile(res.data))
      .finally(() => setLoadingProfile(false));
  }, [open]);

  return (
    <Modal isOpen={open} onClose={close} title="User Settings" width={660}>
      <div style={{ display: "flex", gap: "1.5rem", minHeight: 440 }}>
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
              onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.background = "transparent"; }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", maxHeight: 520, paddingRight: "0.25rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.12 }}
            >
              {activeTab === "My Account" && (
                loadingProfile || !profile ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "2rem 0", textAlign: "center" }}>
                    Loading…
                  </div>
                ) : (
                  <ProfileTab initialProfile={profile} />
                )
              )}
              {activeTab === "Notifications" && <NotificationsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
