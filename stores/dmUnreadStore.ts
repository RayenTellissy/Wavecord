import { create } from "zustand";

export interface DmUnreadEntry {
  conversationId: string;
  count: number;
  senderName: string;
  senderAvatar: string | null;
  href: string;
}

interface DmUnreadState {
  unread: Record<string, DmUnreadEntry>; // keyed by conversationId
  increment: (entry: Omit<DmUnreadEntry, "count">) => void;
  clear: (conversationId: string) => void;
  clearAll: () => void;
}

export const useDmUnreadStore = create<DmUnreadState>((set) => ({
  unread: {},

  increment: (entry) =>
    set((s) => ({
      unread: {
        ...s.unread,
        [entry.conversationId]: {
          ...entry,
          count: (s.unread[entry.conversationId]?.count ?? 0) + 1,
        },
      },
    })),

  clear: (conversationId) =>
    set((s) => {
      const next = { ...s.unread };
      delete next[conversationId];
      return { unread: next };
    }),

  clearAll: () => set({ unread: {} }),
}));
