import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

// GET: List tickets for the logged-in customer
export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Only fetch tickets for this customer
    const { data: tickets, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('customer_id', session.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

// POST: Create a new support ticket
export async function POST(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const { subject, description, priority, category } = data
    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert([
        {
          customer_id: session.user.id,
          subject,
          description,
          priority: priority || 'medium',
          category,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}

// PUT: Add a reply (message) to a ticket
export async function PUT(request: Request) {
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
          sender_type: 'customer',
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
    console.error('Error adding reply:', error)
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 })
  }
} 