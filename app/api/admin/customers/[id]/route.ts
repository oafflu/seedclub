import { NextResponse } from "next/server"
import { customerService } from "@/lib/services/customer.service"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await customerService.getCustomerById(params.id)
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(customer)
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
  try {
    const data = await request.json()
    const customer = await customerService.updateCustomer(params.id, data)
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
  try {
    await customerService.deleteCustomer(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete customer" },
      { status: 500 }
    )
  }
} 