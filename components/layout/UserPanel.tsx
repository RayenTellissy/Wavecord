"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { MicIcon, MicOffIcon, HeadphonesIcon, HeadphonesOffIcon, SettingsIcon, PersonIcon } from "@/components/icons";
import Image from "next/image";
import { useModal } from "@/stores/modalStore";
import { useVoiceStore } from "@/stores/voiceStore";

const STATUS_DOT: Record<string, { color: string; glow: string }> = {
  ONLINE:  { color: "#22c55e", glow: "0 0 8px rgba(34,197,94,0.8), 0 0 16px rgba(34,197,94,0.3)" },
  IDLE:    { color: "#f59e0b", glow: "0 0 8px rgba(245,158,11,0.7)" },
  DND:     { color: "#f43f5e", glow: "0 0 8px rgba(244,63,94,0.7)" },
  OFFLINE: { color: "#475569", glow: "none" },
};

export function UserPanel() {
  const { data: session } = useSession();
  const { open: openModal } = useModal();
  const { micEnabled, deafened, toggleMic, toggleDeafen } = useVoiceStore();
  const muted = !micEnabled;

  if (!session?.user) return null;
  const user = session.user;
  const dot = STATUS_DOT["ONLINE"];

  return (
    <div style={{
      padding: "0.55rem 0.5rem",
      background: "rgba(10,10,14,0.22)",
      backdropFilter: "blur(72px) saturate(2.8) brightness(1.05)",
      WebkitBackdropFilter: "blur(72px) saturate(2.8) brightness(1.05)",
      borderTop: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.40), inset 0 1.5px 0 rgba(255,255,255,0.18)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(109,40,217,0.4), rgba(139,92,246,0.2))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c4b5fd",
          border: "1.5px solid rgba(139,92,246,0.4)",
          boxShadow: "0 0 10px rgba(139,92,246,0.3)",
        }}>
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ""} width={34} height={34} style={{ objectFit: "cover" }} />
          ) : (
            <PersonIcon size={18} />
          )}
        </div>
        <div style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: dot.color,
          border: "2px solid rgba(7,5,18,0.9)",
          boxShadow: dot.glow,
        }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#f0eeff",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {user.name ?? user.username ?? "User"}
        </div>
        <div style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {user.username ? `@${user.username}` : user.email}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.1rem" }}>
        <Tooltip content={muted ? "Unmute" : "Mute"} side="top" adjustX={6} adjustY={-4}>
          <motion.button
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88 }}
            onClick={toggleMic}
            style={{
              width: 30, height: 30,
              borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: muted ? "#f43f5e" : "var(--text-secondary)",
              transition: "color 0.15s, background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = muted ? "rgba(244,63,94,0.18)" : "rgba(255,255,255,0.07)";
              if (muted) e.currentTarget.style.boxShadow = "0 0 12px rgba(244,63,94,0.4)";
            }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {muted ? <MicOffIcon size={16} /> : <MicIcon size={16} />}
          </motion.button>
        </Tooltip>

        <Tooltip content={deafened ? "Undeafen" : "Deafen"} side="top" adjustX={6} adjustY={-4}>
          <motion.button
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88 }}
            onClick={toggleDeafen}
            style={{
              width: 30, height: 30,
              borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: deafened ? "#f43f5e" : "var(--text-secondary)",
              transition: "color 0.15s, background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = deafened ? "rgba(244,63,94,0.18)" : "rgba(255,255,255,0.07)";
              if (deafened) e.currentTarget.style.boxShadow = "0 0 12px rgba(244,63,94,0.4)";
            }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {deafened ? <HeadphonesOffIcon size={16} /> : <HeadphonesIcon size={16} />}
          </motion.button>
        </Tooltip>

        <Tooltip content="Settings" side="top" adjustX={6} adjustY={-4}>
          <motion.button
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => openModal("editProfile")}
            style={{
              width: 30, height: 30,
              borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)",
              transition: "color 0.15s, background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#c4b5fd";
              e.currentTarget.style.background = "rgba(139,92,246,0.18)";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(139,92,246,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <SettingsIcon size={16} />
          </motion.button>
        </Tooltip>
      </div>
    </div>
  );
}
