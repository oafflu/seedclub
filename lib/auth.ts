import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { randomBytes, createHash } from 'crypto'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Session {
  user_id: string
  role?: string
  email_verified?: boolean
  expires_at: number
}

export async function createSession(userId: string, userType: 'admin' | 'customer', ip: string, userAgent: string): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

  await supabase
    .from('active_sessions')
    .insert({
      user_id: userId,
      user_type: userType,
      token: hashToken(token),
      ip_address: ip,
      user_agent: userAgent,
      expires_at: expiresAt.toISOString()
    })

  return token
}

export async function validateSession(token: string): Promise<Session | null> {
  const { data: session } = await supabase
    .from('active_sessions')
    .select('user_id, user_type, expires_at')
    .eq('token', hashToken(token))
    .single()

  if (!session || new Date(session.expires_at) < new Date()) {
    return null
  }

  // Get user details based on user type
  if (session.user_type === 'admin') {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', session.user_id)
      .single()

    return {
      user_id: session.user_id,
      role: admin?.role,
      expires_at: new Date(session.expires_at).getTime()
    }
  } else {
    const { data: customer } = await supabase
      .from('customers')
      .select('email_verified')
      .eq('id', session.user_id)
      .single()

    return {
      user_id: session.user_id,
      email_verified: customer?.email_verified,
      expires_at: new Date(session.expires_at).getTime()
    }
  }
}

export async function invalidateSession(token: string): Promise<void> {
  await supabase
    .from('active_sessions')
    .delete()
    .eq('token', hashToken(token))
}

export async function cleanupExpiredSessions(): Promise<void> {
  await supabase
    .from('active_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
}

export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex')
}

export function generateResetToken(): string {
  return randomBytes(32).toString('hex')
}

function generateToken(): string {
  return randomBytes(32).toString('hex')
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function updateFailedLoginAttempts(userId: string, userType: 'admin' | 'customer'): Promise<void> {
  const table = userType === 'admin' ? 'admin_users' : 'customers'
  const { data: user } = await supabase
    .from(table)
    .select('failed_login_attempts')
    .eq('id', userId)
    .single()

  const attempts = (user?.failed_login_attempts || 0) + 1
  const lockedUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null // Lock for 30 minutes after 5 attempts

  await supabase
    .from(table)
    .update({
      failed_login_attempts: attempts,
      locked_until: lockedUntil?.toISOString()
    })
    .eq('id', userId)
}

export async function resetFailedLoginAttempts(userId: string, userType: 'admin' | 'customer'): Promise<void> {
  const table = userType === 'admin' ? 'admin_users' : 'customers'
  await supabase
    .from(table)
    .update({
      failed_login_attempts: 0,
      locked_until: null
    })
    .eq('id', userId)
}

export async function isAccountLocked(userId: string, userType: 'admin' | 'customer'): Promise<boolean> {
  const table = userType === 'admin' ? 'admin_users' : 'customers'
  const { data: user } = await supabase
    .from(table)
    .select('locked_until')
    .eq('id', userId)
    .single()

  return user?.locked_until && new Date(user.locked_until) > new Date()
}

export async function createAuditLog(
  userId: string,
  userType: 'admin' | 'customer',
  action: string,
  details: any,
  ip: string,
  userAgent: string
): Promise<void> {
  await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      user_type: userType,
      action,
      details,
      ip_address: ip,
      user_agent: userAgent
    })
}

export async function getSession(isApiRoute = false) {
  try {
    const supabase = isApiRoute 
      ? createRouteHandlerClient({ cookies })
      : createServerComponentClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
} 