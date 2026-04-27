import { PrismaClient, MemberRole, ChannelType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await db.message.deleteMany();
  await db.channel.deleteMany();
  await db.category.deleteMany();
  await db.serverMember.deleteMany();
  await db.server.deleteMany();
  await db.user.deleteMany();

  const password = await bcrypt.hash("password123", 12);

  const alice = await db.user.create({
    data: {
      name: "Alice",
      username: "alice",
      email: "alice@wavecord.dev",
      password,
      image: null,
    },
  });

  const bob = await db.user.create({
    data: {
      name: "Bob",
      username: "bob",
      email: "bob@wavecord.dev",
      password,
      image: null,
    },
  });

  const carol = await db.user.create({
    data: {
      name: "Carol",
      username: "carol",
      email: "carol@wavecord.dev",
      password,
      image: null,
    },
  });

  const server = await db.server.create({
    data: {
      name: "Wavecord HQ",
      inviteCode: nanoid(10),
      ownerId: alice.id,
    },
  });

  // Members
  await db.serverMember.createMany({
    data: [
      { userId: alice.id, serverId: server.id, role: MemberRole.ADMIN },
      { userId: bob.id, serverId: server.id, role: MemberRole.MODERATOR },
      { userId: carol.id, serverId: server.id, role: MemberRole.GUEST },
    ],
  });

  // Categories
  const textCategory = await db.category.create({
    data: { name: "TEXT CHANNELS", serverId: server.id, position: 0 },
  });

  const voiceCategory = await db.category.create({
    data: { name: "VOICE CHANNELS", serverId: server.id, position: 1 },
  });

  // Channels
  const general = await db.channel.create({
    data: {
      name: "general",
      type: ChannelType.TEXT,
      serverId: server.id,
      categoryId: textCategory.id,
      position: 0,
    },
  });

  await db.channel.create({
    data: {
      name: "introductions",
      type: ChannelType.TEXT,
      serverId: server.id,
      categoryId: textCategory.id,
      position: 1,
    },
  });

  await db.channel.create({
    data: {
      name: "General",
      type: ChannelType.VOICE,
      serverId: server.id,
      categoryId: voiceCategory.id,
      position: 0,
    },
  });

  // Messages
  await db.message.createMany({
    data: [
      {
        content: "Welcome to Wavecord HQ! 👋",
        authorId: alice.id,
        channelId: general.id,
      },
      {
        content: "Hey everyone, glad to be here!",
        authorId: bob.id,
        channelId: general.id,
      },
      {
        content: "This is built with Next.js and Prisma 🚀",
        authorId: carol.id,
        channelId: general.id,
      },
    ],
  });

  console.log("✅ Seed complete");
  console.log("   alice@wavecord.dev / password123");
  console.log("   bob@wavecord.dev   / password123");
  console.log("   carol@wavecord.dev / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
