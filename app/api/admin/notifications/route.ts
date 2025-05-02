import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'
import { markAllNotificationsAsRead, deleteAllNotifications } from '@/lib/notifications/server'

export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('recipient_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'markAllAsRead') {
      const result = await markAllNotificationsAsRead(session.user.id)
      if (!result.success) {
        throw new Error(result.error?.toString() || 'Failed to mark all notifications as read')
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in notifications API:', error)
    return NextResponse.json(
      { error: 'Failed to process notification action' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await deleteAllNotifications(session.user.id)
    if (!result.success) {
      throw new Error(result.error?.toString() || 'Failed to delete all notifications')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
} 