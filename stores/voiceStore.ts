import { create } from "zustand";

export interface VoiceParticipant {
  identity: string;
  name: string;
  metadata?: string;
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
    }),

  setParticipants: (participants) => set({ participants }),

  toggleMic: () => set((s) => ({ micEnabled: !s.micEnabled })),
  toggleDeafen: () =>
    set((s) => ({
      deafened: !s.deafened,
      micEnabled: s.deafened ? s.micEnabled : false,
    })),
  toggleCamera: () => set((s) => ({ cameraEnabled: !s.cameraEnabled })),
  toggleScreenShare: () => set((s) => ({ screenSharing: !s.screenSharing })),
}));
