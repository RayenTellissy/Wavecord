import { create } from "zustand";

export interface VoiceParticipant {
  identity: string;
  name: string;
  metadata?: string;
  isLive?: boolean;
}

export interface VoiceState {
  channelId: string | null;
  channelName: string | null;
  serverId: string | null;
  serverName: string | null;

  token: string | null;
  lkUrl: string | null;

  micEnabled: boolean;
  deafened: boolean;
  cameraEnabled: boolean;
  screenSharing: boolean;

  participants: VoiceParticipant[];
  /** Shown immediately when the user initiates a join, before LiveKit confirms connection. */
  optimisticParticipant: VoiceParticipant | null;

  lastTextChannelId: string | null;
  lastTextServerId: string | null;

  join: (
    channelId: string,
    channelName: string,
    serverId: string,
    serverName: string,
    token: string,
    lkUrl: string
  ) => void;
  leave: () => void;
  setParticipants: (participants: VoiceParticipant[]) => void;
  setOptimisticParticipant: (p: VoiceParticipant | null) => void;
  setLastTextChannel: (channelId: string, serverId: string) => void;
  toggleMic: () => void;
  toggleDeafen: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  channelId: null,
  channelName: null,
  serverId: null,
  serverName: null,
  token: null,
  lkUrl: null,
  micEnabled: true,
  deafened: false,
  cameraEnabled: false,
  screenSharing: false,
  participants: [],
  optimisticParticipant: null,
  lastTextChannelId: null,
  lastTextServerId: null,

  join: (channelId, channelName, serverId, serverName, token, lkUrl) =>
    set({
      channelId,
      channelName,
      serverId,
      serverName,
      token,
      lkUrl,
      micEnabled: true,
      deafened: false,
      cameraEnabled: false,
      screenSharing: false,
      participants: [],
    }),

  leave: () =>
    set({
      channelId: null,
      channelName: null,
      serverId: null,
      serverName: null,
      token: null,
      lkUrl: null,
      cameraEnabled: false,
      screenSharing: false,
      participants: [],
      optimisticParticipant: null,
    }),

  // Once real participants arrive from LiveKit, the optimistic entry is no longer needed.
  setParticipants: (participants) => set({ participants, optimisticParticipant: null }),

  setOptimisticParticipant: (optimisticParticipant) => set({ optimisticParticipant }),

  setLastTextChannel: (lastTextChannelId, lastTextServerId) => set({ lastTextChannelId, lastTextServerId }),

  toggleMic: () => set((s) => ({ micEnabled: !s.micEnabled })),
  toggleDeafen: () =>
    set((s) => ({
      deafened: !s.deafened,
      micEnabled: s.deafened ? s.micEnabled : false,
    })),
  toggleCamera: () => set((s) => ({ cameraEnabled: !s.cameraEnabled })),
  toggleScreenShare: () => set((s) => ({ screenSharing: !s.screenSharing })),
}));
