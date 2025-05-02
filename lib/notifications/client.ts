import { supabase } from '../supabase/client'
import { pusher } from '../pusher'
import { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from '../pusher'

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('recipient_id', userId)

    if (error) throw error

    // Trigger real-time update
    await pusher.trigger(
      `${NOTIFICATION_CHANNELS.ADMIN}-${userId}`,
      NOTIFICATION_EVENTS.UPDATE,
      { id: notificationId, read: true }
    )

    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error }
  }
}

export async function deleteNotification(notificationId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('recipient_id', userId)

    if (error) throw error

    // Trigger real-time update
    await pusher.trigger(
      `${NOTIFICATION_CHANNELS.ADMIN}-${userId}`,
      NOTIFICATION_EVENTS.DELETE,
      notificationId
    )

    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error }
  }
}

// Helper function to get formatted time
export function getTimeAgo(date: string | Date) {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return past.toLocaleDateString()
} 