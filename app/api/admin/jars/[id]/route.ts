import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface JarUpdateData {
  name: string;
  description: string;
  minimum_investment: number;
  maximum_investment: number | null;
  early_withdrawal_penalty: number | null;
  term_months: number;
  interest_rate: number;
  is_active: boolean;
  icon_name: string;
  updated_at: string;
}

// Get jar by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { data: jar, error } = await supabaseAdmin
      .from('jars')
      .select('*')
      .eq('id', params.id)
      .single()

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

    if (!jar) {
      return NextResponse.json(
        { error: 'Jar not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    return NextResponse.json(
      { jar },
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

// Update jar
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    try {
      const jarData = await request.json()

      // Handle icon based on type
      let iconName = jarData.iconName || 'PiggyBank'
      // If iconType is 'upload' and iconName is a URL, use it directly
      if (jarData.iconType === 'upload' && iconName && (iconName.startsWith('http://') || iconName.startsWith('https://'))) {
        // Use the provided public URL directly
        // No further action needed
      } else if (jarData.iconType === 'upload' && jarData.iconFile) {
        try {
          // Convert base64 to file
          const base64Data = jarData.iconFile.split(',')[1]
          const buffer = Buffer.from(base64Data, 'base64')
          let fileType = jarData.iconFile.split(';')[0].split('/')[1]
          // Accept svg+xml as svg
          if (fileType === 'svg+xml') fileType = 'svg'

          // Log fileType and fileName
          const fileName = `jar-icons/${params.id}-${Date.now()}.${fileType}`
          console.log('[DEBUG] fileType:', fileType, 'fileName:', fileName)

          // Validate file type
          if (!['png', 'svg', 'jpeg', 'jpg'].includes(fileType.toLowerCase())) {
            console.error('[DEBUG] Invalid file type:', fileType)
            return NextResponse.json(
              { error: `Only PNG, SVG, and JPEG files are allowed. Got: ${fileType}` },
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              }
            )
          }

          // Set correct content type for SVGs
          let contentType = `image/${fileType}`
          if (fileType === 'svg') contentType = 'image/svg+xml'

          // Upload to Supabase storage
          console.log('[DEBUG] Uploading to bucket: jar-icons, fileName:', fileName)
          const { error: uploadError } = await supabaseAdmin.storage
            .from('jar-icons')
            .upload(fileName, buffer, {
              cacheControl: '3600',
              upsert: true,
              contentType: contentType
            })

          if (uploadError) {
            console.error('[DEBUG] Upload error:', uploadError)
            return NextResponse.json(
              { error: uploadError.message || 'Failed to upload icon' },
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
              }
            )
          }

          // Get public URL
          console.log('[DEBUG] Getting public URL from bucket: jar-icons, fileName:', fileName)
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('jar-icons')
            .getPublicUrl(fileName)

          // Set custom icon name to the public URL
          iconName = publicUrl
        } catch (error) {
          console.error('Error uploading icon:', error)
          return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }
      }

      // Get admin user ID from session or use null
      let adminUserId = null
      try {
        // TODO: Replace with actual session handling
        // For now, we'll use null which is acceptable in the database
        adminUserId = null
      } catch (error) {
        console.error('Error getting admin user ID:', error)
      }

      // Prepare update data
      const updateData: JarUpdateData = {
        name: jarData.name,
        description: jarData.description,
        minimum_investment: jarData.minimumAmount,
        maximum_investment: jarData.maximumAmount || null,
        early_withdrawal_penalty: jarData.earlyWithdrawalPenalty || null,
        term_months: jarData.termMonths,
        interest_rate: jarData.interestRate,
        is_active: jarData.status,
        icon_name: iconName,
        updated_at: new Date().toISOString()
      }

      // If it's a custom icon URL from previous upload, keep using it
      if (jarData.iconType === 'default' && jarData.iconName.startsWith('http')) {
        // Delete the old icon file if it exists
        try {
          const oldFileName = jarData.iconName.split('/').pop()
          if (oldFileName && oldFileName.startsWith(params.id)) {
            console.log('[DEBUG] Removing file from bucket: jar-icons, fileName:', `jar-icons/${oldFileName}`)
            await supabaseAdmin.storage
              .from('jar-icons')
              .remove([`jar-icons/${oldFileName}`])
          }
        } catch (error) {
          console.error('Error deleting old icon:', error)
          // Continue even if deletion fails
        }
      }

      const { data: updatedJar, error } = await supabaseAdmin
        .from('jars')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single()

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

      // Log the update in audit logs
      await supabaseAdmin
        .from('audit_logs')
        .insert([{
          entity_type: 'jar',
          entity_id: params.id,
          action: 'update',
          changes: updateData,
          performed_by: adminUserId,
          performed_at: new Date().toISOString()
        }])

      return NextResponse.json(
        { jar: updatedJar },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    } catch (error) {
      console.error('Error updating jar (inner):', error)
      let errorMessage = 'Internal Server Error';
      if (error instanceof Error) {
        errorMessage = error.message + (error.stack ? ('\n' + error.stack) : '')
      } else if (typeof error === 'object') {
        try {
          errorMessage = JSON.stringify(error);
        } catch (e) {
          errorMessage = String(error);
        }
      } else {
        errorMessage = String(error);
      }
      return NextResponse.json(
        { error: errorMessage },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }
  } catch (error) {
    console.error('Error updating jar (outer):', error)
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message + (error.stack ? ('\n' + error.stack) : '')
    } else if (typeof error === 'object') {
      try {
        errorMessage = JSON.stringify(error);
      } catch (e) {
        errorMessage = String(error);
      }
    } else {
      errorMessage = String(error);
    }
    return NextResponse.json(
      { error: errorMessage },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 