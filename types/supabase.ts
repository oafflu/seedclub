export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customer_profiles: {
        Row: {
          id: string
          customer_id: string
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          date_of_birth: string | null
          tax_id: string | null
          occupation: string | null
          employer_name: string | null
          annual_income: number | null
          source_of_funds: string | null
          notes: string | null
          receive_marketing_emails: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          date_of_birth?: string | null
          tax_id?: string | null
          occupation?: string | null
          employer_name?: string | null
          annual_income?: number | null
          source_of_funds?: string | null
          notes?: string | null
          receive_marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          date_of_birth?: string | null
          tax_id?: string | null
          occupation?: string | null
          employer_name?: string | null
          annual_income?: number | null
          source_of_funds?: string | null
          notes?: string | null
          receive_marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      kyc_verifications: {
        Row: {
          id: string
          customer_id: string
          document_type: string
          status: string
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          document_type: string
          status: string
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          document_type?: string
          status?: string
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_jars: {
        Row: {
          id: string
          customer_id: string
          initial_amount: number
          current_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          initial_amount: number
          current_value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          initial_amount?: number
          current_value?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 