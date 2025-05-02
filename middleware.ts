import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
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
  '/mobile/login',
]

// Admin paths that require admin authentication
const adminPaths = [
  '/admin',
  '/api/admin',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Get the pathname
  const path = req.nextUrl.pathname

  // Check if the path is public
  if (publicPaths.some(p => path.startsWith(p))) {
    return res
  }

  // Get the session
  const { data: { session } } = await supabase.auth.getSession()

  // If no session and trying to access protected route
  if (!session) {
    if (path.startsWith('/admin/')) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    if (path.startsWith('/mobile/')) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return res
  }

  // Handle admin routes
  if (path.startsWith('/admin/')) {
    // Get user role from admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (adminError || !adminUser || !['admin', 'super_admin'].includes(adminUser.role)) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Check specific path permissions
    const requiredRoles = protectedPaths[path as keyof typeof protectedPaths]
    if (requiredRoles && !requiredRoles.includes(adminUser.role)) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  // Handle mobile/customer routes
  if (path.startsWith('/mobile/')) {
    // Check if user exists in customers table
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (customerError || !customer) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return res
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/:path*',
    '/mobile/:path*',
  ],
} 