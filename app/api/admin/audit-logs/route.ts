import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
  const action = searchParams.get('action')
  const user = searchParams.get('user')
  const resource = searchParams.get('resource')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const search = searchParams.get('search')
  const distinct = searchParams.get('distinct')

  if (distinct) {
    // Only allow certain fields for security
    const allowed = ['action', 'resource', 'user_name', 'userName']
    if (!allowed.includes(distinct)) {
      return NextResponse.json({ error: 'Invalid distinct field' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin.from('audit_logs').select(`${distinct}`).neq(distinct, '').order(distinct, { ascending: true })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    // Return unique values only
    const unique = Array.from(new Set((data || []).map((row: any) => row[distinct]))).filter(Boolean)
    return NextResponse.json({ values: unique })
  }

  let query = supabaseAdmin.from('audit_logs').select('*', { count: 'exact' })

  if (action) query = query.eq('action', action)
  if (user) query = query.or(`userName.eq.${user},user_name.eq.${user}`)
  if (resource) query = query.eq('resource', resource)
  if (start) query = query.gte('performed_at', start)
  if (end) query = query.lte('performed_at', end)
  if (search) {
    query = query.or(`details.ilike.%${search}%,action.ilike.%${search}%,userName.ilike.%${search}%,user_name.ilike.%${search}%,resource.ilike.%${search}%`)
  }

  query = query.order('performed_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, error, count } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ logs: data, total: count })
} 