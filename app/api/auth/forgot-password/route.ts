import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      // Return success anyway to prevent email enumeration attacks
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.update(users)
      .set({ 
        resetToken: token,
        resetTokenExpiry: expiry
      })
      .where(eq(users.id, user.id));

    // Safely emit email but don't crash if SMTP env is missing in dev mode
    try {
      if (process.env.SMTP_USER) {
        await sendPasswordResetEmail(user.email, token);
      } else {
         console.warn(`[DEV] Password reset link for ${user.email}: http://localhost:3000/reset-password?token=${token}`);
      }
    } catch (e) {
      console.error('Failed to send reset email', e);
    }

    return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
