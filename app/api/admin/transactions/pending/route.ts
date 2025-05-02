import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

// Get pending transactions
export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let query = supabaseAdmin
      .from("transactions")
      .select(`
        *,
        customer:customers(id, name, email),
        jar:jars(id, name)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (type) {
      query = query.eq("type", type)
    }

    const { data: transactions, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching pending transactions:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch pending transactions" },
      { status: 500 }
    )
  }
}

// Approve or reject pending transaction
export async function PUT(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { id, action, notes, reason } = data

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const status = action === "approve" ? "completed" : "rejected"

    const { data: transaction, error } = await supabaseAdmin
      .from("transactions")
      .update({
        status,
        notes,
        rejection_reason: action === "reject" ? reason : null,
        processed_by: session.user.id,
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log the action in audit logs
    await supabaseAdmin.from("audit_logs").insert([
      {
        entity_type: "transaction",
        entity_id: id,
        action: `transaction_${action}d`,
        changes: { status, notes, rejection_reason: reason },
        performed_by: session.user.id,
        performed_at: new Date().toISOString()
      }
    ])

    // If approved, update customer jar balance
    if (action === "approve") {
      const { data: customerJar, error: jarError } = await supabaseAdmin
        .from("customer_jars")
        .select("balance")
        .eq("customer_id", transaction.customer_id)
        .eq("jar_id", transaction.jar_id)
        .single()

      if (jarError) {
        throw jarError
      }

      const newBalance =
        transaction.type === "deposit"
          ? (customerJar?.balance || 0) + transaction.amount
          : (customerJar?.balance || 0) - transaction.amount

      const { error: updateError } = await supabaseAdmin
        .from("customer_jars")
        .upsert({
          customer_id: transaction.customer_id,
          jar_id: transaction.jar_id,
          balance: newBalance,
          updated_at: new Date().toISOString()
        })

      if (updateError) {
        throw updateError
      }
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error processing pending transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process pending transaction" },
      { status: 500 }
    )
  }
} 