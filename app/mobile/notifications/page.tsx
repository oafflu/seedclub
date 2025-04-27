"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Check,
  ChevronDown,
  Filter,
  Search,
  Trash2,
  X,
  DollarSign,
  Gift,
  AlertCircle,
  Clock,
  CreditCard,
  Percent,
  UserPlus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Mock notification data for customer
const mockNotifications = [
  {
    id: 1,
    title: "Investment Matured",
    message: "Your investment in Jar #1234 has matured with a profit of $500.",
    time: "10 minutes ago",
    read: false,
    type: "investment",
    icon: <DollarSign className="h-5 w-5 text-green-500" />,
  },
  {
    id: 2,
    title: "Referral Bonus",
    message: "You've earned a $50 referral bonus from John Doe's registration.",
    time: "30 minutes ago",
    read: false,
    type: "referral",
    icon: <Gift className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 3,
    title: "Account Security",
    message: "Your password was changed successfully.",
    time: "1 hour ago",
    read: true,
    type: "security",
    icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 4,
    title: "Withdrawal Processed",
    message: "Your withdrawal request of $1,000 has been processed.",
    time: "2 hours ago",
    read: true,
    type: "transaction",
    icon: <CreditCard className="h-5 w-5 text-orange-500" />,
  },
  {
    id: 5,
    title: "Support Ticket Update",
    message: "Your support ticket #4567 has been resolved.",
    time: "3 hours ago",
    read: false,
    type: "support",
    icon: <Clock className="h-5 w-5 text-indigo-500" />,
  },
  {
    id: 6,
    title: "KYC Verification",
    message: "Your KYC verification has been approved.",
    time: "5 hours ago",
    read: true,
    type: "kyc",
    icon: <Check className="h-5 w-5 text-green-500" />,
  },
  {
    id: 7,
    title: "New Promotion",
    message: "Summer special: Get 5% extra on all investments this month!",
    time: "6 hours ago",
    read: true,
    type: "promotion",
    icon: <Percent className="h-5 w-5 text-red-500" />,
  },
  {
    id: 8,
    title: "Friend Joined",
    message: "Your friend Sarah has joined Seed Club using your referral link.",
    time: "8 hours ago",
    read: true,
    type: "referral",
    icon: <UserPlus className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 9,
    title: "Investment Opportunity",
    message: "New high-yield investment jar available! Limited spots.",
    time: "1 day ago",
    read: true,
    type: "investment",
    icon: <DollarSign className="h-5 w-5 text-green-500" />,
  },
  {
    id: 10,
    title: "Account Statement",
    message: "Your monthly account statement is now available for download.",
    time: "2 days ago",
    read: true,
    type: "account",
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
  },
]

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    // Search filter
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const matchesType = selectedType === "all" || notification.type === selectedType

    return matchesSearch && matchesType
  })

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your account activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Notifications</CardTitle>
              <Badge variant="secondary">{unreadCount} unread</Badge>
            </div>
            <CardDescription>Your recent notifications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search notifications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Type</p>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="investment">Investments</SelectItem>
                          <SelectItem value="transaction">Transactions</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="kyc">KYC</SelectItem>
                          <SelectItem value="referral">Referrals</SelectItem>
                          <SelectItem value="promotion">Promotions</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <CustomerNotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notifications.length === 0
                          ? "You don't have any notifications yet."
                          : "No notifications match your current filters."}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="unread" className="mt-4">
                  {filteredNotifications.filter((n) => !n.read).length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications
                        .filter((n) => !n.read)
                        .map((notification) => (
                          <CustomerNotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Check className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No unread notifications</h3>
                      <p className="text-sm text-muted-foreground mt-1">You've read all your notifications.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="read" className="mt-4">
                  {filteredNotifications.filter((n) => n.read).length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications
                        .filter((n) => n.read)
                        .map((notification) => (
                          <CustomerNotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No read notifications</h3>
                      <p className="text-sm text-muted-foreground mt-1">You don't have any read notifications yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Card id="notification-settings">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerNotificationSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface CustomerNotificationItemProps {
  notification: {
    id: number
    title: string
    message: string
    time: string
    read: boolean
    type: string
    icon: React.ReactNode
  }
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}

function CustomerNotificationItem({ notification, onMarkAsRead, onDelete }: CustomerNotificationItemProps) {
  return (
    <div className={`p-4 border rounded-lg flex items-start gap-4 ${!notification.read ? "bg-muted/50" : ""}`}>
      <div className="mt-1">{notification.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{notification.title}</h4>
          {!notification.read && <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
      </div>
      <div className="flex gap-1">
        {!notification.read && (
          <Button variant="ghost" size="icon" onClick={() => onMarkAsRead(notification.id)} title="Mark as read">
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onDelete(notification.id)} title="Delete notification">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function CustomerNotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Investment Updates</h4>
              <p className="text-sm text-muted-foreground">Receive updates about your investments</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Transaction Alerts</h4>
              <p className="text-sm text-muted-foreground">Receive alerts for deposits and withdrawals</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Promotional Offers</h4>
              <p className="text-sm text-muted-foreground">Receive special offers and promotions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Referral Updates</h4>
              <p className="text-sm text-muted-foreground">Receive updates about your referrals</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Security Alerts</h4>
              <p className="text-sm text-muted-foreground">Receive SMS for login attempts and security changes</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Transaction Confirmations</h4>
              <p className="text-sm text-muted-foreground">Receive SMS for transaction confirmations</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}
