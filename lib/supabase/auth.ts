import { supabase } from './client'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'

export type UserRole = 'customer' | 'admin'

interface AuthResponse {
  success: boolean
  error?: string
  user?: any
}

// Customer Authentication
export const customerSignUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<AuthResponse> => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // First, create the customer record with pending verification
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([
        {
          email,
          encrypted_password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          phone,
          is_active: true,
          email_verified: true,
          verification_token: null,
          verification_token_expires: null
        }
      ])
      .select()
      .single()

    if (customerError) throw customerError

    // Create wallet for the new customer
    const { error: walletError } = await supabase
      .from('wallets')
      .insert([
        {
          customer_id: customer.id,
          balance: 0.00
        }
      ])

    if (walletError) throw walletError

    return {
      success: true,
      user: customer
    }
  } catch (error: any) {
    console.error('Registration/Login error:', error)
    console.error('Registration/Login error (typeof):', typeof error, error)
    console.error('Registration/Login error (keys):', Object.keys(error))
    let errorMsg = "Unknown error"
    if (error) {
      if (typeof error === "string") {
        errorMsg = error
      } else if (error.message) {
        errorMsg = error.message
      } else if (error.error_description) {
        errorMsg = error.error_description
      } else if (error.msg) {
        errorMsg = error.msg
      } else if (typeof error === "object" && Object.keys(error).length === 0) {
        errorMsg = "Unknown error (empty object). This may be a database constraint violation, a Supabase misconfiguration, or a permissions issue. Please check your Supabase table schema and API keys."
      } else {
        try {
          errorMsg = JSON.stringify(error)
        } catch {
          errorMsg = String(error)
        }
      }
    }
    return {
      success: false,
      error: errorMsg
    }
  }
}

export const customerLogin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error

    if (!customer.is_active) {
      throw new Error('Account is inactive')
    }

    // Compare password using bcrypt
    const passwordMatch = await bcrypt.compare(password, customer.encrypted_password)
    if (!passwordMatch) {
      throw new Error('Invalid password')
    }

    // Update last login
    await supabase
      .from('customers')
      .update({ 
        last_login_at: new Date().toISOString(),
        last_login_ip: await getCurrentIP()
      })
      .eq('id', customer.id)

    return {
      success: true,
      user: customer
    }
  } catch (error: any) {
    console.error('Registration/Login error:', error)
    console.error('Registration/Login error (typeof):', typeof error, error)
    console.error('Registration/Login error (keys):', Object.keys(error))
    let errorMsg = "Unknown error"
    if (error) {
      if (typeof error === "string") {
        errorMsg = error
      } else if (error.message) {
        errorMsg = error.message
      } else if (error.error_description) {
        errorMsg = error.error_description
      } else if (error.msg) {
        errorMsg = error.msg
      } else if (typeof error === "object" && Object.keys(error).length === 0) {
        errorMsg = "Unknown error (empty object). This may be a database constraint violation, a Supabase misconfiguration, or a permissions issue. Please check your Supabase table schema and API keys."
      } else {
        try {
          errorMsg = JSON.stringify(error)
        } catch {
          errorMsg = String(error)
        }
      }
    }
    return {
      success: false,
      error: errorMsg
    }
  }
}

// Admin Authentication
export const adminLogin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*, admin_user_roles(role_id, admin_roles(name, admin_role_permissions(permission_id)))')
      .eq('email', email)
      .single()

    if (error) throw error

    if (!admin.is_active) {
      throw new Error('Admin account is inactive')
    }

    // Compare password using bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.encrypted_password)
    if (!passwordMatch) {
      throw new Error('Invalid password')
    }

    // Update last login with IP
    await supabase
      .from('admin_users')
      .update({ 
        last_login_at: new Date().toISOString(),
        last_login_ip: await getCurrentIP()
      })
      .eq('id', admin.id)

    // Log admin login for audit
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: admin.id,
        action: 'login',
        resource: 'admin',
        ip_address: await getCurrentIP(),
        user_agent: navigator.userAgent
      }])

    return {
      success: true,
      user: admin
    }
  } catch (error: any) {
    console.error('Registration/Login error:', error)
    console.error('Registration/Login error (typeof):', typeof error, error)
    console.error('Registration/Login error (keys):', Object.keys(error))
    let errorMsg = "Unknown error"
    if (error) {
      if (typeof error === "string") {
        errorMsg = error
      } else if (error.message) {
        errorMsg = error.message
      } else if (error.error_description) {
        errorMsg = error.error_description
      } else if (error.msg) {
        errorMsg = error.msg
      } else if (typeof error === "object" && Object.keys(error).length === 0) {
        errorMsg = "Unknown error (empty object). This may be a database constraint violation, a Supabase misconfiguration, or a permissions issue. Please check your Supabase table schema and API keys."
      } else {
        try {
          errorMsg = JSON.stringify(error)
        } catch {
          errorMsg = String(error)
        }
      }
    }
    return {
      success: false,
      error: errorMsg
    }
  }
}

// Email Verification
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('verification_token', token)
      .single()

    if (error) throw new Error('Invalid verification token')

    if (new Date(customer.verification_token_expires) < new Date()) {
      throw new Error('Verification token has expired')
    }

    await supabase
      .from('customers')
      .update({
        email_verified: true,
        is_active: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq('id', customer.id)

    return {
      success: true,
      user: customer
    }
  } catch (error: any) {
    console.error('Registration/Login error:', error)
    console.error('Registration/Login error (typeof):', typeof error, error)
    console.error('Registration/Login error (keys):', Object.keys(error))
    let errorMsg = "Unknown error"
    if (error) {
      if (typeof error === "string") {
        errorMsg = error
      } else if (error.message) {
        errorMsg = error.message
      } else if (error.error_description) {
        errorMsg = error.error_description
      } else if (error.msg) {
        errorMsg = error.msg
      } else if (typeof error === "object" && Object.keys(error).length === 0) {
        errorMsg = "Unknown error (empty object). This may be a database constraint violation, a Supabase misconfiguration, or a permissions issue. Please check your Supabase table schema and API keys."
      } else {
        try {
          errorMsg = JSON.stringify(error)
        } catch {
          errorMsg = String(error)
        }
      }
    }
    return {
      success: false,
      error: errorMsg
    }
  }
}

// Password Reset
export const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
  try {
    const { data: user, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error

    const resetToken = generateVerificationToken()
    await supabase
      .from('customers')
      .update({
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
      })
      .eq('id', user.id)

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken)

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Registration/Login error:', error)
    console.error('Registration/Login error (typeof):', typeof error, error)
    console.error('Registration/Login error (keys):', Object.keys(error))
    let errorMsg = "Unknown error"
    if (error) {
      if (typeof error === "string") {
        errorMsg = error
      } else if (error.message) {
        errorMsg = error.message
      } else if (error.error_description) {
        errorMsg = error.error_description
      } else if (error.msg) {
        errorMsg = error.msg
      } else if (typeof error === "object" && Object.keys(error).length === 0) {
        errorMsg = "Unknown error (empty object). This may be a database constraint violation, a Supabase misconfiguration, or a permissions issue. Please check your Supabase table schema and API keys."
      } else {
        try {
          errorMsg = JSON.stringify(error)
        } catch {
          errorMsg = String(error)
        }
      }
    }
    return {
      success: false,
      error: errorMsg
    }
  }
}

// Session Management
export const getSession = async () => {
  const customerSession = localStorage.getItem('customer_session')
  const adminSession = localStorage.getItem('admin_session')

  if (customerSession) {
    return {
      role: 'customer' as UserRole,
      session: JSON.parse(customerSession)
    }
  }

  if (adminSession) {
    return {
      role: 'admin' as UserRole,
      session: JSON.parse(adminSession)
    }
  }

  return null
}

export const logout = async () => {
  localStorage.removeItem('customer_session')
  localStorage.removeItem('admin_session')
}

// Helper functions
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// STUB: sendResetEmail is not implemented yet
const sendResetEmail = async (email: string, token: string) => {
  // TODO: Implement password reset email logic
  console.warn('sendResetEmail is not implemented. Email:', email, 'Token:', token)
  return Promise.resolve()
}

const getCurrentIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    return null
  }
}

const sendVerificationEmail = async (email: string, token: string) => {
  // TODO: Replace with actual email template and subject
  return sendEmail({
    to: email,
    subject: 'Verify your Seed Club account',
    html: `<p>Please verify your account using this token: ${token}</p>`
  })
}

const sendPasswordResetEmail = async (email: string, token: string) => {
  return sendResetEmail(email, token)
} 