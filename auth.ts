import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

const CredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const user = await db.user.findUnique({ where: { username } });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // Auto-generate a unique username from the user's name or email
      const base =
        user.name?.toLowerCase().replace(/\s+/g, "") ??
        user.email?.split("@")[0] ??
        "user";

      let username = base;
      let attempt = 0;
      while (true) {
        const existing = await db.user.findUnique({ where: { username } });
        if (!existing) break;
        attempt++;
        username = `${base}${attempt}`;
      }

      await db.user.update({
        where: { id: user.id },
        data: { username },
      });
    },
  },
});
