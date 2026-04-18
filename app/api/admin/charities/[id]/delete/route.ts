import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { charities } from "@/config/schema";
import { getCurrentDbUser } from "@/lib/current-user";

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await db
      .update(charities)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(charities.id, id));

    return NextResponse.json({ success: true, message: "Charity deactivated successfully" });
  } catch (error) {
    console.error("Deactivate charity error:", error);
    return NextResponse.json({ success: false, message: "Failed to deactivate charity" }, { status: 500 });
  }
}