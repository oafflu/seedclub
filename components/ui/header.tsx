"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { pusherClient, NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from "@/lib/pusher"

export function Header() {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id) return

    // Get initial unread count
    const fetchUnreadCount = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .eq('recipient_id', user.id)
          .eq('read', false)

        if (error) throw error
        setUnreadCount(data?.length || 0)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()

    // Subscribe to notifications
    const channel = pusherClient.subscribe(`${NOTIFICATION_CHANNELS.ADMIN}-${user.id}`)

    // Handle new notifications
    channel.bind(NOTIFICATION_EVENTS.NEW, () => {
      setUnreadCount(prev => prev + 1)
    })

    // Handle notification updates
    channel.bind(NOTIFICATION_EVENTS.UPDATE, (notification: any) => {
      if (notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    })

    return () => {
      pusherClient.unsubscribe(`${NOTIFICATION_CHANNELS.ADMIN}-${user.id}`)
    }
  }, [user?.id])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Seed Club</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 