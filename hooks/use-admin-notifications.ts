import { useState, useEffect, useCallback } from 'react'
import { pusherClient, NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from '@/lib/pusher'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import { toast } from 'sonner'

export function useAdminNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setNotifications(data || [])
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    fetchNotifications()
    const channel = pusherClient.subscribe(`${NOTIFICATION_CHANNELS.ADMIN}-${user.id}`)
    channel.bind(NOTIFICATION_EVENTS.NEW, (notification: any) => {
      setNotifications(prev => [notification, ...prev])
      toast(`New Notification: ${notification.title}`)
    })
    channel.bind(NOTIFICATION_EVENTS.UPDATE, (updatedNotification: any) => {
      setNotifications(prev => prev.map(n => (n.id === updatedNotification.id ? updatedNotification : n)))
    })
    channel.bind(NOTIFICATION_EVENTS.DELETE, (deletedId: string) => {
      setNotifications(prev => prev.filter(n => n.id !== deletedId))
    })
    return () => {
      pusherClient.unsubscribe(`${NOTIFICATION_CHANNELS.ADMIN}-${user.id}`)
    }
  }, [user?.id, fetchNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, unreadCount, loading, refetch: fetchNotifications }
} 