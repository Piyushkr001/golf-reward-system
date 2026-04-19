import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { winners, winnerProofs } from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "A valid proof URL is required." }, { status: 400 });
    }

    const [winnerBlock] = await db.select().from(winners).where(and(eq(winners.id, id), eq(winners.userId, user.id))).limit(1);

    if (!winnerBlock) {
      return NextResponse.json({ error: "Winner record not found." }, { status: 404 });
    }

    if (winnerBlock.reviewStatus === "approved" || winnerBlock.payoutStatus !== "pending") {
       return NextResponse.json({ error: "This record can no longer gather proof submissions." }, { status: 400 });
    }

    // Replace physical existing proofs cleanly (idempotent constraints)
    await db.delete(winnerProofs).where(eq(winnerProofs.winnerId, winnerBlock.id));

    const proofNode = await db.insert(winnerProofs).values({
       id: crypto.randomUUID(),
       winnerId: winnerBlock.id,
       fileUrl,
       fileName: "External Submissions",
       mimeType: "text/uri-list",
    }).returning();

    // Append submission hooks cleanly
    await db.update(winners)
       .set({ reviewStatus: "submitted", updatedAt: new Date() })
       .where(eq(winners.id, winnerBlock.id));

    return NextResponse.json({ success: true, proof: proofNode[0] }, { status: 200 });
  } catch (error: any) {
    console.error(`POST /api/winnings/${id}/proof error:`, error);
    return NextResponse.json({ error: "Failed to persist proof submission." }, { status: 500 });
  }
}
