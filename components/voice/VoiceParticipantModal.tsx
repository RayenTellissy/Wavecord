"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "@/components/icons";
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
  GUEST: "#94a3b8",
};
const ROLE_BANNER: Record<Role, string> = {
  ADMIN: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)",
  MODERATOR: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f0a2e 100%)",
  GUEST: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c1220 100%)",
};
const DEFAULT_BANNER = "linear-gradient(135deg, #1a0533 0%, #2d1b69 45%, #0d0620 100%)";

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const joinedDate = profile?.member?.createdAt
    ? new Date(profile.member.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const banner = profile?.member ? ROLE_BANNER[profile.member.role] : DEFAULT_BANNER;
  const initial = profile?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px) brightness(0.70)",
              WebkitBackdropFilter: "blur(6px) brightness(0.70)",
              zIndex: 200,
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 201,
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 420, mass: 0.7 }}
              style={{
                width: "min(360px, calc(100vw - 2rem))",
                borderRadius: "20px",
                background: "rgba(9,8,16,0.92)",
                backdropFilter: "blur(48px) saturate(1.6) brightness(0.92)",
                WebkitBackdropFilter: "blur(48px) saturate(1.6) brightness(0.92)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  "0 48px 120px rgba(0,0,0,0.70), 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(139,92,246,0.10)",
                pointerEvents: "all",
                overflow: "hidden",
              }}
            >
              {/* Banner */}
              <div
                style={{
                  height: 108,
                  background: banner,
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {/* Subtle noise texture overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
                    opacity: 0.4,
                    mixBlendMode: "overlay",
                  }}
                />
                {/* Radial glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at 50% 120%, rgba(139,92,246,0.18) 0%, transparent 70%)",
                  }}
                />
                {/* Close button */}
                <button
                  onClick={close}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(8px)",
                    transition: "background 0.15s, color 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(244,63,94,0.4)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.35)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  <XIcon size={13} />
                </button>
              </div>

              {/* Avatar — overlaps banner */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ marginTop: -44, position: "relative" }}>
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      border: "4px solid rgba(9,8,16,0.95)",
                      overflow: "hidden",
                      background: "rgba(30,27,50,1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.18)",
                    }}
                  >
                    {profile?.image ? (
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        width={88}
                        height={88}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    ) : loading ? null : (
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          color: "var(--text-secondary)",
                          lineHeight: 1,
                        }}
                      >
                        {initial}
                      </span>
                    )}
                  </div>
                  {/* Status ring + dot */}
                  {profile && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: STATUS_COLOR[profile.status],
                        border: "3px solid rgba(9,8,16,0.95)",
                        boxShadow: `0 0 8px ${STATUS_COLOR[profile.status]}88`,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "0.75rem 1.5rem 1.5rem" }}>
                {loading || !profile ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "1rem 0 0.5rem",
                    }}
                  >
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.07)",
                        borderTopColor: "var(--accent)",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Loading profile…</span>
                  </div>
                ) : (
                  <>
                    {/* Name + username centered */}
                    <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                      <h2
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--text-primary)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                        }}
                      >
                        {profile.name}
                      </h2>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          marginTop: "0.15rem",
                          fontWeight: 500,
                        }}
                      >
                        @{profile.username}
                      </p>
                    </div>

                    {/* Badges row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        flexWrap: "wrap",
                        marginBottom: "1.1rem",
                      }}
                    >
                      {/* Status badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: STATUS_COLOR[profile.status],
                          background: `${STATUS_COLOR[profile.status]}18`,
                          border: `1px solid ${STATUS_COLOR[profile.status]}40`,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "20px",
                          letterSpacing: "0.3px",
                          textTransform: "uppercase",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: STATUS_COLOR[profile.status],
                            boxShadow: `0 0 6px ${STATUS_COLOR[profile.status]}`,
                            flexShrink: 0,
                          }}
                        />
                        {STATUS_LABEL[profile.status]}
                      </span>

                      {/* Role badge */}
                      {profile.member && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: ROLE_COLOR[profile.member.role],
                            background: `${ROLE_COLOR[profile.member.role]}18`,
                            border: `1px solid ${ROLE_COLOR[profile.member.role]}40`,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "20px",
                            letterSpacing: "0.3px",
                            textTransform: "uppercase",
                          }}
                        >
                          {profile.member.role}
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)",
                        marginBottom: "1.1rem",
                      }}
                    />

                    {/* About */}
                    {profile.bio && (
                      <InfoSection title="About">
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.65,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {profile.bio}
                        </p>
                      </InfoSection>
                    )}

                    {/* Member since */}
                    {joinedDate && (
                      <InfoSection title="Member Since">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <CalendarIcon />
                          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                            {joinedDate}
                          </span>
                        </div>
                      </InfoSection>
                    )}

                    {/* Join Live */}
                    {isLive && voiceChannelId && voiceServerId && (
                      <div style={{ marginTop: profile.bio || joinedDate ? "0.25rem" : 0 }}>
                        <Link
                          href={`/servers/${voiceServerId}/channels/${voiceChannelId}`}
                          onClick={close}
                          style={{ textDecoration: "none" }}
                        >
                          <button
                            style={{
                              width: "100%",
                              padding: "0.6rem 1rem",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.88rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                              transition: "opacity 0.15s, box-shadow 0.15s",
                              boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "0.88";
                              e.currentTarget.style.boxShadow = "0 6px 24px rgba(220,38,38,0.5)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.35)";
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                background: "rgba(255,255,255,0.22)",
                                padding: "0.08rem 0.4rem",
                                borderRadius: "4px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              LIVE
                            </span>
                            Join Voice Channel
                          </button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p
        style={{
          fontSize: "0.68rem",
          fontWeight: 800,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          marginBottom: "0.4rem",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "var(--text-muted)" }}>
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
