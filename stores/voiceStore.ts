import { create } from "zustand";

export interface VoiceState {
  /** ID of the voice channel currently connected to (null = not in voice) */
  channelId: string | null;
  channelName: string | null;
  serverId: string | null;
  serverName: string | null;

  micEnabled: boolean;
  deafened: boolean;
  cameraEnabled: boolean;
  screenSharing: boolean;

  join: (
    channelId: string,
    channelName: string,
    serverId: string,
    serverName: string
  ) => void;
  leave: () => void;
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
  micEnabled: true,
  deafened: false,
  cameraEnabled: false,
  screenSharing: false,

  join: (channelId, channelName, serverId, serverName) =>
    set({
      channelId,
      channelName,
      serverId,
      serverName,
      micEnabled: true,
      deafened: false,
      cameraEnabled: false,
      screenSharing: false,
    }),

  leave: () =>
    set({
      channelId: null,
      channelName: null,
      serverId: null,
      serverName: null,
      cameraEnabled: false,
      screenSharing: false,
    }),

  toggleMic: () => set((s) => ({ micEnabled: !s.micEnabled })),
  toggleDeafen: () =>
    set((s) => ({
      deafened: !s.deafened,
      // Deafening also mutes mic
      micEnabled: s.deafened ? s.micEnabled : false,
    })),
  toggleCamera: () => set((s) => ({ cameraEnabled: !s.cameraEnabled })),
  toggleScreenShare: () => set((s) => ({ screenSharing: !s.screenSharing })),
}));
