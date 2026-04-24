import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { CreateServerModal } from "@/components/server/CreateServerModal";
import { JoinServerModal } from "@/components/server/JoinServerModal";
import { InviteModal } from "@/components/server/InviteModal";
import { CreateChannelModal } from "@/components/channel/CreateChannelModal";
import { KickMemberModal } from "@/components/server/KickMemberModal";
import { BanMemberModal } from "@/components/server/BanMemberModal";
import { DeleteServerModal } from "@/components/server/DeleteServerModal";
import { ServerSettingsModal } from "@/components/server/ServerSettingsModal";
import { UserSettingsModal } from "@/components/settings/UserSettingsModal";
import { MobileOverlay } from "@/components/layout/MobileOverlay";
import { PersistentVoice } from "@/components/voice/PersistentVoice";
import { VoiceHUD } from "@/components/voice/VoiceHUD";
import { VoiceParticipantModal } from "@/components/voice/VoiceParticipantModal";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch all servers the user belongs to (same shape as GET /api/servers)
  const memberships = await db.serverMember.findMany({
    where: { userId: session.user.id },
    include: {
      server: {
        include: {
          channels: { orderBy: { position: "asc" }, take: 1 },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const servers = memberships.map((m) => m.server);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
    }}>
      <MainSidebar initialServers={servers} />
      <PersistentVoice>
        {children}
        <VoiceHUD />
      </PersistentVoice>

      {/* Global modals */}
      <CreateServerModal />
      <JoinServerModal />
      <InviteModal />
      <CreateChannelModal />
      <KickMemberModal />
      <BanMemberModal />
      <DeleteServerModal />
      <ServerSettingsModal />
      <UserSettingsModal />
      <VoiceParticipantModal />
      <MobileOverlay />
    </div>
  );
}
