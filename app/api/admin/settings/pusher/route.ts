import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

interface PusherConfig {
  enabled: boolean
  appId: string
  key: string
  secret: string
  cluster: string
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('pusher_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error
    }

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Failed to fetch Pusher settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pusher settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const settings: PusherConfig = await request.json()

    // Validate required fields
    if (!settings.appId || !settings.key || !settings.secret || !settings.cluster) {
      return NextResponse.json(
        { error: 'All Pusher configuration fields are required' },
        { status: 400 }
      )
    }

    // Update or insert Pusher settings
    const { error: upsertError } = await supabaseAdmin
      .from('pusher_settings')
      .upsert({
        enabled: settings.enabled,
        app_id: settings.appId,
        key: settings.key,
        secret: settings.secret,
        cluster: settings.cluster,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Failed to save Pusher settings:', upsertError)
      return NextResponse.json(
        { error: upsertError.message || 'Failed to save Pusher settings' },
        { status: 500 }
      )
    }

    // Log the update in audit logs
    await supabaseAdmin
      .from('audit_logs')
      .insert([{
        entity_type: 'settings',
        entity_id: 'pusher',
        action: 'update',
        changes: settings,
        performed_at: new Date().toISOString()
      }])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save Pusher settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save Pusher settings' },
      { status: 500 }
    )
  }
} 