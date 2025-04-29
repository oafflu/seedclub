import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { EmailConfig } from '@/lib/email/config'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch email settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const settings: EmailConfig = await request.json()

    // Validate admin session here
    // TODO: Add middleware to check admin session

    // Update or insert email settings
    const { error } = await supabase
      .from('email_settings')
      .upsert({
        provider: settings.provider,
        active: settings.active,
        from_email: settings.from,
        smtp_config: settings.smtp,
        sendgrid_config: settings.sendgrid,
        gmail_config: settings.gmail,
        microsoft_config: settings.microsoft,
        updated_at: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save email settings:', error)
    return NextResponse.json(
      { error: 'Failed to save email settings' },
      { status: 500 }
    )
  }
} 