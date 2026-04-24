import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "joinServer"
  | "invite"
  | "createChannel"
  | "editServer"
  | "deleteServer"
  | "leaveServer"
  | "kickMember"
  | "banMember"
  | "editChannel"
  | "deleteChannel"
  | "deleteMessage"
  | "editProfile"
  | "serverSettings";

interface ModalData {
  serverId?: string;
  channelId?: string;
  memberId?: string;
  messageId?: string;
  inviteCode?: string;
  channelType?: "TEXT" | "VOICE";
  memberName?: string;   // display name for kick/ban modals
  targetUserId?: string; // User.id for ban operations
}

interface ModalState {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  open: (type: ModalType, data?: ModalData) => void;
  close: () => void;
}

export const useModal = create<ModalState>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  open: (type, data = {}) => set({ type, data, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
