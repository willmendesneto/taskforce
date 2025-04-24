import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const protectedPaths = ['/dashboard', '/api/projects', '/api/tasks'];
  const isPathProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Public paths that should redirect to dashboard if logged in
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect to login if accessing protected route without token
    if (isPathProtected && !token) {
      const url = new URL('/403', request.url);
      return NextResponse.redirect(url);
    }

    // Redirect to dashboard if accessing auth routes with token
    if (isAuthRoute && token) {
      const url = new URL('/dashboard', request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/projects/:path*',
    '/api/tasks/:path*',
    '/login',
    '/register',
  ],
};
