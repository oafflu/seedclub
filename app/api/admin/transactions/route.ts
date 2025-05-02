import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

// Get all transactions
export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let query = supabaseAdmin
      .from("transactions")
      .select(`
        *,
        customer:customers(id, name, email),
        jar:jars(id, name)
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }
    if (type) {
      query = query.eq("type", type)
    }
    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data: transactions, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

// Create new transaction
export async function POST(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { customer_id, jar_id, type, amount, description, method } = data

    const { data: transaction, error } = await supabaseAdmin
      .from("transactions")
      .insert([
        {
          customer_id,
          jar_id,
          type,
          amount,
          description,
          method,
          status: "pending",
          created_by: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log the creation in audit logs
    await supabaseAdmin.from("audit_logs").insert([
      {
        entity_type: "transaction",
        entity_id: transaction.id,
        action: "create",
        changes: data,
        performed_by: session.user.id,
        performed_at: new Date().toISOString()
      }
    ])

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create transaction" },
      { status: 500 }
    )
  }
}

// Update transaction status
export async function PUT(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { id, status, notes } = data

    const { data: transaction, error } = await supabaseAdmin
      .from("transactions")
      .update({
        status,
        notes,
        updated_by: session.user.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log the update in audit logs
    await supabaseAdmin.from("audit_logs").insert([
      {
        entity_type: "transaction",
        entity_id: id,
        action: "update",
        changes: { status, notes },
        performed_by: session.user.id,
        performed_at: new Date().toISOString()
      }
    ])

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update transaction" },
      { status: 500 }
    )
  }
}

// Delete transaction
export async function DELETE(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    // Check if transaction can be deleted (only pending transactions)
    const { data: existingTransaction, error: checkError } = await supabaseAdmin
      .from("transactions")
      .select("status")
      .eq("id", id)
      .single()

    if (checkError) {
      throw checkError
    }

    if (!existingTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (existingTransaction.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending transactions can be deleted" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from("transactions").delete().eq("id", id)

    if (error) {
      throw error
    }

    // Log the deletion in audit logs
    await supabaseAdmin.from("audit_logs").insert([
      {
        entity_type: "transaction",
        entity_id: id,
        action: "delete",
        performed_by: session.user.id,
        performed_at: new Date().toISOString()
      }
    ])

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete transaction" },
      { status: 500 }
    )
  }
} 