import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    // Total customers
    const { count: totalCustomers } = await supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact', head: true })

    // Total value locked (sum of all customer_jars current_value)
    const { data: jarValues, error: jarError } = await supabaseAdmin
      .from('customer_jars')
      .select('current_value')
    const totalValueLocked = jarValues?.reduce((sum, j) => sum + (j.current_value || 0), 0) || 0

    // Active jars
    const { count: activeJars } = await supabaseAdmin
      .from('jars')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Average APY (average of all jars' apy field)
    const { data: jars, error: jarsError } = await supabaseAdmin
      .from('jars')
      .select('apy')
    const apys = jars?.map(j => j.apy).filter(Number.isFinite)
    const averageApy = apys && apys.length > 0 ? (apys.reduce((a, b) => a + b, 0) / apys.length) : 0

    // Overview chart data (monthly total value locked for last 7 months)
    const { data: monthly, error: monthlyError } = await supabaseAdmin.rpc('dashboard_monthly_tvl')
    // Fallback: use empty array if no RPC
    const overview = monthly || []

    // Recent activity (last 5 transactions)
    const { data: recent, error: recentError } = await supabaseAdmin
      .from('transactions')
      .select('id, amount, type, created_at, customer:customers(name), jar:jars(name)')
      .order('created_at', { ascending: false })
      .limit(5)

    // --- Analytics for Analytics Tab ---
    // Total invested (sum of all completed deposit transactions)
    const { data: depositTxs } = await supabaseAdmin
      .from('transactions')
      .select('amount, status, type')
      .eq('type', 'deposit')
      .eq('status', 'completed')
    const totalInvested = depositTxs?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

    // Monthly revenue (sum of all completed interest transactions for current month)
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const { data: interestTxs } = await supabaseAdmin
      .from('transactions')
      .select('amount, status, type, created_at')
      .eq('type', 'interest')
      .eq('status', 'completed')
      .gte('created_at', monthStart)
    const monthlyRevenue = interestTxs?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

    // Conversion rate (placeholder: totalCustomers / 100 for now)
    const conversionRate = totalCustomers ? Math.round((totalCustomers / 100) * 1000) / 10 : 0

    return NextResponse.json({
      totalCustomers,
      totalValueLocked,
      activeJars,
      averageApy,
      overview,
      recent,
      totalInvested,
      monthlyRevenue,
      conversionRate,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 })
  }
} 