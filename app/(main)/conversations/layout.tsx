import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DMSidebar } from "@/components/dm/DMSidebar";
import type { Conversation, User } from "@prisma/client";

type ConversationWithMembers = Conversation & {
  memberOne: Pick<User, "id" | "name" | "username" | "image">;
  memberTwo: Pick<User, "id" | "name" | "username" | "image">;
  directMessages: { content: string; createdAt: Date; deleted: boolean; senderId: string }[];
};

function getConversations(userId: string) {
  return unstable_cache(
    () =>
      db.conversation.findMany({
        where: { OR: [{ memberOneId: userId }, { memberTwoId: userId }] },
        include: {
          memberOne: { select: { id: true, name: true, username: true, image: true } },
          memberTwo: { select: { id: true, name: true, username: true, image: true } },
          directMessages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, deleted: true, senderId: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
    [`conversations:${userId}`],
    { revalidate: 30, tags: [`conversations:${userId}`] }
  )();
}

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const conversations = (await getConversations(session.user.id)) as ConversationWithMembers[];

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <DMSidebar
        currentUserId={session.user.id}
        initialConversations={conversations}
      />
      {children}
    </div>
  );
}
