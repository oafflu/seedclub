"use client"

import { useState, useEffect } from "react"
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

  // General, Investment, Security settings state
  const [generalSettings, setGeneralSettings] = useState({
    platformName: '',
    supportEmail: '',
    contactPhone: '',
    timezone: 'UTC-5',
    platformDescription: '',
    maintenanceMode: false,
    defaultCurrency: 'USD',
    defaultLanguage: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,234.56',
    adminNewUser: true,
    adminLargeDeposit: true,
    adminLargeWithdrawal: true,
    adminSupportTicket: true,
    customerWelcome: true,
    customerDeposit: true,
    customerWithdrawal: true,
    customerInterest: true,
    customerMaturity: true,
    smsEnabled: false,
    smsProvider: 'twilio',
    smsSecurity: true,
    smsTransaction: true,
    smsMarketing: false,
  })
  const [investmentSettings, setInvestmentSettings] = useState({
    jars: [
      { term: 12, apy: 12, min: 1000, earlyFee: 2, active: true },
      { term: 24, apy: 14, min: 2500, earlyFee: 3, active: true },
      { term: 36, apy: 16, min: 5000, earlyFee: 4, active: true },
    ],
    interest: {
      calculation: 'compound',
      frequency: 'monthly',
      autoReinvest: true,
      allowEarlyWithdrawal: true,
    },
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    passwordExpiry: false,
    passwordExpiryDays: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    ipRestriction: false,
    allowedIps: '',
    kycRequired: true,
    kycInvestmentLimit: 1000,
    amlScreening: true,
    suspiciousThreshold: 10000,
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    supportEmail: '',
    replyToEmail: '',
    adminNewUser: true,
    adminLargeDeposit: true,
    adminLargeWithdrawal: true,
    adminSupportTicket: true,
    customerWelcome: true,
    customerDeposit: true,
    customerWithdrawal: true,
    customerInterest: true,
    customerMaturity: true,
    smsEnabled: false,
    smsProvider: 'twilio',
    smsSecurity: true,
    smsTransaction: true,
    smsMarketing: false,
  })

  // Integration settings state
  const [integrationSettings, setIntegrationSettings] = useState({
    stripe: {
      enabled: true,
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
      paymentMethods: {
        cards: true,
        ach: false,
        sepa: false
      }
    },
    twilio: {
      enabled: false,
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    },
    recaptcha: {
      enabled: true,
      siteKey: '',
      secretKey: ''
    },
    pusher: {
      enabled: true,
      appId: '',
      key: '',
      secret: '',
      cluster: ''
    }
  })

  // Initialize Pusher client for test notifications
  usePusher(pusherConfig)

  // Load settings on mount
  useEffect(() => {
    fetch('/api/admin/settings/general').then(r => r.json()).then(data => {
      if (data && Object.keys(data).length) setGeneralSettings(data)
    })
    fetch('/api/admin/settings/investment').then(r => r.json()).then(data => {
      if (data && Object.keys(data).length) setInvestmentSettings(data)
    })
    fetch('/api/admin/settings/security').then(r => r.json()).then(data => {
      if (data && Object.keys(data).length) setSecuritySettings(data)
    })
    fetch('/api/admin/settings/notifications').then(r => r.json()).then(data => {
      if (data && Object.keys(data).length) setNotificationSettings(data)
      else setNotificationSettings({
        supportEmail: '',
        replyToEmail: '',
        adminNewUser: true,
        adminLargeDeposit: true,
        adminLargeWithdrawal: true,
        adminSupportTicket: true,
        customerWelcome: true,
        customerDeposit: true,
        customerWithdrawal: true,
        customerInterest: true,
        customerMaturity: true,
        smsEnabled: false,
        smsProvider: 'twilio',
        smsSecurity: true,
        smsTransaction: true,
        smsMarketing: false,
      })
    })
  }, [])

  useEffect(() => {
    fetch('/api/admin/settings/integrations').then(r => r.json()).then(data => {
      setIntegrationSettings(prev => ({
        stripe: (data && data.stripe_config) ? data.stripe_config : prev.stripe,
        twilio: (data && data.twilio_config) ? data.twilio_config : prev.twilio,
        recaptcha: (data && data.recaptcha_config) ? data.recaptcha_config : prev.recaptcha,
        pusher: (data && data.pusher_config) ? data.pusher_config : prev.pusher
      }))
    })
  }, [])

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
      const response = await fetch('/api/admin/settings/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrationSettings)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save integration settings')
      }
      toast.success('Integration settings saved successfully', {
        description: 'Your integration settings have been updated.'
      })
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
      console.log('generalSettings payload:', generalSettings)
      const [genRes, invRes, secRes, notifRes, ...otherResponses] = await Promise.all([
        fetch('/api/admin/settings/general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(generalSettings)
        }),
        fetch('/api/admin/settings/investment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(investmentSettings)
        }),
        fetch('/api/admin/settings/security', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(securitySettings)
        }),
        fetch('/api/admin/settings/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notificationSettings)
        }),
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
      if (!genRes.ok) {
        const err = await genRes.json().catch(() => ({}))
        console.error('General settings save error:', err)
        throw new Error('General settings failed to save: ' + (err?.error || genRes.statusText))
      }
      if (!invRes.ok) {
        const err = await invRes.json().catch(() => ({}))
        console.error('Investment settings save error:', err)
        throw new Error('Investment settings failed to save: ' + (err?.error || invRes.statusText))
      }
      if (!secRes.ok) {
        const err = await secRes.json().catch(() => ({}))
        console.error('Security settings save error:', err)
        throw new Error('Security settings failed to save: ' + (err?.error || secRes.statusText))
      }
      if (!notifRes.ok) {
        const err = await notifRes.json().catch(() => ({}))
        console.error('Notifications settings save error:', err)
        throw new Error('Notifications settings failed to save: ' + (err?.error || notifRes.statusText))
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

  // Integration field handlers
  const handleIntegrationChange = (section: keyof typeof integrationSettings, field: string, value: any) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }
  const handleIntegrationPaymentMethodChange = (method: keyof typeof integrationSettings.stripe.paymentMethods) => {
    setIntegrationSettings(prev => ({
      ...prev,
      stripe: {
        ...prev.stripe,
        paymentMethods: {
          ...prev.stripe.paymentMethods,
          [method]: !prev.stripe.paymentMethods[method]
        }
      }
    }))
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
                  <Input id="platform-name" value={generalSettings.platformName} onChange={e => setGeneralSettings(s => ({ ...s, platformName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" value={generalSettings.supportEmail} onChange={e => setGeneralSettings(s => ({ ...s, supportEmail: e.target.value }))} type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" value={generalSettings.contactPhone} onChange={e => setGeneralSettings(s => ({ ...s, contactPhone: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={value => setGeneralSettings(s => ({ ...s, timezone: value }))} defaultValue="UTC-5">
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
                  value={generalSettings.platformDescription}
                  onChange={e => setGeneralSettings(s => ({ ...s, platformDescription: e.target.value }))}
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
                  <Switch id="maintenance-mode" checked={generalSettings.maintenanceMode} onCheckedChange={(checked) => setGeneralSettings(s => ({ ...s, maintenanceMode: checked }))} />
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
                  <Select value={generalSettings.defaultCurrency} onValueChange={value => setGeneralSettings(s => ({ ...s, defaultCurrency: value }))} defaultValue="USD">
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
                  <Select value={generalSettings.defaultLanguage} onValueChange={value => setGeneralSettings(s => ({ ...s, defaultLanguage: value }))} defaultValue="en-US">
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
                  <Select value={generalSettings.dateFormat} onValueChange={value => setGeneralSettings(s => ({ ...s, dateFormat: value }))} defaultValue="MM/DD/YYYY">
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
                  <Select value={generalSettings.numberFormat} onValueChange={value => setGeneralSettings(s => ({ ...s, numberFormat: value }))} defaultValue="1,234.56">
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
                {(Array.isArray(investmentSettings.jars) ? investmentSettings.jars : []).map((jar, index) => (
                  <div key={index} className="space-y-4 border-b pb-4 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{jar.term}-Month Jar</h3>
                      <Badge variant="outline" className="text-primary border-primary">
                        {jar.term <= 12 ? 'Short Term' : jar.term <= 24 ? 'Medium Term' : 'Long Term'}
                      </Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setInvestmentSettings(s => ({
                          ...s,
                          jars: s.jars.filter((_, i) => i !== index)
                        }))}
                        title="Remove term"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor={`term-${index}`}>Term (months)</Label>
                        <Input
                          id={`term-${index}`}
                          value={jar.term}
                          onChange={e => setInvestmentSettings(s => ({
                            ...s,
                            jars: s.jars.map((j, i) => i === index ? { ...j, term: Number(e.target.value) } : j)
                          }))}
                          type="number"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`apy-${index}`}>APY Rate (%)</Label>
                        <Input
                          id={`apy-${index}`}
                          value={jar.apy}
                          onChange={e => setInvestmentSettings(s => ({
                            ...s,
                            jars: s.jars.map((j, i) => i === index ? { ...j, apy: Number(e.target.value) } : j)
                          }))}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`min-${index}`}>Minimum Investment</Label>
                        <Input
                          id={`min-${index}`}
                          value={jar.min}
                          onChange={e => setInvestmentSettings(s => ({
                            ...s,
                            jars: s.jars.map((j, i) => i === index ? { ...j, min: Number(e.target.value) } : j)
                          }))}
                          type="number"
                          min="0"
                          step="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`earlyFee-${index}`}>Early Withdrawal Fee (%)</Label>
                        <Input
                          id={`earlyFee-${index}`}
                          value={jar.earlyFee}
                          onChange={e => setInvestmentSettings(s => ({
                            ...s,
                            jars: s.jars.map((j, i) => i === index ? { ...j, earlyFee: Number(e.target.value) } : j)
                          }))}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2 flex items-center mt-6">
                        <Label htmlFor={`active-${index}`}>Active</Label>
                        <Switch
                          id={`active-${index}`}
                          checked={jar.active}
                          onCheckedChange={checked => setInvestmentSettings(s => ({
                            ...s,
                            jars: s.jars.map((j, i) => i === index ? { ...j, active: checked } : j)
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setInvestmentSettings(s => ({
                  ...s,
                  jars: [
                    ...((Array.isArray(s.jars) ? s.jars : [])),
                    { term: 0, apy: 0, min: 0, earlyFee: 0, active: true }
                  ]
                }))}
              >
                Add Term
              </Button>
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
                  <Select
                    value={investmentSettings.interest.calculation}
                    onValueChange={value => setInvestmentSettings(s => ({
                      ...s,
                      interest: { ...s.interest, calculation: value }
                    }))}
                    defaultValue="compound"
                  >
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
                  <Select
                    value={investmentSettings.interest.frequency}
                    onValueChange={value => setInvestmentSettings(s => ({
                      ...s,
                      interest: { ...s.interest, frequency: value }
                    }))}
                    defaultValue="monthly"
                  >
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
                  <Switch
                    id="auto-reinvest"
                    checked={investmentSettings.interest.autoReinvest}
                    onCheckedChange={(checked) => setInvestmentSettings(s => ({
                      ...s,
                      interest: { ...s.interest, autoReinvest: checked }
                    }))}
                  />
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
                  <Switch
                    id="early-withdrawal"
                    checked={investmentSettings.interest.allowEarlyWithdrawal}
                    onCheckedChange={(checked) => setInvestmentSettings(s => ({
                      ...s,
                      interest: { ...s.interest, allowEarlyWithdrawal: checked }
                    }))}
                  />
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
                  <Switch
                    id="two-factor"
                    checked={securitySettings.twoFactor}
                    onCheckedChange={(checked) => setSecuritySettings(s => ({ ...s, twoFactor: checked }))}
                  />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-expiry" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>Password Expiry</span>
                    <p className="text-sm text-muted-foreground">Force users to change their password periodically</p>
                  </div>
                  <Switch
                    id="password-expiry"
                    checked={securitySettings.passwordExpiry}
                    onCheckedChange={(checked) => setSecuritySettings(s => ({ ...s, passwordExpiry: checked }))}
                  />
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kyc-required" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>KYC Required</span>
                    <p className="text-sm text-muted-foreground">Force customers to complete KYC before investing</p>
                  </div>
                  <Switch
                    id="kyc-required"
                    checked={securitySettings.kycRequired}
                    onCheckedChange={checked => setSecuritySettings(s => ({ ...s, kycRequired: checked }))}
                  />
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kyc-investment-limit">KYC Investment Limit</Label>
                <Input
                  id="kyc-investment-limit"
                  type="number"
                  min={0}
                  value={securitySettings.kycInvestmentLimit}
                  onChange={e => setSecuritySettings(s => ({ ...s, kycInvestmentLimit: Number(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground">Maximum investment allowed before KYC is required</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aml-screening" className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span>AML Screening</span>
                    <p className="text-sm text-muted-foreground">Enable anti-money laundering checks</p>
                  </div>
                  <Switch
                    id="aml-screening"
                    checked={securitySettings.amlScreening}
                    onCheckedChange={checked => setSecuritySettings(s => ({ ...s, amlScreening: checked }))}
                  />
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspicious-threshold">Suspicious Transaction Threshold</Label>
                <Input
                  id="suspicious-threshold"
                  type="number"
                  min={0}
                  value={securitySettings.suspiciousThreshold}
                  onChange={e => setSecuritySettings(s => ({ ...s, suspiciousThreshold: Number(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground">Amount above which transactions are flagged for review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and SMS notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" value={notificationSettings.supportEmail} onChange={e => setNotificationSettings(s => ({ ...s, supportEmail: e.target.value }))} type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-to-email">Reply-To Email</Label>
                  <Input id="reply-to-email" value={notificationSettings.replyToEmail} onChange={e => setNotificationSettings(s => ({ ...s, replyToEmail: e.target.value }))} type="email" />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
                  <Switch id="sms-enabled" checked={notificationSettings.smsEnabled} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, smsEnabled: checked }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select value={notificationSettings.smsProvider} onValueChange={value => setNotificationSettings(s => ({ ...s, smsProvider: value }))}>
                    <SelectTrigger id="sms-provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Admin Notifications</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span>New User</span>
                      <Switch checked={notificationSettings.adminNewUser} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, adminNewUser: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Large Deposit</span>
                      <Switch checked={notificationSettings.adminLargeDeposit} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, adminLargeDeposit: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Large Withdrawal</span>
                      <Switch checked={notificationSettings.adminLargeWithdrawal} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, adminLargeWithdrawal: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support Ticket</span>
                      <Switch checked={notificationSettings.adminSupportTicket} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, adminSupportTicket: checked }))} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Customer Notifications</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span>Welcome</span>
                      <Switch checked={notificationSettings.customerWelcome} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, customerWelcome: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Deposit</span>
                      <Switch checked={notificationSettings.customerDeposit} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, customerDeposit: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Withdrawal</span>
                      <Switch checked={notificationSettings.customerWithdrawal} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, customerWithdrawal: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Interest</span>
                      <Switch checked={notificationSettings.customerInterest} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, customerInterest: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Maturity</span>
                      <Switch checked={notificationSettings.customerMaturity} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, customerMaturity: checked }))} />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>SMS Notifications</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span>Security Alerts</span>
                      <Switch checked={notificationSettings.smsSecurity} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, smsSecurity: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Transaction Alerts</span>
                      <Switch checked={notificationSettings.smsTransaction} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, smsTransaction: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Marketing</span>
                      <Switch checked={notificationSettings.smsMarketing} onCheckedChange={checked => setNotificationSettings(s => ({ ...s, smsMarketing: checked }))} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Configure third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="stripe-enabled" checked={integrationSettings.stripe.enabled} onCheckedChange={checked => handleIntegrationChange('stripe', 'enabled', checked)} />
                  <Label htmlFor="stripe-enabled" className="ml-2">Enable Stripe</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-publishable-key">Stripe Publishable Key</Label>
                    <Input id="stripe-publishable-key" value={integrationSettings.stripe.publishableKey} onChange={e => handleIntegrationChange('stripe', 'publishableKey', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                    <Input id="stripe-secret-key" value={integrationSettings.stripe.secretKey} onChange={e => handleIntegrationChange('stripe', 'secretKey', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-webhook-secret">Stripe Webhook Secret</Label>
                    <Input id="stripe-webhook-secret" value={integrationSettings.stripe.webhookSecret} onChange={e => handleIntegrationChange('stripe', 'webhookSecret', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
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
              </div>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="twilio-enabled" checked={integrationSettings.twilio.enabled} onCheckedChange={checked => handleIntegrationChange('twilio', 'enabled', checked)} />
                  <Label htmlFor="twilio-enabled" className="ml-2">Enable Twilio</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-account-sid">Twilio Account SID</Label>
                    <Input id="twilio-account-sid" value={integrationSettings.twilio.accountSid} onChange={e => handleIntegrationChange('twilio', 'accountSid', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-auth-token">Twilio Auth Token</Label>
                    <Input id="twilio-auth-token" value={integrationSettings.twilio.authToken} onChange={e => handleIntegrationChange('twilio', 'authToken', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-phone-number">Twilio Phone Number</Label>
                    <Input id="twilio-phone-number" value={integrationSettings.twilio.phoneNumber} onChange={e => handleIntegrationChange('twilio', 'phoneNumber', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="recaptcha-enabled" checked={integrationSettings.recaptcha.enabled} onCheckedChange={checked => handleIntegrationChange('recaptcha', 'enabled', checked)} />
                  <Label htmlFor="recaptcha-enabled" className="ml-2">Enable reCAPTCHA</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recaptcha-site-key">reCAPTCHA Site Key</Label>
                    <Input id="recaptcha-site-key" value={integrationSettings.recaptcha.siteKey} onChange={e => handleIntegrationChange('recaptcha', 'siteKey', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recaptcha-secret-key">reCAPTCHA Secret Key</Label>
                    <Input id="recaptcha-secret-key" value={integrationSettings.recaptcha.secretKey} onChange={e => handleIntegrationChange('recaptcha', 'secretKey', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="pusher-enabled" checked={integrationSettings.pusher.enabled} onCheckedChange={checked => handleIntegrationChange('pusher', 'enabled', checked)} />
                  <Label htmlFor="pusher-enabled" className="ml-2">Enable Pusher</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pusher-app-id">Pusher App ID</Label>
                    <Input id="pusher-app-id" value={integrationSettings.pusher.appId} onChange={e => handleIntegrationChange('pusher', 'appId', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pusher-key">Pusher Key</Label>
                    <Input id="pusher-key" value={integrationSettings.pusher.key} onChange={e => handleIntegrationChange('pusher', 'key', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pusher-secret">Pusher Secret</Label>
                    <Input id="pusher-secret" value={integrationSettings.pusher.secret} onChange={e => handleIntegrationChange('pusher', 'secret', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pusher-cluster">Pusher Cluster</Label>
                    <Input id="pusher-cluster" value={integrationSettings.pusher.cluster} onChange={e => handleIntegrationChange('pusher', 'cluster', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
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
              </div>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="smtp-enabled" checked={smtpConfig.enabled} onCheckedChange={checked => handleSMTPChange('enabled', checked)} />
                  <Label htmlFor="smtp-enabled" className="ml-2">Enable SMTP</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" value={smtpConfig.host} onChange={e => handleSMTPChange('host', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" type="number" value={smtpConfig.port} onChange={e => handleSMTPChange('port', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-secure">Use SSL/TLS</Label>
                    <Switch id="smtp-secure" checked={smtpConfig.secure} onCheckedChange={checked => handleSMTPChange('secure', checked)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">Username</Label>
                    <Input id="smtp-user" value={smtpConfig.user} onChange={e => handleSMTPChange('user', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-pass">Password</Label>
                    <Input id="smtp-pass" type="password" value={smtpConfig.pass} onChange={e => handleSMTPChange('pass', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="gmail-enabled" checked={gmailConfig.enabled} onCheckedChange={checked => handleGmailChange('enabled', checked)} />
                  <Label htmlFor="gmail-enabled" className="ml-2">Enable Gmail</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gmail-client-id">Client ID</Label>
                    <Input id="gmail-client-id" value={gmailConfig.clientId} onChange={e => handleGmailChange('clientId', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gmail-client-secret">Client Secret</Label>
                    <Input id="gmail-client-secret" type="password" value={gmailConfig.clientSecret} onChange={e => handleGmailChange('clientSecret', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gmail-refresh-token">Refresh Token</Label>
                    <Input id="gmail-refresh-token" type="password" value={gmailConfig.refreshToken} onChange={e => handleGmailChange('refreshToken', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gmail-user">Gmail Address</Label>
                    <Input id="gmail-user" type="email" value={gmailConfig.user} onChange={e => handleGmailChange('user', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Switch id="microsoft-enabled" checked={microsoftConfig.enabled} onCheckedChange={checked => handleMicrosoftChange('enabled', checked)} />
                  <Label htmlFor="microsoft-enabled" className="ml-2">Enable Microsoft 365</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="microsoft-client-id">Client ID</Label>
                    <Input id="microsoft-client-id" value={microsoftConfig.clientId} onChange={e => handleMicrosoftChange('clientId', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="microsoft-client-secret">Client Secret</Label>
                    <Input id="microsoft-client-secret" type="password" value={microsoftConfig.clientSecret} onChange={e => handleMicrosoftChange('clientSecret', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="microsoft-tenant-id">Tenant ID</Label>
                    <Input id="microsoft-tenant-id" value={microsoftConfig.tenantId} onChange={e => handleMicrosoftChange('tenantId', e.target.value)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
