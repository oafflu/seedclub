import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);

// Notification channels
export const NOTIFICATION_CHANNELS = {
  ADMIN: 'admin-notifications',
  USER: 'user-notifications',
} as const;

// Notification events
export const NOTIFICATION_EVENTS = {
  NEW: 'new-notification',
  UPDATE: 'update-notification',
  DELETE: 'delete-notification',
} as const;

// Helper function to trigger notifications
export async function triggerNotification(notification: {
  type: string;
  title: string;
  message: string;
  priority: string;
  recipientId: string;
}) {
  try {
    await pusher.trigger(
      `${NOTIFICATION_CHANNELS.ADMIN}-${notification.recipientId}`,
      NOTIFICATION_EVENTS.NEW,
      notification
    );
  } catch (error) {
    console.error('Error triggering Pusher notification:', error);
  }
} 