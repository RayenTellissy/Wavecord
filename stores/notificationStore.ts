import { create } from "zustand";

export interface NotificationToast {
  id: string;
  type: "channel" | "dm";
  title: string;
  body: string;
  avatarUrl: string | null;
  href: string;
}

interface NotificationState {
  toasts: NotificationToast[];
  push: (toast: Omit<NotificationToast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((s) => ({
      toasts: [...s.toasts.slice(-4), { ...toast, id: crypto.randomUUID() }],
    })),
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
