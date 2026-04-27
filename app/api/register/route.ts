import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { checkRateLimit, getIP, tooManyRequests } from "@/lib/rateLimit";

const RegisterSchema = z.object({
  name: z.string().min(2).max(32),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(`register:${getIP(req)}`, 5, 60 * 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { name, username, email, password } = parsed.data;

    const [existingEmail, existingUsername] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.user.findUnique({ where: { username } }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { error: { email: ["Email already in use"] } },
        { status: 409 }
      );
    }
    if (existingUsername) {
      return NextResponse.json(
        { error: { username: ["Username already taken"] } },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, username, email, password: hashed },
      select: { id: true, email: true, username: true, name: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
