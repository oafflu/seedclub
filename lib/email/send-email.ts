import { Resend } from "resend"
import { CustomerNotificationEmail } from "@/emails/customer-notification"
import { render } from "@react-email/render"

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  try {
    let html: string

    // Select email template
    switch (template) {
      case "customer-notification":
        html = render(CustomerNotificationEmail({ ...data }))
        break
      default:
        throw new Error(`Unknown email template: ${template}`)
    }

    // Send email using Resend
    const { data: result, error } = await resend.emails.send({
      from: "Seed Club <noreply@seedclub.com>",
      to,
      subject,
      html,
    })

    if (error) {
      throw error
    }

    return result
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
} 