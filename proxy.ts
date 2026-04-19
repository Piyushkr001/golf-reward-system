import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { db } from '@/config/db';
import { users, onboardingProfiles } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { getStepRoute } from '@/lib/onboarding';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-change-me'
);

const protectedRoutes = ['/dashboard', '/admin'];
const userDashboardRoute = '/dashboard';
const adminDashboardRoute = '/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/sign-up') || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('session')?.value;

  // Unauthenticated user -> Login
  if (!sessionToken) {
    const loginUrl = pathname.startsWith(adminDashboardRoute) ? '/admin/login' : '/sign-in';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = payload.userId as string;
    const role = payload.role as "user" | "admin";
    
    // Enforcement 1: Correct Route based on Role
    if (pathname.startsWith(adminDashboardRoute) && role !== 'admin') {
       return NextResponse.redirect(new URL(userDashboardRoute, request.url));
    }
    if (pathname.startsWith(userDashboardRoute) && role === 'admin') {
       return NextResponse.redirect(new URL(adminDashboardRoute, request.url));
    }

    // Edge DB Check
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new Error("Invalid session user");

    // Enforcement 2: Verification
    // Verify email only for 'user' role
    if (role === 'user' && !user.isVerified) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Enforcement 3: Onboarding
    const [profile] = await db.select().from(onboardingProfiles).where(eq(onboardingProfiles.userId, userId)).limit(1);
    
    if (!profile || profile.status !== 'completed') {
       // If no profile, we start at 'profile', otherwise use the current step
       const step = profile?.currentStep || null;
       const route = getStepRoute(role, step);
       return NextResponse.redirect(new URL(route, request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token
    request.cookies.delete('session');
    const loginUrl = pathname.startsWith(adminDashboardRoute) ? '/admin/login' : '/sign-in';
    const response = NextResponse.redirect(new URL(loginUrl, request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|Images|favicon.ico).*)'],
};
