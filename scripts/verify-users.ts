import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyUsers() {
  try {
    // Check for oafflu@gmail.com in customers table
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('email, first_name, last_name, is_active')
      .eq('email', 'oafflu@gmail.com')
      .single()

    console.log('\nChecking customers table:')
    if (customerError) {
      console.log('❌ oafflu@gmail.com not found in customers table:', customerError.message)
    } else {
      console.log('✅ Found in customers table:', customer)
    }

    // Check for admin@seedclub.com in admin_users table
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('email, first_name, last_name, is_active')
      .eq('email', 'admin@seedclub.com')
      .single()

    console.log('\nChecking admin_users table:')
    if (adminError) {
      console.log('❌ admin@seedclub.com not found in admin_users table:', adminError.message)
    } else {
      console.log('✅ Found in admin_users table:', admin)
    }

  } catch (error) {
    console.error('Error verifying users:', error)
  }
}

verifyUsers() 