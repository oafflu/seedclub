import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected paths and their required roles
const protectedPaths = {
  '/admin/dashboard': ['admin', 'super_admin'],
  '/admin/customers': ['admin', 'super_admin'],
  '/admin/jars': ['admin', 'super_admin'],
  '/admin/transactions': ['admin', 'super_admin'],
  '/admin/settings': ['super_admin'],
  '/admin/users-roles': ['super_admin'],
}

// Define paths that require customer authentication
const customerProtectedPaths = [
  '/mobile/dashboard',
  '/mobile/invest',
  '/mobile/jars',
  '/mobile/wallet',
  '/mobile/profile',
  '/mobile/notifications',
  '/mobile/support',
  '/mobile/referrals',
]

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/about',
  '/blog',
  '/contact',
  '/faq',
  '/features',
  '/how-it-works',
  '/privacy',
  '/security',
  '/terms',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/admin/login',
  '/api/auth/login',
  '/api/auth/register',
  '/admin/login',
]

// Admin paths that require admin authentication
const adminPaths = [
  '/admin',
  '/api/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Handle admin routes
  if (adminPaths.some(path => pathname.startsWith(path))) {
    const adminToken = request.cookies.get('admin_token')
    if (!adminToken && !pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Allow access to login page if no session
    if (pathname === '/admin/login' && !adminToken) {
      return NextResponse.next()
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname === '/admin/login' && adminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Check role-based access for protected admin paths
    if (adminToken) {
      const userRole = JSON.parse(adminToken.value).role
      const requiredRoles = protectedPaths[pathname as keyof typeof protectedPaths]

      if (requiredRoles && !requiredRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }

    return NextResponse.next()
  }

  // Handle mobile (customer) routes
  if (pathname.startsWith('/mobile')) {
    const customerSession = request.cookies.get('customer_token')

    // Redirect to customer login if no session
    if (!customerSession && !pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if email is verified for customer routes
    if (customerSession) {
      const session = JSON.parse(customerSession.value)
      if (!session.email_verified && !pathname.startsWith('/auth/verify-email')) {
        return NextResponse.redirect(new URL('/auth/verify-email', request.url))
      }
    }

    return NextResponse.next()
  }

  // Allow access to all other routes (marketing pages)
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
} 