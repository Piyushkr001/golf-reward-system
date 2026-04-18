import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.verificationToken, token)).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    await db.update(users)
      .set({ 
        isVerified: true,
        verificationToken: null // Clear token after use
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, message: 'Email verified successfully.' });
  } catch (error: any) {
    console.error('Verify Email Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
