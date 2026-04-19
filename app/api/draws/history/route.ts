import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { draws } from "@/config/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const history = await db
      .select()
      .from(draws)
      .where(eq(draws.status, "published"))
      .orderBy(desc(draws.publishedAt), desc(draws.createdAt));

    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
