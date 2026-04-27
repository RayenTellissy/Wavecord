"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParty, type PartyMessage } from "./useParty";
import { PartyEvents } from "@/party/types";

export interface VoiceSession {
  userId: string;
  name: string;
  image: string | null;
  serverId: string;
  channelId: string;
  isMuted: boolean;
  isDeafened: boolean;
  isLive: boolean;
}

type ChannelUpdate = { channelId: string; serverId: string; sessions: VoiceSession[] };

/**
 * Subscribes to the server party for voice-channel occupancy broadcasts.
 * Returns a map of channelId → sessions for the given server.
 */
export function useVoiceSessions(serverId: string | undefined): Record<string, VoiceSession[]> {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Record<string, VoiceSession[]>>({});

  const onMessage = useCallback((msg: PartyMessage) => {
    if (msg.event === PartyEvents.VOICE_STATE_UPDATE) {
      const u = msg.payload as ChannelUpdate;
      if (!serverId || u.serverId !== serverId) return;
      setSessions((prev) => {
        if (u.sessions.length === 0) {
          if (!prev[u.channelId]) return prev;
          const next = { ...prev };
          delete next[u.channelId];
          return next;
        }
        return { ...prev, [u.channelId]: u.sessions };
      });
    } else if (msg.event === PartyEvents.VOICE_STATE_SNAPSHOT) {
      const updates = msg.payload as ChannelUpdate[];
      setSessions((prev) => {
        const next = { ...prev };
        for (const u of updates) {
          if (!serverId || u.serverId !== serverId) continue;
          next[u.channelId] = u.sessions;
        }
        return next;
      });
    }
  }, [serverId]);

  const socketRef = useParty({
    party: "main",
    room: serverId,
    userId: session?.user?.id,
    onMessage,
  });

  // On mount / serverId change, clear stale state and ask the server for a
  // fresh snapshot. The server-party's onConnect snapshot only fires for the
  // first subscriber on a given socket; later subscribers (e.g. when the user
  // navigates back to the server while PersistentVoice is still holding the
  // socket open) need to request explicitly.
  useEffect(() => {
    if (!serverId) return;
    setSessions({});

    const send = () => {
      const s = socketRef.current as unknown as
        | { send: (data: string) => void; readyState: number }
        | null;
      if (!s) return;
      try {
        s.send(JSON.stringify({ event: "voice:snapshot:request", payload: null }));
      } catch {}
    };

    const s = socketRef.current as unknown as
      | { addEventListener: (e: string, h: () => void) => void;
          removeEventListener: (e: string, h: () => void) => void;
          readyState: number; }
      | null;
    if (!s) return;
    if (s.readyState === 1) {
      send();
    } else {
      s.addEventListener("open", send);
    }
    return () => {
      s.removeEventListener?.("open", send);
    };
  }, [serverId, socketRef]);

  return sessions;
}
