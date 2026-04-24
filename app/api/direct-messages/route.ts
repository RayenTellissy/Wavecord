import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO, userRoom, SocketEvents } from "@/lib/socket";
import { checkRateLimit, tooManyRequests } from "@/lib/rateLimit";

const MESSAGE_BATCH = 50;

const AttachmentSchema = z.object({
  url: z.string().url(),
  fileType: z.string().max(100),
  fileName: z.string().max(255),
  fileSize: z.number().int().positive().optional(),
});

const SendDMSchema = z
  .object({
    content: z.string().max(4000).default(""),
    conversationId: z.string().uuid(),
    attachments: z.array(AttachmentSchema).max(10).optional(),
  })
  .refine(
    (d) =>
      d.content.trim().length > 0 ||
      (d.attachments && d.attachments.length > 0),
    { message: "Message must have content or an attachment" }
  );

// GET /api/direct-messages?conversationId=xxx&cursor=xxx
export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { memberOneId: true, memberTwoId: true },
    });

    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (conversation.memberOneId !== userId && conversation.memberTwoId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await db.directMessage.findMany({
      where: { conversationId },
      take: MESSAGE_BATCH,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      include: {
        sender: { select: { id: true, name: true, username: true, image: true } },
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: string | null = null;
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({ messages, nextCursor });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/direct-messages
export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    // 30 DMs per user per minute
    const rl = checkRateLimit(`dm:${userId}`, 30, 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const body = await req.json();
    const parsed = SendDMSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { content, conversationId, attachments } = parsed.data;

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { memberOneId: true, memberTwoId: true },
    });

    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (conversation.memberOneId !== userId && conversation.memberTwoId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await db.directMessage.create({
      data: {
        content: content || "",
        conversationId,
        senderId: userId,
        ...(attachments?.length
          ? {
              attachments: {
                create: attachments.map((a) => ({
                  url: a.url,
                  fileType: a.fileType,
                  fileName: a.fileName,
                  fileSize: a.fileSize ?? null,
                })),
              },
            }
          : {}),
      },
      include: {
        sender: { select: { id: true, name: true, username: true, image: true } },
        attachments: true,
      },
    });

    // Bump conversation updatedAt so sidebar sorts correctly
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    const io = getIO();
    if (io) {
      const rooms = [userRoom(conversation.memberOneId), userRoom(conversation.memberTwoId)];
      io.to(rooms[0]).to(rooms[1]).emit(SocketEvents.DM_MESSAGE_NEW, message);
      if (process.env.NODE_ENV === "development") {
        const socketsA = (await io.in(rooms[0]).fetchSockets()).length;
        const socketsB = (await io.in(rooms[1]).fetchSockets()).length;
        console.log(
          `[DM emit] to ${rooms[0]} (${socketsA} sockets), ${rooms[1]} (${socketsB} sockets)`
        );
      }
    } else if (process.env.NODE_ENV === "development") {
      console.warn("[DM emit] getIO() returned undefined — message not broadcast");
    }

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("[DM_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
