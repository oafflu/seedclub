import { supabase } from './supabase/client'
import { pusher } from './pusher'
import { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from './pusher'
import { supabaseAdmin } from './supabase/server'

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
    const { error: dbError } = await supabaseAdmin
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

    if (dbError) throw dbError

    // Send real-time notification via Pusher
    await pusher.trigger(
      `${NOTIFICATION_CHANNELS.ADMIN}-${data.recipientId}`,
      NOTIFICATION_EVENTS.NEW,
      {
        ...data,
        read: false,
        created_at: new Date().toISOString()
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Error creating notification:', error)
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