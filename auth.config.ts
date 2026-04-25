import type { NextAuthConfig } from "next-auth";

// Edge-safe config — no DB imports, used by middleware
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username ?? null;
        if (user.image) token.image = user.image;
        if (user.name) token.name = user.name;
      }
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.image = session.image ?? token.image;
        token.username = session.username ?? token.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string) ?? null;
        if (token.name) session.user.name = token.name as string;
        if (token.image) session.user.image = token.image as string;
      }
      return session;
    },
  },
};
