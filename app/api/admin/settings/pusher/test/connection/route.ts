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

    // Try to authenticate - this will validate the credentials
    const socketId = '1234.1234' // Dummy socket ID for testing
    const channel = 'test-channel'
    
    try {
      await pusher.authorizeChannel(socketId, channel)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully connected to Pusher'
      })
    } catch (authError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid Pusher credentials'
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Failed to test Pusher connection:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Pusher'
      },
      { status: 500 }
    )
  }
} 