import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  // Get the token from the cookies with proper parsing
  const cookieHeader = request.headers.get('cookie')
  let token = ''
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc: { [key: string]: string }, cookie: string) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    token = cookies['token'] || ''
  }

  // Add debug logging for production
  console.log(`Path: ${path}, IsPublicPath: ${isPublicPath}, HasToken: ${Boolean(token)}`)

  // Redirect to login if accessing a protected route without token
  if (!isPublicPath && !token) {
    console.log('Redirecting to login: No token found')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to bookings if accessing auth pages with token
  if (isPublicPath && path !== '/' && token) {
    console.log('Redirecting to bookings: Token exists')
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