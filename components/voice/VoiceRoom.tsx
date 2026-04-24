"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track, type Participant } from "livekit-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useVoiceStore } from "@/stores/voiceStore";
import {
  MicIcon,
  MicOffIcon,
  HeadphonesIcon,
  HeadphonesOffIcon,
  CameraIcon,
  CameraOffIcon,
  ScreenShareIcon,
  LeaveIcon,
  PersonIcon,
  VolumeIcon,
} from "@/components/icons";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Channel } from "@prisma/client";

interface VoiceRoomProps {
  channel: Channel;
  serverId: string;
  serverName: string;
  currentUserId: string;
}

export function VoiceRoom({ channel, serverId, serverName }: VoiceRoomProps) {
  const [token, setToken] = useState<string | null>(null);
  const [lkUrl, setLkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { join, leave } = useVoiceStore();
  const router = useRouter();

  useEffect(() => {
    join(channel.id, channel.name, serverId, serverName);

    fetch(`/api/livekit/token?channelId=${channel.id}`)
      .then((r) => r.json())
      .then((data: { token?: string; serverUrl?: string; error?: string }) => {
        if (data.error) throw new Error(data.error);
        setToken(data.token!);
        setLkUrl(data.serverUrl!);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));

    return () => {
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id]);

  function handleLeave() {
    leave();
    router.push(`/servers/${serverId}/channels`);
  }

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          color: "var(--text-muted)",
          background: "var(--surface-1)",
        }}
      >
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ fontSize: "0.9rem" }}>
          Connecting to <strong style={{ color: "var(--text-primary)" }}>#{channel.name}</strong>…
        </p>
      </div>
    );
  }

  if (error || !token || !lkUrl) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          color: "var(--text-muted)",
          background: "var(--surface-1)",
        }}
      >
        <p>Failed to connect: {error ?? "LiveKit not configured"}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "6px",
            background: "var(--accent)",
            color: "#fff",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={lkUrl}
      connect
      audio
      video={false}
      onDisconnected={handleLeave}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <RoomAudioRenderer />
      <VoiceRoomInner channel={channel} onLeave={handleLeave} />
    </LiveKitRoom>
  );
}

// ─── Inner (has access to LiveKit context) ────────────────────────────────────

function VoiceRoomInner({
  channel,
  onLeave,
}: {
  channel: Channel;
  onLeave: () => void;
}) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const { micEnabled, deafened, cameraEnabled, screenSharing, toggleMic, toggleDeafen, toggleCamera, toggleScreenShare } =
    useVoiceStore();

  // Sync store → LiveKit track states
  useEffect(() => {
    if (!localParticipant) return;
    const enable = micEnabled && !deafened;
    localParticipant.setMicrophoneEnabled(enable);
  }, [micEnabled, deafened, localParticipant]);

  useEffect(() => {
    if (!localParticipant) return;
    localParticipant.setCameraEnabled(cameraEnabled);
  }, [cameraEnabled, localParticipant]);

  useEffect(() => {
    if (!localParticipant) return;
    localParticipant.setScreenShareEnabled(screenSharing);
  }, [screenSharing, localParticipant]);

  // All camera tracks for the video grid
  const cameraTrackRefs = useTracks([Track.Source.Camera]);
  const screenTrackRefs = useTracks([Track.Source.ScreenShare]);

  const hasVideo = cameraTrackRefs.length > 0 || screenTrackRefs.length > 0;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-1)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          height: 48,
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <VolumeIcon size={18} style={{ color: "var(--text-secondary)" }} />
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>{channel.name}</span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "var(--success)",
              background: "rgba(34,197,94,0.15)",
              padding: "0.1rem 0.45rem",
              borderRadius: "10px",
              letterSpacing: "0.3px",
            }}
          >
            LIVE
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {participants.length} connected
        </span>
      </div>

      {/* ── Participants / Video Grid ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {hasVideo ? (
          // Video grid: show all camera + screen share tracks
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[...cameraTrackRefs, ...screenTrackRefs].map((trackRef) => (
              <div
                key={`${trackRef.participant.identity}-${trackRef.source}`}
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "var(--surface-3)",
                  aspectRatio: "16/9",
                }}
              >
                <VideoTrack
                  trackRef={trackRef}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    left: "0.5rem",
                    background: "rgba(0,0,0,0.6)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {trackRef.participant.name ?? trackRef.participant.identity}
                  {trackRef.source === Track.Source.ScreenShare && " (screen)"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Audio-only: participant cards
          participants.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <VolumeIcon size={52} style={{ opacity: 0.25 }} />
              <p style={{ fontSize: "0.95rem" }}>Waiting for others to join…</p>
              <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                You&apos;re connected · share the invite link to bring friends in
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {participants.map((p) => (
                <ParticipantCard key={p.identity} participant={p} />
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Controls bar ── */}
      <VoiceControls
        micEnabled={micEnabled}
        deafened={deafened}
        cameraEnabled={cameraEnabled}
        screenSharing={screenSharing}
        onToggleMic={toggleMic}
        onToggleDeafen={toggleDeafen}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onLeave={onLeave}
      />
    </div>
  );
}

// ─── Participant card ─────────────────────────────────────────────────────────

function ParticipantCard({ participant }: { participant: Participant }) {
  const isMicOn = participant.isMicrophoneEnabled;
  const isSpeaking = participant.isSpeaking;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.9rem 0.5rem",
        borderRadius: "10px",
        background: "var(--surface-2)",
        border: `2px solid ${isSpeaking ? "var(--accent)" : "transparent"}`,
        transition: "border-color 0.15s",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "var(--surface-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
          overflow: "hidden",
          border: isSpeaking ? "2px solid var(--accent)" : "2px solid transparent",
          transition: "border-color 0.15s",
        }}
      >
        {participant.metadata ? (
          <Image
            src={participant.metadata}
            alt={participant.name ?? ""}
            width={52}
            height={52}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PersonIcon size={24} />
        )}
      </div>

      {/* Name */}
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {participant.name ?? participant.identity}
      </span>

      {/* Mic status */}
      <span style={{ color: isMicOn ? "var(--text-muted)" : "var(--danger)" }}>
        {isMicOn ? <MicIcon size={14} /> : <MicOffIcon size={14} />}
      </span>
    </motion.div>
  );
}

// ─── Controls bar ─────────────────────────────────────────────────────────────

interface VoiceControlsProps {
  micEnabled: boolean;
  deafened: boolean;
  cameraEnabled: boolean;
  screenSharing: boolean;
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
}

function VoiceControls({
  micEnabled,
  deafened,
  cameraEnabled,
  screenSharing,
  onToggleMic,
  onToggleDeafen,
  onToggleCamera,
  onToggleScreenShare,
  onLeave,
}: VoiceControlsProps) {
  const controls = [
    {
      icon: micEnabled ? <MicIcon size={18} /> : <MicOffIcon size={18} />,
      label: micEnabled ? "Mute" : "Unmute",
      active: !micEnabled,
      onClick: onToggleMic,
      danger: !micEnabled,
    },
    {
      icon: deafened ? <HeadphonesOffIcon size={18} /> : <HeadphonesIcon size={18} />,
      label: deafened ? "Undeafen" : "Deafen",
      active: deafened,
      onClick: onToggleDeafen,
      danger: deafened,
    },
    {
      icon: cameraEnabled ? <CameraIcon size={18} /> : <CameraOffIcon size={18} />,
      label: cameraEnabled ? "Stop Video" : "Start Video",
      active: cameraEnabled,
      onClick: onToggleCamera,
      danger: false,
    },
    {
      icon: <ScreenShareIcon size={18} />,
      label: screenSharing ? "Stop Share" : "Share Screen",
      active: screenSharing,
      onClick: onToggleScreenShare,
      danger: false,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "1rem",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
      }}
    >
      {controls.map(({ icon, label, active, onClick, danger }) => (
        <Tooltip key={label} content={label} side="top">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClick}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: active
                ? danger
                  ? "rgba(239,68,68,0.2)"
                  : "var(--accent-muted)"
                : "var(--surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active
                ? danger
                  ? "var(--danger)"
                  : "var(--accent)"
                : "var(--text-secondary)",
              border: `1px solid ${active ? (danger ? "var(--danger)" : "var(--accent)") : "var(--border)"}`,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {icon}
          </motion.button>
        </Tooltip>
      ))}

      {/* Leave */}
      <Tooltip content="Disconnect" side="top">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onLeave}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
            transition: "background 0.15s",
            marginLeft: "0.5rem",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.background = "var(--danger)");
            (e.currentTarget.style.color = "#fff");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.background = "rgba(239,68,68,0.2)");
            (e.currentTarget.style.color = "var(--danger)");
          }}
        >
          <LeaveIcon size={18} />
        </motion.button>
      </Tooltip>
    </div>
  );
}
