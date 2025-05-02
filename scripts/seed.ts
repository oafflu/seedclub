import { supabaseAdmin } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

async function checkExistingData() {
  const { data: existingCustomers, error } = await supabaseAdmin
    .from('customers')
    .select('*')

  if (error) throw error
  return existingCustomers?.length > 0
}

async function seedDatabase() {
  try {
    console.log('Checking existing data...')
    const hasExistingData = await checkExistingData()
    
    if (hasExistingData) {
      console.log('Database already contains data. Skipping seed process.')
      return
    }

    console.log('Starting database seeding...')

    // Create test customers
    const customers = [
      {
        email: 'john.doe@example.com',
        encrypted_password: await bcrypt.hash('password123', 10),
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1 (555) 123-4567',
        is_active: true,
        email_verified: true,
      },
      {
        email: 'jane.smith@example.com',
        encrypted_password: await bcrypt.hash('password123', 10),
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1 (555) 987-6543',
        is_active: true,
        email_verified: true,
      },
      {
        email: 'bob.wilson@example.com',
        encrypted_password: await bcrypt.hash('password123', 10),
        first_name: 'Bob',
        last_name: 'Wilson',
        phone: '+1 (555) 456-7890',
        is_active: false,
        email_verified: false,
      },
    ]

    // Insert customers
    const { data: createdCustomers, error: customersError } = await supabaseAdmin
      .from('customers')
      .insert(customers)
      .select()

    if (customersError) throw customersError
    console.log('Created customers:', createdCustomers)

    // Create customer profiles
    const customerProfiles = createdCustomers.map(customer => ({
      customer_id: customer.id,
      address_line1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'United States',
      date_of_birth: '1990-01-01',
      occupation: 'Software Engineer',
      employer_name: 'Tech Corp',
      annual_income: 100000,
      source_of_funds: 'Employment Income',
      receive_marketing_emails: true,
    }))

    const { error: profilesError } = await supabaseAdmin
      .from('customer_profiles')
      .insert(customerProfiles)

    if (profilesError) throw profilesError
    console.log('Created customer profiles')

    // Create KYC verifications
    const kycVerifications = createdCustomers.map((customer, index) => ({
      customer_id: customer.id,
      document_type: 'passport',
      status: index < 2 ? 'verified' : 'pending',
      verified_at: index < 2 ? new Date().toISOString() : null,
    }))

    const { error: kycError } = await supabaseAdmin
      .from('kyc_verifications')
      .insert(kycVerifications)

    if (kycError) throw kycError
    console.log('Created KYC verifications')

    // Create wallets
    const wallets = createdCustomers.map(customer => ({
      customer_id: customer.id,
      balance: 0,
    }))

    const { error: walletsError } = await supabaseAdmin
      .from('wallets')
      .insert(wallets)

    if (walletsError) throw walletsError
    console.log('Created wallets')

    // Create customer jars
    const customerJars = []
    for (const customer of createdCustomers.slice(0, 2)) { // Only for active customers
      customerJars.push(
        {
          customer_id: customer.id,
          initial_amount: 10000,
          current_value: 10500,
          start_date: new Date().toISOString(),
          maturity_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          status: 'active',
        },
        {
          customer_id: customer.id,
          initial_amount: 5000,
          current_value: 5200,
          start_date: new Date().toISOString(),
          maturity_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
          status: 'active',
        }
      )
    }

    const { error: jarsError } = await supabaseAdmin
      .from('customer_jars')
      .insert(customerJars)

    if (jarsError) throw jarsError
    console.log('Created customer jars')

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase() 