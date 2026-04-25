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
        background: "var(--bg-2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0.75rem 0",
        gap: "0.5rem",
        overflowY: "auto",
        overflowX: "visible",
        zIndex: 10,
      }}
    >
      {/* Home / DMs */}
      <Tooltip content="Direct Messages" side="right">
        <Link href="/conversations">
          <motion.div
            whileHover={{ scale: 1.1, borderRadius: "16px" }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: isDMActive ? "16px" : "50%",
              background: isDMActive
                ? "var(--accent)"
                : "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isDMActive ? "#fff" : "var(--text-secondary)",
              transition: "border-radius 0.2s, background 0.2s, box-shadow 0.2s",
              boxShadow: isDMActive ? "var(--accent-glow)" : "none",
              backdropFilter: "blur(8px)",
              border: isDMActive
                ? "1px solid rgba(139,92,246,0.4)"
                : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <FriendsIcon size={22} />
          </motion.div>
        </Link>
      </Tooltip>

      {/* Separator */}
      <div style={{
        width: 32, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        margin: "0.25rem 0",
      }} />

      {/* Server Icons */}
      {servers.map((server) => {
        const isActive = activeServerId === server.id;
        return (
          <Tooltip key={server.id} content={server.name} side="right">
            <Link href={`/servers/${server.id}/channels/${server.channels[0]?.id ?? ""}`}>
              {/* Active glow ring wrapper */}
              <div style={{
                position: "relative",
                padding: 2,
                borderRadius: isActive ? "20px" : "50%",
                transition: "border-radius 0.2s",
                background: isActive
                  ? "linear-gradient(135deg, var(--accent), var(--cyan))"
                  : "transparent",
                boxShadow: isActive ? "var(--accent-glow)" : "none",
              }}>
                <motion.div
                  whileHover={{ scale: 1.08, borderRadius: "16px" }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: isActive ? "16px" : "50%",
                    overflow: "hidden",
                    background: server.imageUrl
                      ? "transparent"
                      : "linear-gradient(135deg, var(--accent-dim), var(--accent))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    transition: "border-radius 0.2s",
                    position: "relative",
                    flexShrink: 0,
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
        width: 32, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        margin: "0.25rem 0",
      }} />

      {/* Create Server */}
      <Tooltip content="Create Server" side="right">
        <motion.button
          whileHover={{ scale: 1.1, borderRadius: "16px" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => open("createServer")}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--success)",
            transition: "border-radius 0.2s, background 0.2s, box-shadow 0.2s",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.boxShadow = "0 0 10px rgba(34,197,94,0.35)");
            (e.currentTarget.style.background = "rgba(34,197,94,0.18)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.boxShadow = "none");
            (e.currentTarget.style.background = "rgba(34,197,94,0.1)");
          }}
        >
          <PlusIcon size={22} />
        </motion.button>
      </Tooltip>

      {/* Join Server */}
      <Tooltip content="Join Server" side="right">
        <motion.button
          whileHover={{ scale: 1.1, borderRadius: "16px" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => open("joinServer")}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-bright)",
            transition: "border-radius 0.2s, background 0.2s, box-shadow 0.2s",
            fontSize: "1.1rem",
            fontWeight: 700,
            border: "1px solid rgba(139,92,246,0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.boxShadow = "var(--accent-glow-sm)");
            (e.currentTarget.style.background = "rgba(139,92,246,0.18)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.boxShadow = "none");
            (e.currentTarget.style.background = "rgba(139,92,246,0.1)");
          }}
        >
          #
        </motion.button>
      </Tooltip>
    </nav>
  );
}
