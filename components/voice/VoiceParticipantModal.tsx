"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/stores/modalStore";
import { useVoiceStore } from "@/stores/voiceStore";

type Status = "ONLINE" | "IDLE" | "DND" | "OFFLINE";
type Role = "ADMIN" | "MODERATOR" | "GUEST";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  status: Status;
  member: { role: Role; createdAt: string } | null;
}

const STATUS_COLOR: Record<Status, string> = {
  ONLINE: "var(--success)",
  IDLE: "#f59e0b",
  DND: "var(--danger)",
  OFFLINE: "var(--text-muted)",
};
const STATUS_LABEL: Record<Status, string> = {
  ONLINE: "Online",
  IDLE: "Idle",
  DND: "Do Not Disturb",
  OFFLINE: "Offline",
};

const ROLE_COLOR: Record<Role, string> = {
  ADMIN: "#f87171",
  MODERATOR: "#818cf8",
  GUEST: "var(--text-muted)",
};

export function VoiceParticipantModal() {
  const { isOpen, type, data, close } = useModal();
  const open = isOpen && type === "voiceParticipantProfile";

  const { channelId: voiceChannelId, serverId: voiceServerId, participants: voiceParticipants } = useVoiceStore();
  const isLive = voiceParticipants.find((p) => p.identity === data.targetUserId)?.isLive ?? false;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !data.targetUserId) return;
    setLoading(true);
    setProfile(null);
    const url = data.serverId
      ? `/api/users/${data.targetUserId}?serverId=${data.serverId}`
      : `/api/users/${data.targetUserId}`;
    fetch(url)
      .then((r) => r.json())
      .then((d: UserProfile) => setProfile(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, data.targetUserId, data.serverId]);

  const joinedDate = profile?.member?.createdAt
    ? new Date(profile.member.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Modal isOpen={open} onClose={close} title="">
      {loading || !profile ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 0",
          }}
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid var(--border)",
              borderTopColor: "var(--accent)",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      ) : (
        <div style={{ marginTop: "-0.5rem" }}>
          {/* Avatar + status */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={64}
                  height={64}
                  style={{ borderRadius: "50%", border: "2px solid var(--border)" }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Status dot */}
              <span
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: STATUS_COLOR[profile.status],
                  border: "2px solid var(--surface-1)",
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {profile.name}
                </span>
                {profile.member && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: ROLE_COLOR[profile.member.role],
                      background: `${ROLE_COLOR[profile.member.role]}20`,
                      padding: "0.1rem 0.5rem",
                      borderRadius: "10px",
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                    }}
                  >
                    {profile.member.role}
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                @{profile.username}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.15rem" }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: STATUS_COLOR[profile.status],
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {STATUS_LABEL[profile.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Join Live button */}
          {isLive && voiceChannelId && voiceServerId && (
            <div style={{ marginBottom: "1rem" }}>
              <Link
                href={`/servers/${voiceServerId}/channels/${voiceChannelId}`}
                onClick={close}
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    background: "var(--danger, #ef4444)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget.style.opacity = "0.85"); }}
                  onMouseLeave={(e) => { (e.currentTarget.style.opacity = "1"); }}
                >
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      background: "rgba(255,255,255,0.25)",
                      padding: "0.05rem 0.35rem",
                      borderRadius: "4px",
                      letterSpacing: "0.4px",
                    }}
                  >
                    LIVE
                  </span>
                  Join Live
                </button>
              </Link>
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <Section title="About">
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {profile.bio}
              </p>
            </Section>
          )}

          {/* Member since */}
          {joinedDate && (
            <Section title="Member Since">
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{joinedDate}</p>
            </Section>
          )}
        </div>
      )}
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "0.35rem",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
