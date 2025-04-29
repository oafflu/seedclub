import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'

export interface NotificationSettings {
  email_notifications: {
    customer_registrations: boolean;
    large_deposits: boolean;
    large_withdrawals: boolean;
    new_support_tickets: boolean;
    welcome_email: boolean;
    deposit_confirmation: boolean;
    withdrawal_confirmation: boolean;
    interest_payment: boolean;
    jar_maturity: boolean;
  };
  sms_notifications: {
    enabled: boolean;
    security_alerts: boolean;
    transaction_confirmations: boolean;
    marketing_messages: boolean;
  };
  push_notifications: {
    enabled: boolean;
  };
}

const defaultSettings: NotificationSettings = {
  email_notifications: {
    customer_registrations: true,
    large_deposits: true,
    large_withdrawals: true,
    new_support_tickets: true,
    welcome_email: true,
    deposit_confirmation: true,
    withdrawal_confirmation: true,
    interest_payment: true,
    jar_maturity: true
  },
  sms_notifications: {
    enabled: false,
    security_alerts: true,
    transaction_confirmations: true,
    marketing_messages: false
  },
  push_notifications: {
    enabled: true
  }
}

export function useNotificationSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadSettings()
    }
  }, [user?.id])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error
      }

      if (data) {
        setSettings(data)
      } else {
        // If no settings exist, create default settings
        const { error: insertError } = await supabase
          .from('notification_settings')
          .insert([
            {
              user_id: user?.id,
              ...defaultSettings
            }
          ])

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      }

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user?.id,
          ...updatedSettings
        })

      if (error) throw error

      setSettings(updatedSettings)
      return true
    } catch (error) {
      console.error('Error updating notification settings:', error)
      return false
    }
  }

  const shouldSendNotification = (type: keyof NotificationSettings['email_notifications'] | keyof NotificationSettings['sms_notifications']) => {
    if (type in settings.email_notifications) {
      return settings.email_notifications[type as keyof NotificationSettings['email_notifications']]
    }
    if (type in settings.sms_notifications) {
      return settings.sms_notifications[type as keyof NotificationSettings['sms_notifications']]
    }
    return false
  }

  return {
    settings,
    loading,
    updateSettings,
    shouldSendNotification
  }
} 