import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getUserBillingEvents } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const events = await getUserBillingEvents(user.id);
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Fetch billing history error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
