import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createNotification } from '@/lib/notifications/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface JarCreateData {
  name: string;
  description: string;
  minimum_investment: number;
  maximum_investment: number | null;
  early_withdrawal_penalty: number | null;
  term_months: number;
  interest_rate: number;
  is_active: boolean;
  icon_name: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function POST(request: Request) {
  try {
    // Get the session with admin check
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 })
    }

    // Check if user has admin or super_admin role
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', session.user.id)
      .single()

    if (adminError || !adminUser || !['admin', 'super_admin'].includes(adminUser.role)) {
      console.error('Admin user/role error:', adminError)
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const data = await request.json()

    // Handle icon upload if provided
    let iconName = 'piggy-bank'
    if (data.iconType === 'upload' && data.iconFile) {
      try {
        const file = data.iconFile
        const fileExt = file.name.split('.').pop()?.toLowerCase()

        // Validate file extension
        if (!fileExt || !['png', 'svg'].includes(fileExt)) {
          throw new Error('Only PNG and SVG files are allowed')
        }

        const fileName = `jar-icons/${Date.now()}.${fileExt}`

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: fileExt === 'png' ? 'image/png' : 'image/svg+xml'
          })

        if (uploadError) throw uploadError

        // Set custom icon name
        iconName = fileName
      } catch (error) {
        console.error('Error uploading icon:', error)
        // Continue with default icon if upload fails
        iconName = 'piggy-bank'
      }
    }

    // Prepare jar data
    const newJarData: JarCreateData = {
      name: data.name,
      description: data.description,
      minimum_investment: data.minimumAmount,
      maximum_investment: data.maximumAmount || null,
      early_withdrawal_penalty: data.earlyWithdrawalPenalty || null,
      term_months: data.termMonths,
      interest_rate: data.interestRate,
      is_active: data.status,
      icon_name: iconName,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newJar, error } = await supabase
      .from('jars')
      .insert([newJarData])
      .select()
      .single()

    if (error) {
      console.error('Error creating jar:', error)
      return NextResponse.json(
        { error: error?.message || JSON.stringify(error) || 'Internal Server Error' },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Log the creation in audit logs
    await supabase
      .from('audit_logs')
      .insert([{
        entity_type: 'jar',
        entity_id: newJar.id,
        action: 'create',
        changes: newJarData,
        performed_by: session.user.id,
        performed_at: new Date().toISOString()
      }])

    // Send notification to admin
    await createNotification({
      title: 'New Investment Jar Created',
      message: `A new investment jar "${data.name}" has been created with ${data.interestRate}% APY.`,
      type: 'investment',
      priority: 'medium',
      recipientId: session.user.id,
      metadata: {
        jarId: newJar.id,
        jarName: newJar.name,
        apy: data.interestRate
      }
    })

    return NextResponse.json(
      { jar: newJar },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Error creating jar:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) || 'Internal Server Error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 