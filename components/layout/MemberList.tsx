"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { PersonIcon, KickIcon, BanIcon, ShieldIcon } from "@/components/icons";
import { useModal } from "@/stores/modalStore";
import { useParty, type PartyMessage } from "@/hooks/useParty";
import { PartyEvents } from "@/party/types";
import type { Server, ServerMember, User } from "@prisma/client";

type MemberWithUser = ServerMember & {
  user: Pick<User, "id" | "name" | "username" | "image" | "status">;
};

type PopulatedServer = Server & {
  members: MemberWithUser[];
};

interface MemberListProps {
  server: PopulatedServer;
  currentUserId: string;
  currentMemberRole: string;
}

type ContextMenu = {
  member: MemberWithUser;
  x: number;
  y: number;
};

const STATUS_COLOR: Record<string, string> = {
  ONLINE: "var(--success)",
  IDLE: "#f59e0b",
  DND: "var(--danger)",
  OFFLINE: "var(--text-muted)",
};

const ROLE_GROUPS = [
  { role: "ADMIN", label: "Admins" },
  { role: "MODERATOR", label: "Moderators" },
  { role: "GUEST", label: "Members" },
] as const;

export function MemberList({ server, currentUserId, currentMemberRole }: MemberListProps) {
  const { open } = useModal();
  const { data: session } = useSession();
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

  const onMessage = useCallback((msg: PartyMessage) => {
    if (msg.event !== PartyEvents.USER_STATUS) return;
    const { userId, status } = msg.payload as { userId: string; status: string };
    setStatusOverrides((prev) => ({ ...prev, [userId]: status }));
  }, []);

  useParty({ party: "main", room: server.id, userId: session?.user?.id, onMessage });

  const isModOrAdmin = currentMemberRole === "ADMIN" || currentMemberRole === "MODERATOR";
  const isAdmin = currentMemberRole === "ADMIN";

  function handleContextMenu(e: React.MouseEvent, member: MemberWithUser) {
    if (!isModOrAdmin || member.user.id === currentUserId) return;
    e.preventDefault();
    // Clamp to viewport
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 160);
    setContextMenu({ member, x, y });
  }

  function openKick(member: MemberWithUser) {
    const memberName = member.user.name ?? member.user.username ?? "this member";
    open("kickMember", { serverId: server.id, memberId: member.id, memberName });
    setContextMenu(null);
  }

  function openBan(member: MemberWithUser) {
    const memberName = member.user.name ?? member.user.username ?? "this member";
    open("banMember", { serverId: server.id, memberId: member.id, targetUserId: member.user.id, memberName });
    setContextMenu(null);
  }

  return (
    <>
      <div
        style={{
          width: 240,
          minWidth: 240,
          background: "rgba(12,12,16,0.24)",
          backdropFilter: "blur(80px) saturate(3) brightness(1.06)",
          WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.06)",
          borderLeft: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "inset 1px 0 0 rgba(255,255,255,0.07), inset 0 2px 0 rgba(255,255,255,0.14), -4px 0 40px rgba(0,0,0,0.45)",
          overflowY: "auto",
          padding: "0.75rem 0",
        }}
      >
        {ROLE_GROUPS.map(({ role, label }) => {
          const members = server.members.filter((m) => m.role === role);
          if (!members.length) return null;

          return (
            <div key={role}>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  padding: "0.6rem 1rem 0.2rem",
                }}
              >
                {label} — {members.length}
              </p>

              {members.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  effectiveStatus={statusOverrides[member.user.id] ?? member.user.status}
                  isSelf={member.user.id === currentUserId}
                  canModerate={isModOrAdmin && member.user.id !== currentUserId}
                  onContextMenu={(e) => handleContextMenu(e, member)}
                  onClick={() => open("voiceParticipantProfile", { targetUserId: member.user.id, serverId: server.id })}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Context menu (portal-like, fixed position) */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 200 }}
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{
                position: "fixed",
                left: contextMenu.x,
                top: contextMenu.y,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.35rem",
                zIndex: 201,
                boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                minWidth: 180,
              }}
            >
              {/* Member name header */}
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  padding: "0.3rem 0.6rem 0.1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contextMenu.member.user.name ?? contextMenu.member.user.username ?? "Member"}
              </p>
              <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />

              {isAdmin && (
                <ContextMenuItem
                  icon={<ShieldIcon size={15} />}
                  label="Manage Roles"
                  onClick={() => {
                    setContextMenu(null);
                    open("serverSettings", { serverId: server.id });
                  }}
                />
              )}

              {isModOrAdmin && (
                <>
                  <ContextMenuItem
                    icon={<KickIcon size={15} />}
                    label="Kick Member"
                    danger
                    onClick={() => openKick(contextMenu.member)}
                  />
                  {isAdmin && (
                    <ContextMenuItem
                      icon={<BanIcon size={15} />}
                      label="Ban Member"
                      danger
                      onClick={() => openBan(contextMenu.member)}
                    />
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Member row

function MemberRow({
  member,
  effectiveStatus,
  isSelf,
  canModerate,
  onContextMenu,
  onClick,
}: {
  member: MemberWithUser;
  effectiveStatus: string | null | undefined;
  isSelf: boolean;
  canModerate: boolean;
  onContextMenu: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const displayName = member.user.name ?? member.user.username ?? "User";
  const statusColor = STATUS_COLOR[effectiveStatus ?? "OFFLINE"] ?? "var(--text-muted)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onContextMenu={canModerate ? onContextMenu : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.3rem 0.75rem",
        margin: "0.05rem 0.5rem",
        borderRadius: "6px",
        background: hovered ? "var(--surface-2)" : "transparent",
        transition: "background 0.1s",
        cursor: "pointer",
      }}
    >
      {/* Avatar + status dot */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {member.user.image ? (
            <Image
              src={member.user.image}
              alt={displayName}
              width={32}
              height={32}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <PersonIcon size={16} style={{ color: "var(--text-secondary)" }} />
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: statusColor,
            border: "2px solid var(--surface-1)",
          }}
        />
      </div>

      {/* Name */}
      <span
        style={{
          flex: 1,
          fontSize: "0.88rem",
          fontWeight: 500,
          color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.1s",
        }}
      >
        {displayName}
        {isSelf && (
          <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 400 }}>
            {" "}(you)
          </span>
        )}
      </span>

      {/* Right-click hint on hover (for moderatable members) */}
      {hovered && canModerate && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: "0.65rem", color: "var(--text-muted)", flexShrink: 0 }}
        >
          ···
        </motion.span>
      )}
    </div>
  );
}

// Context menu item

function ContextMenuItem({
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
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.45rem 0.6rem",
        borderRadius: "5px",
        color: danger ? "var(--danger)" : "var(--text-secondary)",
        fontSize: "0.88rem",
        fontWeight: 500,
        transition: "background 0.1s, color 0.1s",
        textAlign: "left",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.background = danger ? "var(--danger)" : "var(--accent)");
        (e.currentTarget.style.color = "#fff");
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
