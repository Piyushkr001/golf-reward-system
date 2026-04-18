import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and expected role are required' }, { status: 400 });
    }

    if (role === 'admin' && !email.endsWith('@playlance.com')) {
      return NextResponse.json({ error: 'Admin access requires a @playlance.com email address.' }, { status: 403 });
    }

    // 1. Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    // Strict Role Enforcement
    if (user && user.role !== role) {
      return NextResponse.json({ error: `Access denied. Please use the ${user.role === 'admin' ? 'Admin Portal' : 'User Portal'} to sign in.` }, { status: 403 });
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Verify password
    const isCorrect = await verifyPassword(password, user.passwordHash);
    if (!isCorrect) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 3. Create Session
    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, message: 'Logged in successfully', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
