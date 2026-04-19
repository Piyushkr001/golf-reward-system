import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { draws } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getCurrentDbUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [draw] = await db.select().from(draws).where(eq(draws.id, id)).limit(1);

    if (!draw) {
      return NextResponse.json({ error: "Draw not found" }, { status: 404 });
    }
    if (draw.status !== "simulated") {
      return NextResponse.json({ error: "Only simulated draws can be published" }, { status: 400 });
    }

    await db.update(draws)
      .set({
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(draws.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`POST /api/admin/draws/${id}/publish error:`, error);
    return NextResponse.json({ error: "Failed to publish draw" }, { status: 500 });
  }
}
