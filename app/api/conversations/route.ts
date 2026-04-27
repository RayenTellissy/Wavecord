import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

const CreateConversationSchema = z.object({
  targetUserId: z.string().uuid(),
});

// GET /api/conversations — list all conversations for current user
export async function GET() {
  try {
    const userId = await requireUserId();

    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ memberOneId: userId }, { memberTwoId: userId }],
      },
      include: {
        memberOne: {
          select: { id: true, name: true, username: true, image: true },
        },
        memberTwo: {
          select: { id: true, name: true, username: true, image: true },
        },
        directMessages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true, deleted: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/conversations — create or fetch existing conversation with targetUserId
export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const parsed = CreateConversationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { targetUserId } = parsed.data;

    if (targetUserId === userId) {
      return NextResponse.json({ error: "Cannot DM yourself" }, { status: 400 });
    }

    const target = await db.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Enforce consistent ordering: memberOneId < memberTwoId (lexicographic)
    const [memberOneId, memberTwoId] =
      userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];

    const conversation = await db.conversation.upsert({
      where: { memberOneId_memberTwoId: { memberOneId, memberTwoId } },
      create: { memberOneId, memberTwoId },
      update: {},
      include: {
        memberOne: {
          select: { id: true, name: true, username: true, image: true },
        },
        memberTwo: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    revalidateTag(`conversations:${userId}`);
    revalidateTag(`conversations:${targetUserId}`);

    return NextResponse.json(conversation, { status: 201 });
  } catch (err) {
    console.error("[CONVERSATION_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
