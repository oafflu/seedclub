import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

// GET: Fetch all messages for a ticket (admin)
export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const ticket_id = searchParams.get('ticket_id')
    if (!ticket_id) {
      return NextResponse.json({ error: 'Missing ticket_id' }, { status: 400 })
    }
    // Fetch messages
    const { data: messages, error } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticket_id)
      .order('created_at', { ascending: true })
    if (error) throw error
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages (admin):', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST: Add a message to a ticket as admin
export async function POST(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const { ticket_id, message } = data
    if (!ticket_id || !message) {
      return NextResponse.json({ error: 'Missing ticket_id or message' }, { status: 400 })
    }
    // Insert message
    const { data: msg, error } = await supabaseAdmin
      .from('support_messages')
      .insert([
        {
          ticket_id,
          sender_type: 'admin',
          sender_id: session.user.id,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()
    if (error) throw error
    // Update ticket updated_at
    await supabaseAdmin
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticket_id)
    return NextResponse.json({ message: msg }, { status: 201 })
  } catch (error) {
    console.error('Error adding admin message:', error)
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
  }
} 