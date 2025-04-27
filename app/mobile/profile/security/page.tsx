"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Eye, EyeOff, ShieldCheck, Key, Smartphone, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SecurityPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginNotifications, setLoginNotifications] = useState(true)
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false)
  const { toast } = useToast()

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    setPasswordChangeLoading(true)

    // In a real app, this would be an API call to change the password
    setTimeout(() => {
      setPasswordChangeLoading(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    }, 1000)
  }

  const handleEnableTwoFactor = () => {
    // In a real app, this would initiate the 2FA setup process
    toast({
      title: "Two-factor authentication",
      description: "Setup wizard would appear here in a real application.",
    })
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Security Settings</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <Button type="submit" disabled={passwordChangeLoading}>
              {passwordChangeLoading ? (
                <>Updating password...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Secure your account with two-factor authentication via an authenticator app
                </p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {!twoFactorEnabled && (
            <Button variant="outline" className="ml-8" onClick={handleEnableTwoFactor}>
              <Key className="mr-2 h-4 w-4" /> Setup Two-Factor Authentication
            </Button>
          )}

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Login Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when someone logs into your account
                </p>
              </div>
            </div>
            <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Activity</CardTitle>
          <CardDescription>Recent security-related activity on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="outline" className="bg-muted/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security measures are simulated in this demo</AlertTitle>
            <AlertDescription>
              In a real application, this section would display recent login attempts, password changes, and other
              account activity.
            </AlertDescription>
          </Alert>

          <ul className="mt-4 space-y-4">
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-1">
                <ShieldCheck className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Successful login</p>
                <p className="text-xs text-muted-foreground">Today, 10:30 AM • IP: 192.168.1.1 • Chrome on Windows</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-1">
                <Key className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Password changed</p>
                <p className="text-xs text-muted-foreground">January 15, 2024, 3:45 PM • IP: 192.168.1.1</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-1">
                <ShieldCheck className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Successful login</p>
                <p className="text-xs text-muted-foreground">
                  January 12, 2024, 9:15 AM • IP: 192.168.1.1 • Safari on macOS
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">
            View All Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
