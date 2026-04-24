import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

/**
 * Returns the current session or redirects to /login.
 * Use in Server Components / Route Handlers that require auth.
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/**
 * Returns the current session or null.
 * Use when auth is optional.
 */
export async function getSession(): Promise<Session | null> {
  return auth();
}

/**
 * Returns the current user ID from session or redirects.
 */
export async function requireUserId(): Promise<string> {
  const session = await requireAuth();
  return session.user.id;
}
