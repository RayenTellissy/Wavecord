"use client";

import { useSidebar } from "@/stores/sidebarStore";

export function MobileOverlay() {
  const { mobileOpen, closeMobile } = useSidebar();
  return (
    <div
      className={`mobile-overlay${mobileOpen ? " active" : ""}`}
      onClick={closeMobile}
      aria-hidden="true"
    />
  );
}
