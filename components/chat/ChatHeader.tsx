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
      borderBottom: "1px solid var(--border)",
      background: "var(--surface-1)",
      zIndex: 5,
    }}>
      {/* Hamburger — only shown on mobile via CSS */}
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
          (e.currentTarget.style.background = "var(--surface-2)");
          (e.currentTarget.style.color = "var(--text-primary)");
        }}
        onMouseLeave={(e) => {
          (e.currentTarget.style.background = "transparent");
          (e.currentTarget.style.color = "var(--text-secondary)");
        }}
      >
        <HamburgerIcon />
      </button>

      <span style={{ color: "var(--text-secondary)", display: "flex" }}>
        {channel.type === "TEXT" ? <HashIcon size={20} /> : <VolumeIcon size={20} />}
      </span>
      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{channel.name}</span>

      <div style={{ flex: 1 }} />

      {/* Search placeholder */}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.3rem 0.6rem",
          borderRadius: "6px",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: "0.82rem",
          minWidth: 140,
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
