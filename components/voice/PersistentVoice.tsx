"use client";

import { useEffect, useRef } from "react";
import { Room, RoomEvent } from "livekit-client";
import { RoomContext, RoomAudioRenderer } from "@livekit/components-react";
import { useVoiceStore } from "@/stores/voiceStore";

/**
 * Keeps a single LiveKit Room alive across page navigations.
 * Connects when voiceStore has a token; disconnects when leave() clears it.
 * Wraps all children in RoomContext so voice-channel pages can use LK hooks.
 */
export function PersistentVoice({ children }: { children: React.ReactNode }) {
  const roomRef = useRef<Room>(new Room());
  const { token, lkUrl, channelId, leave } = useVoiceStore();

  // Connect / disconnect the persistent Room when credentials change
  useEffect(() => {
    const room = roomRef.current;
    if (token && lkUrl) {
      room.connect(lkUrl, token).catch(console.error);
    } else {
      room.disconnect().catch(() => {});
    }
  }, [token, lkUrl]);

  // If LiveKit drops the connection unexpectedly, clear the store
  useEffect(() => {
    const room = roomRef.current;
    const handleDisconnect = () => {
      if (useVoiceStore.getState().channelId) leave();
    };
    room.on(RoomEvent.Disconnected, handleDisconnect);
    return () => { room.off(RoomEvent.Disconnected, handleDisconnect); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RoomContext.Provider value={roomRef.current}>
      {/* Keep audio renderer mounted while in a channel so audio plays everywhere */}
      {channelId && <RoomAudioRenderer />}
      {children}
    </RoomContext.Provider>
  );
}
