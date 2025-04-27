"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")

  // Mock admin data
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@seedclub.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    bio: "Experienced administrator with over 5 years in financial services management.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      sms: false,
      push: true,
      loginAlerts: true,
      weeklyReports: true,
      customerActivity: false,
      systemUpdates: true,
      marketingNews: false,
    },
    security: {
      twoFactor: true,
      sessionTimeout: "30",
      ipRestriction: false,
      loginHistory: true,
      passwordExpiry: "90",
      deviceManagement: true,
    },
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })

    setIsLoading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (adminData.newPassword !== adminData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setAdminData({
      ...adminData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    })

    setIsLoading(false)
  }

  const handleNotificationChange = (key: string) => {
    setAdminData({
      ...adminData,
      notifications: {
        ...adminData.notifications,
        [key]: !adminData.notifications[key as keyof typeof adminData.notifications],
      },
    })
  }

  const handleSecurityChange = (key: string, value: any) => {
    setAdminData({
      ...adminData,
      security: {
        ...adminData.security,
        [key]: typeof value === "boolean" ? value : value,
      },
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage || "/placeholder.svg"} alt={adminData.name} />
                  <AvatarFallback>{adminData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="picture" className="cursor-pointer">
                    <div className="rounded-full bg-primary p-2 text-white">
                      <User className="h-4 w-4" />
                    </div>
                  </Label>
                  <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">{adminData.name}</h3>
              <p className="text-muted-foreground">{adminData.role}</p>

              <div className="w-full mt-6">
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{adminData.email}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{adminData.phone}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={adminData.name}
                        onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={adminData.email}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={adminData.phone}
                        onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={adminData.role} disabled />
                      <p className="text-xs text-muted-foreground">
                        Role can only be changed by a system administrator
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={adminData.bio}
                        onChange={(e) => setAdminData({ ...adminData, bio: e.target.value })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordChange}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={adminData.currentPassword}
                        onChange={(e) => setAdminData({ ...adminData, currentPassword: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={adminData.newPassword}
                        onChange={(e) => setAdminData({ ...adminData, newPassword: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={adminData.confirmPassword}
                        onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                      />
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="text-sm font-medium">Password Requirements:</div>
                      <ul className="mt-2 text-xs text-muted-foreground">
                        <li>Minimum 8 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-base">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={adminData.notifications.email}
                        onCheckedChange={() => handleNotificationChange("email")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="text-base">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={adminData.notifications.sms}
                        onCheckedChange={() => handleNotificationChange("sms")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="text-base">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={adminData.notifications.push}
                        onCheckedChange={() => handleNotificationChange("push")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="login-alerts" className="text-base">
                          Login Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">Get notified about new login attempts</p>
                      </div>
                      <Switch
                        id="login-alerts"
                        checked={adminData.notifications.loginAlerts}
                        onCheckedChange={() => handleNotificationChange("loginAlerts")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports" className="text-base">
                          Weekly Reports
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={adminData.notifications.weeklyReports}
                        onCheckedChange={() => handleNotificationChange("weeklyReports")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="customer-activity" className="text-base">
                          Customer Activity
                        </Label>
                        <p className="text-sm text-muted-foreground">Get notified about important customer actions</p>
                      </div>
                      <Switch
                        id="customer-activity"
                        checked={adminData.notifications.customerActivity}
                        onCheckedChange={() => handleNotificationChange("customerActivity")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-updates" className="text-base">
                          System Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">Get notified about system changes and updates</p>
                      </div>
                      <Switch
                        id="system-updates"
                        checked={adminData.notifications.systemUpdates}
                        onCheckedChange={() => handleNotificationChange("systemUpdates")}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-news" className="text-base">
                          Marketing News
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about marketing campaigns and promotions
                        </p>
                      </div>
                      <Switch
                        id="marketing-news"
                        checked={adminData.notifications.marketingNews}
                        onCheckedChange={() => handleNotificationChange("marketingNews")}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      toast({
                        title: "Preferences saved",
                        description: "Your notification preferences have been updated.",
                      })
                    }
                  >
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor" className="text-base">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={adminData.security.twoFactor}
                        onCheckedChange={(checked) => handleSecurityChange("twoFactor", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout" className="text-base">
                        Session Timeout (minutes)
                      </Label>
                      <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                      <Input
                        id="session-timeout"
                        type="number"
                        min="5"
                        max="120"
                        value={adminData.security.sessionTimeout}
                        onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ip-restriction" className="text-base">
                          IP Restriction
                        </Label>
                        <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
                      </div>
                      <Switch
                        id="ip-restriction"
                        checked={adminData.security.ipRestriction}
                        onCheckedChange={(checked) => handleSecurityChange("ipRestriction", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="login-history" className="text-base">
                          Login History
                        </Label>
                        <p className="text-sm text-muted-foreground">Track and review your login activity</p>
                      </div>
                      <Switch
                        id="login-history"
                        checked={adminData.security.loginHistory}
                        onCheckedChange={(checked) => handleSecurityChange("loginHistory", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="password-expiry" className="text-base">
                        Password Expiry (days)
                      </Label>
                      <p className="text-sm text-muted-foreground">Force password change after specified period</p>
                      <Input
                        id="password-expiry"
                        type="number"
                        min="30"
                        max="365"
                        value={adminData.security.passwordExpiry}
                        onChange={(e) => handleSecurityChange("passwordExpiry", e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="device-management" className="text-base">
                          Device Management
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Manage and remove devices connected to your account
                        </p>
                      </div>
                      <Switch
                        id="device-management"
                        checked={adminData.security.deviceManagement}
                        onCheckedChange={(checked) => handleSecurityChange("deviceManagement", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      toast({
                        title: "Security settings saved",
                        description: "Your security preferences have been updated.",
                      })
                    }
                  >
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
