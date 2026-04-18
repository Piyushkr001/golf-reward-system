import { NextRequest, NextResponse } from "next/server";
import { getActivePlans } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  try {
    const plans = await getActivePlans();
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error("Fetch plans error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
