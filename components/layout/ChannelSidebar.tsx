"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  HashIcon, VolumeIcon, ChevronDownIcon, ChevronRightIcon,
  PlusIcon, LeaveIcon, LinkIcon, SettingsIcon,
} from "@/components/icons";
import { UserPanel } from "./UserPanel";
import { VoiceHUD } from "@/components/voice/VoiceHUD";
import { useModal } from "@/stores/modalStore";
import { useSidebar } from "@/stores/sidebarStore";
import type { Server, Channel, Category, ServerMember, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
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
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
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
  const activeChannelId = params?.channelId as string | undefined;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [serverMenuOpen, setServerMenuOpen] = useState(false);

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

  return (
    <div
      className={`sidebar-channel${mobileOpen ? " mobile-open" : ""}`}
      style={{
        width: 240,
        minWidth: 240,
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Server Header */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setServerMenuOpen(!serverMenuOpen)}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border)",
            background: serverMenuOpen ? "var(--surface-2)" : "transparent",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { if (!serverMenuOpen) (e.currentTarget.style.background = "var(--surface-2)"); }}
          onMouseLeave={(e) => { if (!serverMenuOpen) (e.currentTarget.style.background = "transparent"); }}
        >
          {server.imageUrl && (
            <Image
              src={server.imageUrl}
              alt={server.name}
              width={20}
              height={20}
              style={{ borderRadius: "4px" }}
            />
          )}
          <span style={{
            flex: 1,
            fontWeight: 700,
            fontSize: "0.95rem",
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {server.name}
          </span>
          <ChevronDownIcon size={16} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        </button>

        {/* Server dropdown menu */}
        <AnimatePresence>
          {serverMenuOpen && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 50 }}
                onClick={() => setServerMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: "0.5rem",
                  right: "0.5rem",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.35rem",
                  zIndex: 51,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
                onClick={() => setServerMenuOpen(false)}
              >
                <MenuItem
                  icon={<LinkIcon size={16} />}
                  label="Invite People"
                  onClick={() => open("invite", { serverId: server.id })}
                />
                {isModOrAdmin && (
                  <MenuItem
                    icon={<PlusIcon size={16} />}
                    label="Create Channel"
                    onClick={() => open("createChannel", { serverId: server.id })}
                  />
                )}
                {isAdmin && (
                  <MenuItem
                    icon={<SettingsIcon size={16} />}
                    label="Server Settings"
                    onClick={() => open("serverSettings", { serverId: server.id })}
                  />
                )}
                <div style={{ height: 1, background: "var(--border)", margin: "0.35rem 0" }} />
                <MenuItem
                  icon={<LeaveIcon size={16} />}
                  label={isAdmin ? "Delete Server" : "Leave Server"}
                  danger
                  onClick={isAdmin
                    ? () => open("deleteServer", { serverId: server.id })
                    : handleLeave
                  }
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Channel List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
        {/* Uncategorized channels */}
        {server.categories.map((category) => (
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
                <Tooltip content="Create Channel" side="right">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      open("createChannel", { serverId: server.id });
                    }}
                    style={{
                      display: "flex",
                      padding: "2px",
                      borderRadius: "4px",
                      opacity: 0,
                    }}
                    className="category-plus"
                  >
                    <PlusIcon size={14} />
                  </span>
                </Tooltip>
              )}
            </button>

            <style>{`.category-plus:hover { opacity: 1 !important; } .category-header:hover .category-plus { opacity: 0.7; }`}</style>

            {/* Channels */}
            <AnimatePresence initial={false}>
              {!collapsed[category.id] && (
                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  {category.channels.map((channel) => (
                    <motion.div key={channel.id} variants={itemVariant}>
                      <ChannelItem
                        channel={channel}
                        serverId={server.id}
                        isActive={channel.id === activeChannelId}
                        onNavigate={closeMobile}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Voice HUD — shown when connected to a voice channel */}
      <VoiceHUD />

      {/* User Panel */}
      <UserPanel />
    </div>
  );
}

function ChannelItem({
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
  const href = `/servers/${serverId}/channels/${channel.id}`;

  return (
    <Link href={href} onClick={onNavigate}>
      <motion.div
        whileHover={{ x: 2 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.3rem 0.5rem 0.3rem 0.75rem",
          margin: "0.05rem 0.5rem",
          borderRadius: "6px",
          background: isActive ? "var(--surface-2)" : "transparent",
          color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
          fontSize: "0.9rem",
          fontWeight: isActive ? 600 : 400,
          transition: "background 0.12s, color 0.12s",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget.style.background = "var(--surface-2)");
            (e.currentTarget.style.color = "var(--text-primary)");
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget.style.background = "transparent");
            (e.currentTarget.style.color = "var(--text-secondary)");
          }
        }}
      >
        <span style={{ display: "flex", color: isActive ? "var(--accent)" : "inherit", flexShrink: 0 }}>
          {channel.type === "TEXT" ? <HashIcon size={17} /> : <VolumeIcon size={17} />}
        </span>
        <span style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {channel.name}
        </span>
      </motion.div>
    </Link>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
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
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.6rem",
        borderRadius: "4px",
        color: danger ? "var(--danger)" : "var(--text-secondary)",
        fontSize: "0.88rem",
        fontWeight: 500,
        transition: "background 0.12s, color 0.12s",
        textAlign: "left",
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
