import { supabase } from '@/lib/supabase/client'

async function checkUsers() {
  try {
    // Check for customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('email, first_name, last_name, is_active')
      .eq('email', 'oafflu@gmail.com')
      .single()

    if (customerError) {
      console.log('❌ Customer not found:', customerError.message)
    } else {
      console.log('✅ Customer found:', customer)
    }

    // Check for admin
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('email, first_name, last_name, is_active')
      .eq('email', 'admin@seedclub.com')
      .single()

    if (adminError) {
      console.log('❌ Admin not found:', adminError.message)
    } else {
      console.log('✅ Admin found:', admin)
    }
  } catch (error) {
    console.error('Error checking users:', error)
  }
}

checkUsers() 