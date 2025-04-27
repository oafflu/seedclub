"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, ChevronDown, Filter, Search, Settings, Trash2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "New Customer Registration",
    message: "John Doe has registered a new account.",
    time: "10 minutes ago",
    read: false,
    type: "customer",
    priority: "medium",
  },
  {
    id: 2,
    title: "Withdrawal Request",
    message: "A withdrawal request of $5,000 is pending approval.",
    time: "30 minutes ago",
    read: false,
    type: "transaction",
    priority: "high",
  },
  {
    id: 3,
    title: "System Update",
    message: "System maintenance scheduled for tonight at 2:00 AM.",
    time: "1 hour ago",
    read: true,
    type: "system",
    priority: "high",
  },
  {
    id: 4,
    title: "New Investment",
    message: "A new investment of $10,000 has been made in Jar #1234.",
    time: "2 hours ago",
    read: true,
    type: "investment",
    priority: "medium",
  },
  {
    id: 5,
    title: "Support Ticket",
    message: "New support ticket #4567 has been opened.",
    time: "3 hours ago",
    read: false,
    type: "support",
    priority: "medium",
  },
  {
    id: 6,
    title: "KYC Verification",
    message: "5 KYC verifications are pending review.",
    time: "5 hours ago",
    read: true,
    type: "kyc",
    priority: "high",
  },
  {
    id: 7,
    title: "Server Alert",
    message: "High CPU usage detected on main server.",
    time: "6 hours ago",
    read: true,
    type: "system",
    priority: "critical",
  },
  {
    id: 8,
    title: "New Referral",
    message: "10 new referrals were registered today.",
    time: "8 hours ago",
    read: true,
    type: "referral",
    priority: "low",
  },
  {
    id: 9,
    title: "Marketing Campaign",
    message: "The summer promotion campaign has ended.",
    time: "1 day ago",
    read: true,
    type: "marketing",
    priority: "medium",
  },
  {
    id: 10,
    title: "Database Backup",
    message: "Weekly database backup completed successfully.",
    time: "2 days ago",
    read: true,
    type: "system",
    priority: "low",
  },
]

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    // Search filter
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const matchesType = selectedType === "all" || notification.type === selectedType

    // Priority filter
    const matchesPriority = selectedPriority === "all" || notification.priority === selectedPriority

    return matchesSearch && matchesType && matchesPriority
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
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage and view your system notifications</p>
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
          <Button variant="outline" asChild>
            <a href="#notification-settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Notification Center</CardTitle>
              <Badge variant="secondary">{unreadCount} unread</Badge>
            </div>
            <CardDescription>View and manage your notifications</CardDescription>
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
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="transaction">Transaction</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="kyc">KYC</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Priority</p>
                      <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
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
                        <NotificationItem
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
                          <NotificationItem
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
                          <NotificationItem
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
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: {
    id: number
    title: string
    message: string
    time: string
    read: boolean
    type: string
    priority: string
  }
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const priorityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }

  const typeIcons = {
    customer: <Bell className="h-5 w-5" />,
    transaction: <Bell className="h-5 w-5" />,
    system: <Bell className="h-5 w-5" />,
    investment: <Bell className="h-5 w-5" />,
    support: <Bell className="h-5 w-5" />,
    kyc: <Bell className="h-5 w-5" />,
    referral: <Bell className="h-5 w-5" />,
    marketing: <Bell className="h-5 w-5" />,
  }

  return (
    <div className={`p-4 border rounded-lg flex items-start gap-4 ${!notification.read ? "bg-muted/50" : ""}`}>
      <div className="mt-1">{typeIcons[notification.type as keyof typeof typeIcons]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{notification.title}</h4>
          {!notification.read && <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>}
          <Badge
            variant="outline"
            className={`ml-auto ${priorityColors[notification.priority as keyof typeof priorityColors]}`}
          >
            {notification.priority}
          </Badge>
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

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Customer Registrations</h4>
              <p className="text-sm text-muted-foreground">Receive notifications for new customer registrations</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="important">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Transaction Alerts</h4>
              <p className="text-sm text-muted-foreground">Receive notifications for transactions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">System Alerts</h4>
              <p className="text-sm text-muted-foreground">Receive notifications for system events</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Support Tickets</h4>
              <p className="text-sm text-muted-foreground">Receive notifications for support tickets</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="important">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="enabled">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Critical Alerts</h4>
              <p className="text-sm text-muted-foreground">Receive SMS for critical system alerts</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="enabled">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
