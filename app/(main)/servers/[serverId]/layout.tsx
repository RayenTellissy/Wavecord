import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ChannelSidebar } from "@/components/layout/ChannelSidebar";
import { MemberList } from "@/components/layout/MemberList";

export default async function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { serverId } = await params;

  const server = await db.server.findFirst({
    where: {
      id: serverId,
      members: { some: { userId: session.user.id } },
    },
    include: {
      categories: {
        orderBy: { position: "asc" },
        include: {
          channels: { orderBy: { position: "asc" } },
        },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true, status: true },
          },
        },
        orderBy: { role: "asc" },
      },
    },
  });

  if (!server) notFound();

  const currentMember = server.members.find((m) => m.user.id === session.user.id);
  if (!currentMember) redirect("/");

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <ChannelSidebar
        server={server as Parameters<typeof ChannelSidebar>[0]["server"]}
        currentUserId={session.user.id}
        currentMemberRole={currentMember.role}
      />
      {children}
      <MemberList
        server={server as Parameters<typeof MemberList>[0]["server"]}
        currentUserId={session.user.id}
        currentMemberRole={currentMember.role}
      />
    </div>
  );
}
