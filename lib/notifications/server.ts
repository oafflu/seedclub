import { supabaseAdmin } from '../supabase/server'
import { pusher } from '../pusher'
import { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from '../pusher'

export type NotificationType = 'customer' | 'transaction' | 'system' | 'investment' | 'support' | 'kyc' | 'referral' | 'marketing'
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low'

export interface NotificationData {
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  recipientId: string
  metadata?: Record<string, any>
}

export async function createNotification(data: NotificationData) {
  try {
    // Save notification to database
    const { data: notification, error: dbError } = await supabaseAdmin
      .from('notifications')
      .insert({
        recipient_id: data.recipientId,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        read: false,
        metadata: data.metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Send real-time notification via Pusher
    await pusher.trigger(
      `${NOTIFICATION_CHANNELS.ADMIN}-${data.recipientId}`,
      NOTIFICATION_EVENTS.NEW,
      notification
    )

    return { success: true, notification }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error }
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('recipient_id', userId)
      .eq('read', false)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error }
  }
}

export async function deleteAllNotifications(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('recipient_id', userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting all notifications:', error)
    return { success: false, error }
  }
} 