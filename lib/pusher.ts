import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Client-side Pusher configuration using only public environment variables
const clientConfig = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
};

// Server-side Pusher configuration
const serverConfig = {
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
};

// Client-side Pusher instance
export const pusherClient = new PusherClient(clientConfig.key, {
  cluster: clientConfig.cluster,
});

// Server-side Pusher instance (only used in server components/API routes)
export const pusher = new Pusher(serverConfig);

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

// Helper function to trigger notifications (server-side only)
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