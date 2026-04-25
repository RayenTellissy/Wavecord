"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

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
 * Subscribes to server-wide voice-channel occupancy broadcasts for a given server.
 * Returns a map of channelId → sessions visible to every member of the server,
 * regardless of whether they are connected to the LiveKit room.
 */
export function useVoiceSessions(serverId: string | undefined): Record<string, VoiceSession[]> {
  const { socket } = useSocket();
  const [sessions, setSessions] = useState<Record<string, VoiceSession[]>>({});

  useEffect(() => {
    if (!socket || !serverId) return;

    const joinRoom = () => socket.emit("join-server", serverId);
    joinRoom();
    socket.on("connect", joinRoom);

    const onUpdate = (u: ChannelUpdate) => {
      if (u.serverId !== serverId) return;
      setSessions((prev) => {
        if (u.sessions.length === 0) {
          if (!prev[u.channelId]) return prev;
          const next = { ...prev };
          delete next[u.channelId];
          return next;
        }
        return { ...prev, [u.channelId]: u.sessions };
      });
    };

    const onSnapshot = (updates: ChannelUpdate[]) => {
      setSessions((prev) => {
        const next = { ...prev };
        for (const u of updates) {
          if (u.serverId !== serverId) continue;
          next[u.channelId] = u.sessions;
        }
        return next;
      });
    };

    socket.on("voice:state:update", onUpdate);
    socket.on("voice:state:snapshot", onSnapshot);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("voice:state:update", onUpdate);
      socket.off("voice:state:snapshot", onSnapshot);
      socket.emit("leave-server", serverId);
    };
  }, [socket, serverId]);

  return sessions;
}
