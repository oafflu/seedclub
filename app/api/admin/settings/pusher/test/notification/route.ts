import { NextResponse } from 'next/server'
import Pusher from 'pusher'

export async function POST(request: Request) {
  try {
    const settings = await request.json()

    // Validate required fields
    if (!settings.appId?.trim() || !settings.key?.trim() || !settings.secret?.trim() || !settings.cluster?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'All Pusher configuration fields are required'
        },
        { status: 400 }
      )
    }

    // Create a Pusher instance with the provided credentials
    const pusher = new Pusher({
      appId: settings.appId,
      key: settings.key,
      secret: settings.secret,
      cluster: settings.cluster,
      useTLS: true
    })

    // First verify the connection
    try {
      const socketId = '1234.1234' // Dummy socket ID for testing
      const channel = 'test-channel'
      await pusher.authorizeChannel(socketId, channel)
    } catch (authError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid Pusher credentials'
        },
        { status: 401 }
      )
    }

    // Send a test notification
    try {
      await pusher.trigger('test-channel', 'test-event', {
        title: 'Test Notification',
        message: 'This is a test notification from your Pusher configuration.',
        timestamp: new Date().toISOString()
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Test notification sent successfully'
      })
    } catch (triggerError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send notification. Please check your Pusher settings.'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Failed to send test notification:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test notification'
      },
      { status: 500 }
    )
  }
} 