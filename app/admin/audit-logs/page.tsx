"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  Calendar,
  Clock,
  User,
  FileText,
  Settings,
  Database,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for audit logs
const auditLogs = [
  {
    id: "LOG-001",
    userId: "USER-001",
    userName: "John Admin",
    action: "login",
    resource: "system",
    resourceId: null,
    details: "User logged in successfully",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:30:00Z",
    category: "authentication",
  },
  {
    id: "LOG-002",
    userId: "USER-001",
    userName: "John Admin",
    action: "update",
    resource: "settings",
    resourceId: "SETTING-001",
    details: "Updated system settings: Changed APY rate for 12-month jar from 10% to 12%",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:35:00Z",
    category: "settings",
  },
  {
    id: "LOG-003",
    userId: "USER-002",
    userName: "Sarah Manager",
    action: "create",
    resource: "customer",
    resourceId: "CUST-010",
    details: "Created new customer account for Jane Doe",
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: "2024-01-20T15:10:00Z",
    category: "customer",
  },
  {
    id: "LOG-004",
    userId: "USER-003",
    userName: "Michael Support",
    action: "view",
    resource: "transaction",
    resourceId: "TX-105",
    details: "Viewed transaction details for TX-105",
    ipAddress: "192.168.1.3",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    timestamp: "2024-01-20T15:45:00Z",
    category: "transaction",
  },
  {
    id: "LOG-005",
    userId: "USER-002",
    userName: "Sarah Manager",
    action: "approve",
    resource: "withdrawal",
    resourceId: "TX-102",
    details: "Approved withdrawal request for $2,000 from Emily Davis (CUST-004)",
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: "2024-01-20T16:20:00Z",
    category: "transaction",
  },
  {
    id: "LOG-006",
    userId: "USER-001",
    userName: "John Admin",
    action: "create",
    resource: "user",
    resourceId: "USER-005",
    details: "Created new admin user: Robert Viewer with Viewer role",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T16:45:00Z",
    category: "user",
  },
  {
    id: "LOG-007",
    userId: "USER-004",
    userName: "Emily Analyst",
    action: "export",
    resource: "report",
    resourceId: null,
    details: "Exported monthly transaction report for January 2024",
    ipAddress: "192.168.1.4",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T17:15:00Z",
    category: "report",
  },
  {
    id: "LOG-008",
    userId: "USER-003",
    userName: "Michael Support",
    action: "update",
    resource: "ticket",
    resourceId: "TICKET-003",
    details: "Updated support ticket: Marked as in-progress and assigned to self",
    ipAddress: "192.168.1.3",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    timestamp: "2024-01-20T17:30:00Z",
    category: "support",
  },
  {
    id: "LOG-009",
    userId: "USER-001",
    userName: "John Admin",
    action: "update",
    resource: "role",
    resourceId: "ROLE-003",
    details: "Updated Support role permissions: Added view reports permission",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T18:00:00Z",
    category: "user",
  },
  {
    id: "LOG-010",
    userId: "SYSTEM",
    userName: "System",
    action: "process",
    resource: "interest",
    resourceId: null,
    details: "Processed monthly interest payments for all active jars",
    ipAddress: "127.0.0.1",
    userAgent: "SeedClub/1.0",
    timestamp: "2024-01-20T00:00:00Z",
    category: "system",
  },
]

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewLog, setViewLog] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredLogs = auditLogs
    .filter(
      (log) =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((log) => {
      if (activeTab === "all") return true
      return log.category === activeTab
    })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <Shield className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      case "customer":
        return <User className="h-4 w-4" />
      case "transaction":
        return <Database className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      case "support":
        return <User className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>Track all actions performed in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Checkbox id="admin-actions" className="mr-2" />
                    <Label htmlFor="admin-actions">Admin Actions</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="system-events" className="mr-2" />
                    <Label htmlFor="system-events">System Events</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="today-only" className="mr-2" />
                    <Label htmlFor="today-only">Today Only</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="authentication">Auth</TabsTrigger>
                  <TabsTrigger value="transaction">Transactions</TabsTrigger>
                  <TabsTrigger value="user">Users</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{log.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{log.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(log.category)}
                          <span>{log.resource}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setViewLog(log)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Audit Log Details</DialogTitle>
                              <DialogDescription>Detailed information about this activity.</DialogDescription>
                            </DialogHeader>
                            {viewLog && (
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="rounded-full bg-primary/10 p-3">
                                    {getCategoryIcon(viewLog.category)}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold capitalize">
                                      {viewLog.action} {viewLog.resource}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{viewLog.id}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">User</Label>
                                    <p>
                                      {viewLog.userName} ({viewLog.userId})
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Timestamp</Label>
                                    <p>{formatDate(viewLog.timestamp)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">IP Address</Label>
                                    <p>{viewLog.ipAddress}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Resource ID</Label>
                                    <p>{viewLog.resourceId || "N/A"}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm text-muted-foreground">User Agent</Label>
                                    <p className="text-sm">{viewLog.userAgent}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm text-muted-foreground">Details</Label>
                                    <p>{viewLog.details}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
