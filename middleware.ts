import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('amexan_token')?.value;
  const path = request.nextUrl.pathname;

  // Public routes
  if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/triage')) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Optional: Check role from token (if needed, could decode JWT)
  // For now, just allow; role checks will be done client-side.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};