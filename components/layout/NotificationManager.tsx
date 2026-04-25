"use client";

import { useNotifications } from "@/hooks/useNotifications";

export function NotificationManager() {
  useNotifications();
  return null;
}
