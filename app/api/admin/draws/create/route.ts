import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { draws } from "@/config/schema";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { month, year, logicType } = body;

    if (!month || !year || !logicType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newId = crypto.randomUUID();

    const [newDraw] = await db
      .insert(draws)
      .values({
        id: newId,
        month,
        year,
        logicType,
        status: "draft",
      })
      .returning();

    return NextResponse.json({ draw: newDraw }, { status: 201 });
  } catch (error: any) {
    if (error.code === "23505" || error.cause?.code === "23505" || error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "A draw iteration for this Month and Year already exists." }, { status: 400 });
    }
    console.error("POST /api/admin/draws/create error:", error);
    return NextResponse.json({ error: "Failed to create draft draw" }, { status: 500 });
  }
}
