import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { charities } from "@/config/schema";
import { getCurrentDbUser } from "@/lib/current-user";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const name = String(body.name || "").trim();
    const shortDescription = String(body.shortDescription || "").trim();
    const fullDescription = String(body.fullDescription || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();
    const websiteUrl = String(body.websiteUrl || "").trim();
    const category = String(body.category || "other").trim() as
      | "education"
      | "sports"
      | "health"
      | "environment"
      | "community"
      | "other";
    const featured = Boolean(body.featured);
    const isActive = body.isActive !== false;
    const displayOrder = Number(body.displayOrder || 0);

    if (name.length < 2) {
      return NextResponse.json({ success: false, message: "Charity name is required" }, { status: 400 });
    }

    if (shortDescription.length < 10) {
      return NextResponse.json({ success: false, message: "Short description is too short" }, { status: 400 });
    }

    if (fullDescription.length < 20) {
      return NextResponse.json({ success: false, message: "Full description is too short" }, { status: 400 });
    }

    const slug = slugify(name);

    const existingCharity = await db.select().from(charities).where(eq(charities.slug, slug)).limit(1);
    
    if (existingCharity && existingCharity.length > 0) {
      return NextResponse.json({ success: false, message: "Charity already exists" }, { status: 400 });
    }

    await db.insert(charities).values({
      id: crypto.randomUUID(),
      name,
      slug,
      shortDescription,
      fullDescription,
      imageUrl: imageUrl || null,
      websiteUrl: websiteUrl || null,
      category,
      featured,
      isActive,
      displayOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Charity created successfully" });
  } catch (error) {
    console.error("Create charity error:", error);
    return NextResponse.json({ success: false, message: "Failed to create charity" }, { status: 500 });
  }
}