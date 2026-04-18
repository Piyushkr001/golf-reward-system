import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getUserSubscription } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(user.id);
    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Fetch current subscription error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
