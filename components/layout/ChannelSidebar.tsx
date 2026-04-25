"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  HashIcon, VolumeIcon, ChevronDownIcon,
  PlusIcon, LeaveIcon, LinkIcon, SettingsIcon,
  MicOffIcon, HeadphonesOffIcon, ScreenShareIcon,
} from "@/components/icons";
import { UserPanel } from "./UserPanel";
import { useModal } from "@/stores/modalStore";
import { useSidebar } from "@/stores/sidebarStore";
import { useVoiceStore, type VoiceParticipant } from "@/stores/voiceStore";
import { useVoiceSessions } from "@/hooks/useVoiceSessions";
import { useLocalParticipant, useConnectionQualityIndicator } from "@livekit/components-react";
import { ConnectionQuality } from "livekit-client";
import type { Server, Channel, Category, ServerMember, User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";

type PopulatedCategory = Category & { channels: Channel[] };
type PopulatedServer = Server & {
  categories: PopulatedCategory[];
  members: (ServerMember & { user: Pick<User, "id" | "name" | "username" | "image" | "status"> })[];
};

interface ChannelSidebarProps {
  server: PopulatedServer;
  currentUserId: string;
  currentMemberRole: string;
}

const stagger = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariant = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.15 } },
};

export function ChannelSidebar({ server, currentUserId, currentMemberRole }: ChannelSidebarProps) {
  const params = useParams();
  const router = useRouter();
  const { open } = useModal();
  const { mobileOpen, closeMobile } = useSidebar();
  const {
    channelId: voiceChannelId,
    token: voiceToken,
    optimisticParticipant: voiceOptimisticParticipant,
    join: joinVoice,
    setOptimisticParticipant,
  } = useVoiceStore();
  const voiceSessions = useVoiceSessions(server.id);

  const activeChannelId = params?.channelId as string | undefined;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [serverMenuOpen, setServerMenuOpen] = useState(false);
  const [joiningVoice, setJoiningVoice] = useState<string | null>(null);

  const isAdmin = currentMemberRole === "ADMIN";
  const isModOrAdmin = currentMemberRole === "ADMIN" || currentMemberRole === "MODERATOR";

  async function handleLeave() {
    if (!confirm("Are you sure you want to leave this server?")) return;
    try {
      const member = server.members.find((m) => m.user.id === currentUserId);
      if (!member) return;
      await axios.delete(`/api/servers/${server.id}/members/${member.id}`);
      router.push("/");
      router.refresh();
    } catch { /* silent */ }
  }

  async function handleVoiceChannelClick(channel: Channel, forceNavigate = false) {
    // Already connected to this exact channel → navigate to full room UI
    if (voiceChannelId === channel.id && voiceToken) {
      router.push(`/servers/${server.id}/channels/${channel.id}`);
      closeMobile();
      return;
    }

    // Optimistically show the current user in the participant list immediately
    const currentMember = server.members.find((m) => m.user.id === currentUserId);
    if (currentMember) {
      setOptimisticParticipant({
        identity: currentUserId,
        name: currentMember.user.name ?? currentMember.user.username ?? "User",
        metadata: currentMember.user.image ?? undefined,
      });
    }

    // Otherwise join (or switch) — stay on current page, audio connects in background
    setJoiningVoice(channel.id);
    try {
      const res = await fetch(`/api/livekit/token?channelId=${channel.id}`);
      const data = await res.json() as { token?: string; serverUrl?: string; error?: string };
      if (data.error) throw new Error(data.error);
      joinVoice(channel.id, channel.name, server.id, server.name, data.token!, data.serverUrl!);
      import("@/lib/sounds").then(({ playJoinSound }) => playJoinSound());
      if (forceNavigate) {
        router.push(`/servers/${server.id}/channels/${channel.id}`);
        closeMobile();
      }
    } catch (e) {
      console.error("Voice join failed:", e);
      setOptimisticParticipant(null);
    } finally {
      setJoiningVoice(null);
    }
  }

  function handleWatchStream(channel: Channel) {
    handleVoiceChannelClick(channel, true);
  }

  return (
    <div
      className={`sidebar-channel${mobileOpen ? " mobile-open" : ""}`}
      style={{
        width: 240,
        minWidth: 240,
        background: "rgba(12,12,16,0.24)",
        backdropFilter: "blur(80px) saturate(3) brightness(1.06)",
        WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.06)",
        borderRight: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "inset -1px 0 0 rgba(139,92,246,0.12), inset 0 2px 0 rgba(255,255,255,0.14), inset 1px 0 0 rgba(255,255,255,0.05), 4px 0 40px rgba(0,0,0,0.45)",
      }}
    >
      {/* ── Server Header ── */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setServerMenuOpen(!serverMenuOpen)}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            borderBottom: "1px solid rgba(139,92,246,0.15)",
            background: serverMenuOpen ? "rgba(139,92,246,0.12)" : "transparent",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { if (!serverMenuOpen) e.currentTarget.style.background = "rgba(139,92,246,0.08)"; }}
          onMouseLeave={(e) => { if (!serverMenuOpen) e.currentTarget.style.background = "transparent"; }}
        >
          {server.imageUrl && (
            <Image src={server.imageUrl} alt={server.name} width={20} height={20} style={{ borderRadius: "4px" }} />
          )}
          <span style={{
            flex: 1, fontWeight: 700, fontSize: "0.95rem", textAlign: "left",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {server.name}
          </span>
          <ChevronDownIcon size={16} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        </button>

        <AnimatePresence>
          {serverMenuOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 50 }} onClick={() => setServerMenuOpen(false)} />
              {/* Outer: prismatic border wrapper */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ type: "spring", damping: 28, stiffness: 420, mass: 0.7 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)", left: "0.5rem", right: "0.5rem",
                  borderRadius: "16px",
                  padding: "1px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(192,162,250,0.44) 20%, rgba(167,139,250,0.38) 38%, rgba(34,211,238,0.28) 65%, rgba(255,255,255,0.22) 100%)",
                  backdropFilter: "blur(80px) saturate(3) brightness(1.10)",
                  WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.10)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.70), 0 8px 24px rgba(0,0,0,0.40)",
                  zIndex: 51,
                }}
                onClick={() => setServerMenuOpen(false)}
              >
                {/* Inner: dark glass fill */}
                <div style={{
                  borderRadius: "15px",
                  background: "rgba(13,13,16,0.88)",
                  padding: "0.35rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Specular highlight */}
                  <div style={{
                    position: "absolute",
                    top: 0, left: "8%", right: "8%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.50), rgba(255,255,255,0.65), rgba(255,255,255,0.50), transparent)",
                    zIndex: 1,
                  }} />
                  <MenuItem icon={<LinkIcon size={16} />} label="Invite People" onClick={() => open("invite", { serverId: server.id })} />
                  {isModOrAdmin && (
                    <MenuItem icon={<PlusIcon size={16} />} label="Create Channel" onClick={() => open("createChannel", { serverId: server.id })} />
                  )}
                  {isAdmin && (
                    <MenuItem icon={<SettingsIcon size={16} />} label="Server Settings" onClick={() => open("serverSettings", { serverId: server.id })} />
                  )}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0.35rem 0" }} />
                  <MenuItem
                    icon={<LeaveIcon size={16} />}
                    label={isAdmin ? "Delete Server" : "Leave Server"}
                    danger
                    onClick={isAdmin ? () => open("deleteServer", { serverId: server.id }) : handleLeave}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Channel List ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
        {server.categories.map((category) => {
          const textChannels = category.channels.filter((c) => c.type === "TEXT");
          const voiceChannels = category.channels.filter((c) => c.type === "VOICE");

          return (
            <div key={category.id}>
              {/* Category header */}
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [category.id]: !c[category.id] }))}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.75rem 0.5rem 0.25rem",
                  color: "var(--text-muted)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                <motion.span
                  animate={{ rotate: collapsed[category.id] ? -90 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex" }}
                >
                  <ChevronDownIcon size={14} />
                </motion.span>
                <span style={{ flex: 1, textAlign: "left" }}>{category.name}</span>
                {isModOrAdmin && (
                  <Tooltip content="Create Channel" side="top">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        open("createChannel", { serverId: server.id, categoryId: category.id });
                      }}
                      style={{ display: "flex", padding: "2px", borderRadius: "4px", opacity: 0 }}
                      className="category-plus"
                    >
                      <PlusIcon size={14} />
                    </span>
                  </Tooltip>
                )}
              </button>

              <style>{`.category-plus:hover { opacity: 1 !important; }`}</style>

              <AnimatePresence initial={false}>
                {!collapsed[category.id] && (
                  <motion.div variants={stagger} initial="initial" animate="animate">
                    {/* ── Text channels ── */}
                    {textChannels.length > 0 && (
                      <>
                        {voiceChannels.length > 0 && (
                          <SectionLabel label="Text Channels" />
                        )}
                        {textChannels.map((channel) => (
                          <motion.div key={channel.id} variants={itemVariant}>
                            <TextChannelItem
                              channel={channel}
                              serverId={server.id}
                              isActive={channel.id === activeChannelId}
                              onNavigate={closeMobile}
                            />
                          </motion.div>
                        ))}
                      </>
                    )}

                    {/* ── Voice channels ── */}
                    {voiceChannels.length > 0 && (
                      <>
                        {textChannels.length > 0 && (
                          <SectionLabel label="Voice Channels" />
                        )}
                        {voiceChannels.map((channel) => {
                          const sessions = voiceSessions[channel.id] ?? [];
                          const participants: VoiceParticipant[] = sessions.map((s) => ({
                            identity: s.userId,
                            name: s.name,
                            metadata: s.image ?? undefined,
                            isMuted: s.isMuted,
                            isDeafened: s.isDeafened,
                            isLive: s.isLive,
                          }));
                          return (
                            <motion.div key={channel.id} variants={itemVariant}>
                              <VoiceChannelItem
                                channel={channel}
                                serverId={server.id}
                                isActive={channel.id === activeChannelId}
                                isConnected={channel.id === voiceChannelId && !!voiceToken}
                                isJoining={joiningVoice === channel.id}
                                participants={participants}
                                optimisticParticipant={
                                  joiningVoice === channel.id &&
                                  !participants.find((p) => p.identity === voiceOptimisticParticipant?.identity)
                                    ? voiceOptimisticParticipant
                                    : null
                                }
                                onClick={() => handleVoiceChannelClick(channel)}
                                onWatchStream={() => handleWatchStream(channel)}
                              />
                            </motion.div>
                          );
                        })}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Spacer so UserPanel stays above the fixed VoiceHUD when connected */}
      {voiceChannelId && <div style={{ height: 80, flexShrink: 0 }} />}
      <UserPanel />
    </div>
  );
}

// ─── Section divider label ────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "0.5rem 0.75rem 0.2rem",
        fontSize: "0.68rem",
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        opacity: 0.7,
      }}
    >
      {label}
    </div>
  );
}

// ─── Text channel item ────────────────────────────────────────────────────────

function TextChannelItem({
  channel,
  serverId,
  isActive,
  onNavigate,
}: {
  channel: Channel;
  serverId: string;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link href={`/servers/${serverId}/channels/${channel.id}`} onClick={onNavigate}>
      <motion.div
        whileHover={{ x: 2 }}
        style={channelRowStyle(isActive)}
        onMouseEnter={(e) => applyHover(e, isActive)}
        onMouseLeave={(e) => clearHover(e, isActive)}
      >
        <span style={{ display: "flex", color: isActive ? "var(--accent)" : "inherit", flexShrink: 0 }}>
          <HashIcon size={17} />
        </span>
        <span style={channelNameStyle}>{channel.name}</span>
      </motion.div>
    </Link>
  );
}

// ─── Voice channel item ───────────────────────────────────────────────────────

function VoiceChannelItem({
  channel,
  serverId,
  isActive,
  isConnected,
  isJoining,
  participants,
  optimisticParticipant,
  onClick,
  onWatchStream,
}: {
  channel: Channel;
  serverId: string;
  isActive: boolean;
  isConnected: boolean;
  isJoining: boolean;
  participants: VoiceParticipant[];
  optimisticParticipant?: VoiceParticipant | null;
  onClick: () => void;
  onWatchStream: () => void;
}) {
  const { open } = useModal();
  const accentColor = isConnected ? "var(--success)" : isActive ? "var(--accent)" : "inherit";

  const [streamPopup, setStreamPopup] = useState<{
    participant: VoiceParticipant;
    x: number;
    y: number;
  } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showStreamPopup(participant: VoiceParticipant, el: HTMLElement) {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    const rect = el.getBoundingClientRect();
    const popupHeight = 175;
    const y = Math.min(rect.top, window.innerHeight - popupHeight - 8);
    setStreamPopup({ participant, x: rect.right + 8, y });
  }

  function scheduleHidePopup() {
    hideTimerRef.current = setTimeout(() => setStreamPopup(null), 180);
  }

  function cancelHidePopup() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }

  return (
    <div>
      <motion.div
        whileHover={{ x: 2 }}
        onClick={onClick}
        style={{
          ...channelRowStyle(isActive || isConnected),
          cursor: isJoining ? "default" : "pointer",
          color: isConnected ? "#4ade80" : isActive ? "#f0eeff" : "var(--text-secondary)",
          background: isConnected
            ? "rgba(34,197,94,0.14)"
            : isActive
            ? "rgba(139,92,246,0.22)"
            : "transparent",
          border: isConnected
            ? "1px solid rgba(34,197,94,0.3)"
            : isActive
            ? "1px solid rgba(167,139,250,0.35)"
            : "1px solid transparent",
          boxShadow: isConnected
            ? "0 0 16px rgba(34,197,94,0.18), inset 0 1px 0 rgba(255,255,255,0.05)"
            : isActive
            ? "0 0 16px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive && !isConnected) {
            (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)";
            (e.currentTarget as HTMLElement).style.color = "#f0eeff";
            (e.currentTarget as HTMLElement).style.border = "1px solid rgba(139,92,246,0.18)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive && !isConnected) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
          }
        }}
      >
        <span style={{ display: "flex", color: accentColor, flexShrink: 0 }}>
          <VolumeIcon size={17} />
        </span>
        <span style={channelNameStyle}>{channel.name}</span>
        {isJoining && <JoiningIndicator />}
        {isConnected && !isJoining && <ConnectionQualityDot />}
      </motion.div>

      {/* Participants list — visible to everyone in the server, not just those connected */}
      {(participants.length > 0 || optimisticParticipant) && (
        <div style={{ paddingLeft: "1.75rem", paddingBottom: "0.25rem" }}>
          {/* Optimistic self-entry: shown while connecting, grayed out */}
          {optimisticParticipant && !participants.find((p) => p.identity === optimisticParticipant.identity) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.5rem",
                marginRight: "0.5rem",
                borderRadius: "4px",
                opacity: 0.45,
                filter: "grayscale(0.6)",
              }}
            >
              {optimisticParticipant.metadata ? (
                <Image
                  src={optimisticParticipant.metadata}
                  alt={optimisticParticipant.name}
                  width={22}
                  height={22}
                  style={{ borderRadius: "50%", flexShrink: 0 }}
                />
              ) : (
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {optimisticParticipant.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {optimisticParticipant.name}
              </span>
            </div>
          )}
          {participants.map((p) => (
            <motion.div
              key={p.identity}
              whileHover={{ x: 2 }}
              onClick={() => open("voiceParticipantProfile", { targetUserId: p.identity, serverId })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.5rem",
                marginRight: "0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                if (p.isLive) showStreamPopup(p, e.currentTarget as HTMLElement);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                if (p.isLive) scheduleHidePopup();
              }}
            >
              {p.metadata ? (
                <Image
                  src={p.metadata}
                  alt={p.name}
                  width={22}
                  height={22}
                  style={{ borderRadius: "50%", flexShrink: 0 }}
                />
              ) : (
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {p.name}
              </span>
              {p.isLive && (
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: "#fff",
                    background: "var(--danger, #ef4444)",
                    padding: "0.05rem 0.3rem",
                    borderRadius: "4px",
                    letterSpacing: "0.4px",
                    flexShrink: 0,
                  }}
                >
                  LIVE
                </span>
              )}
              <ParticipantStatusIcons isMuted={!!p.isMuted} isDeafened={!!p.isDeafened} />
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Stream hover popup ── */}
      <AnimatePresence>
        {streamPopup && (
        <motion.div
          key="stream-popup"
          initial={{ opacity: 0, scale: 0.95, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -6 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          onMouseEnter={cancelHidePopup}
          onMouseLeave={() => setStreamPopup(null)}
          style={{
            position: "fixed",
            left: streamPopup.x,
            top: streamPopup.y,
            zIndex: 9999,
            width: 220,
            borderRadius: "16px",
            padding: "1px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(192,162,250,0.44) 20%, rgba(167,139,250,0.38) 38%, rgba(34,211,238,0.28) 65%, rgba(255,255,255,0.22) 100%)",
            backdropFilter: "blur(80px) saturate(3) brightness(1.10)",
            WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.10)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.72), 0 8px 24px rgba(0,0,0,0.40)",
            pointerEvents: "all",
          }}
        >
          {/* Inner: dark glass fill */}
          <div style={{ borderRadius: "15px", background: "rgba(13,13,16,0.88)", overflow: "hidden", position: "relative" }}>
          {/* Specular */}
          <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.50), rgba(255,255,255,0.65), rgba(255,255,255,0.50), transparent)", zIndex: 3 }} />
          {/* Thumbnail */}
          <div
            style={{
              background: "#0a0a0d",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {streamPopup.participant.metadata ? (
              <Image
                src={streamPopup.participant.metadata}
                alt=""
                width={44}
                height={44}
                style={{ borderRadius: "50%", opacity: 0.3, filter: "blur(2px)" }}
              />
            ) : (
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  opacity: 0.4,
                }}
              >
                {streamPopup.participant.name.charAt(0).toUpperCase()}
              </span>
            )}
            <ScreenShareIcon
              size={30}
              style={{ position: "absolute", color: "rgba(255,255,255,0.18)" }}
            />
            <span
              style={{
                position: "absolute",
                top: "0.4rem",
                left: "0.4rem",
                background: "#ef4444",
                color: "#fff",
                fontSize: "0.58rem",
                fontWeight: 700,
                padding: "0.05rem 0.32rem",
                borderRadius: "4px",
                letterSpacing: "0.5px",
              }}
            >
              LIVE
            </span>
          </div>

          {/* Info + button */}
          <div style={{ padding: "0.6rem 0.75rem 0.75rem" }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.15rem",
              }}
            >
              Streaming Now
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                marginBottom: "0.6rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {streamPopup.participant.name}
            </div>
            <button
              onClick={() => {
                setStreamPopup(null);
                onWatchStream();
              }}
              style={{
                width: "100%",
                padding: "0.42rem",
                borderRadius: "6px",
                background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(139,92,246,0.2))",
                color: "var(--cyan)",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                border: "1px solid rgba(34,211,238,0.3)",
                cursor: "pointer",
                transition: "box-shadow 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--cyan-glow)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <ScreenShareIcon size={13} />
              Watch Stream
            </button>
          </div>
          </div>{/* /inner */}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Per-participant mute / deafen icons ──────────────────────────────────────

function ParticipantStatusIcons({ isMuted, isDeafened }: { isMuted: boolean; isDeafened: boolean }) {
  return (
    <>
      {isDeafened && (
        <HeadphonesOffIcon size={13} style={{ color: "var(--danger, #ef4444)", flexShrink: 0 }} />
      )}
      {isMuted && !isDeafened && (
        <MicOffIcon size={13} style={{ color: "var(--danger, #ef4444)", flexShrink: 0 }} />
      )}
    </>
  );
}

// ─── Connection quality dot ───────────────────────────────────────────────────

const QUALITY_CONFIG = {
  [ConnectionQuality.Excellent]: { color: "#22c55e", glow: "0 0 5px #22c55e", pulse: false },
  [ConnectionQuality.Good]:      { color: "#86efac", glow: "0 0 4px #86efac", pulse: false },
  [ConnectionQuality.Poor]:      { color: "#f59e0b", glow: "0 0 5px #f59e0b", pulse: false },
  [ConnectionQuality.Lost]:      { color: "#ef4444", glow: "0 0 5px #ef4444", pulse: true  },
  [ConnectionQuality.Unknown]:   { color: "var(--text-muted)", glow: "none",       pulse: false },
} as const;

function ConnectionQualityDot() {
  const { localParticipant } = useLocalParticipant();
  const { quality } = useConnectionQualityIndicator({ participant: localParticipant });
  const cfg = QUALITY_CONFIG[quality] ?? QUALITY_CONFIG[ConnectionQuality.Unknown];

  return (
    <>
      {cfg.pulse && (
        <style>{`@keyframes q-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      )}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: cfg.color,
          flexShrink: 0,
          boxShadow: cfg.glow,
          animation: cfg.pulse ? "q-pulse 1s ease-in-out infinite" : "none",
        }}
      />
    </>
  );
}

// ─── Joining indicator: three pulsing dots ────────────────────────────────────

function JoiningIndicator() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "var(--text-muted)",
            display: "inline-block",
            animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

function channelRowStyle(isActive: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.32rem 0.5rem 0.32rem 0.75rem",
    margin: "0.06rem 0.5rem",
    borderRadius: "8px",
    background: isActive
      ? "rgba(139,92,246,0.22)"
      : "transparent",
    color: isActive ? "#f0eeff" : "var(--text-secondary)",
    fontSize: "0.9rem",
    fontWeight: isActive ? 700 : 500,
    transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
    textDecoration: "none",
    border: isActive
      ? "1px solid rgba(167,139,250,0.35)"
      : "1px solid transparent",
    boxShadow: isActive ? "0 0 16px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
  };
}

const channelNameStyle: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

function applyHover(e: React.MouseEvent, isActive: boolean) {
  if (!isActive) {
    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)";
    (e.currentTarget as HTMLElement).style.color = "#f0eeff";
    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(139,92,246,0.18)";
  }
}

function clearHover(e: React.MouseEvent, isActive: boolean) {
  if (!isActive) {
    (e.currentTarget as HTMLElement).style.background = "transparent";
    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
    (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
  }
}

// ─── Dropdown menu item ───────────────────────────────────────────────────────

function MenuItem({
  icon, label, onClick, danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.5rem 0.6rem", borderRadius: "4px",
        color: danger ? "var(--danger)" : "var(--text-secondary)",
        fontSize: "0.88rem", fontWeight: 500,
        transition: "background 0.12s, color 0.12s", textAlign: "left",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.background = danger ? "rgba(244,63,94,0.15)" : "rgba(139,92,246,0.15)");
        (e.currentTarget.style.color = danger ? "var(--danger)" : "var(--accent-bright)");
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.background = "transparent");
        (e.currentTarget.style.color = danger ? "var(--danger)" : "var(--text-secondary)");
      }}
    >
      {icon}
      {label}
    </button>
  );
}
