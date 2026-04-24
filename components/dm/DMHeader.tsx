"use client";

import Image from "next/image";
import { PersonIcon } from "@/components/icons";
import type { User } from "@prisma/client";

interface DMHeaderProps {
  recipient: Pick<User, "id" | "name" | "username" | "image">;
}

export function DMHeader({ recipient }: DMHeaderProps) {
  const displayName = recipient.name ?? recipient.username ?? "User";

  return (
    <div style={{
      height: 49,
      minHeight: 49,
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      padding: "0 1rem",
      borderBottom: "1px solid var(--border)",
      background: "var(--surface-1)",
      flexShrink: 0,
    }}>
      {/* Avatar */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        overflow: "hidden",
        background: "var(--surface-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>
        {recipient.image ? (
          <Image
            src={recipient.image}
            alt={displayName}
            width={32}
            height={32}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PersonIcon size={17} />
        )}
      </div>

      <div>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{displayName}</span>
        {recipient.username && (
          <span style={{
            marginLeft: "0.4rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}>
            @{recipient.username}
          </span>
        )}
      </div>
    </div>
  );
}
