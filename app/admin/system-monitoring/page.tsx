"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  RefreshCw,
  Server,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for system metrics
const cpuUsageData = [
  { time: "00:00", usage: 25 },
  { time: "01:00", usage: 20 },
  { time: "02:00", usage: 15 },
  { time: "03:00", usage: 18 },
  { time: "04:00", usage: 22 },
  { time: "05:00", usage: 28 },
  { time: "06:00", usage: 35 },
  { time: "07:00", usage: 45 },
  { time: "08:00", usage: 65 },
  { time: "09:00", usage: 78 },
  { time: "10:00", usage: 82 },
  { time: "11:00", usage: 75 },
  { time: "12:00", usage: 70 },
  { time: "13:00", usage: 65 },
  { time: "14:00", usage: 72 },
  { time: "15:00", usage: 85 },
  { time: "16:00", usage: 78 },
  { time: "17:00", usage: 65 },
  { time: "18:00", usage: 55 },
  { time: "19:00", usage: 48 },
  { time: "20:00", usage: 40 },
  { time: "21:00", usage: 35 },
  { time: "22:00", usage: 30 },
  { time: "23:00", usage: 25 },
]

const memoryUsageData = [
  { time: "00:00", usage: 40 },
  { time: "01:00", usage: 38 },
  { time: "02:00", usage: 35 },
  { time: "03:00", usage: 32 },
  { time: "04:00", usage: 30 },
  { time: "05:00", usage: 35 },
  { time: "06:00", usage: 40 },
  { time: "07:00", usage: 45 },
  { time: "08:00", usage: 55 },
  { time: "09:00", usage: 65 },
  { time: "10:00", usage: 70 },
  { time: "11:00", usage: 68 },
  { time: "12:00", usage: 65 },
  { time: "13:00", usage: 62 },
  { time: "14:00", usage: 60 },
  { time: "15:00", usage: 65 },
  { time: "16:00", usage: 70 },
  { time: "17:00", usage: 68 },
  { time: "18:00", usage: 62 },
  { time: "19:00", usage: 58 },
  { time: "20:00", usage: 52 },
  { time: "21:00", usage: 48 },
  { time: "22:00", usage: 45 },
  { time: "23:00", usage: 42 },
]

const diskUsageData = [
  { time: "00:00", usage: 62 },
  { time: "01:00", usage: 62.1 },
  { time: "02:00", usage: 62.2 },
  { time: "03:00", usage: 62.3 },
  { time: "04:00", usage: 62.4 },
  { time: "05:00", usage: 62.5 },
  { time: "06:00", usage: 62.6 },
  { time: "07:00", usage: 62.7 },
  { time: "08:00", usage: 62.9 },
  { time: "09:00", usage: 63.2 },
  { time: "10:00", usage: 63.5 },
  { time: "11:00", usage: 63.8 },
  { time: "12:00", usage: 64.0 },
  { time: "13:00", usage: 64.2 },
  { time: "14:00", usage: 64.5 },
  { time: "15:00", usage: 64.8 },
  { time: "16:00", usage: 65.0 },
  { time: "17:00", usage: 65.2 },
  { time: "18:00", usage: 65.3 },
  { time: "19:00", usage: 65.4 },
  { time: "20:00", usage: 65.5 },
  { time: "21:00", usage: 65.6 },
  { time: "22:00", usage: 65.7 },
  { time: "23:00", usage: 65.8 },
]

const networkTrafficData = [
  { time: "00:00", incoming: 10, outgoing: 5 },
  { time: "01:00", incoming: 8, outgoing: 4 },
  { time: "02:00", incoming: 5, outgoing: 3 },
  { time: "03:00", incoming: 3, outgoing: 2 },
  { time: "04:00", incoming: 2, outgoing: 1 },
  { time: "05:00", incoming: 5, outgoing: 2 },
  { time: "06:00", incoming: 10, outgoing: 5 },
  { time: "07:00", incoming: 20, outgoing: 10 },
  { time: "08:00", incoming: 35, outgoing: 18 },
  { time: "09:00", incoming: 50, outgoing: 25 },
  { time: "10:00", incoming: 65, outgoing: 32 },
  { time: "11:00", incoming: 60, outgoing: 30 },
  { time: "12:00", incoming: 55, outgoing: 28 },
  { time: "13:00", incoming: 60, outgoing: 30 },
  { time: "14:00", incoming: 70, outgoing: 35 },
  { time: "15:00", incoming: 75, outgoing: 38 },
  { time: "16:00", incoming: 65, outgoing: 32 },
  { time: "17:00", incoming: 55, outgoing: 28 },
  { time: "18:00", incoming: 45, outgoing: 22 },
  { time: "19:00", incoming: 35, outgoing: 18 },
  { time: "20:00", incoming: 25, outgoing: 12 },
  { time: "21:00", incoming: 20, outgoing: 10 },
  { time: "22:00", incoming: 15, outgoing: 8 },
  { time: "23:00", incoming: 12, outgoing: 6 },
]

const databaseQueriesData = [
  { time: "00:00", queries: 50, avgResponseTime: 15 },
  { time: "01:00", queries: 40, avgResponseTime: 12 },
  { time: "02:00", queries: 30, avgResponseTime: 10 },
  { time: "03:00", queries: 20, avgResponseTime: 8 },
  { time: "04:00", queries: 15, avgResponseTime: 7 },
  { time: "05:00", queries: 25, avgResponseTime: 9 },
  { time: "06:00", queries: 45, avgResponseTime: 12 },
  { time: "07:00", queries: 80, avgResponseTime: 18 },
  { time: "08:00", queries: 150, avgResponseTime: 25 },
  { time: "09:00", queries: 250, avgResponseTime: 35 },
  { time: "10:00", queries: 320, avgResponseTime: 45 },
  { time: "11:00", queries: 280, avgResponseTime: 40 },
  { time: "12:00", queries: 250, avgResponseTime: 35 },
  { time: "13:00", queries: 270, avgResponseTime: 38 },
  { time: "14:00", queries: 300, avgResponseTime: 42 },
  { time: "15:00", queries: 320, avgResponseTime: 45 },
  { time: "16:00", queries: 280, avgResponseTime: 40 },
  { time: "17:00", queries: 220, avgResponseTime: 32 },
  { time: "18:00", queries: 180, avgResponseTime: 28 },
  { time: "19:00", queries: 120, avgResponseTime: 22 },
  { time: "20:00", queries: 90, avgResponseTime: 18 },
  { time: "21:00", queries: 70, avgResponseTime: 15 },
  { time: "22:00", queries: 60, avgResponseTime: 14 },
  { time: "23:00", queries: 55, avgResponseTime: 13 },
]

// Mock data for system services
const systemServices = [
  {
    id: "service-001",
    name: "Web Server",
    status: "running",
    uptime: "45 days, 12 hours",
    lastRestart: "2023-12-05T08:30:00Z",
    type: "nginx",
    version: "1.20.2",
  },
  {
    id: "service-002",
    name: "Application Server",
    status: "running",
    uptime: "30 days, 5 hours",
    lastRestart: "2023-12-20T15:45:00Z",
    type: "node.js",
    version: "18.12.1",
  },
  {
    id: "service-003",
    name: "Database Server",
    status: "running",
    uptime: "45 days, 12 hours",
    lastRestart: "2023-12-05T08:30:00Z",
    type: "postgresql",
    version: "14.5",
  },
  {
    id: "service-004",
    name: "Redis Cache",
    status: "running",
    uptime: "45 days, 12 hours",
    lastRestart: "2023-12-05T08:30:00Z",
    type: "redis",
    version: "6.2.6",
  },
  {
    id: "service-005",
    name: "Background Worker",
    status: "running",
    uptime: "15 days, 8 hours",
    lastRestart: "2024-01-05T10:15:00Z",
    type: "node.js",
    version: "18.12.1",
  },
  {
    id: "service-006",
    name: "Scheduled Tasks",
    status: "warning",
    uptime: "5 days, 3 hours",
    lastRestart: "2024-01-15T09:45:00Z",
    type: "cron",
    version: "3.0.1",
    issue: "High resource usage detected",
  },
  {
    id: "service-007",
    name: "Email Service",
    status: "running",
    uptime: "45 days, 12 hours",
    lastRestart: "2023-12-05T08:30:00Z",
    type: "sendgrid",
    version: "1.0.0",
  },
  {
    id: "service-008",
    name: "Payment Processor",
    status: "running",
    uptime: "25 days, 18 hours",
    lastRestart: "2023-12-25T06:00:00Z",
    type: "stripe",
    version: "2.0.0",
  },
]

// Mock data for recent alerts
const recentAlerts = [
  {
    id: "alert-001",
    severity: "warning",
    message: "High CPU usage detected (85%)",
    timestamp: "2024-01-20T15:30:00Z",
    service: "Application Server",
    status: "active",
  },
  {
    id: "alert-002",
    severity: "info",
    message: "Database backup completed successfully",
    timestamp: "2024-01-20T12:00:00Z",
    service: "Database Server",
    status: "resolved",
  },
  {
    id: "alert-003",
    severity: "error",
    message: "Failed login attempts exceeded threshold",
    timestamp: "2024-01-19T22:15:00Z",
    service: "Authentication Service",
    status: "resolved",
  },
  {
    id: "alert-004",
    severity: "warning",
    message: "Scheduled task taking longer than expected",
    timestamp: "2024-01-19T18:45:00Z",
    service: "Scheduled Tasks",
    status: "active",
  },
  {
    id: "alert-005",
    severity: "info",
    message: "System update available",
    timestamp: "2024-01-18T09:30:00Z",
    service: "System",
    status: "active",
  },
]

export default function SystemMonitoringPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("24h")
  const [metrics, setMetrics] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMonitoringData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/system-monitoring")
      const data = await res.json()
      setMetrics(data.metrics)
      setServices(data.services)
      setAlerts(data.alerts)
    } catch (e) {
      // Optionally handle error
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMonitoringData()
    // eslint-disable-next-line
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchMonitoringData().then(() => setRefreshing(false))
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Monitoring</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="12h">Last 12 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* System Overview */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-muted-foreground">Loading system metrics...</span>
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>CPU Usage</CardDescription>
            <CardTitle className="text-3xl">{metrics?.cpu?.usage ?? "-"}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics?.cpu?.usage ?? 0} className="h-2" />
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Cpu className="mr-1 h-4 w-4 text-primary" />
              <span>{metrics?.cpu?.cores ?? "-"} cores, {metrics?.cpu?.speed ?? "-"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Memory Usage</CardDescription>
            <CardTitle className="text-3xl">{metrics?.memory?.usage ?? "-"}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics?.memory?.usage ?? 0} className="h-2" />
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Server className="mr-1 h-4 w-4 text-primary" />
              <span>{metrics?.memory?.used ?? "-"} GB / {metrics?.memory?.total ?? "-"} GB</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Disk Usage</CardDescription>
            <CardTitle className="text-3xl">{metrics?.disk?.usage ?? "-"}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics?.disk?.usage ?? 0} className="h-2" />
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <HardDrive className="mr-1 h-4 w-4 text-primary" />
              <span>{metrics?.disk?.used ?? "-"} GB / {metrics?.disk?.total ?? "-"} GB</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Network Traffic</CardDescription>
            <CardTitle className="text-3xl">{metrics?.network?.total ?? "-"} {metrics?.network?.unit ?? "Mbps"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-500">↑ {metrics?.network?.up ?? "-"} Mbps</span>
              <span className="text-blue-500">↓ {metrics?.network?.down ?? "-"} Mbps</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Network className="mr-1 h-4 w-4 text-primary" />
              <span>1 Gbps connection</span>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
                <CardDescription>Percentage of CPU utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    usage: {
                      label: "CPU Usage (%)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#204854" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#204854" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="usage" stroke="#204854" fillOpacity={1} fill="url(#colorUsage)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>Percentage of memory utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    usage: {
                      label: "Memory Usage (%)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={memoryUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#286578" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#286578" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="usage" stroke="#286578" fillOpacity={1} fill="url(#colorMemory)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disk Usage</CardTitle>
                <CardDescription>Percentage of disk space utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    usage: {
                      label: "Disk Usage (%)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={diskUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="time" />
                      <YAxis domain={[60, 70]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#d97a4b"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Traffic</CardTitle>
                <CardDescription>Incoming and outgoing network traffic over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    incoming: {
                      label: "Incoming (Mbps)",
                      color: "hsl(var(--chart-1))",
                    },
                    outgoing: {
                      label: "Outgoing (Mbps)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={networkTrafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="incoming"
                        stroke="#204854"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="outgoing"
                        stroke="#d97a4b"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
                <CardDescription>Query volume and response times</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    queries: {
                      label: "Queries per Minute",
                      color: "hsl(var(--chart-1))",
                    },
                    avgResponseTime: {
                      label: "Avg Response Time (ms)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={databaseQueriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="queries"
                        stroke="#204854"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgResponseTime"
                        stroke="#286578"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>System Services</CardTitle>
              <CardDescription>Status and health of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Last Restart</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.type}</TableCell>
                        <TableCell>{service.version}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(service.status)}
                            <Badge
                              variant={
                                service.status === "running"
                                  ? "default"
                                  : service.status === "warning"
                                    ? "outline"
                                    : "destructive"
                              }
                              className="capitalize"
                            >
                              {service.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{service.uptime}</TableCell>
                        <TableCell>{formatDate(service.lastRestart)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="mr-2 h-3 w-3" />
                            Restart
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(alert.severity)}
                            <Badge
                              variant={
                                alert.severity === "error"
                                  ? "destructive"
                                  : alert.severity === "warning"
                                    ? "outline"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{alert.message}</TableCell>
                        <TableCell>{alert.service}</TableCell>
                        <TableCell>{formatDate(alert.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant={alert.status === "active" ? "outline" : "default"} className="capitalize">
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {alert.status === "active" ? (
                            <Button variant="outline" size="sm">
                              Resolve
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
