import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO, channelRoom, SocketEvents } from "@/lib/socket";
import { checkRateLimit, tooManyRequests } from "@/lib/rateLimit";

const MESSAGE_BATCH = 50;

const AttachmentSchema = z.object({
  url: z.string().url(),
  fileType: z.string().max(100),
  fileName: z.string().max(255),
  fileSize: z.number().int().positive().optional(),
});

const SendMessageSchema = z
  .object({
    content: z.string().max(4000).default(""),
    channelId: z.string().uuid(),
    fileUrl: z.string().url().optional(),
    replyToId: z.string().uuid().optional(),
    attachments: z.array(AttachmentSchema).max(10).optional(),
  })
  .refine(
    (d) =>
      d.content.trim().length > 0 ||
      !!d.fileUrl ||
      (d.attachments && d.attachments.length > 0),
    { message: "Message must have content or an attachment" }
  );

// GET /api/messages?channelId=xxx&cursor=xxx
export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const cursor = searchParams.get("cursor");

    if (!channelId) {
      return NextResponse.json({ error: "channelId required" }, { status: 400 });
    }

    // Verify membership via channel → server
    const channel = await db.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true },
    });

    if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember = await db.serverMember.findFirst({
      where: { serverId: channel.serverId, userId },
    });
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const messages = await db.message.findMany({
      where: { channelId },
      take: MESSAGE_BATCH,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        reactions: {
          include: { user: { select: { id: true, name: true } } },
        },
        replyTo: {
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
        },
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

// POST /api/messages
export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    // 30 messages per user per minute
    const rl = checkRateLimit(`msg:${userId}`, 30, 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const body = await req.json();
    const parsed = SendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { content, channelId, fileUrl, replyToId, attachments } = parsed.data;

    const channel = await db.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true },
    });
    if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember = await db.serverMember.findFirst({
      where: { serverId: channel.serverId, userId },
    });
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const message = await db.message.create({
      data: {
        content: content || "",
        channelId,
        authorId: userId,
        fileUrl: fileUrl ?? null,
        replyToId: replyToId ?? null,
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
        author: { select: { id: true, name: true, username: true, image: true } },
        reactions: true,
        replyTo: {
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
        },
        attachments: true,
      },
    });

    // Emit to all clients in this channel room
    getIO()?.to(channelRoom(channelId)).emit(SocketEvents.CHANNEL_MESSAGE_NEW, message);

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("[MESSAGE_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
