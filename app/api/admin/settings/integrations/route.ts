import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { createNotification } from '@/lib/notifications/server'

export const dynamic = 'force-dynamic'

interface IntegrationSettings {
  stripe?: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    paymentMethods: {
      cards: boolean;
      ach: boolean;
      sepa: boolean;
    };
  };
  twilio?: {
    enabled: boolean;
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  recaptcha?: {
    enabled: boolean;
    siteKey: string;
    secretKey: string;
  };
  pusher?: {
    enabled: boolean;
    appId: string;
    key: string;
    secret: string;
    cluster: string;
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('integration_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error
    }

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Failed to fetch integration settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integration settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const settings: IntegrationSettings = await request.json()

    // Validate settings here if needed
    if (!settings) {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // Update or insert settings
    const { error } = await supabaseAdmin
      .from('integration_settings')
      .upsert({
        stripe_config: settings.stripe,
        twilio_config: settings.twilio,
        recaptcha_config: settings.recaptcha,
        pusher_config: settings.pusher,
        updated_at: new Date().toISOString()
      })

    if (error) throw error

    // Log the update in audit logs
    await supabaseAdmin
      .from('audit_logs')
      .insert([{
        entity_type: 'settings',
        entity_id: 'integrations',
        action: 'update',
        changes: settings,
        performed_at: new Date().toISOString()
      }])

    // Create admin notification
    const session = await getSession(true)
    if (session?.user) {
      await createNotification({
        title: 'Integration Settings Updated',
        message: 'Integration settings were updated.',
        type: 'system',
        priority: 'medium',
        recipientId: session.user.id
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save integration settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save integration settings' },
      { status: 500 }
    )
  }
} 