"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useParticipants,
  useLocalParticipant,
  useSpeakingParticipants,
  useTracks,
  VideoTrack,
  isTrackReference,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
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
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { join, leave, channelId: activeChannelId, token, lastTextChannelId, lastTextServerId } = useVoiceStore();
  const router = useRouter();

  const alreadyConnected = activeChannelId === channel.id && !!token;

  useEffect(() => {
    if (alreadyConnected) return;

    setConnecting(true);
    setError(null);

    fetch(`/api/livekit/token?channelId=${channel.id}`)
      .then((r) => r.json())
      .then((data: { token?: string; serverUrl?: string; error?: string }) => {
        if (data.error) throw new Error(data.error);
        join(channel.id, channel.name, serverId, serverName, data.token!, data.serverUrl!);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setConnecting(false));

    // Intentionally no cleanup — navigating away keeps the voice connection alive.
    // The user must click Disconnect to leave the channel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id]);

  function handleLeave() {
    import("@/lib/sounds").then(({ playLeaveSound }) => playLeaveSound());
    leave();
    if (lastTextChannelId && lastTextServerId) {
      router.push(`/servers/${lastTextServerId}/channels/${lastTextChannelId}`);
    } else {
      router.push(`/servers/${serverId}/channels`);
    }
  }

  // Render the room immediately — participants populate once LiveKit connects.
  // A subtle header indicator communicates the connecting state.
  return <VoiceRoomInner channel={channel} onLeave={handleLeave} connecting={connecting} error={error} />;
}

// ─── Inner UI (uses LiveKit context from PersistentVoice) ─────────────────────

function VoiceRoomInner({
  channel,
  onLeave,
  connecting,
  error,
}: {
  channel: Channel;
  onLeave: () => void;
  connecting?: boolean;
  error?: string | null;
}) {
  const participants = useParticipants();
  const speakingParticipants = useSpeakingParticipants();
  const speakingSet = new Set(speakingParticipants.map((p) => p.identity));
  const { localParticipant } = useLocalParticipant();
  const { micEnabled, deafened, cameraEnabled, screenSharing, toggleMic, toggleDeafen, toggleCamera, toggleScreenShare, setSpeakingIdentities } =
    useVoiceStore();

  useEffect(() => {
    setSpeakingIdentities(new Set(speakingParticipants.map((p) => p.identity)));
  }, [speakingParticipants, setSpeakingIdentities]);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Camera and screen share must be triggered directly from the click handler —
  // not via useEffect — so the browser's transient user activation is still active
  // when getUserMedia / getDisplayMedia is called.
  function handleToggleCamera() {
    const next = !cameraEnabled;
    toggleCamera();
    setMediaError(null);
    localParticipant?.setCameraEnabled(next)?.catch((err: Error) => {
      console.error("Camera toggle failed:", err);
      if (next) toggleCamera();
      if (err.name === "NotAllowedError") {
        setMediaError("Camera access denied. Go to System Settings → Privacy & Security → Camera and allow your browser.");
      } else {
        setMediaError("Could not start camera: " + err.message);
      }
    });
  }

  function handleToggleScreenShare() {
    const next = !screenSharing;
    toggleScreenShare();
    setMediaError(null);
    localParticipant?.setScreenShareEnabled(next)?.catch((err: Error) => {
      console.error("Screen share failed:", err);
      if (next) toggleScreenShare();
      if (err.name === "NotAllowedError") {
        setMediaError("Screen share permission denied.");
      } else {
        setMediaError("Could not start screen share: " + err.message);
      }
    });
  }

  const cameraTrackRefs = useTracks([Track.Source.Camera]).filter(
    (t) => isTrackReference(t) && !t.publication.isMuted
  );
  const screenTrackRefs = useTracks([Track.Source.ScreenShare]);
  const hasVideo = cameraTrackRefs.length > 0 || screenTrackRefs.length > 0;

  const [focusedTrack, setFocusedTrack] = useState<TrackReference | null>(null);
  const closeFocused = useCallback(() => setFocusedTrack(null), []);

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
          {error ? (
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--danger, #ef4444)",
                background: "rgba(239,68,68,0.15)",
                padding: "0.1rem 0.45rem",
                borderRadius: "10px",
                letterSpacing: "0.3px",
              }}
            >
              FAILED
            </span>
          ) : connecting ? (
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                background: "var(--surface-3)",
                padding: "0.1rem 0.45rem",
                borderRadius: "10px",
                letterSpacing: "0.3px",
              }}
            >
              CONNECTING…
            </span>
          ) : (
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
          )}
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {participants.length} connected
        </span>
      </div>

      {/* ── Participants / Video Grid ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {hasVideo ? (
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
                onClick={() => isTrackReference(trackRef) && setFocusedTrack(trackRef)}
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "var(--surface-3)",
                  aspectRatio: "16/9",
                  cursor: "pointer",
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
                {/* expand hint on hover */}
                <ExpandHint />
              </div>
            ))}
          </div>
        ) : participants.length === 0 ? (
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
            {error ? (
              <>
                <p style={{ fontSize: "0.95rem" }}>Failed to connect: {error}</p>
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
              </>
            ) : connecting ? (
              <p style={{ fontSize: "0.95rem" }}>Connecting to #{channel.name}…</p>
            ) : (
              <>
                <p style={{ fontSize: "0.95rem" }}>Waiting for others to join…</p>
                <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  You&apos;re connected · share the invite link to bring friends in
                </p>
              </>
            )}
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
              <ParticipantCard key={p.identity} participant={p} isSpeaking={speakingSet.has(p.identity)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Media permission error banner ── */}
      {mediaError && (
        <div
          style={{
            padding: "0.6rem 1rem",
            background: "rgba(239,68,68,0.12)",
            borderTop: "1px solid rgba(239,68,68,0.3)",
            color: "var(--danger, #ef4444)",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <span>{mediaError}</span>
          <button
            onClick={() => setMediaError(null)}
            style={{ background: "none", color: "inherit", fontWeight: 700, fontSize: "1rem", lineHeight: 1, padding: "0 0.25rem" }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Controls bar ── */}
      <VoiceControls
        micEnabled={micEnabled}
        deafened={deafened}
        cameraEnabled={cameraEnabled}
        screenSharing={screenSharing}
        onToggleMic={toggleMic}
        onToggleDeafen={toggleDeafen}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onLeave={onLeave}
      />

      <FullscreenOverlay trackRef={focusedTrack} onClose={closeFocused} />
    </div>
  );
}

// ─── Participant card ─────────────────────────────────────────────────────────

function ParticipantCard({ participant, isSpeaking }: { participant: Participant; isSpeaking: boolean }) {
  const isMicOn = participant.isMicrophoneEnabled;

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
        border: "2px solid transparent",
      }}
    >
      {/* Speaking ring wraps the avatar */}
      <div
        style={{
          padding: 3,
          borderRadius: "50%",
          border: `3px solid ${isSpeaking ? "var(--success)" : "transparent"}`,
          boxShadow: isSpeaking ? "0 0 8px var(--success)" : "none",
          transition: "border-color 0.1s, box-shadow 0.1s",
        }}
      >
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
      </div>
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

// ─── Expand-on-hover hint overlay ────────────────────────────────────────────

function ExpandHint() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0)",
        transition: "background 0.15s",
        pointerEvents: "none",
      }}
    >
      <svg
        width="32" height="32" viewBox="0 0 24 24" fill="none"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}
      >
        <path d="M3 3h6M3 3v6M21 3h-6M21 3v6M3 21h6M3 21v-6M21 21h-6M21 21v-6"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Fullscreen overlay ───────────────────────────────────────────────────────

function FullscreenOverlay({
  trackRef,
  onClose,
}: {
  trackRef: TrackReference | null;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    if (!trackRef) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trackRef, onClose]);

  return (
    <AnimatePresence>
      {trackRef && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {/* Video fills available space, click-through blocked so video events don't bubble */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(92vw, 160vh)",
              aspectRatio: "16/9",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
          >
            <VideoTrack
              trackRef={trackRef}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            {/* Name badge */}
            <div
              style={{
                position: "absolute",
                bottom: "0.75rem",
                left: "0.75rem",
                background: "rgba(0,0,0,0.65)",
                padding: "0.2rem 0.6rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {trackRef.participant.name ?? trackRef.participant.identity}
              {trackRef.source === Track.Source.ScreenShare && " (screen)"}
            </div>
          </div>

          {/* Dismiss hint */}
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
            Click anywhere or press Esc to close
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
