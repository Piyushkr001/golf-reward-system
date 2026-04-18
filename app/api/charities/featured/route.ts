import { NextResponse } from "next/server";
import { getFeaturedCharities } from "@/lib/charities";

export async function GET() {
  try {
    const data = await getFeaturedCharities();
    return NextResponse.json({ success: true, charities: data });
  } catch (error) {
    console.error("Get featured charities error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch featured charities" }, { status: 500 });
  }
}