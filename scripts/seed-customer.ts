import { seedCustomerData } from '../lib/supabase/seed-customer'

async function main() {
  try {
    const result = await seedCustomerData()
    if (!result.success) {
      console.error('Failed to seed customer data:', result.error)
      process.exit(1)
    }
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed customer data:', error)
    process.exit(1)
  }
}

main() 