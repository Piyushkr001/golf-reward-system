import { NextResponse } from "next/server";
import { getCharityBySlug } from "@/lib/charities";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const charity = await getCharityBySlug(slug);

    if (!charity) {
      return NextResponse.json({ success: false, message: "Charity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, charity });
  } catch (error) {
    console.error("Get single charity error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch charity" }, { status: 500 });
  }
}