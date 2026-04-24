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
        background: "var(--bg)",
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
              background: isDMActive ? "var(--accent)" : "var(--surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isDMActive ? "#fff" : "var(--text-secondary)",
              transition: "border-radius 0.2s, background 0.2s",
              boxShadow: isDMActive ? "0 0 12px rgba(59,130,246,0.4)" : "none",
            }}
          >
            <FriendsIcon size={22} />
          </motion.div>
        </Link>
      </Tooltip>

      {/* Separator */}
      <div style={{ width: 32, height: 2, background: "var(--border)", borderRadius: 1, margin: "0.25rem 0" }} />

      {/* Server Icons */}
      {servers.map((server) => {
        const isActive = activeServerId === server.id;
        return (
          <Tooltip key={server.id} content={server.name} side="right">
            <Link href={`/servers/${server.id}/channels/${server.channels[0]?.id ?? ""}`}>
              <motion.div
                whileHover={{ scale: 1.1, borderRadius: "16px" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: isActive ? "16px" : "50%",
                  overflow: "hidden",
                  background: server.imageUrl ? "transparent" : "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  transition: "border-radius 0.2s, background 0.2s",
                  boxShadow: isActive ? "0 0 12px rgba(59,130,246,0.35)" : "none",
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
            </Link>
          </Tooltip>
        );
      })}

      {/* Separator */}
      <div style={{ width: 32, height: 2, background: "var(--border)", borderRadius: 1, margin: "0.25rem 0" }} />

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
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--success)",
            transition: "border-radius 0.2s, background 0.2s",
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
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            transition: "border-radius 0.2s, background 0.2s",
            fontSize: "1.1rem",
            fontWeight: 700,
          }}
        >
          #
        </motion.button>
      </Tooltip>
    </nav>
  );
}
