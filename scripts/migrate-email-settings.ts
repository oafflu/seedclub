import { supabase } from '@/lib/supabase/client'
import fs from 'fs'
import path from 'path'

async function runMigration() {
  try {
    // Read the migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(process.cwd(), 'migrations', 'email_settings.sql'),
      'utf8'
    )

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', {
      query: migrationSQL
    })

    if (error) {
      throw error
    }

    console.log('✅ Email settings migration completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration() 