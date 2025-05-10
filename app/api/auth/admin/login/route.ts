import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSession } from '@/lib/auth'
import { compare } from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists and is an admin
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, role, is_active, failed_login_attempts, locked_until')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !adminUser) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
      return NextResponse.json(
        { 
          message: 'Account is temporarily locked. Please try again later.',
          lockedUntil: adminUser.locked_until 
        },
        { status: 423 }
      )
    }

    // Check if account is active
    if (!adminUser.is_active) {
      return NextResponse.json(
        { message: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Reset failed login attempts on successful login
    await supabase
      .from('admin_users')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString()
      })
      .eq('id', adminUser.id)

    // Get IP and User Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create session
    const sessionToken = await createSession(
      adminUser.id,
      'admin',
      ip,
      userAgent
    )

    // Set session cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      }
    })

    response.cookies.set('admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1000 // 24 hours in milliseconds
    })

    // Create audit log
    await supabase.from('audit_logs').insert({
      user_id: adminUser.id,
      action: 'login',
      user_type: 'admin',
      ip_address: ip,
      user_agent: userAgent
    })

    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
} 