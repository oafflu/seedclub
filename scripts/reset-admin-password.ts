import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rmyblssbxxoqmemfdupl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteWJsc3NieHhvcW1lbWZkdXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDIwMTY4MSwiZXhwIjoyMDU5Nzc3NjgxfQ.GR9dHR8QT2wMisYhmcWCi7A11432kLCGY4bmpK2KHN8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetAdminPassword() {
  try {
    // Get admin user from auth system
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) throw listError

    const adminUser = users?.find(user => user.email === 'admin@seedclub.com')
    if (!adminUser) {
      throw new Error('Admin user not found in auth system')
    }

    // Reset password for admin user
    const newPassword = 'Admin@123' // You should change this password after logging in
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: newPassword }
    )

    if (error) {
      throw error
    }

    console.log('Successfully reset password for admin user')
    console.log('Email:', adminUser.email)
    console.log('New password:', newPassword)
    console.log('Please change this password after logging in')

  } catch (error) {
    console.error('Error resetting admin password:', error)
  }
}

resetAdminPassword() 