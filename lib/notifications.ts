import { supabase } from './supabase/client'
import { pusher } from './pusher'
import { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from './pusher'

interface NotificationOptions {
  title: string
  message: string
  type: string
  priority: string
  recipientId: string
  metadata?: Record<string, any>
}

export async function sendNotification(options: NotificationOptions) {
  try {
    // Get user's notification settings
    const { data: settings } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', options.recipientId)
      .single()

    // Create notification record
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([{
        title: options.title,
        message: options.message,
        type: options.type,
        priority: options.priority,
        recipient_id: options.recipientId,
        metadata: options.metadata || {}
      }])
      .select()
      .single()

    if (error) throw error

    // Check notification settings and send accordingly
    if (settings) {
      // Send push notification if enabled
      if (settings.push_notifications.enabled) {
        await pusher.trigger(
          `${NOTIFICATION_CHANNELS.ADMIN}-${options.recipientId}`,
          NOTIFICATION_EVENTS.NEW,
          notification
        )
      }

      // Send email notification if enabled for this type
      if (settings.email_notifications[options.type]) {
        // Implement email sending logic here
        // await sendEmail({ ... })
      }

      // Send SMS notification if enabled and it's a critical notification
      if (settings.sms_notifications.enabled && 
          settings.sms_notifications[options.type] && 
          options.priority === 'critical') {
        // Implement SMS sending logic here
        // await sendSMS({ ... })
      }
    }

    return notification
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

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
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
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
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
} 