import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

// GET: List/filter/sort support tickets
export async function GET(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigned = searchParams.get('assigned')
    const recent = searchParams.get('recent')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*, customer:customers(id, first_name, last_name, email), assigned_admin:admin_users(id, first_name, last_name, email)', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })

    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)
    if (assigned === 'unassigned') query = query.is('assigned_to', null)
    if (recent === '1') {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      query = query.gte('created_at', since)
    }
    if (search) {
      query = query.or(`subject.ilike.%${search}%,description.ilike.%${search}%,id.ilike.%${search}%`)
    }

    const { data: tickets, error } = await query
    if (error) {
      console.error('Supabase error (with join):', error)
      // Try fallback: fetch without join
      const fallback = await supabaseAdmin
        .from('support_tickets')
        .select('*')
        .order(sort, { ascending: order === 'asc' })
      console.error('Fallback query result:', fallback)
      if (fallback.error) {
        console.error('Supabase fallback error:', fallback.error)
        throw fallback.error
      }
      // Fetch all customers for mapping
      const customersRes = await supabaseAdmin
        .from('customers')
        .select('id, first_name, last_name, email')
      const customers = customersRes.data || []
      const customerMap = Object.fromEntries(
        customers.map(c => [c.id, c])
      )
      // Map customerName and customerEmail for each ticket
      const mappedTickets = (fallback.data || []).map((t) => ({
        ...t,
        customerName: customerMap[t.customer_id] ? `${customerMap[t.customer_id].first_name ?? ''} ${customerMap[t.customer_id].last_name ?? ''}`.trim() : '',
        customerEmail: customerMap[t.customer_id]?.email || '',
        customerId: t.customer_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        assignedTo: t.assigned_to,
      }))
      return NextResponse.json({ tickets: mappedTickets })
    }
    // Map customerName and customerEmail for each ticket, robust to missing customer
    const mappedTickets = (tickets || []).map((t) => ({
      ...t,
      customerName: t.customer ? `${t.customer.first_name ?? ''} ${t.customer.last_name ?? ''}`.trim() : '',
      customerEmail: t.customer ? t.customer.email : '',
      customerId: t.customer ? t.customer.id : t.customer_id,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      assignedTo: t.assigned_to,
      assignedAdmin: t.assigned_admin,
    }))
    console.log('API: mappedTickets', mappedTickets)
    return NextResponse.json({ tickets: mappedTickets })
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
    const { customer_id, subject, description, priority, category } = data
    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert([
        {
          customer_id,
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

// PUT: Update/assign/close a support ticket
export async function PUT(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const { id, status, priority, assigned_to, resolution } = data
    const update: any = { updated_at: new Date().toISOString() }
    if (status) update.status = status
    if (priority) update.priority = priority
    if (assigned_to !== undefined) update.assigned_to = assigned_to
    if (status === 'closed') update.closed_at = new Date().toISOString()
    if (resolution) update.resolution = resolution
    console.log('PUT /api/admin/support:', { id, status, priority, assigned_to, resolution, update })
    const { data: ticket, error, count } = await supabaseAdmin
      .from('support_tickets')
      .update(update)
      .eq('id', id)
      .select()
      .single()
    console.log('Update result:', { ticket, error, count })
    if (error) {
      console.error('Error updating ticket:', error)
      throw error
    }
    if (!ticket) {
      console.warn('No ticket updated for id:', id, 'with update:', update)
      return NextResponse.json({ error: 'No ticket updated. Check ticket ID and permissions.' }, { status: 400 })
    }
    // Fetch assigned admin info if assigned_to is set
    let assignedAdmin = null
    if (ticket?.assigned_to) {
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admin_users')
        .select('id, first_name, last_name, email')
        .eq('id', ticket.assigned_to)
        .single()
      if (!adminError) assignedAdmin = admin
    }
    console.log('Updated ticket:', ticket, 'Assigned admin:', assignedAdmin)
    return NextResponse.json({ ticket: { ...ticket, assignedAdmin } })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}

// DELETE: Remove a support ticket (optional)
export async function DELETE(request: Request) {
  try {
    const session = await getSession(true)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await request.json()
    const { error } = await supabaseAdmin.from('support_tickets').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 })
  }
} 