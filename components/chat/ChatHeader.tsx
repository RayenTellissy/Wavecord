"use client";

import { HashIcon, VolumeIcon, SearchIcon } from "@/components/icons";
import { useSidebar } from "@/stores/sidebarStore";
import type { Channel } from "@prisma/client";

interface ChatHeaderProps {
  channel: Channel;
}

export function ChatHeader({ channel }: ChatHeaderProps) {
  const { toggleMobile } = useSidebar();

  return (
    <div style={{
      height: 48,
      minHeight: 48,
      padding: "0 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(10,10,14,0.20)",
      backdropFilter: "blur(72px) saturate(2.8) brightness(1.06)",
      WebkitBackdropFilter: "blur(72px) saturate(2.8) brightness(1.06)",
      boxShadow: "0 1px 0 rgba(139,92,246,0.18), 0 4px 24px rgba(0,0,0,0.28), inset 0 1.5px 0 rgba(255,255,255,0.16)",
      zIndex: 5,
    }}>
      <button
        className="hamburger-btn"
        onClick={toggleMobile}
        aria-label="Toggle sidebar"
        style={{
          display: "none", /* overridden to flex on mobile */
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "6px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget.style.background = "rgba(255,255,255,0.06)");
          (e.currentTarget.style.color = "var(--text-primary)");
        }}
        onMouseLeave={(e) => {
          (e.currentTarget.style.background = "transparent");
          (e.currentTarget.style.color = "var(--text-secondary)");
        }}
      >
        <HamburgerIcon />
      </button>

      <span style={{ color: "var(--accent-bright)", display: "flex" }}>
        {channel.type === "TEXT" ? <HashIcon size={20} /> : <VolumeIcon size={20} />}
      </span>
      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{channel.name}</span>

      <div style={{ flex: 1 }} />

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.3rem 0.6rem",
          borderRadius: "6px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-muted)",
          fontSize: "0.82rem",
          minWidth: 140,
          backdropFilter: "blur(8px)",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        <SearchIcon size={14} />
        Search
      </button>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="3.5" width="16" height="1.8" rx="0.9" fill="currentColor" />
      <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
      <rect x="1" y="12.7" width="16" height="1.8" rx="0.9" fill="currentColor" />
    </svg>
  );
}
