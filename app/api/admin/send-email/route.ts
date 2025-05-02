import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/server/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, template, data } = body

    await sendEmail({
      to,
      subject,
      template,
      data
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 