import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { createNotification } from '@/lib/notifications/server'

const CATEGORY = 'investment'

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
    console.error('Failed to fetch investment settings:', error)
    return NextResponse.json({ error: 'Failed to fetch investment settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()
    const { error } = await supabaseAdmin
      .from('system_settings')
      .upsert({
        category: CATEGORY,
        settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'category' })
    if (error) throw error
    // Create admin notification
    const session = await getSession(true)
    if (session?.user) {
      await createNotification({
        title: 'Investment Settings Updated',
        message: 'Investment settings were updated.',
        type: 'investment',
        priority: 'medium',
        recipientId: session.user.id
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save investment settings:', error)
    return NextResponse.json({ error: 'Failed to save investment settings' }, { status: 500 })
  }
} 