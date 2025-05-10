import { NextResponse, NextRequest } from "next/server"
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    // Fetch customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("id, email, first_name, last_name, is_active")
      .eq("id", id)
      .single();
    if (customerError || !customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }
    // Fetch customer profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("customer_profiles")
      .select("address_line1, address_line2, city, state, zip_code, country, date_of_birth, tax_id, occupation, employer_name, annual_income, source_of_funds, notes, receive_marketing_emails")
      .eq("customer_id", id)
      .single();
    // Fetch KYC
    const { data: kyc, error: kycError } = await supabaseAdmin
      .from("kyc_verifications")
      .select("full_name, date_of_birth, nationality, tax_country, id_number, document_type, status, verified_at, created_at, updated_at, front_url, back_url, selfie_url")
      .eq("customer_id", id)
      .single();
    const kycObj = {
      full_name: kyc?.full_name || "",
      date_of_birth: kyc?.date_of_birth || "",
      nationality: kyc?.nationality || "",
      tax_country: kyc?.tax_country || "",
      id_number: kyc?.id_number || "",
      document_type: kyc?.document_type || "",
      status: kyc?.status || "pending",
      verified_at: kyc?.verified_at || "",
      created_at: kyc?.created_at || "",
      updated_at: kyc?.updated_at || "",
      front_url: kyc?.front_url || "",
      back_url: kyc?.back_url || "",
      selfie_url: kyc?.selfie_url || "",
    }
    const result = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      is_active: customer.is_active,
      ...profile,
      kyc_status: kycObj.status,
      kyc: kycObj,
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch customer" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const data = await request.json()
    // Update customers table
    const updateFields = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      is_active: data.is_active,
    }
    await supabaseAdmin
      .from("customers")
      .update(updateFields)
      .eq("id", id)
    // Update customer_profiles table
    const profileFields = {
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      date_of_birth: data.date_of_birth,
      tax_id: data.tax_id,
      occupation: data.occupation,
      employer_name: data.employer_name,
      annual_income: data.annual_income,
      source_of_funds: data.source_of_funds,
      notes: data.notes,
      receive_marketing_emails: data.receive_marketing_emails,
      updated_at: new Date().toISOString(),
    }
    await supabaseAdmin
      .from("customer_profiles")
      .update(profileFields)
      .eq("customer_id", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update customer" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const customer = await supabaseAdmin
      .from("customers")
      .delete()
      .eq("id", id)
      .select()
      .single()
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete customer" },
      { status: 500 }
    )
  }
} 