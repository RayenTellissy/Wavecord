import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { WaveLogo } from "@/components/ui/WaveLogo";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Redirect to the user's first server + first channel
  const membership = await db.serverMember.findFirst({
    where: { userId: session.user.id },
    include: {
      server: {
        include: {
          channels: { orderBy: { position: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (membership?.server?.channels[0]) {
    redirect(
      `/servers/${membership.server.id}/channels/${membership.server.channels[0].id}`
    );
  }

  // No servers yet — show welcome screen
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface-1)",
      color: "var(--text-secondary)",
      gap: "1rem",
    }}>
      <WaveLogo size={64} />
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
        Welcome to Wavecord
      </h1>
      <p style={{ fontSize: "0.95rem", maxWidth: 360, textAlign: "center", lineHeight: 1.6 }}>
        Create or join a server from the sidebar to get started chatting, voice calling, and more.
      </p>
    </div>
  );
}
