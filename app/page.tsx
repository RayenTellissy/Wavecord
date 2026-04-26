import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function RootPage() {
  const session = await auth();

  if (session?.user) {
    const membership = await db.serverMember.findFirst({
      where: { userId: session.user.id },
      include: {
        server: {
          include: {
            channels: { orderBy: { position: "asc" }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (membership?.server?.channels[0]) {
      redirect(
        `/servers/${membership.server.id}/channels/${membership.server.channels[0].id}`
      );
    }

    redirect("/conversations");
  }

  return <LandingPage />;
}
