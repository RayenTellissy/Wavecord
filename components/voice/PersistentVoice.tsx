"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Room, RoomEvent, Track, type RemoteTrackPublication, type RemoteParticipant, type LocalTrackPublication } from "livekit-client";
import { RoomContext, RoomAudioRenderer, useParticipants, useLocalParticipant, useTracks, isTrackReference, useRoomContext } from "@livekit/components-react";
import { useVoiceStore } from "@/stores/voiceStore";
import { useSocket } from "@/hooks/useSocket";
import { playUserJoinSound, playUserLeaveSound, playScreenShareSound, playScreenShareEndSound, playNotificationSound } from "@/lib/sounds";

/**
 * Keeps a single LiveKit Room alive across page navigations.
 * Connects when voiceStore has a token; disconnects when leave() clears it.
 * Wraps all children in RoomContext so voice-channel pages can use LK hooks.
 */
export function PersistentVoice({ children }: { children: React.ReactNode }) {
  const roomRef = useRef<Room>(new Room());
  const { token, lkUrl, channelId, leave } = useVoiceStore();

  useEffect(() => {
    const room = roomRef.current;
    if (token && lkUrl) {
      room.connect(lkUrl, token).catch(console.error);
    } else {
      room.disconnect().catch(() => {});
    }
  }, [token, lkUrl]);

  // Clear store if LiveKit drops the connection unexpectedly
  useEffect(() => {
    const room = roomRef.current;
    const handleDisconnect = () => {
      if (useVoiceStore.getState().channelId) leave();
    };
    room.on(RoomEvent.Disconnected, handleDisconnect);
    return () => { room.off(RoomEvent.Disconnected, handleDisconnect); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deafened = useVoiceStore((s) => s.deafened);

  return (
    <RoomContext.Provider value={roomRef.current}>
      {channelId && (
        <>
          {!deafened && <RoomAudioRenderer />}
          <ParticipantSync />
          <SoundSync />
        </>
      )}
      <VoicePresenceSync />
      {children}
    </RoomContext.Provider>
  );
}

/**
 * Broadcasts the current user's voice presence (join/leave/mute/deafen/live)
 * to the Socket.io server, so every member of the server can see who's in
 * which voice channel — without having to be connected themselves.
 */
function VoicePresenceSync() {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const channelId = useVoiceStore((s) => s.channelId);
  const serverId = useVoiceStore((s) => s.serverId);
  const micEnabled = useVoiceStore((s) => s.micEnabled);
  const deafened = useVoiceStore((s) => s.deafened);
  const screenShareLive = useVoiceStore((s) => s.screenShareLive);
  const cameraLive = useVoiceStore((s) => s.cameraLive);

  const user = session?.user;
  const userId = user?.id;
  const name = user?.name ?? user?.username ?? "User";
  const image = user?.image ?? null;

  // Join / leave — re-emit on (re)connect so presence survives socket resets.
  useEffect(() => {
    if (!socket || !userId || !channelId || !serverId) return;
    const join = () => socket.emit("voice:join", {
      channelId, serverId, userId, name, image,
      isMuted: !useVoiceStore.getState().micEnabled || useVoiceStore.getState().deafened,
      isDeafened: useVoiceStore.getState().deafened,
    });
    join();
    socket.on("connect", join);
    return () => {
      socket.off("connect", join);
      socket.emit("voice:leave");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, channelId, serverId, userId]);

  // State updates (mute / deafen / live)
  useEffect(() => {
    if (!socket || !channelId) return;
    socket.emit("voice:state", {
      isMuted: !micEnabled || deafened,
      isDeafened: deafened,
      isLive: screenShareLive || cameraLive,
    });
  }, [socket, channelId, micEnabled, deafened, screenShareLive, cameraLive]);

  return null;
}

/**
 * Plays sounds for voice/screen share events.
 * Local track events fire after the OS picker is confirmed and the track is
 * actually publishing — not on button click — so timing is correct.
 */
function SoundSync() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const connectedAt = useRef<number>(0);
  const setScreenShareLive = useVoiceStore((s) => s.setScreenShareLive);
  const setCameraLive = useVoiceStore((s) => s.setCameraLive);

  useEffect(() => {
    connectedAt.current = Date.now();

    const onParticipantConnected = () => playUserJoinSound();
    const onParticipantDisconnected = () => playUserLeaveSound();

    // Remote participants starting screen share or camera
    const onTrackPublished = (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (participant.identity === localParticipant?.identity) return;
      if (Date.now() - connectedAt.current < 1000) return;
      if (publication.source === Track.Source.ScreenShare || publication.source === Track.Source.Camera) {
        playScreenShareSound();
      }
    };

    // Local participant: fires after the OS picker is confirmed and track is live.
    // Also drives the LIVE badge via the store flags read by VoicePresenceSync.
    const onLocalTrackPublished = (publication: LocalTrackPublication) => {
      if (publication.source === Track.Source.ScreenShare) {
        setScreenShareLive(true);
        playScreenShareSound();
      } else if (publication.source === Track.Source.Camera) {
        setCameraLive(true);
        playScreenShareSound();
      }
    };

    const onLocalTrackUnpublished = (publication: LocalTrackPublication) => {
      if (publication.source === Track.Source.ScreenShare) {
        setScreenShareLive(false);
        playScreenShareEndSound();
      } else if (publication.source === Track.Source.Camera) {
        setCameraLive(false);
        playScreenShareEndSound();
      }
    };

    room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    room.on(RoomEvent.TrackPublished, onTrackPublished);
    room.on(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
    room.on(RoomEvent.LocalTrackUnpublished, onLocalTrackUnpublished);

    return () => {
      room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
      room.off(RoomEvent.TrackPublished, onTrackPublished);
      room.off(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
      room.off(RoomEvent.LocalTrackUnpublished, onLocalTrackUnpublished);
    };
  }, [room, localParticipant, setScreenShareLive, setCameraLive]);

  return null;
}

/** Syncs LiveKit participant list into voiceStore so the sidebar can display it. */
function ParticipantSync() {
  const room = useRoomContext();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const cameraTracks = useTracks([Track.Source.Camera]);
  const screenTracks = useTracks([Track.Source.ScreenShare]);
  const setParticipants = useVoiceStore((s) => s.setParticipants);
  const deafened = useVoiceStore((s) => s.deafened);
  const micEnabled = useVoiceStore((s) => s.micEnabled);
  const [attrTick, setAttrTick] = useState(0);

  // Apply mic state to LiveKit regardless of which page the user is on.
  useEffect(() => {
    if (!localParticipant) return;
    localParticipant.setMicrophoneEnabled(micEnabled && !deafened).catch(() => {});
  }, [micEnabled, deafened, localParticipant]);

  // Publish local deafen state so remote peers can render the headphones-off icon.
  useEffect(() => {
    if (!localParticipant) return;
    localParticipant.setAttributes({ deafened: deafened ? "1" : "0" }).catch(() => {});
  }, [deafened, localParticipant]);

  // Re-render when any participant's attributes change (deafened broadcast).
  useEffect(() => {
    const bump = () => setAttrTick((t) => t + 1);
    room.on(RoomEvent.ParticipantAttributesChanged, bump);
    return () => { room.off(RoomEvent.ParticipantAttributesChanged, bump); };
  }, [room]);

  useEffect(() => {
    const liveIdentities = new Set([
      ...cameraTracks
        .filter((t) => isTrackReference(t) && !t.publication.isMuted)
        .map((t) => t.participant.identity),
      ...screenTracks
        .filter((t) => isTrackReference(t) && !t.publication.isMuted)
        .map((t) => t.participant.identity),
    ]);

    setParticipants(
      participants.map((p) => {
        const isLocal = p.identity === localParticipant?.identity;
        const isDeafened = isLocal ? deafened : p.attributes?.deafened === "1";
        return {
          identity: p.identity,
          name: p.name ?? p.identity,
          metadata: p.metadata,
          isLive: liveIdentities.has(p.identity),
          // Deafened users can't hear, so show them as muted too.
          isMuted: isDeafened || (isLocal ? !micEnabled : !p.isMicrophoneEnabled),
          isDeafened,
        };
      })
    );
    return () => setParticipants([]);
  }, [participants, localParticipant, cameraTracks, screenTracks, setParticipants, deafened, micEnabled, attrTick]);

  return null;
}
