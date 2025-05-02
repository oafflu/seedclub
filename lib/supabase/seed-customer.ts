import { supabaseAdmin } from './client'

async function seedCustomerData() {
  try {
    // 1. Get existing customer record
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select()
      .eq('email', 'oafflu@gmail.com')
      .single()

    if (customerError) {
      console.error('❌ Failed to find customer:', customerError)
      throw customerError
    }
    console.log('✅ Found existing customer:', customer)

    // 2. Get or update wallet
    const { data: existingWallet, error: walletFetchError } = await supabaseAdmin
      .from('wallets')
      .select()
      .eq('customer_id', customer.id)
      .single()

    if (walletFetchError) {
      console.error('❌ Failed to fetch wallet:', walletFetchError)
      throw walletFetchError
    }

    const { data: wallet, error: walletUpdateError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: 3750.00 })
      .eq('id', existingWallet.id)
      .select()
      .single()

    if (walletUpdateError) {
      console.error('❌ Failed to update wallet:', walletUpdateError)
      throw walletUpdateError
    }
    console.log('✅ Wallet updated:', wallet)

    // 3. Create jar records
    const jars = [
      {
        name: 'Sprout Fund',
        description: 'Short-term growth investment jar',
        term_months: 12,
        interest_rate: 10.00,
        minimum_investment: 1000.00,
        is_active: true,
        icon_name: 'sprout-jar'
      },
      {
        name: 'Sapling Stash',
        description: 'Medium-term growth investment jar',
        term_months: 24,
        interest_rate: 12.00,
        minimum_investment: 5000.00,
        is_active: true,
        icon_name: 'sapling-jar'
      },
      {
        name: 'Blossom Budget',
        description: 'Long-term growth investment jar',
        term_months: 36,
        interest_rate: 15.00,
        minimum_investment: 2000.00,
        is_active: true,
        icon_name: 'blossom-jar'
      }
    ]

    // Insert jars
    const { data: createdJars, error: jarsError } = await supabaseAdmin
      .from('jars')
      .insert(jars)
      .select()

    if (jarsError) {
      console.error('❌ Failed to create jars:', jarsError)
      throw jarsError
    }
    console.log('✅ Investment jars created:', createdJars)

    // 4. Create customer jars (investments)
    const { data: customerJarsData, error: customerJarsError } = await supabaseAdmin
      .from('customer_jars')
      .insert([
        {
          customer_id: customer.id,
          jar_id: createdJars[0].id, // Sprout Fund
          initial_amount: 5000.00,
          current_value: 5023.88, // Including current profit
          start_date: new Date('2024-01-15').toISOString(),
          maturity_date: new Date('2025-12-15').toISOString(),
          status: 'active'
        },
        {
          customer_id: customer.id,
          jar_id: createdJars[1].id, // Sapling Stash
          initial_amount: 10000.00,
          current_value: 10229.25, // Including current profit
          start_date: new Date('2024-01-15').toISOString(),
          maturity_date: new Date('2026-01-15').toISOString(),
          status: 'active'
        },
        {
          customer_id: customer.id,
          jar_id: createdJars[2].id, // Blossom Budget
          initial_amount: 3000.00,
          current_value: 3102.34, // Including current profit
          start_date: new Date('2024-01-15').toISOString(),
          maturity_date: new Date('2027-02-15').toISOString(),
          status: 'active'
        }
      ])
      .select()

    if (customerJarsError) {
      console.error('❌ Failed to create customer jars:', customerJarsError)
      throw customerJarsError
    }
    console.log('✅ Customer investments created:', customerJarsData)

    // 5. Create recent transactions
    const transactions = [
      {
        customer_id: customer.id,
        wallet_id: wallet.id,
        type: 'deposit',
        amount: 2000.00,
        status: 'completed',
        description: 'Added funds to wallet',
        processed_at: new Date('2023-12-15').toISOString()
      },
      {
        customer_id: customer.id,
        wallet_id: wallet.id,
        customer_jar_id: customerJarsData[0].id,
        type: 'investment',
        amount: 5000.00,
        status: 'completed',
        description: 'Created Jar',
        processed_at: new Date('2023-12-10').toISOString()
      },
      {
        customer_id: customer.id,
        wallet_id: wallet.id,
        customer_jar_id: customerJarsData[0].id,
        type: 'interest',
        amount: 250.00,
        status: 'completed',
        description: 'Jar earnings',
        processed_at: new Date('2024-01-15').toISOString()
      }
    ]

    const { error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .insert(transactions)

    if (transactionsError) {
      console.error('❌ Failed to create transactions:', transactionsError)
      throw transactionsError
    }
    console.log('✅ Recent transactions created')

    console.log('✅ All customer data seeded successfully!')
    return { success: true }
  } catch (error) {
    console.error('❌ Error seeding customer data:', error)
    return { success: false, error }
  }
}

export { seedCustomerData } 