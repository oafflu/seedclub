import { createClient } from '@supabase/supabase-js'

// Client for public operations (can be used on both client and server)
export const supabase = createClient(
  'https://rmyblssbxxoqmemfdupl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteWJsc3NieHhvcW1lbWZkdXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDE2ODEsImV4cCI6MjA1OTc3NzY4MX0.8lc9GnDzgtQESwsNy--a7VSv4-JPypStA0KgNWcSeKQ',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Admin client for privileged operations (server-side only)
// Only create if service role key is available (server-side)
export const supabaseAdmin = createClient(
  'https://rmyblssbxxoqmemfdupl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteWJsc3NieHhvcW1lbWZkdXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDIwMTY4MSwiZXhwIjoyMDU5Nzc3NjgxfQ.GR9dHR8QT2wMisYhmcWCi7A11432kLCGY4bmpK2KHN8',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
  }
) 