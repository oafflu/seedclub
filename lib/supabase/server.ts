import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  }
})

// Create a server component client
export function createServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient({
    cookies: () => cookieStore
  })
}

// Create a route handler client
export function createRouteHandler() {
  const cookieStore = cookies()
  return createRouteHandlerClient({
    cookies: () => cookieStore
  })
} 