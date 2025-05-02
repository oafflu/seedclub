import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('notification_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error

    return NextResponse.json(data || {
      email_notifications: {
        customer_registrations: 'all',
        transaction_alerts: 'all',
        system_alerts: 'all',
        support_tickets: 'all'
      },
      push_notifications: {
        enabled: 'enabled'
      },
      sms_notifications: {
        critical_alerts: 'enabled'
      }
    })
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await request.json()

    const { error } = await supabaseAdmin
      .from('notification_settings')
      .upsert({
        user_id: session.user.id,
        ...settings
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to save notification settings' },
      { status: 500 }
    )
  }
} 