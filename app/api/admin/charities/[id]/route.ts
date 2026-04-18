import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { charities } from "@/config/schema";
import { getCurrentDbUser } from "@/lib/current-user";

export async function PATCH(
  req: NextRequest,
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
    const body = await req.json();

    await db
      .update(charities)
      .set({
        name: body.name,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        imageUrl: body.imageUrl || null,
        websiteUrl: body.websiteUrl || null,
        category: body.category,
        featured: Boolean(body.featured),
        isActive: Boolean(body.isActive),
        displayOrder: Number(body.displayOrder || 0),
        updatedAt: new Date(),
      })
      .where(eq(charities.id, id));

    return NextResponse.json({ success: true, message: "Charity updated successfully" });
  } catch (error) {
    console.error("Update charity error:", error);
    return NextResponse.json({ success: false, message: "Failed to update charity" }, { status: 500 });
  }
}