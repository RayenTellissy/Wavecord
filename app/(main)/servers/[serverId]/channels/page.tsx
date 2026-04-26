import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function ServerDefaultPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { serverId } = await params;

  const firstTextChannel = await db.channel.findFirst({
    where: { serverId, type: "TEXT" },
    orderBy: { position: "asc" },
  });

  if (!firstTextChannel) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        color: "var(--text-muted)",
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)" }}>No channels yet</p>
        <p style={{ fontSize: "0.85rem" }}>Use the server menu to create a category and channel.</p>
      </div>
    );
  }

  redirect(`/servers/${serverId}/channels/${firstTextChannel.id}`);
}
