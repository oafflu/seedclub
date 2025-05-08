"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  Clock,
  AlertTriangle,
  User,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
// @ts-ignore
import { saveAs } from "file-saver"
// @ts-ignore
import Papa from "papaparse"
import * as XLSX from "xlsx"
import Link from "next/link"
import { supabase } from '@/lib/supabase/client'

// Add for messages
interface SupportMessage {
  id: string
  sender_type: string
  sender_id: string
  message: string
  created_at: string
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [viewTicket, setViewTicket] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ high: false, unassigned: false, recent: false })
  const [sort, setSort] = useState({ field: "created_at", order: "desc" })
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch tickets from API
  const fetchTickets = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeTab !== "all") params.append("status", activeTab)
    if (filters.high) params.append("priority", "high")
    if (filters.unassigned) params.append("assigned", "unassigned")
    if (filters.recent) params.append("recent", "1")
    if (searchTerm) params.append("search", searchTerm)
    if (sort.field) params.append("sort", sort.field)
    if (sort.order) params.append("order", sort.order)
    fetch(`/api/admin/support?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        // Map assigned_to to assignedTo for UI
        const mapped = (data.tickets || []).map((t: any) => ({
          ...t,
          assignedTo: t.assigned_to ?? t.assignedTo,
        }))
        setTickets(mapped)
        console.log('Fetched tickets:', mapped)
      })
      .finally(() => setLoading(false))
  }
  useEffect(fetchTickets, [activeTab, filters, searchTerm, sort])

  const filteredTickets = tickets
    .filter((ticket) => {
      if (!searchTerm) return true
      return (
        (ticket.customerName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.subject ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.id ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .filter((ticket) => {
      if (activeTab === "all") return true
      if (activeTab === "open") return ticket.status === "open"
      if (activeTab === "in-progress") return ticket.status === "in-progress"
      if (activeTab === "closed") return ticket.status === "closed"
      return true
    })
  // Debug log
  console.log('Filtered tickets:', filteredTickets)

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets((prev) => (prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]))
  }

  const toggleAllTickets = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id))
    }
  }

  // Calculate totals
  const openTickets = tickets.filter((ticket) => ticket.status === "open").length
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "in-progress").length
  const closedTickets = tickets.filter((ticket) => ticket.status === "closed").length
  const highPriorityTickets = tickets.filter((ticket) => ticket.priority === "high").length

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Filter handlers
  const handleFilterChange = (name: string, checked: boolean) => {
    setFilters((prev) => ({ ...prev, [name]: checked }))
  }

  // Sorting handler (add clickable headers if needed)
  // Example: onClick={() => setSort({ field: 'created_at', order: sort.order === 'asc' ? 'desc' : 'asc' })}

  // Export handlers
  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredTickets)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "support_tickets.csv")
  }
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTickets)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Tickets")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    saveAs(blob, "support_tickets.xlsx")
  }
  const handleExportPDF = async () => {
    if (!filteredTickets.length) {
      alert("No tickets to export.")
      return
    }
    try {
      const { jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      const doc = new jsPDF()
      const columns = ["ID", "Customer", "Subject", "Status", "Priority", "Created", "Assigned To"]
      const rows = filteredTickets.map((t) => [
        String(t.id ?? ""),
        String(t.customerName ?? t.customer_id ?? ""),
        String(t.subject ?? ""),
        String(t.status ?? ""),
        String(t.priority ?? ""),
        String(new Date(t.createdAt ?? t.created_at ?? Date.now()).toLocaleDateString()),
        String(t.assignedTo ?? t.assigned_to ?? "Unassigned"),
      ])
      autoTable(doc, {
        head: [columns],
        body: rows,
      })
      const blob = doc.output("blob")
      const filename = `support_tickets_export_pdf_${new Date().toISOString().split('T')[0]}.pdf`
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // Optionally show a toast here
    } catch (err) {
      alert("PDF export failed: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  // Fetch messages for a ticket
  const fetchMessages = async (ticketId: string) => {
    setMessagesLoading(true)
    try {
      const res = await fetch(`/api/admin/support/messages?ticket_id=${ticketId}`)
      const data = await res.json()
      setMessages(data.messages || [])
      console.log('Fetched messages:', data.messages)
    } catch (e) {
      setMessages([])
      console.error('Error fetching messages:', e)
    } finally {
      setMessagesLoading(false)
    }
  }

  // Post a new message
  const postMessage = async (ticketId: string, message: string) => {
    if (!message.trim()) return
    try {
      const res = await fetch(`/api/admin/support/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, message }),
      })
      const data = await res.json()
      console.log('Post message response:', data)
      setNewMessage("")
      await fetchMessages(ticketId)
    } catch (e) {
      console.error('Error posting message:', e)
    }
  }

  // Fetch current admin user ID on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentAdminId(data?.user?.id ?? null)
    })
  }, [])

  // Ticket status/actions
  const assignToMe = async (ticket: any) => {
    if (!ticket || !ticket.id || !currentAdminId) return
    setActionLoading(true)
    try {
      console.log('Assign to Me: currentAdminId:', currentAdminId, 'ticket.assignedTo:', ticket.assignedTo)
      console.log('Assigning to me payload:', { id: ticket.id, assigned_to: currentAdminId })
      const res = await fetch("/api/admin/support", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticket.id, assigned_to: currentAdminId }),
      })
      const data = await res.json()
      console.log('Assign to Me response:', data)
      if (res.ok) {
        setViewTicket(null)
        fetchTickets()
      } else {
        alert('Failed to assign ticket: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Failed to assign ticket: ' + e)
    } finally {
      setActionLoading(false)
    }
  }
  const updateTicketStatus = async (ticket: any, status: string, resolution?: string) => {
    if (!ticket || !ticket.id) return
    setActionLoading(true)
    try {
      console.log('Updating ticket status:', { ticketId: ticket.id, status, resolution })
      const res = await fetch("/api/admin/support", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticket.id, status, resolution }),
      })
      const data = await res.json()
      console.log('Update status response:', data)
      if (res.ok) {
        setViewTicket(null)
        fetchTickets()
      } else {
        alert('Failed to update ticket: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Failed to update ticket: ' + e)
    } finally {
      setActionLoading(false)
    }
  }

  // Ensure message thread is always shown and fetches messages for the ticket
  useEffect(() => {
    if (viewTicket?.id) {
      fetchMessages(viewTicket.id)
    }
  }, [viewTicket?.id])

  // Add a stub for View Customer
  const viewCustomer = (ticket: any) => {
    alert(`View Customer: ${ticket.customerName ?? ticket.customerId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support Ticket Management</h1>
        <Link href="/admin/support/create">
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" /> Create Ticket
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Tickets</CardDescription>
            <CardTitle className="text-3xl">{openTickets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
              <span>Awaiting response</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{inProgressTickets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-4 w-4 text-blue-500" />
              <span>Being handled</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Closed Tickets</CardDescription>
            <CardTitle className="text-3xl">{closedTickets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              <span>Resolved issues</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Priority</CardDescription>
            <CardTitle className="text-3xl">{highPriorityTickets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />
              <span>Urgent attention needed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Manage and respond to customer support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tickets..."
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
                    <Checkbox id="high" className="mr-2" checked={filters.high} onCheckedChange={(v: boolean) => handleFilterChange('high', v)} />
                    <Label htmlFor="high">High Priority</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="unassigned" className="mr-2" checked={filters.unassigned} onCheckedChange={(v: boolean) => handleFilterChange('unassigned', v)} />
                    <Label htmlFor="unassigned">Unassigned</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="recent" className="mr-2" checked={filters.recent} onCheckedChange={(v: boolean) => handleFilterChange('recent', v)} />
                    <Label htmlFor="recent">Last 24 Hours</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>Export as Excel</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onCheckedChange={toggleAllTickets}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id ?? ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id ?? "")}
                        onCheckedChange={() => toggleTicketSelection(ticket.id ?? "")}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{ticket.id ?? ""}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{ticket.customerName ?? ""}</span>
                        <span className="text-xs text-muted-foreground">{ticket.customerEmail ?? ticket.customerId ?? ""}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.subject ?? ""}</TableCell>
                    <TableCell>
                      <Badge variant={
                        ticket.status === "open"
                          ? "outline"
                          : ticket.status === "in-progress"
                            ? "secondary"
                            : "default"
                      }>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === "high"
                            ? "destructive"
                            : ticket.priority === "medium"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.createdAt ?? ticket.created_at ?? "").toLocaleDateString()}</TableCell>
                    <TableCell>
                      {ticket.assignedAdmin && (ticket.assignedAdmin.first_name || ticket.assignedAdmin.last_name || ticket.assignedAdmin.email) ? (
                        `${ticket.assignedAdmin.first_name ?? ''} ${ticket.assignedAdmin.last_name ?? ''}`.trim() || ticket.assignedAdmin.email
                      ) : ticket.assignedTo ? (
                        ticket.assignedTo === currentAdminId ? 'Assigned to Me' : ticket.assignedTo
                      ) : (
                        <Badge variant="outline">Unassigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setViewTicket(ticket)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                              <DialogTitle>Support Ticket Details</DialogTitle>
                              <DialogDescription>Detailed information about the support ticket.</DialogDescription>
                            </DialogHeader>
                            {viewTicket && (
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                      <AvatarFallback>{(viewTicket.customerName ?? "?").charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{viewTicket.customerName ?? ""}</h3>
                                      <p className="text-sm text-muted-foreground">{viewTicket.customerId ?? ""}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        viewTicket.status === "open"
                                          ? "outline"
                                          : viewTicket.status === "in-progress"
                                            ? "secondary"
                                            : "default"
                                      }
                                    >
                                      {viewTicket.status}
                                    </Badge>
                                    <Badge
                                      variant={
                                        viewTicket.priority === "high"
                                          ? "destructive"
                                          : viewTicket.priority === "medium"
                                            ? "outline"
                                            : "secondary"
                                      }
                                    >
                                      {viewTicket.priority}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-base font-medium">{viewTicket.subject ?? ""}</h4>
                                  <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                                    <p>{viewTicket.description ?? ""}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Created At</Label>
                                    <p>{formatDate(viewTicket.createdAt ?? "")}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Last Updated</Label>
                                    <p>{formatDate(viewTicket.updatedAt ?? "")}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Category</Label>
                                    <p className="capitalize">{viewTicket.category ?? ""}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Assigned To</Label>
                                    <p>
                                      {viewTicket.assignedAdmin && (viewTicket.assignedAdmin.first_name || viewTicket.assignedAdmin.last_name || viewTicket.assignedAdmin.email) ? (
                                        `${viewTicket.assignedAdmin.first_name ?? ''} ${viewTicket.assignedAdmin.last_name ?? ''}`.trim() || viewTicket.assignedAdmin.email
                                      ) : viewTicket.assignedTo ? (
                                        viewTicket.assignedTo === currentAdminId ? 'Assigned to Me' : viewTicket.assignedTo
                                      ) : (
                                        <Badge variant="outline">Unassigned</Badge>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {viewTicket.resolution && (
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Resolution</Label>
                                    <div className="mt-1 rounded-md bg-muted p-3 text-sm">
                                      <p>{viewTicket.resolution ?? ""}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Message Thread */}
                                <div>
                                  <Label className="text-sm text-muted-foreground mb-2">Conversation</Label>
                                  <div className="max-h-48 overflow-y-auto border rounded p-2 bg-muted mb-2">
                                    {messagesLoading ? (
                                      <div>Loading messages...</div>
                                    ) : messages.length === 0 ? (
                                      <div className="text-muted-foreground text-sm">No messages yet.</div>
                                    ) : (
                                      messages.map((msg) => (
                                        <div key={msg.id} className="mb-2">
                                          <span className="font-semibold text-xs mr-2">{msg.sender_type === 'admin' ? 'Admin' : 'Customer'}</span>
                                          <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
                                          <div className="ml-2 text-sm">{msg.message}</div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                  {viewTicket.status !== "closed" && (
                                    <div className="flex gap-2 mt-2">
                                      <Textarea
                                        id="response"
                                        placeholder="Type your response here..."
                                        className="mt-1 flex-1"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                      />
                                      <Button onClick={() => postMessage(viewTicket.id, newMessage)} disabled={!newMessage.trim()}>Send</Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              {viewTicket?.status !== "closed" ? (
                                <>
                                  {(!viewTicket?.assignedTo || viewTicket.assignedTo !== currentAdminId) && (
                                    <Button variant="outline" onClick={() => assignToMe(viewTicket)} disabled={actionLoading}>Assign to Me</Button>
                                  )}
                                  <Button variant="outline" onClick={() => updateTicketStatus(viewTicket, "in-progress") } disabled={actionLoading}> <Clock className="mr-2 h-4 w-4" /> Mark In Progress</Button>
                                  <Button onClick={() => updateTicketStatus(viewTicket, "closed") } disabled={actionLoading}> <CheckCircle className="mr-2 h-4 w-4" /> Resolve & Close</Button>
                                </>
                              ) : (
                                <Button variant="outline" onClick={() => updateTicketStatus(viewTicket, "open") } disabled={actionLoading}>Reopen Ticket</Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewCustomer(ticket)}>
                              <User className="mr-2 h-4 w-4" /> View Customer
                            </DropdownMenuItem>
                            {ticket.status !== "closed" && (
                              <>
                                {(!ticket.assignedTo || ticket.assignedTo !== currentAdminId) && (
                                  <DropdownMenuItem onClick={() => assignToMe(ticket)} disabled={actionLoading}>
                                    <User className="mr-2 h-4 w-4" /> Assign to Me
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket, "in-progress") } disabled={actionLoading}>
                                  <Clock className="mr-2 h-4 w-4" /> Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket, "closed") } disabled={actionLoading}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Resolve & Close
                                </DropdownMenuItem>
                              </>
                            )}
                            {ticket.status === "closed" && (
                              <DropdownMenuItem onClick={() => updateTicketStatus(ticket, "open") } disabled={actionLoading}>
                                <AlertTriangle className="mr-2 h-4 w-4" /> Reopen Ticket
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

