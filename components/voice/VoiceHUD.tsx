"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useVoiceStore } from "@/stores/voiceStore";
import {
  CameraIcon,
  CameraOffIcon,
  ScreenShareIcon,
  LeaveIcon,
  VolumeIcon,
} from "@/components/icons";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Compact bar at the bottom of ChannelSidebar while in a voice channel.
 * Shows channel name + mic / camera / screen-share / disconnect controls.
 */
export function VoiceHUD() {
  const {
    channelId,
    channelName,
    serverId,
    serverName,
    cameraEnabled,
    screenSharing,
    toggleCamera,
    toggleScreenShare,
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
            position: "fixed",
            bottom: 54,
            left: 72,
            width: 240,
            zIndex: 200,
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
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
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}
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

            <Tooltip content="Disconnect" side="top" adjustX={6} adjustY={-4}>
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

          {/* Controls row: camera / screen share */}
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <HudButton
              tooltip={cameraEnabled ? "Stop Video" : "Start Video"}
              active={cameraEnabled}
              onClick={toggleCamera}
            >
              {cameraEnabled ? <CameraIcon size={13} /> : <CameraOffIcon size={13} />}
            </HudButton>

            <HudButton
              tooltip={screenSharing ? "Stop Share" : "Share Screen"}
              active={screenSharing}
              onClick={toggleScreenShare}
            >
              <ScreenShareIcon size={13} />
            </HudButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HudButton({
  tooltip,
  active,
  onClick,
  children,
}: {
  tooltip: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      title={tooltip}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        flex: 1,
        height: 28,
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "rgba(99,102,241,0.15)" : "var(--surface-2)",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        border: `1px solid ${active ? "rgba(99,102,241,0.4)" : "var(--border)"}`,
        transition: "background 0.12s, color 0.12s",
      }}
    >
      {children}
    </motion.button>
  );
}
