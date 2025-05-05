import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { createNotification } from '@/lib/notifications/server'

const CATEGORY = 'general'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('settings')
      .eq('category', CATEGORY)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json(data?.settings || {})
  } catch (error) {
    console.error('Failed to fetch general settings:', error)
    return NextResponse.json({ error: 'Failed to fetch general settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()
    console.log('[General Settings API] Incoming payload:', settings)
    const { error } = await supabaseAdmin
      .from('system_settings')
      .upsert({
        category: CATEGORY,
        settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'category' })
    if (error) {
      if (error instanceof Error) {
        console.error('[General Settings API] Failed to save general settings:', error, error.stack)
      } else {
        console.error('[General Settings API] Failed to save general settings:', error)
      }
      throw error
    }
    // Create admin notification
    const session = await getSession(true)
    if (session?.user) {
      await createNotification({
        title: 'General Settings Updated',
        message: 'General settings were updated.',
        type: 'system',
        priority: 'medium',
        recipientId: session.user.id
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      console.error('[General Settings API] Failed to save general settings:', error, error.stack)
    } else {
      console.error('[General Settings API] Failed to save general settings:', error)
    }
    return NextResponse.json({ error: 'Failed to save general settings' }, { status: 500 })
  }
} 