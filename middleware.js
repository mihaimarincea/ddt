import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request) {
  console.log('Middleware called for path:', request.nextUrl.pathname);

  // Allow access to the login page without a token
  if (request.nextUrl.pathname === '/admin/login') {
    console.log('Allowing access to login page');
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    console.log('Token from cookie:', token);

    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      verify(token, JWT_SECRET);
      console.log('Token verified successfully');
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};