import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { data: jars, error } = await supabaseAdmin
      .from('jars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    return NextResponse.json(
      { jars },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { jarId } = await request.json()

    // Check if jar has any customer investments
    const { data: customerJars, error: checkError } = await supabaseAdmin
      .from('customer_jars')
      .select('id')
      .eq('jar_id', jarId)
      .limit(1)

    if (checkError) {
      return NextResponse.json(
        { error: checkError.message },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    if (customerJars && customerJars.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete jar with active investments' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    const { error } = await supabaseAdmin
      .from('jars')
      .delete()
      .eq('id', jarId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { jarId, is_active } = await request.json()

    const { error } = await supabaseAdmin
      .from('jars')
      .update({ 
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', jarId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 