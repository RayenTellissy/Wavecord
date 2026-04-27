import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DMChatArea } from "@/components/dm/DMChatArea";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      memberOne: { select: { id: true, name: true, username: true, image: true } },
      memberTwo: { select: { id: true, name: true, username: true, image: true } },
    },
  });

  if (!conversation) notFound();

  const { memberOneId, memberTwoId, memberOne, memberTwo } = conversation;

  if (memberOneId !== session.user.id && memberTwoId !== session.user.id) {
    redirect("/conversations");
  }

  const recipient = memberOneId === session.user.id ? memberTwo : memberOne;

  return (
    <DMChatArea
      conversationId={conversationId}
      recipient={recipient}
      currentUserId={session.user.id}
    />
  );
}
