import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq, count } from 'drizzle-orm';
import crypto from 'crypto';
import { hashPassword, createSession } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'user';

    // 0. Domain restriction for admins
    if (assignedRole === 'admin' && !email.endsWith('@playlance.com')) {
      return NextResponse.json({ error: 'Admin registration requires a @playlance.com email address.' }, { status: 403 });
    }

    // 1. Enforce max 3 admins rule
    if (assignedRole === 'admin') {
      const [{ adminCount }] = await db
        .select({ adminCount: count() })
        .from(users)
        .where(eq(users.role, 'admin'));

      if (adminCount >= 3) {
        return NextResponse.json({ error: 'Maximum number of admins (3) has already been reached.' }, { status: 403 });
      }
    }

    // 2. Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    // 3. Hash password & Insert
    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const [newUser] = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      role: assignedRole,
      verificationToken
    }).returning();

    // 4. Send Verification Email
    try {
      if (process.env.SMTP_USER) {
        await sendVerificationEmail(newUser.email, verificationToken);
      } else {
        console.warn(`[DEV] Verification link for ${newUser.email}: http://localhost:3000/verify-email?token=${verificationToken}`);
      }
    } catch (e) {
      console.error('Failed to send verification email:', e);
    }

    // 5. Create Session
    await createSession(newUser.id, newUser.role);

    return NextResponse.json({ success: true, message: 'Registered successfully', user: { id: newUser.id, email: newUser.email, role: newUser.role } });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
