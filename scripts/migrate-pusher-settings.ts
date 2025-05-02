import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function migratePusherSettings() {
  try {
    console.log('Running Pusher settings migration...')

    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(
      path.join(process.cwd(), 'migrations', 'pusher_settings.sql'),
      'utf8'
    )

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', {
      query: migrationSQL
    })

    if (error) {
      if (error.message.includes('function "exec_sql" does not exist')) {
        // Fall back to direct table creation if RPC is not available
        const { error: createError } = await supabase.from('pusher_settings').select('*').limit(1)
        
        if (createError && createError.code === 'PGRST204') {
          const { error: tableError } = await supabase.rpc('create_pusher_settings_table')
          if (tableError) throw tableError
        } else if (createError && !createError.message.includes('does not exist')) {
          throw createError
        }
      } else {
        throw error
      }
    }

    console.log('✅ Pusher settings migration completed successfully')
  } catch (error) {
    console.error('❌ Error running Pusher settings migration:', error)
    process.exit(1)
  }
}

migratePusherSettings() 