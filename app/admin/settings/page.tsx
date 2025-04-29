"use client"

import { useState } from "react"
import { Save, RefreshCw, CheckCircle, Lock, Mail, Bell, DollarSign, Percent, Clock, CreditCard } from "lucide-react"
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

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 1000)
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
                  <Switch id="stripe-enabled" defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-public-key">Public Key</Label>
                    <Input id="stripe-public-key" defaultValue="pk_test_..." type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Secret Key</Label>
                    <Input id="stripe-secret-key" defaultValue="sk_test_..." type="password" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                  <Input id="stripe-webhook-secret" defaultValue="whsec_..." type="password" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">PayPal</h3>
                      <p className="text-sm text-muted-foreground">PayPal payment processing</p>
                    </div>
                  </div>
                  <Switch id="paypal-enabled" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <Input id="paypal-client-id" placeholder="Enter PayPal client ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Client Secret</Label>
                    <Input id="paypal-secret" placeholder="Enter PayPal client secret" type="password" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Configure integrations with third-party services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">SendGrid</h3>
                      <p className="text-sm text-muted-foreground">Email delivery service</p>
                    </div>
                  </div>
                  <Switch id="sendgrid-enabled" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sendgrid-api-key">API Key</Label>
                  <Input id="sendgrid-api-key" defaultValue="SG..." type="password" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Twilio</h3>
                      <p className="text-sm text-muted-foreground">SMS notification service</p>
                    </div>
                  </div>
                  <Switch id="twilio-enabled" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-account-sid">Account SID</Label>
                    <Input id="twilio-account-sid" placeholder="Enter Twilio Account SID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-auth-token">Auth Token</Label>
                    <Input id="twilio-auth-token" placeholder="Enter Twilio Auth Token" type="password" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-phone-number">Phone Number</Label>
                  <Input id="twilio-phone-number" placeholder="Enter Twilio Phone Number" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">reCAPTCHA</h3>
                      <p className="text-sm text-muted-foreground">Bot protection service</p>
                    </div>
                  </div>
                  <Switch id="recaptcha-enabled" defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recaptcha-site-key">Site Key</Label>
                    <Input id="recaptcha-site-key" defaultValue="6Lc..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recaptcha-secret-key">Secret Key</Label>
                    <Input id="recaptcha-secret-key" defaultValue="6Lc..." type="password" />
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
