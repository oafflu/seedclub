import { supabaseAdmin } from "../lib/supabase/client"
import bcrypt from "bcryptjs"

async function seedCustomers() {
  try {
    // Hash a default password for test customers
    const hashedPassword = await bcrypt.hash("password123", 10)

    const customers = [
      {
        email: "john.smith@example.com",
        encrypted_password: hashedPassword,
        first_name: "John",
        last_name: "Smith",
        phone: "+1 (555) 123-4567",
        is_active: true
      },
      {
        email: "sarah.johnson@example.com",
        encrypted_password: hashedPassword,
        first_name: "Sarah",
        last_name: "Johnson",
        phone: "+1 (555) 987-6543",
        is_active: true
      },
      {
        email: "michael.brown@example.com",
        encrypted_password: hashedPassword,
        first_name: "Michael",
        last_name: "Brown",
        phone: "+1 (555) 456-7890",
        is_active: true
      }
    ]

    // Insert customers
    for (const customer of customers) {
      // Check if customer already exists
      const { data: existingCustomer } = await supabaseAdmin
        .from("customers")
        .select("id")
        .eq("email", customer.email)
        .single()

      if (existingCustomer) {
        console.log(`Customer ${customer.email} already exists, skipping...`)
        continue
      }

      // Create customer
      const { data: createdCustomer, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert(customer)
        .select()
        .single()

      if (customerError) {
        console.error(`Error creating customer ${customer.email}:`, customerError)
        continue
      }

      console.log(`Created customer: ${customer.email}`)

      // Create customer profile
      const { error: profileError } = await supabaseAdmin
        .from("customer_profiles")
        .insert({
          customer_id: createdCustomer.id,
          address_line1: "123 Main St",
          city: "New York",
          state: "NY",
          zip_code: "10001",
          country: "United States",
          date_of_birth: new Date("1990-01-01").toISOString().split("T")[0],
          occupation: "Software Engineer",
          employer_name: "Tech Corp",
          annual_income: 120000,
          source_of_funds: "Employment Income",
          receive_marketing_emails: true
        })

      if (profileError) {
        console.error(`Error creating profile for ${customer.email}:`, profileError)
        continue
      }

      console.log(`Created profile for: ${customer.email}`)

      // Create KYC verification
      const { error: kycError } = await supabaseAdmin
        .from("kyc_verifications")
        .insert({
          customer_id: createdCustomer.id,
          document_type: "passport",
          status: "verified",
          verified_at: new Date().toISOString()
        })

      if (kycError) {
        console.error(`Error creating KYC for ${customer.email}:`, kycError)
        continue
      }

      console.log(`Created KYC for: ${customer.email}`)

      // Create wallet
      const { error: walletError } = await supabaseAdmin
        .from("wallets")
        .insert({
          customer_id: createdCustomer.id,
          balance: 10000.00
        })

      if (walletError) {
        console.error(`Error creating wallet for ${customer.email}:`, walletError)
        continue
      }

      console.log(`Created wallet for: ${customer.email}`)
      console.log(`Successfully created all records for customer: ${customer.email}`)
    }

    console.log("Customer seeding completed!")
    return { success: true }
  } catch (error) {
    console.error("Error seeding customers:", error)
    return { success: false, error }
  }
}

export { seedCustomers } 