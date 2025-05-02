import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@supabase/supabase-js"

export interface CustomerProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: "active" | "inactive"
  kycStatus: "verified" | "pending" | "rejected"
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  dateOfBirth: string
  taxId?: string
  occupation?: string
  employerName?: string
  annualIncome?: number
  sourceOfFunds?: string
  notes?: string
  receiveMarketingEmails: boolean
  createdAt: Date
  updatedAt: Date
  // Investment related fields
  totalInvested?: number
  jars?: number
}

class CustomerService {
  async getCustomers(): Promise<CustomerProfile[]> {
    try {
      // First get all customers
      const { data: customers, error: customersError } = await supabaseAdmin
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })

      if (customersError) {
        console.error("Error fetching customers:", customersError)
        throw new Error(customersError.message)
      }

      if (!customers || customers.length === 0) {
        return []
      }

      // Get customer profiles
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from("customer_profiles")
        .select("*")
        .in("customer_id", customers.map(c => c.id))

      if (profilesError) {
        console.error("Error fetching customer profiles:", profilesError)
        throw new Error(profilesError.message)
      }

      // Get KYC verifications
      const { data: kycVerifications, error: kycError } = await supabaseAdmin
        .from("kyc_verifications")
        .select("*")
        .in("customer_id", customers.map(c => c.id))

      if (kycError) {
        console.error("Error fetching KYC verifications:", kycError)
        throw new Error(kycError.message)
      }

      // Get customer jars
      const { data: customerJars, error: jarsError } = await supabaseAdmin
        .from("customer_jars")
        .select("*")
        .in("customer_id", customers.map(c => c.id))

      if (jarsError) {
        console.error("Error fetching customer jars:", jarsError)
        throw new Error(jarsError.message)
      }

      // Map the data to CustomerProfile interface
      return customers.map((customer: any) => {
        const profile = profiles?.find(p => p.customer_id === customer.id)
        const kyc = kycVerifications?.find(k => k.customer_id === customer.id)
        const jars = customerJars?.filter(j => j.customer_id === customer.id) || []

        return {
          id: customer.id,
          firstName: customer.first_name,
          lastName: customer.last_name,
          email: customer.email,
          phone: customer.phone,
          status: customer.is_active ? "active" : "inactive",
          kycStatus: kyc?.status || "pending",
          addressLine1: profile?.address_line1 || "",
          addressLine2: profile?.address_line2,
          city: profile?.city || "",
          state: profile?.state || "",
          zipCode: profile?.zip_code || "",
          country: profile?.country || "",
          dateOfBirth: profile?.date_of_birth || "",
          taxId: profile?.tax_id,
          occupation: profile?.occupation,
          employerName: profile?.employer_name,
          annualIncome: profile?.annual_income?.toString(),
          sourceOfFunds: profile?.source_of_funds,
          notes: profile?.notes,
          receiveMarketingEmails: profile?.receive_marketing_emails || false,
          totalInvested: jars.reduce((sum, jar) => sum + (jar.current_value || 0), 0),
          jars: jars.length,
          createdAt: customer.created_at,
          updatedAt: customer.updated_at,
        }
      })
    } catch (error) {
      console.error("Error in getCustomers:", error)
      throw error instanceof Error ? error : new Error("Failed to fetch customers")
    }
  }

  async getCustomerById(id: string): Promise<CustomerProfile | null> {
    const { data: customer, error } = await supabaseAdmin
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
      .single()

    if (error) return null

    return {
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
  }

  async createCustomer(data: Partial<CustomerProfile>): Promise<CustomerProfile> {
    // First create the customer
    const { data: customer, error: customerError } = await supabaseAdmin.from("customers").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      is_active: data.status === "active",
    }).select().single()

    if (customerError) throw customerError

    // Then create the customer profile
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
      status: "pending",
    })

    if (kycError) throw kycError

    return this.getCustomerById(customer.id) as Promise<CustomerProfile>
  }

  async updateCustomer(id: string, data: Partial<CustomerProfile>): Promise<CustomerProfile> {
    console.log("CustomerService.updateCustomer called with:", { id, data })
    
    try {
      // Update customer
      const { error: customerError } = await supabaseAdmin
        .from("customers")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          is_active: data.status === "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (customerError) {
        console.error("Error updating customer:", customerError)
        throw customerError
      }

      // Check if customer profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from("customer_profiles")
        .select("*")
        .eq("customer_id", id)
        .single()

      // Update or insert customer profile
      const profileData = {
        customer_id: id,
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
        updated_at: new Date().toISOString(),
      }

      const { error: profileError } = existingProfile
        ? await supabaseAdmin
            .from("customer_profiles")
            .update(profileData)
            .eq("customer_id", id)
        : await supabaseAdmin
            .from("customer_profiles")
            .insert({ ...profileData, created_at: new Date().toISOString() })

      if (profileError) {
        console.error("Error updating customer profile:", profileError)
        throw profileError
      }

      // Update KYC status if provided
      if (data.kycStatus) {
        try {
          console.log("Updating KYC status to:", data.kycStatus)
          
          // Check if KYC verification exists
          const { data: existingKyc, error: kycCheckError } = await supabaseAdmin
            .from("kyc_verifications")
            .select("*")
            .eq("customer_id", id)
            .single()

          if (kycCheckError && kycCheckError.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error("Error checking KYC verification:", kycCheckError)
            throw kycCheckError
          }

          const kycData = {
            customer_id: id,
            status: data.kycStatus,
            document_type: existingKyc?.document_type || "identity",
            verified_at: data.kycStatus === "verified" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }

          console.log("KYC data to update:", kycData)
          console.log("Existing KYC:", existingKyc)

          let kycResult
          if (existingKyc) {
            console.log("Updating existing KYC verification")
            kycResult = await supabaseAdmin
              .from("kyc_verifications")
              .update(kycData)
              .eq("customer_id", id)
              .select()
          } else {
            console.log("Creating new KYC verification")
            kycResult = await supabaseAdmin
              .from("kyc_verifications")
              .insert({ ...kycData, created_at: new Date().toISOString() })
              .select()
          }

          console.log("KYC operation result:", kycResult)

          if (kycResult.error) {
            console.error("Error in KYC operation:", kycResult.error)
            throw new Error(`KYC update failed: ${kycResult.error.message || JSON.stringify(kycResult.error)}`)
          }

          if (!kycResult.data || kycResult.data.length === 0) {
            throw new Error("KYC update succeeded but no data was returned")
          }

          console.log("KYC update successful:", kycResult.data)
        } catch (error) {
          console.error("Error in KYC update:", error)
          throw error instanceof Error 
            ? error 
            : new Error(`Failed to update KYC verification: ${JSON.stringify(error)}`)
        }
      }

      const updatedCustomer = await this.getCustomerById(id)
      if (!updatedCustomer) {
        throw new Error("Failed to fetch updated customer")
      }

      console.log("Customer updated successfully:", updatedCustomer)
      return updatedCustomer
    } catch (error) {
      console.error("Error in updateCustomer:", error)
      throw error
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("customers").delete().eq("id", id)
    if (error) throw error
  }

  async exportCustomers(format: "csv" | "excel" | "pdf"): Promise<Blob> {
    const customers = await this.getCustomers()
    
    if (format === "csv") {
      const headers = Object.keys(customers[0]).join(",")
      const rows = customers.map(customer => Object.values(customer).join(",")).join("\n")
      const csv = `${headers}\n${rows}`
      return new Blob([csv], { type: "text/csv" })
    }
    
    if (format === "excel") {
      // Use xlsx library to create Excel file
      const XLSX = await import('xlsx')
      const worksheet = XLSX.utils.json_to_sheet(customers)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers")
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    }
    
    if (format === "pdf") {
      // Use pdfmake to create PDF file
      const pdfMake = await import('pdfmake/build/pdfmake')
      const pdfFonts = await import('pdfmake/build/vfs_fonts')
      pdfMake.default.vfs = pdfFonts.default.pdfMake.vfs
      
      const docDefinition = {
        content: [
          { text: "Customer List", style: "header" },
          {
            table: {
              headerRows: 1,
              body: [
                Object.keys(customers[0]),
                ...customers.map(customer => Object.values(customer))
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          }
        }
      }
      
      return new Promise((resolve) => {
        const pdfDocGenerator = pdfMake.default.createPdf(docDefinition)
        pdfDocGenerator.getBlob((blob: Blob) => {
          resolve(blob)
        })
      })
    }
    
    throw new Error("Unsupported export format")
  }
}

export const customerService = new CustomerService() 