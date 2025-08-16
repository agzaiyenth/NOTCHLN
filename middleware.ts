import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if user is authenticated for protected routes
  const isAuthenticated = true; // In a real app, check session/token

  // Protected routes that require authentication
  const protectedRoutes = ['/services/*/book', '/payment', '/profile'];
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    // Convert route pattern to regex
    const pattern = new RegExp(`^${route.replace('*', '.*')}($|/.*$)`)
    return pattern.test(request.nextUrl.pathname)
  });

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/services/:path*/book/:path*', 
    '/payment/:path*',
    '/profile/:path*',
  ],
}