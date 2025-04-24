import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''

  // Redirect to login if accessing a protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to bookings if accessing auth pages with token
  if (isPublicPath && path !== '/' && token) {
    return NextResponse.redirect(new URL('/bookings', request.url))
  }

  return NextResponse.next()
}
 
// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/bookings/:path*'
  ]
}