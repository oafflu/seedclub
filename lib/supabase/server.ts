import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

// Create a server component client
export function createServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  })
}

// Create a route handler client
export function createRouteHandler() {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
} 