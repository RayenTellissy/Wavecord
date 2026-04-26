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
  | "channelSettings"
  | "createCategory"
  | "editCategory"
  | "deleteCategory"
  | "deleteMessage"
  | "editProfile"
  | "serverSettings"
  | "voiceParticipantProfile";

interface ModalData {
  serverId?: string;
  channelId?: string;
  channelName?: string;
  categoryId?: string;
  categoryName?: string;
  memberId?: string;
  messageId?: string;
  inviteCode?: string;
  channelType?: "TEXT" | "VOICE";
  allowedRole?: "ADMIN" | "MODERATOR" | "GUEST";
  memberName?: string;
  targetUserId?: string;
  isDM?: boolean;
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
