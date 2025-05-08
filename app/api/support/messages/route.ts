import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

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
    // Check ticket ownership
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('id, customer_id')
      .eq('id', ticket_id)
      .single()
    if (ticketError || !ticket || ticket.customer_id !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
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
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
} 