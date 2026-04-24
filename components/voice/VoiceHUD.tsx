"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useVoiceStore } from "@/stores/voiceStore";
import { MicIcon, MicOffIcon, HeadphonesIcon, HeadphonesOffIcon, LeaveIcon, VolumeIcon } from "@/components/icons";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Shown at the bottom of the ChannelSidebar when the user is in a voice channel.
 * Gives quick mic/deafen/disconnect controls without leaving the current page.
 */
export function VoiceHUD() {
  const {
    channelId,
    channelName,
    serverId,
    serverName,
    micEnabled,
    deafened,
    toggleMic,
    toggleDeafen,
    leave,
  } = useVoiceStore();

  return (
    <AnimatePresence>
      {channelId && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg)",
            padding: "0.5rem 0.6rem 0.45rem",
          }}
        >
          {/* Channel info row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              marginBottom: "0.4rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--success)",
                flexShrink: 0,
                boxShadow: "0 0 6px var(--success)",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link
                href={`/servers/${serverId}/channels/${channelId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  textDecoration: "none",
                }}
              >
                <VolumeIcon size={13} style={{ color: "var(--success)", flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--success)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {channelName}
                </span>
              </Link>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: "0.05rem",
                }}
              >
                {serverName}
              </p>
            </div>

            {/* Disconnect */}
            <Tooltip content="Disconnect" side="top">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={leave}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--danger)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { (e.currentTarget.style.background = "rgba(239,68,68,0.2)"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.background = "transparent"); }}
              >
                <LeaveIcon size={14} />
              </motion.button>
            </Tooltip>
          </div>

          {/* Quick controls row */}
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <Tooltip content={micEnabled ? "Mute" : "Unmute"} side="top">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMic}
                style={{
                  flex: 1,
                  height: 28,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: !micEnabled ? "rgba(239,68,68,0.15)" : "var(--surface-2)",
                  color: !micEnabled ? "var(--danger)" : "var(--text-secondary)",
                  border: `1px solid ${!micEnabled ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
                  gap: "0.3rem",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  transition: "background 0.12s, color 0.12s",
                }}
              >
                {micEnabled ? <MicIcon size={13} /> : <MicOffIcon size={13} />}
                {micEnabled ? "Muted off" : "Muted"}
              </motion.button>
            </Tooltip>

            <Tooltip content={deafened ? "Undeafen" : "Deafen"} side="top">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDeafen}
                style={{
                  flex: 1,
                  height: 28,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: deafened ? "rgba(239,68,68,0.15)" : "var(--surface-2)",
                  color: deafened ? "var(--danger)" : "var(--text-secondary)",
                  border: `1px solid ${deafened ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
                  gap: "0.3rem",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  transition: "background 0.12s, color 0.12s",
                }}
              >
                {deafened ? <HeadphonesOffIcon size={13} /> : <HeadphonesIcon size={13} />}
                {deafened ? "Deafened" : "Deafen"}
              </motion.button>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
