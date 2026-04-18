import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { getSession } from "@/lib/auth";

export async function getCurrentDbUser() {
  const sessionUser = await getSession();
  if (!sessionUser?.userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, sessionUser.userId)).limit(1);
  return user || null;
}