import { NextResponse } from "next/server"
import { customerService } from "@/lib/services/customer.service"
import { sendEmail } from "@/lib/email/send-email"

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json()
    
    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    const customer = await customerService.getCustomerById(customerId)
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Send email to customer
    await sendEmail({
      to: customer.email,
      subject: "Message from Seed Club",
      template: "customer-notification",
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    })

    return NextResponse.json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    )
  }
} 