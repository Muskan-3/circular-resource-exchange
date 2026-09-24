import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken, type SessionPayload } from "@/lib/auth";

export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
