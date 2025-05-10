"use client"

import { useState, useEffect } from "react"
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
import { format } from 'date-fns'
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewLog, setViewLog] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [actionFilter, setActionFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [resourceFilter, setResourceFilter] = useState("")
  const [dateRange, setDateRange] = useState<{start: string|null, end: string|null}>({start: null, end: null})
  const [actionOptions, setActionOptions] = useState<string[]>([])
  const [userOptions, setUserOptions] = useState<string[]>([])
  const [resourceOptions, setResourceOptions] = useState<string[]>([])

  // Fetch logs with filters and pagination
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('pageSize', String(pageSize))
      if (searchTerm) params.set('search', searchTerm)
      if (actionFilter) params.set('action', actionFilter)
      if (userFilter) params.set('user', userFilter)
      if (resourceFilter) params.set('resource', resourceFilter)
      if (dateRange.start) params.set('start', dateRange.start)
      if (dateRange.end) params.set('end', dateRange.end)
      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`)
      const data = await res.json()
      setLogs(data.logs || [])
      setTotal(data.total || 0)
      setLoading(false)
    }
    fetchLogs()
    // eslint-disable-next-line
  }, [page, pageSize, searchTerm, actionFilter, userFilter, resourceFilter, dateRange])

  // Fetch filter options
  useEffect(() => {
    fetch('/api/admin/audit-logs?distinct=action').then(r => r.json()).then(d => setActionOptions(d.values || []))
    fetch('/api/admin/audit-logs?distinct=user_name').then(r => r.json()).then(d => setUserOptions(d.values || []))
    fetch('/api/admin/audit-logs?distinct=resource').then(r => r.json()).then(d => setResourceOptions(d.values || []))
  }, [])

  // Export handlers
  const handleExport = async (formatType: 'csv' | 'excel' | 'pdf') => {
    // Use all logs for export (fetch all pages)
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('pageSize', String(total || 1000))
    if (searchTerm) params.set('search', searchTerm)
    if (actionFilter) params.set('action', actionFilter)
    if (userFilter) params.set('user', userFilter)
    if (resourceFilter) params.set('resource', resourceFilter)
    if (dateRange.start) params.set('start', dateRange.start)
    if (dateRange.end) params.set('end', dateRange.end)
    const res = await fetch(`/api/admin/audit-logs?${params.toString()}`)
    const data = await res.json()
    const exportLogs = data.logs || []
    if (!exportLogs.length) return
    if (formatType === 'csv') {
      const csvRows = [
        Object.keys(exportLogs[0]).join(','),
        ...exportLogs.map((row: any) => Object.values(row).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      ]
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `audit_logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (formatType === 'excel') {
      const XLSX = await import('xlsx')
      const ws = XLSX.utils.json_to_sheet(exportLogs)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs')
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `audit_logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (formatType === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()
      autoTable(doc, {
        head: [Object.keys(exportLogs[0])],
        body: exportLogs.map((row: any) => Object.values(row)),
      })
      doc.save(`audit_logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`)
    }
  }

  const filteredLogs = logs
    .filter(
      (log) =>
        (log.userName || log.user_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.action || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.id || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((log) => {
      if (activeTab === "all") return true
      return (log.category || log.resource || "") === activeTab
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
          {/* Date Range Picker */}
          <CalendarDateRangePicker
            className="mr-2"
            onChange={(range: any) => {
              setDateRange({
                start: range?.from ? format(range.from, 'yyyy-MM-dd') : null,
                end: range?.to ? format(range.to, 'yyyy-MM-dd') : null,
              })
              setPage(1)
            }}
            value={{
              from: dateRange.start ? new Date(dateRange.start) : undefined,
              to: dateRange.end ? new Date(dateRange.end) : undefined,
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
                />
              </div>
              {/* Action Filter */}
              <Select value={actionFilter || '__all__'} onValueChange={v => { setActionFilter(v === '__all__' ? '' : v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Actions</SelectItem>
                  {actionOptions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* User Filter */}
              <Select value={userFilter || '__all__'} onValueChange={v => { setUserFilter(v === '__all__' ? '' : v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Users</SelectItem>
                  {userOptions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* Resource Filter */}
              <Select value={resourceFilter || '__all__'} onValueChange={v => { setResourceFilter(v === '__all__' ? '' : v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Resources</SelectItem>
                  {resourceOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* Reset Filters */}
              <Button variant="outline" size="sm" onClick={() => {
                setActionFilter(""); setUserFilter(""); setResourceFilter(""); setDateRange({start: null, end: null}); setSearchTerm(""); setPage(1)
              }}>Reset</Button>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={v => { setActiveTab(v); setPage(1) }}>
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
            {loading ? (
              <div className="flex justify-center items-center h-32 text-muted-foreground">Loading logs...</div>
            ) : (
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
                          <AvatarFallback className="text-xs">{(log.userName || log.user_name || "?").charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{log.userName || log.user_name || "System"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(log.category || log.resource)}
                          <span>{log.resource}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                    <TableCell>{formatDate(log.performed_at || log.timestamp)}</TableCell>
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
                                    {getCategoryIcon(viewLog.category || viewLog.resource)}
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
                                      {(viewLog.userName || viewLog.user_name || "System")} ({viewLog.userId || viewLog.user_id || "N/A"})
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Timestamp</Label>
                                    <p>{formatDate(viewLog.performed_at || viewLog.timestamp)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">IP Address</Label>
                                    <p>{viewLog.ipAddress || viewLog.ip_address}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Resource ID</Label>
                                    <p>{viewLog.resourceId || viewLog.entity_id || "N/A"}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm text-muted-foreground">User Agent</Label>
                                    <p className="text-sm">{viewLog.userAgent || viewLog.user_agent}</p>
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
            )}
          </div>

          {/* Add pagination controls below the table */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * pageSize + 1, total)}-
              {Math.min(page * pageSize, total)} of {total} logs
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm">Page {page}</span>
              <Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>
                Next
              </Button>
              <select
                className="ml-2 border rounded px-2 py-1 text-sm"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size} / page</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
