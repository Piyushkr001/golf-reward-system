import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { winners, winnerProofs, draws, users } from "@/config/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const adminUser = await getCurrentDbUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await db.select().from(winners).orderBy(desc(winners.createdAt));

    // Map structural data cleanly preventing huge N+1 hits if arrays are small initially
    // Since this is a specialized test sequence, basic promise-all mapping is extremely efficient
    const mappedPayload = await Promise.all(
       payload.map(async (winnerNode) => {
         const [draw] = await db.select().from(draws).where(eq(draws.id, winnerNode.drawId)).limit(1);
         const [user] = await db.select().from(users).where(eq(users.id, winnerNode.userId)).limit(1);
         const [proof] = await db.select().from(winnerProofs).where(eq(winnerProofs.winnerId, winnerNode.id)).limit(1);

         return {
            ...winnerNode,
            draw: draw || null,
            user: user ? { id: user.id, email: user.email } : null,
            proof: proof || null,
         }
       })
    );

    return NextResponse.json({ winners: mappedPayload });
  } catch (error: any) {
    console.error("GET /api/admin/winners error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
