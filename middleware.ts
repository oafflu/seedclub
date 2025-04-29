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

// Define public paths that don't need authentication
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
  '/admin/login',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname === path || pathname.startsWith('/blog/'))) {
    return NextResponse.next()
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_token')
    
    // Redirect to admin login if no session and trying to access protected admin path
    if (!adminSession && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Allow access to login page if no session
    if (pathname === '/admin/login' && !adminSession) {
      return NextResponse.next()
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname === '/admin/login' && adminSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Check role-based access for protected admin paths
    if (adminSession) {
      const userRole = adminSession.value ? JSON.parse(adminSession.value).role : null
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
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder
     * 5. api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
} 