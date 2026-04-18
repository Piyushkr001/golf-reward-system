import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq, and, gt } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (password.length < 8) {
       return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    // Find user where resetToken = token AND resetTokenExpiry > NOW()
    const [user] = await db.select().from(users)
       .where(
         and(
           eq(users.resetToken, token),
           gt(users.resetTokenExpiry, new Date())
         )
       )
       .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, message: 'Password has been safely reset.' });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
