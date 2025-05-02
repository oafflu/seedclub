import { NextResponse } from "next/server"
import { customerService } from "@/lib/services/customer.service"

export async function GET() {
  try {
    const customers = await customerService.getCustomers()
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
    const customer = await customerService.createCustomer(data)
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
    const customer = await customerService.updateCustomer(id, updateData)
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
    await customerService.deleteCustomer(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete customer" },
      { status: 500 }
    )
  }
} 