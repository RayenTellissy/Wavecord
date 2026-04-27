import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publishToServer, PartyEvents } from "@/lib/party";

// Called by the PartyKit user party when a user's first connection opens
// (ONLINE) or last connection closes (OFFLINE). Writes the new status to the
// DB and fans out user:status to every server-party the user belongs to.
//
// Auth: shared secret with the user party.

export async function POST(req: Request) {
  const secret = process.env.PARTYKIT_SECRET;
  if (!secret || req.headers.get("x-partykit-secret") !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { userId?: string; status?: "ONLINE" | "OFFLINE" };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { userId, status } = body;
  if (!userId || (status !== "ONLINE" && status !== "OFFLINE")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 422 });
  }

  try {
    await db.user.update({ where: { id: userId }, data: { status } });
  } catch (err) {
    console.error("[presence] db update failed", err);
  }

  try {
    const memberships = await db.serverMember.findMany({
      where: { userId },
      select: { serverId: true },
    });
    await Promise.all(
      memberships.map((m) =>
        publishToServer(m.serverId, PartyEvents.USER_STATUS, { userId, status })
      )
    );
  } catch (err) {
    console.error("[presence] fan-out failed", err);
  }

  return NextResponse.json({ ok: true });
}
