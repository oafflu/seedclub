import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create a test notification
    const result = await createNotification({
      title: 'Test Notification',
      message: 'This is a test notification to verify the notification system is working.',
      type: 'system',
      priority: 'medium',
      recipientId: session.user.id,
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    })

    if (!result.success) {
      throw new Error(result.error || 'Failed to create test notification')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test notification created successfully'
    })
  } catch (error) {
    console.error('Error creating test notification:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create test notification'
      },
      { status: 500 }
    )
  }
} 