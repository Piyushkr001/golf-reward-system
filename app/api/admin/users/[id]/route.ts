import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Awaiting params correctly matching Next.js 15+ patterns
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id) {
        return NextResponse.json({ error: "Configuration missing ID." }, { status: 400 });
    }

    // Explicitly delete ONLY if the role is 'user', preventing rogue admin deletions
    const [deletedUser] = await db
        .delete(users)
        .where(
            and(
                eq(users.id, id),
                eq(users.role, "user") // Structural safety boundary
            )
        )
        .returning();

    if (!deletedUser) {
        return NextResponse.json({ error: "User target not found or unauthorized deletion type." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Target user fully decoupled and deleted safely.",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
