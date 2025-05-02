import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rmyblssbxxoqmemfdupl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteWJsc3NieHhvcW1lbWZkdXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDIwMTY4MSwiZXhwIjoyMDU5Nzc3NjgxfQ.GR9dHR8QT2wMisYhmcWCi7A11432kLCGY4bmpK2KHN8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAuthUsers() {
  try {
    // Get all admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('email, encrypted_password, role')
      .eq('is_active', true)

    if (adminError) throw adminError

    // Get all customers
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('email, encrypted_password')
      .eq('is_active', true)

    if (customerError) throw customerError

    console.log('Found admin users:', adminUsers?.length)
    console.log('Found customers:', customers?.length)

    // Create auth users for admins
    for (const admin of adminUsers || []) {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: admin.email,
          password: admin.encrypted_password,
          email_confirm: true,
          user_metadata: {
            role: admin.role || 'admin'
          }
        })

        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`Admin user already exists: ${admin.email}`)
          } else {
            console.error(`Error creating admin user ${admin.email}:`, error.message)
          }
        } else {
          console.log(`Created auth user for admin: ${admin.email}`)
        }
      } catch (err) {
        console.error(`Failed to create admin user ${admin.email}:`, err)
      }
    }

    // Create auth users for customers
    for (const customer of customers || []) {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: customer.email,
          password: customer.encrypted_password,
          email_confirm: true,
          user_metadata: {
            role: 'customer'
          }
        })

        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`Customer user already exists: ${customer.email}`)
          } else {
            console.error(`Error creating customer user ${customer.email}:`, error.message)
          }
        } else {
          console.log(`Created auth user for customer: ${customer.email}`)
        }
      } catch (err) {
        console.error(`Failed to create customer user ${customer.email}:`, err)
      }
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

createAuthUsers() 