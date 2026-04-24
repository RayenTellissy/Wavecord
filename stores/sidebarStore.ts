import { create } from "zustand";

interface SidebarState {
  mobileOpen: boolean;
  channelSidebarOpen: boolean;
  memberListOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  toggleMemberList: () => void;
  setChannelSidebarOpen: (open: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  mobileOpen: false,
  channelSidebarOpen: true,
  memberListOpen: true,
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
  toggleMemberList: () => set((s) => ({ memberListOpen: !s.memberListOpen })),
  setChannelSidebarOpen: (open) => set({ channelSidebarOpen: open }),
}));
