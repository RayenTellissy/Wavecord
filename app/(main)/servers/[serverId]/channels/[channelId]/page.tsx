import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ChatArea } from "@/components/chat/ChatArea";
import { VoiceRoom } from "@/components/voice/VoiceRoom";
import { MemberRole } from "@prisma/client";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { serverId, channelId } = await params;

  const [channel, member] = await Promise.all([
    db.channel.findFirst({
      where: { id: channelId, serverId },
    }),
    db.serverMember.findFirst({
      where: { serverId, userId: session.user.id },
    }),
  ]);

  if (!channel) notFound();
  if (!member) redirect("/");

  // Voice channel
  if (channel.type === "VOICE") {
    const server = await db.server.findUnique({
      where: { id: serverId },
      select: { name: true },
    });

    return (
      <VoiceRoom
        channel={channel}
        serverId={serverId}
        serverName={server?.name ?? "Server"}
        currentUserId={session.user.id}
      />
    );
  }

  // Text channel
  const isModOrAdmin =
    member.role === MemberRole.ADMIN || member.role === MemberRole.MODERATOR;

  return (
    <ChatArea
      channel={channel}
      currentUserId={session.user.id}
      isModOrAdmin={isModOrAdmin}
    />
  );
}
