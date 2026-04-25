"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { PlusIcon, FriendsIcon } from "@/components/icons";
import { useModal } from "@/stores/modalStore";
import { useSidebar } from "@/stores/sidebarStore";
import { useServers, type ServerWithChannel } from "@/hooks/useServers";
import Image from "next/image";

interface MainSidebarProps {
  initialServers: ServerWithChannel[];
}

export function MainSidebar({ initialServers }: MainSidebarProps) {
  const { data: servers = [] } = useServers(initialServers);
  const params = useParams();
  const pathname = usePathname();
  const { open } = useModal();
  const { mobileOpen } = useSidebar();
  const activeServerId = params?.serverId as string | undefined;
  const isDMActive = pathname.startsWith("/conversations");

  return (
    <nav
      className={`sidebar-main${mobileOpen ? " mobile-open" : ""}`}
      style={{
        width: 72,
        minWidth: 72,
        background: "rgba(12,12,16,0.28)",
        backdropFilter: "blur(80px) saturate(3) brightness(1.06)",
        WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.06)",
        borderRight: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0.75rem 0",
        gap: "0.5rem",
        overflowY: "auto",
        overflowX: "visible",
        zIndex: 10,
        boxShadow: "inset -1px 0 0 rgba(139,92,246,0.12), inset 0 2px 0 rgba(255,255,255,0.14), inset 1px 0 0 rgba(255,255,255,0.06), 4px 0 40px rgba(0,0,0,0.45)",
      }}
    >
      {/* Home / DMs */}
      <Tooltip content="Direct Messages" side="right">
        <Link href="/conversations">
          <motion.div
            whileHover={{ scale: 1.12, borderRadius: "18px" }}
            whileTap={{ scale: 0.93 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: isDMActive ? "18px" : "50%",
              background: isDMActive
                ? "linear-gradient(135deg, #7c3aed, #8b5cf6)"
                : "rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isDMActive ? "#fff" : "var(--text-secondary)",
              transition: "border-radius 0.25s, background 0.25s, box-shadow 0.25s",
              boxShadow: isDMActive ? "var(--accent-glow)" : "none",
              border: isDMActive
                ? "1px solid rgba(167,139,250,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <FriendsIcon size={22} />
          </motion.div>
        </Link>
      </Tooltip>

      {/* Separator */}
      <div style={{
        width: 36, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)",
        margin: "0.25rem 0",
      }} />

      {/* Server Icons */}
      {servers.map((server) => {
        const isActive = activeServerId === server.id;
        return (
          <Tooltip key={server.id} content={server.name} side="right">
            <Link href={`/servers/${server.id}/channels/${server.channels[0]?.id ?? ""}`}>
              <div style={{
                position: "relative",
                padding: isActive ? 2 : 0,
                borderRadius: isActive ? "22px" : "50%",
                transition: "border-radius 0.25s, box-shadow 0.25s",
                background: isActive
                  ? "linear-gradient(135deg, #a78bfa, #22d3ee)"
                  : "transparent",
                boxShadow: isActive ? "var(--accent-glow)" : "none",
              }}>
                <motion.div
                  whileHover={{ scale: 1.1, borderRadius: "18px" }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: isActive ? 44 : 48,
                    height: isActive ? 44 : 48,
                    borderRadius: isActive ? "18px" : "50%",
                    overflow: "hidden",
                    background: server.imageUrl
                      ? "transparent"
                      : "linear-gradient(135deg, #5b21b6, #7c3aed, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    letterSpacing: "-0.5px",
                    transition: "border-radius 0.25s, width 0.25s, height 0.25s",
                    position: "relative",
                    flexShrink: 0,
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {server.imageUrl ? (
                    <Image
                      src={server.imageUrl}
                      alt={server.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    server.name.slice(0, 2).toUpperCase()
                  )}
                </motion.div>
              </div>
            </Link>
          </Tooltip>
        );
      })}

      {/* Separator */}
      <div style={{
        width: 36, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)",
        margin: "0.25rem 0",
      }} />

      {/* Create Server */}
      <Tooltip content="Create Server" side="right">
        <motion.button
          whileHover={{ scale: 1.12, borderRadius: "18px" }}
          whileTap={{ scale: 0.93 }}
          onClick={() => open("createServer")}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.12)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#22c55e",
            transition: "border-radius 0.25s, background 0.25s, box-shadow 0.25s",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 16px rgba(34,197,94,0.45), 0 0 40px rgba(34,197,94,0.15)";
            e.currentTarget.style.background = "rgba(34,197,94,0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "rgba(34,197,94,0.12)";
          }}
        >
          <PlusIcon size={22} />
        </motion.button>
      </Tooltip>

      {/* Join Server */}
      <Tooltip content="Join Server" side="right">
        <motion.button
          whileHover={{ scale: 1.12, borderRadius: "18px" }}
          whileTap={{ scale: 0.93 }}
          onClick={() => open("joinServer")}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.12)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-bright)",
            transition: "border-radius 0.25s, background 0.25s, box-shadow 0.25s",
            fontSize: "1.15rem",
            fontWeight: 800,
            border: "1px solid rgba(139,92,246,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--accent-glow-sm)";
            e.currentTarget.style.background = "rgba(139,92,246,0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "rgba(139,92,246,0.12)";
          }}
        >
          #
        </motion.button>
      </Tooltip>
    </nav>
  );
}
