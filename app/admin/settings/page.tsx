"use client"

import { useState } from "react"
import { Save, RefreshCw, CheckCircle, Lock, Mail, Bell, DollarSign, Percent, Clock, CreditCard, Shield, Loader2, TestTube, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { usePusher } from '@/hooks/use-pusher'

interface GmailConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  refreshToken: string
  user: string
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [sendingTestNotification, setSendingTestNotification] = useState(false)

  // Stripe configuration state
  const [stripeConfig, setStripeConfig] = useState({
    enabled: true,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    paymentMethods: {
      cards: true,
      ach: false,
      sepa: false
    }
  })

  // Twilio configuration state
  const [twilioConfig, setTwilioConfig] = useState({
    enabled: false,
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
  })

  // reCAPTCHA configuration state
  const [recaptchaConfig, setRecaptchaConfig] = useState({
    enabled: true,
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || ''
  })

  // SMTP configuration state
  const [smtpConfig, setSmtpConfig] = useState({
    enabled: process.env.SMTP_ENABLED === 'true',
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || '587',
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  })

  // Gmail configuration state
  const [gmailConfig, setGmailConfig] = useState<GmailConfig>({
    enabled: process.env.GMAIL_ENABLED === 'true',
    clientId: process.env.GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
    user: process.env.GMAIL_USER || ''
  })

  // Microsoft configuration state
  const [microsoftConfig, setMicrosoftConfig] = useState({
    enabled: process.env.MICROSOFT_ENABLED === 'true',
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    refreshToken: process.env.MICROSOFT_REFRESH_TOKEN || '',
    user: process.env.MICROSOFT_USER || '',
    tenantId: process.env.MICROSOFT_TENANT_ID || ''
  })

  // Add Pusher configuration state
  const [pusherConfig, setPusherConfig] = useState({
    enabled: true,
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ''
  })

  // Initialize Pusher client for test notifications
  usePusher(pusherConfig)

  const handleStripeChange = (field: string, value: any) => {
    setStripeConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStripePaymentMethodChange = (method: keyof typeof stripeConfig.paymentMethods) => {
    setStripeConfig(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method]
      }
    }))
  }

  const handleTwilioChange = (field: string, value: any) => {
    setTwilioConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRecaptchaChange = (field: string, value: any) => {
    setRecaptchaConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSMTPChange = (field: string, value: any) => {
    setSmtpConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGmailChange = (field: string, value: any) => {
    setGmailConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMicrosoftChange = (field: string, value: any) => {
    setMicrosoftConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePusherChange = (field: string, value: any) => {
    setPusherConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTestPusherConnection = async () => {
    try {
      setTestingConnection(true)
      const response = await fetch('/api/admin/settings/pusher/test/connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pusherConfig)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Pusher connection test successful', {
          description: 'Your Pusher credentials are valid and working.'
        })
      } else {
        throw new Error(data.error || 'Connection test failed')
      }
    } catch (error) {
      console.error('Pusher connection test failed:', error)
      toast.error('Pusher connection test failed', {
        description: error instanceof Error ? error.message : 'Failed to test Pusher connection'
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSendTestNotification = async () => {
    try {
      setSendingTestNotification(true)
      const response = await fetch('/api/admin/settings/pusher/test/notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pusherConfig)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Test notification sent', {
          description: 'Check your Pusher debug console to see the test event.'
        })
      } else {
        throw new Error(data.error || 'Failed to send test notification')
      }
    } catch (error) {
      console.error('Failed to send test notification:', error)
      toast.error('Failed to send test notification', {
        description: error instanceof Error ? error.message : 'Could not send test notification'
      })
    } finally {
      setSendingTestNotification(false)
    }
  }

  const handleSaveIntegrations = async () => {
    try {
      setSaving(true)
      
      // Save Pusher settings
      const pusherResponse = await fetch('/api/admin/settings/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pusherConfig)
      })

      if (!pusherResponse.ok) {
        const error = await pusherResponse.json()
        throw new Error(error.message || 'Failed to save Pusher settings')
      }

      // Show success message for Pusher settings
      toast.success('Pusher settings saved successfully', {
        description: 'Your real-time notification settings have been updated.'
      })

      // Save other integration settings
      await Promise.all([
        fetch('/api/admin/settings/twilio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(twilioConfig)
        }).then(res => {
          if (res.ok) {
            toast.success('Twilio settings saved successfully', {
              description: 'Your SMS notification settings have been updated.'
            })
          }
          return res
        }),
        fetch('/api/admin/settings/recaptcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recaptchaConfig)
        }).then(res => {
          if (res.ok) {
            toast.success('reCAPTCHA settings saved successfully', {
              description: 'Your bot protection settings have been updated.'
            })
          }
          return res
        })
      ])

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving integration settings:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save integration settings', {
        description: 'Please try again or contact support if the issue persists.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveStripeSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stripeConfig)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save Stripe settings')
      }
      
      toast.success('Stripe settings saved successfully', {
        description: 'Your payment gateway settings have been updated.'
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving Stripe settings:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save Stripe settings', {
        description: 'Please try again or contact support if the issue persists.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const responses = await Promise.all([
        fetch('/api/admin/settings/smtp', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(smtpConfig) 
        }).then(res => {
          if (res.ok) {
            toast.success('SMTP settings saved successfully', {
              description: 'Your email server settings have been updated.'
            })
          }
          return res
        }),
        fetch('/api/admin/settings/gmail', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gmailConfig) 
        }).then(res => {
          if (res.ok) {
            toast.success('Gmail settings saved successfully', {
              description: 'Your Gmail integration settings have been updated.'
            })
          }
          return res
        }),
        fetch('/api/admin/settings/microsoft', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(microsoftConfig) 
        }).then(res => {
          if (res.ok) {
            toast.success('Microsoft settings saved successfully', {
              description: 'Your Microsoft 365 integration settings have been updated.'
            })
          }
          return res
        })
      ])

      // Check if any requests failed
      const failedRequests = responses.filter(res => !res.ok)
      if (failedRequests.length > 0) {
        throw new Error('Some settings failed to save')
      }

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save settings', {
        description: 'Please try again or contact support if the issue persists.'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      {savedSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="Seed Club" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@seedclub.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="UTC-5">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="platform-description">Platform Description</Label>
                <Textarea
                  id="platform-description"
                  defaultValue="Seed Club helps you grow your wealth through smart investments in time-bound jars with guaranteed returns."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance-mode" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Maintenance Mode</span>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to prevent users from accessing the platform
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure regional and localization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="default-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger id="default-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-format">Number Format</Label>
                  <Select defaultValue="1,234.56">
                    <SelectTrigger id="number-format">
                      <SelectValue placeholder="Select number format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1,234.56">1,234.56 (US)</SelectItem>
                      <SelectItem value="1.234,56">1.234,56 (EU)</SelectItem>
                      <SelectItem value="1 234.56">1 234.56 (Space)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Settings */}
        <TabsContent value="investment" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Jar Settings</CardTitle>
              <CardDescription>Configure investment jar options and rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">12-Month Jar</h3>
                    <Badge variant="outline" className="text-primary border-primary">
                      Short Term
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="12-month-apy">APY Rate (%)</Label>
                      <div className="relative">
                        <Input id="12-month-apy" defaultValue="12" type="number" min="0" max="100" step="0.1" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="12-month-min">Minimum Investment</Label>
                      <div className="relative">
                        <Input id="12-month-min" defaultValue="1000" type="number" min="0" step="100" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="12-month-early">Early Withdrawal Fee (%)</Label>
                      <div className="relative">
                        <Input id="12-month-early" defaultValue="2" type="number" min="0" max="100" step="0.1" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="12-month-status" className="flex items-center justify-between">
                      <span>Active</span>
                      <Switch id="12-month-status" defaultChecked />
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">24-Month Jar</h3>
                    <Badge variant="outline" className="text-primary border-primary">
                      Medium Term
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="24-month-apy">APY Rate (%)</Label>
                      <div className="relative">
                        <Input id="24-month-apy" defaultValue="14" type="number" min="0" max="100" step="0.1" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="24-month-min">Minimum Investment</Label>
                      <div className="relative">
                        <Input id="24-month-min" defaultValue="2500" type="number" min="0" step="100" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="24-month-early">Early Withdrawal Fee (%)</Label>
                      <div className="relative">
                        <Input id="24-month-early" defaultValue="3" type="number" min="0" max="100" step="0.1" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="24-month-status" className="flex items-center justify-between">
                      <span>Active</span>
                      <Switch id="24-month-status" defaultChecked />
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">36-Month Jar</h3>
                    <Badge variant="outline" className="text-primary border-primary">
                      Long Term
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="36-month-apy">APY Rate (%)</Label>
                      <div className="relative">
                        <Input id="36-month-apy" defaultValue="16" type="number" min="0" max="100" step="0.1" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="36-month-min">Minimum Investment</Label>
                      <div className="relative">
                        <Input id="36-month-min" defaultValue="5000" type="number" min="0" step="100" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="36-month-early">Early Withdrawal Fee (%)</Label>
                      <div className="relative">
                        <Input id="36-month-early" defaultValue="4" type="number" min="0" max="100" step="0.1" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="36-month-status" className="flex items-center justify-between">
                      <span>Active</span>
                      <Switch id="36-month-status" defaultChecked />
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interest Settings</CardTitle>
              <CardDescription>Configure interest calculation and payout settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interest-calculation">Interest Calculation Method</Label>
                  <Select defaultValue="compound">
                    <SelectTrigger id="interest-calculation">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple Interest</SelectItem>
                      <SelectItem value="compound">Compound Interest</SelectItem>
                      <SelectItem value="daily">Daily Compound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest-frequency">Interest Payout Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="interest-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="maturity">At Maturity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-reinvest" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Allow Auto-Reinvestment</span>
                    <p className="text-sm text-muted-foreground">
                      Allow users to automatically reinvest earned interest
                    </p>
                  </div>
                  <Switch id="auto-reinvest" defaultChecked />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="early-withdrawal" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Allow Early Withdrawals</span>
                    <p className="text-sm text-muted-foreground">
                      Allow users to withdraw funds before maturity (with penalty)
                    </p>
                  </div>
                  <Switch id="early-withdrawal" defaultChecked />
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure user authentication and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="two-factor" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Require Two-Factor Authentication</span>
                    <p className="text-sm text-muted-foreground">Force all users to set up 2FA for their accounts</p>
                  </div>
                  <Switch id="two-factor" defaultChecked />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-expiry" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Password Expiry</span>
                    <p className="text-sm text-muted-foreground">Force users to change their password periodically</p>
                  </div>
                  <Switch id="password-expiry" />
                </Label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password-expiry-days">Password Expiry Days</Label>
                  <div className="relative">
                    <Input id="password-expiry-days" defaultValue="90" type="number" min="1" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <div className="relative">
                    <Input id="session-timeout" defaultValue="30" type="number" min="1" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input id="max-login-attempts" defaultValue="5" type="number" min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                  <div className="relative">
                    <Input id="lockout-duration" defaultValue="30" type="number" min="1" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-restriction" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>IP Address Restriction</span>
                    <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses</p>
                  </div>
                  <Switch id="ip-restriction" />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                <Textarea id="allowed-ips" placeholder="Enter IP addresses, one per line" rows={3} />
                <p className="text-xs text-muted-foreground">
                  Enter one IP address or CIDR range per line (e.g., 192.168.1.1 or 192.168.1.0/24)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KYC and Compliance</CardTitle>
              <CardDescription>Configure Know Your Customer and compliance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kyc-required" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Require KYC Verification</span>
                    <p className="text-sm text-muted-foreground">
                      Require users to complete KYC verification before investing
                    </p>
                  </div>
                  <Switch id="kyc-required" defaultChecked />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kyc-investment-limit" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Investment Limit Without KYC</span>
                    <p className="text-sm text-muted-foreground">
                      Maximum investment amount allowed without KYC verification
                    </p>
                  </div>
                  <div className="relative w-32">
                    <Input id="kyc-investment-limit" defaultValue="1000" type="number" min="0" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aml-screening" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>AML Screening</span>
                    <p className="text-sm text-muted-foreground">
                      Enable Anti-Money Laundering screening for transactions
                    </p>
                  </div>
                  <Switch id="aml-screening" defaultChecked />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suspicious-threshold" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Suspicious Transaction Threshold</span>
                    <p className="text-sm text-muted-foreground">Flag transactions above this amount for review</p>
                  </div>
                  <div className="relative w-32">
                    <Input id="suspicious-threshold" defaultValue="10000" type="number" min="0" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure system email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-from">From Email Address</Label>
                <Input id="email-from" defaultValue="notifications@seedclub.com" type="email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-reply-to">Reply-To Email Address</Label>
                <Input id="email-reply-to" defaultValue="support@seedclub.com" type="email" />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Admin Notifications</h3>
                <div className="space-y-2">
                  <Label htmlFor="admin-new-user" className="flex items-center justify-between">
                    <span>New User Registration</span>
                    <Switch id="admin-new-user" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-large-deposit" className="flex items-center justify-between">
                    <span>Large Deposits</span>
                    <Switch id="admin-large-deposit" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-large-withdrawal" className="flex items-center justify-between">
                    <span>Large Withdrawals</span>
                    <Switch id="admin-large-withdrawal" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-support-ticket" className="flex items-center justify-between">
                    <span>New Support Tickets</span>
                    <Switch id="admin-support-ticket" defaultChecked />
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Customer Notifications</h3>
                <div className="space-y-2">
                  <Label htmlFor="customer-welcome" className="flex items-center justify-between">
                    <span>Welcome Email</span>
                    <Switch id="customer-welcome" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-deposit" className="flex items-center justify-between">
                    <span>Deposit Confirmation</span>
                    <Switch id="customer-deposit" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-withdrawal" className="flex items-center justify-between">
                    <span>Withdrawal Confirmation</span>
                    <Switch id="customer-withdrawal" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-interest" className="flex items-center justify-between">
                    <span>Interest Payment</span>
                    <Switch id="customer-interest" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-maturity" className="flex items-center justify-between">
                    <span>Jar Maturity Reminder</span>
                    <Switch id="customer-maturity" defaultChecked />
                  </Label>
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
                <Label htmlFor="sms-enabled" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Enable SMS Notifications</span>
                    <p className="text-sm text-muted-foreground">Send important notifications via SMS</p>
                  </div>
                  <Switch id="sms-enabled" />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <Select defaultValue="twilio">
                  <SelectTrigger id="sms-provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    <SelectItem value="messagebird">MessageBird</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">SMS Notification Types</h3>
                <div className="space-y-2">
                  <Label htmlFor="sms-security" className="flex items-center justify-between">
                    <span>Security Alerts</span>
                    <Switch id="sms-security" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-transaction" className="flex items-center justify-between">
                    <span>Transaction Confirmations</span>
                    <Switch id="sms-transaction" defaultChecked />
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-marketing" className="flex items-center justify-between">
                    <span>Marketing Messages</span>
                    <Switch id="sms-marketing" />
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure payment gateway integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Credit card and bank transfer processing</p>
                    </div>
                  </div>
                  <Switch
                    id="stripe-enabled"
                    checked={stripeConfig.enabled}
                    onCheckedChange={(checked) => handleStripeChange('enabled', checked)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-public-key">Publishable Key</Label>
                    <Input
                      id="stripe-public-key"
                      type="text"
                      placeholder="pk_test_..."
                      value={stripeConfig.publishableKey}
                      onChange={(e) => handleStripeChange('publishableKey', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your Stripe publishable key (starts with pk_)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Secret Key</Label>
                    <Input
                      id="stripe-secret-key"
                      type="password"
                      placeholder="sk_test_..."
                      value={stripeConfig.secretKey}
                      onChange={(e) => handleStripeChange('secretKey', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your Stripe secret key (starts with sk_)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                  <Input
                    id="stripe-webhook-secret"
                    type="password"
                    placeholder="whsec_..."
                    value={stripeConfig.webhookSecret}
                    onChange={(e) => handleStripeChange('webhookSecret', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your Stripe webhook signing secret (starts with whsec_)
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Payment Methods</h4>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-cards" className="flex items-center justify-between">
                      <span>Credit & Debit Cards</span>
                      <Switch
                        id="stripe-cards"
                        checked={stripeConfig.paymentMethods.cards}
                        onCheckedChange={() => handleStripePaymentMethodChange('cards')}
                      />
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-ach" className="flex items-center justify-between">
                      <span>ACH Direct Debit (US)</span>
                      <Switch
                        id="stripe-ach"
                        checked={stripeConfig.paymentMethods.ach}
                        onCheckedChange={() => handleStripePaymentMethodChange('ach')}
                      />
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-sepa" className="flex items-center justify-between">
                      <span>SEPA Direct Debit (EU)</span>
                      <Switch
                        id="stripe-sepa"
                        checked={stripeConfig.paymentMethods.sepa}
                        onCheckedChange={() => handleStripePaymentMethodChange('sepa')}
                      />
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Webhook Endpoint</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <code className="text-sm break-all">
                      {`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this URL in your Stripe Dashboard webhook settings
                  </p>
                </div>

                <Button
                  onClick={handleSaveStripeSettings}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Stripe Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="smtp-enabled"
                  checked={smtpConfig.enabled}
                  onCheckedChange={(checked) => handleSMTPChange('enabled', checked)}
                />
                <Label htmlFor="smtp-enabled">Enable SMTP</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    value={smtpConfig.host}
                    onChange={(e) => handleSMTPChange('host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={smtpConfig.port}
                    onChange={(e) => handleSMTPChange('port', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-secure">Use SSL/TLS</Label>
                  <Switch
                    id="smtp-secure"
                    checked={smtpConfig.secure}
                    onCheckedChange={(checked) => handleSMTPChange('secure', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Username</Label>
                  <Input
                    id="smtp-user"
                    value={smtpConfig.user}
                    onChange={(e) => handleSMTPChange('user', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">Password</Label>
                  <Input
                    id="smtp-pass"
                    type="password"
                    value={smtpConfig.pass}
                    onChange={(e) => handleSMTPChange('pass', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gmail Configuration</CardTitle>
              <CardDescription>Configure Gmail API settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gmail-enabled"
                  checked={gmailConfig.enabled}
                  onCheckedChange={(checked) => handleGmailChange('enabled', checked)}
                />
                <Label htmlFor="gmail-enabled">Enable Gmail</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gmail-client-id">Client ID</Label>
                  <Input
                    id="gmail-client-id"
                    value={gmailConfig.clientId}
                    onChange={(e) => handleGmailChange('clientId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gmail-client-secret">Client Secret</Label>
                  <Input
                    id="gmail-client-secret"
                    type="password"
                    value={gmailConfig.clientSecret}
                    onChange={(e) => handleGmailChange('clientSecret', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gmail-refresh-token">Refresh Token</Label>
                  <Input
                    id="gmail-refresh-token"
                    type="password"
                    value={gmailConfig.refreshToken}
                    onChange={(e) => handleGmailChange('refreshToken', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gmail-user">Gmail Address</Label>
                  <Input
                    id="gmail-user"
                    type="email"
                    value={gmailConfig.user}
                    onChange={(e) => handleGmailChange('user', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Microsoft Configuration</CardTitle>
              <CardDescription>Configure Microsoft 365 API settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="microsoft-enabled"
                  checked={microsoftConfig.enabled}
                  onCheckedChange={(checked) => handleMicrosoftChange('enabled', checked)}
                />
                <Label htmlFor="microsoft-enabled">Enable Microsoft 365</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="microsoft-client-id">Client ID</Label>
                  <Input
                    id="microsoft-client-id"
                    value={microsoftConfig.clientId}
                    onChange={(e) => handleMicrosoftChange('clientId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="microsoft-client-secret">Client Secret</Label>
                  <Input
                    id="microsoft-client-secret"
                    type="password"
                    value={microsoftConfig.clientSecret}
                    onChange={(e) => handleMicrosoftChange('clientSecret', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="microsoft-tenant-id">Tenant ID</Label>
                  <Input
                    id="microsoft-tenant-id"
                    value={microsoftConfig.tenantId}
                    onChange={(e) => handleMicrosoftChange('tenantId', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twilio Configuration</CardTitle>
              <CardDescription>Configure Twilio API settings for sending SMS notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="twilio-enabled"
                  checked={twilioConfig.enabled}
                  onCheckedChange={(checked) => handleTwilioChange('enabled', checked)}
                />
                <Label htmlFor="twilio-enabled">Enable Twilio</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twilio-account-sid">Account SID</Label>
                  <Input
                    id="twilio-account-sid"
                    value={twilioConfig.accountSid}
                    onChange={(e) => handleTwilioChange('accountSid', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-auth-token">Auth Token</Label>
                  <Input
                    id="twilio-auth-token"
                    type="password"
                    value={twilioConfig.authToken}
                    onChange={(e) => handleTwilioChange('authToken', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-phone-number">Phone Number</Label>
                  <Input
                    id="twilio-phone-number"
                    value={twilioConfig.phoneNumber}
                    onChange={(e) => handleTwilioChange('phoneNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>reCAPTCHA Configuration</CardTitle>
              <CardDescription>Configure reCAPTCHA API settings for bot protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recaptcha-enabled"
                  checked={recaptchaConfig.enabled}
                  onCheckedChange={(checked) => handleRecaptchaChange('enabled', checked)}
                />
                <Label htmlFor="recaptcha-enabled">Enable reCAPTCHA</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recaptcha-site-key">Site Key</Label>
                  <Input
                    id="recaptcha-site-key"
                    value={recaptchaConfig.siteKey}
                    onChange={(e) => handleRecaptchaChange('siteKey', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recaptcha-secret-key">Secret Key</Label>
                  <Input
                    id="recaptcha-secret-key"
                    type="password"
                    value={recaptchaConfig.secretKey}
                    onChange={(e) => handleRecaptchaChange('secretKey', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pusher Configuration</CardTitle>
              <CardDescription>Configure Pusher API settings for real-time notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pusher-enabled"
                  checked={pusherConfig.enabled}
                  onCheckedChange={(checked) => handlePusherChange('enabled', checked)}
                />
                <Label htmlFor="pusher-enabled">Enable Pusher</Label>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pusher-app-id">App ID</Label>
                  <Input
                    id="pusher-app-id"
                    value={pusherConfig.appId}
                    onChange={(e) => handlePusherChange('appId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pusher-key">Key</Label>
                  <Input
                    id="pusher-key"
                    value={pusherConfig.key}
                    onChange={(e) => handlePusherChange('key', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pusher-secret">Secret</Label>
                  <Input
                    id="pusher-secret"
                    type="password"
                    value={pusherConfig.secret}
                    onChange={(e) => handlePusherChange('secret', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pusher-cluster">Cluster</Label>
                  <Select 
                    value={pusherConfig.cluster}
                    onValueChange={(value) => handlePusherChange('cluster', value)}
                  >
                    <SelectTrigger id="pusher-cluster">
                      <SelectValue placeholder="Select cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mt1">mt1 (US East)</SelectItem>
                      <SelectItem value="us2">us2 (US West)</SelectItem>
                      <SelectItem value="us3">us3 (US Central)</SelectItem>
                      <SelectItem value="eu">eu (Europe)</SelectItem>
                      <SelectItem value="ap1">ap1 (Asia Pacific)</SelectItem>
                      <SelectItem value="ap2">ap2 (Asia Pacific 2)</SelectItem>
                      <SelectItem value="ap3">ap3 (Asia Pacific 3)</SelectItem>
                      <SelectItem value="ap4">ap4 (Asia Pacific 4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleTestPusherConnection}
                  disabled={testingConnection || !pusherConfig.appId || !pusherConfig.key || !pusherConfig.secret || !pusherConfig.cluster}
                >
                  {testingConnection ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="mr-2 h-4 w-4" />
                  )}
                  Test Connection
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSendTestNotification}
                  disabled={sendingTestNotification || !pusherConfig.appId || !pusherConfig.key || !pusherConfig.secret || !pusherConfig.cluster}
                >
                  {sendingTestNotification ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BellRing className="mr-2 h-4 w-4" />
                  )}
                  Send Test Notification
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Webhook Endpoint</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <code className="text-sm break-all">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pusher`}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this URL in your Pusher Dashboard webhook settings
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveIntegrations}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Integration Settings'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
