"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Button } from "@/components/ui/button"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { ArrowUpRight, Users, Wallet, Sprout, TrendingUp, BarChart3, PieChartIcon, LineChart as LucideLineChart, PiggyBank, CreditCard, Gift, ChevronDown, Bell, Check, Filter, Search, Settings, Trash2, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { pusherClient, NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from "@/lib/pusher"
import { getTimeAgo, markNotificationAsRead, deleteNotification } from "@/lib/notifications/client"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import React from 'react'

const COLORS = ["#204854", "#286578", "#d97a4b", "#dedddd"]

function AnalyticsTab({ totalUsers, totalInvested, monthlyRevenue, conversionRate, monthlyInvestmentData, userGrowthData, jarDistributionData, conversionRateData, COLORS }: {
  totalUsers: number,
  totalInvested: number,
  monthlyRevenue: number,
  conversionRate: number,
  monthlyInvestmentData: any[],
  userGrowthData: any[],
  jarDistributionData: any[],
  conversionRateData: any[],
  COLORS: string[],
}) {
  return (
    <div className="space-y-6 pt-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Invested</CardTitle>
            <CardDescription>Sum of all deposits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${totalInvested.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>This month's interest revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${monthlyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Visitor to customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Growth</CardTitle>
            <CardDescription>Total investment growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ amount: { label: "Investment Amount", color: "hsl(var(--chart-1))" } }} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyInvestmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#204854" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#204854" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="amount" stroke="#204854" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} users`, "Total Users"]} />
                  <Bar dataKey="users" fill="#d97a4b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jar Distribution</CardTitle>
            <CardDescription>Distribution of investment jars by term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={jarDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {jarDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Visitor to customer conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Conversion Rate"]} />
                  <Line type="monotone" dataKey="rate" stroke="#204854" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NotificationsTab() {
  // Inline the notification center logic from AdminNotificationsPage
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [loading, setLoading] = useState(true)

  // Fetch notifications from database
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.id) return
    const channel = pusherClient.subscribe(`${NOTIFICATION_CHANNELS.ADMIN}-${user.id}`)
    channel.bind(NOTIFICATION_EVENTS.NEW, (notification: any) => {
      setNotifications(prev => [notification, ...prev])
      toast(`New Notification: ${notification.title}`)
    })
    channel.bind(NOTIFICATION_EVENTS.UPDATE, (updatedNotification: any) => {
      setNotifications(prev => prev.map(n => (n.id === updatedNotification.id ? updatedNotification : n)))
    })
    channel.bind(NOTIFICATION_EVENTS.DELETE, (deletedId: string) => {
      setNotifications(prev => prev.filter(n => n.id !== deletedId))
    })
    fetchNotifications()
    return () => {
      pusherClient.unsubscribe(`${NOTIFICATION_CHANNELS.ADMIN}-${user.id}`)
    }
  }, [user?.id])

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || notification.type === selectedType
    const matchesPriority = selectedPriority === "all" || notification.priority === selectedPriority
    return matchesSearch && matchesType && matchesPriority
  })
  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsRead(id, user?.id || '')
      if (!result.success) throw new Error('Failed to mark notification as read')
      toast.success('Notification marked as read')
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteNotification(id, user?.id || '')
      if (!result.success) throw new Error('Failed to delete notification')
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllAsRead' })
      })
      if (!response.ok) throw new Error('Failed to mark all notifications as read')
      toast.success('All notifications marked as read')
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }
  const handleClearAll = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to clear all notifications')
      toast.success('All notifications cleared')
      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
      toast.error('Failed to clear notifications')
    }
  }
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage and view your system notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
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
                  <Input type="search" placeholder="Search notifications..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                        <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notifications.length === 0 ? "You don't have any notifications yet." : "No notifications match your current filters."}
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="unread" className="mt-4">
                  {filteredNotifications.filter((n) => !n.read).length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.filter((n) => !n.read).map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
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
                      {filteredNotifications.filter((n) => n.read).map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
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
            {/* You can add notification settings UI here if needed */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: { notification: any, onMarkAsRead: (id: string) => void, onDelete: (id: string) => void }): React.ReactElement {
  const priorityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }
  const typeIcons: Record<string, React.ReactElement> = {
    customer: <Bell className="h-5 w-5" />, transaction: <Bell className="h-5 w-5" />, system: <Bell className="h-5 w-5" />, investment: <Bell className="h-5 w-5" />, support: <Bell className="h-5 w-5" />, kyc: <Bell className="h-5 w-5" />, referral: <Bell className="h-5 w-5" />, marketing: <Bell className="h-5 w-5" />,
  }
  return (
    <div className={`p-4 border rounded-lg flex items-start gap-4 ${!notification.read ? "bg-muted/50" : ""}`}>
      <div className="mt-1">{typeIcons[notification.type as keyof typeof typeIcons] || <Bell className="h-5 w-5" />}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{notification.title}</h4>
          {!notification.read && <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>}
          <Badge variant="outline" className={`ml-auto ${priorityColors[notification.priority as keyof typeof priorityColors] || ''}`}>{notification.priority}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(notification.created_at)}</p>
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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>({})
  const [jars, setJars] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [notifLoading, setNotifLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const res = await fetch("/api/admin/dashboard")
      const data = await res.json()
      setMetrics(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchNotifications() {
      setNotifLoading(true)
      const res = await fetch("/api/admin/notifications")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
      setNotifLoading(false)
    }
    if (user?.id) fetchNotifications()
  }, [user?.id])

  // Pass real data to AnalyticsTab
  const analyticsProps = {
    totalUsers: metrics.totalCustomers || 0,
    totalInvested: metrics.totalInvested || 0,
    monthlyRevenue: metrics.monthlyRevenue || 0,
    conversionRate: metrics.conversionRate || 0,
    monthlyInvestmentData: [],
    userGrowthData: [],
    jarDistributionData: [],
    conversionRateData: [],
    COLORS,
  }

  // Map real recent activity to RecentSales format
  const mappedRecent = (metrics.recent || []).map((item: any) => {
    let action = ""
    if (item.type === "deposit") action = `Deposited to ${item.jar?.name || 'jar'}`
    else if (item.type === "withdrawal") action = `Withdrew from ${item.jar?.name || 'jar'}`
    else if (item.type === "interest") action = `Interest payment in ${item.jar?.name || 'jar'}`
    else action = item.description || item.type
    return {
      name: item.customer?.name || "Unknown",
      action,
      amount: item.amount,
      type: item.type,
      avatar: undefined, // Optionally map to a real avatar if available
    }
  })

  // Download handler for dashboard metrics
  const handleDownload = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Customers", metrics.totalCustomers],
      ["Total Value Locked", metrics.totalValueLocked],
      ["Active Jars", metrics.activeJars],
      ["Average APY", metrics.averageApy],
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `dashboard_metrics_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button onClick={handleDownload}>Download</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '--' : metrics.totalCustomers?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Add delta from last month if available */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '--' : `$${metrics.totalValueLocked?.toLocaleString()}`}</div>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Add delta from last month if available */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jars</CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '--' : metrics.activeJars?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Add delta from last month if available */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '--' : `${metrics.averageApy?.toFixed(2)}%`}</div>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Add delta from last month if available */}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={metrics.overview} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest customer transactions and jar creations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales sales={mappedRecent} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab {...analyticsProps} />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
} 