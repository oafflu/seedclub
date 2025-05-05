import { NextResponse, NextRequest } from "next/server"
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    // Try to fetch by id first, then by code if not found
    let { data: customer, error } = await supabaseAdmin
      .from("customers")
      .select(`
        *,
        customer_profiles (*),
        kyc_verifications (status),
        customer_jars (
          id,
          initial_amount,
          current_value
        )
      `)
      .eq("id", id)
      .single();

    // Now safe to log params.id
    // console.log("API param id:", params.id, "length:", params.id.length);

    if ((!customer || error) && id.startsWith('CUST-')) {
      ({ data: customer, error } = await supabaseAdmin
        .from("customers")
        .select(`
          *,
          customer_profiles (*),
          kyc_verifications (status),
          customer_jars (
            id,
            initial_amount,
            current_value
          )
        `)
        .ilike("code", id)
        .single());
      // console.log("Customer by code:", customer, "Error:", error);
    }

    if (error || !customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    // Map to CustomerProfile shape
    const result = {
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      status: customer.is_active ? "active" : "inactive",
      kycStatus: customer.kyc_verifications?.[0]?.status || "pending",
      addressLine1: customer.customer_profiles?.address_line1,
      addressLine2: customer.customer_profiles?.address_line2,
      city: customer.customer_profiles?.city,
      state: customer.customer_profiles?.state,
      zipCode: customer.customer_profiles?.zip_code,
      country: customer.customer_profiles?.country,
      dateOfBirth: customer.customer_profiles?.date_of_birth,
      taxId: customer.customer_profiles?.tax_id,
      occupation: customer.customer_profiles?.occupation,
      employerName: customer.customer_profiles?.employer_name,
      annualIncome: customer.customer_profiles?.annual_income?.toString(),
      sourceOfFunds: customer.customer_profiles?.source_of_funds,
      notes: customer.customer_profiles?.notes,
      receiveMarketingEmails: customer.customer_profiles?.receive_marketing_emails || false,
      totalInvested: customer.customer_jars?.reduce((sum: number, jar: any) => sum + jar.current_value, 0) || 0,
      jars: customer.customer_jars?.length || 0,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
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
    const customer = await supabaseAdmin
      .from("customers")
      .update(data)
      .eq("id", id)
      .select()
      .single()
    return NextResponse.json(customer)
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