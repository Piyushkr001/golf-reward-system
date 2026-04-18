import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq, count } from 'drizzle-orm';
import { createSession } from '@/lib/auth';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { credential, role } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'Missing Google credential' }, { status: 400 });
    }

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      console.error("Token verification failed", err);
       return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    if (!payload?.email) {
      return NextResponse.json({ error: 'Invalid Google Identity' }, { status: 400 });
    }

    const { email, sub: googleId } = payload;
    let assignedRole = role === 'admin' ? 'admin' : 'user';

    if (assignedRole === 'admin' && !email.endsWith('@playlance.com')) {
      return NextResponse.json({ error: 'Admin access requires a @playlance.com Google account.' }, { status: 403 });
    }

    // Check if user exists
    let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      // Create user if not exists
      // If registering as admin, enforce limit
      if (assignedRole === 'admin') {
        const [{ adminCount }] = await db
          .select({ adminCount: count() })
          .from(users)
          .where(eq(users.role, 'admin'));

        if (adminCount >= 3) {
          return NextResponse.json({ error: 'Maximum number of admins (3) has already been reached.' }, { status: 403 });
        }
      }

      [user] = await db.insert(users).values({
        email,
        googleId,
        role: assignedRole,
      }).returning();
    } else {
      // User exists. Enforce role boundary.
      if (user.role !== assignedRole) {
         return NextResponse.json({ error: `Access denied. Please sign in via the ${user.role === 'admin' ? 'Admin Portal' : 'User Portal'}.` }, { status: 403 });
      }
      
      // User exists. Update googleId if missing
      if (!user.googleId) {
        await db.update(users).set({ googleId }).where(eq(users.id, user.id));
      }
    }

    // Create session
    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });

  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
