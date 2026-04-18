import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { charities } from "@/config/schema";

export async function getActiveCharities() {
  return db
    .select()
    .from(charities)
    .where(eq(charities.isActive, true))
    .orderBy(asc(charities.displayOrder), asc(charities.name));
}

export async function getFeaturedCharities() {
  return db
    .select()
    .from(charities)
    .where(eq(charities.featured, true))
    .orderBy(asc(charities.displayOrder), asc(charities.name));
}

export async function getCharityBySlug(slug: string) {
  const result = await db
    .select()
    .from(charities)
    .where(eq(charities.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function getAllCharitiesForAdmin() {
  return db
    .select()
    .from(charities)
    .orderBy(desc(charities.createdAt));
}