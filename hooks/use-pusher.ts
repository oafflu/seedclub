import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { toast } from 'sonner'

export function usePusher(config: {
  enabled: boolean
  appId: string
  key: string
  cluster: string
}) {
  const [pusher, setPusher] = useState<Pusher | null>(null)

  useEffect(() => {
    if (!config.enabled || !config.key || !config.cluster) {
      return
    }

    let pusherClient: Pusher | null = null;

    try {
      // Initialize Pusher client
      pusherClient = new Pusher(config.key, {
        cluster: config.cluster,
        forceTLS: true,
      })

      // Handle connection success
      pusherClient.connection.bind('connected', () => {
        console.log('Connected to Pusher')
      })

      // Handle connection errors
      pusherClient.connection.bind('error', (err: any) => {
        console.error('Pusher connection error:', err)
        if (err.error?.data?.code === 4004) {
          toast.error('Pusher Connection Error', {
            description: 'Invalid Pusher credentials. Please check your settings.'
          })
        } else {
          toast.error('Pusher Connection Error', {
            description: 'Failed to connect to Pusher. Please try again.'
          })
        }
      })

      // Subscribe to test channel
      const channel = pusherClient.subscribe('test-channel')
      
      // Listen for test notifications
      channel.bind('test-event', (data: { title: string; message: string }) => {
        toast.success(data.title, {
          description: data.message
        })
      })

      setPusher(pusherClient)
    } catch (error) {
      console.error('Error initializing Pusher:', error)
      toast.error('Pusher Initialization Error', {
        description: 'Failed to initialize Pusher client. Please check your settings.'
      })
    }

    // Cleanup on unmount or config change
    return () => {
      if (pusherClient) {
        try {
          const channel = pusherClient.channel('test-channel')
          if (channel) {
            channel.unbind_all()
            pusherClient.unsubscribe('test-channel')
          }
          pusherClient.disconnect()
        } catch (error) {
          console.error('Error cleaning up Pusher:', error)
        }
      }
    }
  }, [config.enabled, config.key, config.cluster])

  return pusher
} 