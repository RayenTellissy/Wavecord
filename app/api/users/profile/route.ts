import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-z0-9_]+$/, "Username may only contain lowercase letters, numbers, and underscores")
    .optional(),
  bio: z.string().max(500).nullable().optional(),
  image: z.string().url().nullable().optional(),
  status: z.enum(["ONLINE", "IDLE", "DND", "OFFLINE"]).optional(),
});

export async function GET() {
  const userId = await requireUserId();

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      status: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const userId = await requireUserId();

  const body = await req.json();
  const parsed = UpdateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.username) {
    const existing = await db.user.findUnique({ where: { username: data.username } });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  const user = await db.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      status: true,
    },
  });

  return NextResponse.json(user);
}
