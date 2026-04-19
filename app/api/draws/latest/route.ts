import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { draws, prizePools } from "@/config/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const [latestDraw] = await db
      .select()
      .from(draws)
      .where(eq(draws.status, "published"))
      .orderBy(desc(draws.publishedAt), desc(draws.createdAt))
      .limit(1);

    if (!latestDraw) {
      return NextResponse.json({ draw: null });
    }

    const [pool] = await db
      .select()
      .from(prizePools)
      .where(eq(prizePools.drawId, latestDraw.id))
      .limit(1);

    return NextResponse.json({ draw: { ...latestDraw, prizePool: pool || null } });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
