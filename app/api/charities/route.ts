import { NextResponse } from "next/server";
import { getActiveCharities } from "@/lib/charities";

export async function GET() {
  try {
    const data = await getActiveCharities();
    return NextResponse.json({ success: true, charities: data });
  } catch (error) {
    console.error("Get charities error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch charities" }, { status: 500 });
  }
}