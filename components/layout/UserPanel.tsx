"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { MicIcon, MicOffIcon, HeadphonesIcon, HeadphonesOffIcon, SettingsIcon, PersonIcon } from "@/components/icons";
import Image from "next/image";
import { useModal } from "@/stores/modalStore";
import { useVoiceStore } from "@/stores/voiceStore";

const STATUS_COLORS: Record<string, string> = {
  ONLINE: "var(--online)",
  IDLE: "var(--idle)",
  DND: "var(--dnd)",
  OFFLINE: "var(--offline)",
};

export function UserPanel() {
  const { data: session } = useSession();
  const { open: openModal } = useModal();
  const { micEnabled, deafened, toggleMic, toggleDeafen } = useVoiceStore();
  const muted = !micEnabled;

  if (!session?.user) return null;
  const user = session.user;

  return (
    <div style={{
      padding: "0.6rem 0.5rem",
      background: "var(--bg)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }}>
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          overflow: "hidden",
          background: "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
        }}>
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ""} width={34} height={34} style={{ objectFit: "cover" }} />
          ) : (
            <PersonIcon size={18} />
          )}
        </div>
        {/* Status dot */}
        <div style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: STATUS_COLORS["ONLINE"],
          border: "2px solid var(--bg)",
        }} />
      </div>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {user.name ?? user.username ?? "User"}
        </div>
        <div style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {user.username ? `@${user.username}` : user.email}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.1rem" }}>
        <Tooltip content={muted ? "Unmute" : "Mute"} side="top" adjustX={6} adjustY={-4}>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMic}
            style={{
              width: 30,
              height: 30,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: muted ? "var(--danger)" : "var(--text-secondary)",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.background = "var(--surface-2)"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.background = "none"); }}
          >
            {muted ? <MicOffIcon size={17} /> : <MicIcon size={17} />}
          </motion.button>
        </Tooltip>

        <Tooltip content={deafened ? "Undeafen" : "Deafen"} side="top" adjustX={6} adjustY={-4}>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDeafen}
            style={{
              width: 30,
              height: 30,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: deafened ? "var(--danger)" : "var(--text-secondary)",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.background = "var(--surface-2)"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.background = "none"); }}
          >
            {deafened ? <HeadphonesOffIcon size={17} /> : <HeadphonesIcon size={17} />}
          </motion.button>
        </Tooltip>

        <Tooltip content="User Settings" side="top" adjustX={6} adjustY={-4}>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openModal("editProfile")}
            style={{
              width: 30,
              height: 30,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--text-primary)"); (e.currentTarget.style.background = "var(--surface-2)"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-secondary)"); (e.currentTarget.style.background = "none"); }}
          >
            <SettingsIcon size={17} />
          </motion.button>
        </Tooltip>

      </div>
    </div>
  );
}
