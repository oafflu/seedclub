import { NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data: customers, error } = await supabaseAdmin.from('customers').select('*')
    if (error) throw error
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch customers" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // Generate next customer code
    const { data: maxCodeRow } = await supabaseAdmin
      .from("customers")
      .select("code")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    let nextNumber = 1;
    if (maxCodeRow && maxCodeRow.code) {
      const match = maxCodeRow.code.match(/CUST-(\d+)/);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }
    const newCode = `CUST-${nextNumber.toString().padStart(3, '0')}`;
    // Create customer
    const { data: customer, error: customerError } = await supabaseAdmin.from("customers").insert({
      code: newCode,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      is_active: data.status === "active",
    }).select().single()
    if (customerError) throw customerError

    // Create customer profile
    const { error: profileError } = await supabaseAdmin.from("customer_profiles").insert({
      customer_id: customer.id,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode,
      country: data.country,
      date_of_birth: data.dateOfBirth,
      tax_id: data.taxId,
      occupation: data.occupation,
      employer_name: data.employerName,
      annual_income: data.annualIncome ? parseFloat(data.annualIncome.toString()) : null,
      source_of_funds: data.sourceOfFunds,
      notes: data.notes,
      receive_marketing_emails: data.receiveMarketingEmails,
    })
    if (profileError) throw profileError

    // Create initial KYC verification record
    const { error: kycError } = await supabaseAdmin.from("kyc_verifications").insert({
      customer_id: customer.id,
      document_type: "pending",
      status: data.kycStatus || "pending",
    })
    if (kycError) throw kycError

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create customer" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }
    // Update customer
    const { data: customer, error } = await supabaseAdmin.from('customers').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update customer" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }
    // Delete customer
    const { error } = await supabaseAdmin.from('customers').delete().eq('id', id)
    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete customer" },
      { status: 500 }
    )
  }
} 