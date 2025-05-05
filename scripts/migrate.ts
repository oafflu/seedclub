import { supabaseAdmin } from '@/lib/supabase/admin'
import fs from 'fs'
import path from 'path'

async function runMigrations() {
  try {
    console.log('Starting database migrations...')

    // Read the migration SQL file
    const sqlContent = fs.readFileSync(
      path.join(process.cwd(), 'scripts', 'migrate.sql'),
      'utf-8'
    )

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)

    // Execute each statement
    for (const statement of statements) {
      console.log('Executing:', statement.slice(0, 50) + '...')
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql_statement: statement
      })

      if (error) {
        throw error
      }
    }

    console.log('Migrations completed successfully!')
  } catch (error) {
    console.error('Error running migrations:', error)
    process.exit(1)
  }
}

runMigrations() 