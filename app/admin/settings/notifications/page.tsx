"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useNotificationSettings } from "@/hooks/use-notification-settings"

export default function NotificationSettingsPage() {
  const { settings, loading, updateSettings } = useNotificationSettings()

  if (loading) {
    return <div>Loading settings...</div>
  }

  const handleEmailSettingChange = (key: keyof typeof settings.email_notifications) => {
    updateSettings({
      email_notifications: {
        ...settings.email_notifications,
        [key]: !settings.email_notifications[key]
      }
    }).then((success) => {
      if (success) {
        toast('Email notification settings updated')
      }
    })
  }

  const handleSMSSettingChange = (key: keyof typeof settings.sms_notifications) => {
    updateSettings({
      sms_notifications: {
        ...settings.sms_notifications,
        [key]: !settings.sms_notifications[key]
      }
    }).then((success) => {
      if (success) {
        toast('SMS notification settings updated')
      }
    })
  }

  const handlePushNotificationsChange = (enabled: boolean) => {
    updateSettings({
      push_notifications: { enabled }
    }).then((success) => {
      if (success) {
        toast('Push notification settings updated')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notification Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Configure system email notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Admin Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New User Registration</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications for new customer registrations</p>
                </div>
                <Switch
                  checked={settings.email_notifications.customer_registrations}
                  onCheckedChange={() => handleEmailSettingChange('customer_registrations')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Large Deposits</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications for large deposits</p>
                </div>
                <Switch
                  checked={settings.email_notifications.large_deposits}
                  onCheckedChange={() => handleEmailSettingChange('large_deposits')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Large Withdrawals</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications for large withdrawals</p>
                </div>
                <Switch
                  checked={settings.email_notifications.large_withdrawals}
                  onCheckedChange={() => handleEmailSettingChange('large_withdrawals')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Support Tickets</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications for new support tickets</p>
                </div>
                <Switch
                  checked={settings.email_notifications.new_support_tickets}
                  onCheckedChange={() => handleEmailSettingChange('new_support_tickets')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Customer Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Welcome Email</h4>
                  <p className="text-sm text-muted-foreground">Send welcome email to new customers</p>
                </div>
                <Switch
                  checked={settings.email_notifications.welcome_email}
                  onCheckedChange={() => handleEmailSettingChange('welcome_email')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Deposit Confirmation</h4>
                  <p className="text-sm text-muted-foreground">Send confirmation emails for deposits</p>
                </div>
                <Switch
                  checked={settings.email_notifications.deposit_confirmation}
                  onCheckedChange={() => handleEmailSettingChange('deposit_confirmation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Withdrawal Confirmation</h4>
                  <p className="text-sm text-muted-foreground">Send confirmation emails for withdrawals</p>
                </div>
                <Switch
                  checked={settings.email_notifications.withdrawal_confirmation}
                  onCheckedChange={() => handleEmailSettingChange('withdrawal_confirmation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Interest Payment</h4>
                  <p className="text-sm text-muted-foreground">Send notifications for interest payments</p>
                </div>
                <Switch
                  checked={settings.email_notifications.interest_payment}
                  onCheckedChange={() => handleEmailSettingChange('interest_payment')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Jar Maturity</h4>
                  <p className="text-sm text-muted-foreground">Send reminders for jar maturity</p>
                </div>
                <Switch
                  checked={settings.email_notifications.jar_maturity}
                  onCheckedChange={() => handleEmailSettingChange('jar_maturity')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>Configure system SMS notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">Send important notifications via SMS</p>
              </div>
              <Switch
                checked={settings.sms_notifications.enabled}
                onCheckedChange={(enabled) => handleSMSSettingChange('enabled')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Security Alerts</h4>
                <p className="text-sm text-muted-foreground">Receive SMS for security alerts</p>
              </div>
              <Switch
                checked={settings.sms_notifications.security_alerts}
                onCheckedChange={() => handleSMSSettingChange('security_alerts')}
                disabled={!settings.sms_notifications.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Transaction Confirmations</h4>
                <p className="text-sm text-muted-foreground">Receive SMS for transaction confirmations</p>
              </div>
              <Switch
                checked={settings.sms_notifications.transaction_confirmations}
                onCheckedChange={() => handleSMSSettingChange('transaction_confirmations')}
                disabled={!settings.sms_notifications.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Messages</h4>
                <p className="text-sm text-muted-foreground">Receive marketing messages via SMS</p>
              </div>
              <Switch
                checked={settings.sms_notifications.marketing_messages}
                onCheckedChange={() => handleSMSSettingChange('marketing_messages')}
                disabled={!settings.sms_notifications.enabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Configure browser push notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
              </div>
              <Switch
                checked={settings.push_notifications.enabled}
                onCheckedChange={(enabled) => handlePushNotificationsChange(enabled)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 