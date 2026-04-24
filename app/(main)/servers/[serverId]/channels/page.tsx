import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function ServerDefaultPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { serverId } = await params;

  const firstTextChannel = await db.channel.findFirst({
    where: { serverId, type: "TEXT" },
    orderBy: { position: "asc" },
  });

  if (!firstTextChannel) notFound();

  redirect(`/servers/${serverId}/channels/${firstTextChannel.id}`);
}
