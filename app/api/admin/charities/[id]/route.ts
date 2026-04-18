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

    const name = String(body.name || "").trim();
    const shortDescription = String(body.shortDescription || "").trim();
    const fullDescription = String(body.fullDescription || "").trim();

    if (name.length < 2) {
      return NextResponse.json({ success: false, message: "Charity name is required" }, { status: 400 });
    }
    if (shortDescription.length < 10) {
      return NextResponse.json({ success: false, message: "Short description is too short" }, { status: 400 });
    }
    if (fullDescription.length < 20) {
      return NextResponse.json({ success: false, message: "Full description is too short" }, { status: 400 });
    }

    await db
      .update(charities)
      .set({
        name,
        shortDescription,
        fullDescription,
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