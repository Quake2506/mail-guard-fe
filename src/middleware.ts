import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  // // Redirect root path to inbox
  // if (pathname === '/') {
  //   return NextResponse.redirect(new URL('/inbox', request.url));
  // }

  // Allow access to public routes regardless of authentication status
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login/register, redirect to home
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/inbox', request.url));
  }

  return NextResponse.next();
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|next.svg).*)'
  ]
};