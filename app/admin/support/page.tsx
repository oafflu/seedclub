"use client"

import { useState } from "react"
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

// Mock data for support tickets
const tickets = [
  {
    id: "TICKET-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    subject: "Withdrawal Issue",
    description: "I'm having trouble withdrawing funds from my account. The transaction has been pending for 3 days.",
    status: "open",
    priority: "high",
    category: "account",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:45:00Z",
    assignedTo: "Agent Smith",
  },
  {
    id: "TICKET-002",
    customerId: "CUST-002",
    customerName: "Sarah Johnson",
    subject: "Interest Rate Question",
    description: "I'd like to understand how the interest rates are calculated for the 24-month investment jar.",
    status: "open",
    priority: "medium",
    category: "investment",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
    assignedTo: null,
  },
  {
    id: "TICKET-003",
    customerId: "CUST-003",
    customerName: "Michael Chen",
    subject: "Account Verification",
    description: "I submitted my verification documents 5 days ago but my account is still not verified.",
    status: "in-progress",
    priority: "medium",
    category: "kyc",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-17T09:30:00Z",
    assignedTo: "Agent Johnson",
  },
  {
    id: "TICKET-004",
    customerId: "CUST-004",
    customerName: "Emily Davis",
    subject: "Referral Bonus Missing",
    description: "I referred my friend who created an account and invested, but I haven't received my referral bonus.",
    status: "open",
    priority: "low",
    category: "referral",
    createdAt: "2024-01-17T13:20:00Z",
    updatedAt: "2024-01-17T13:20:00Z",
    assignedTo: null,
  },
  {
    id: "TICKET-005",
    customerId: "CUST-005",
    customerName: "Robert Wilson",
    subject: "App Login Issue",
    description:
      "I'm unable to log in to the mobile app. It keeps saying 'Invalid credentials' even though I'm sure my password is correct.",
    status: "in-progress",
    priority: "high",
    category: "technical",
    createdAt: "2024-01-16T15:10:00Z",
    updatedAt: "2024-01-17T10:45:00Z",
    assignedTo: "Agent Brown",
  },
  {
    id: "TICKET-006",
    customerId: "CUST-006",
    customerName: "Jennifer Lee",
    subject: "Early Withdrawal Request",
    description:
      "I need to withdraw my investment early due to a family emergency. What are the penalties and process?",
    status: "closed",
    priority: "medium",
    category: "investment",
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-15T16:20:00Z",
    assignedTo: "Agent Smith",
    resolution: "Explained early withdrawal process and penalties. Customer proceeded with partial withdrawal.",
  },
  {
    id: "TICKET-007",
    customerId: "CUST-007",
    customerName: "David Brown",
    subject: "Investment Strategy Advice",
    description: "I'd like some advice on which investment jar would be best for my retirement goals.",
    status: "closed",
    priority: "low",
    category: "investment",
    createdAt: "2024-01-13T14:25:00Z",
    updatedAt: "2024-01-16T09:50:00Z",
    assignedTo: "Agent Johnson",
    resolution: "Provided detailed comparison of investment options. Customer chose the 36-month jar.",
  },
  {
    id: "TICKET-008",
    customerId: "CUST-008",
    customerName: "Lisa Martinez",
    subject: "Tax Documentation",
    description: "I need tax documents for my investments for the 2023 tax year.",
    status: "open",
    priority: "medium",
    category: "account",
    createdAt: "2024-01-17T16:40:00Z",
    updatedAt: "2024-01-17T16:40:00Z",
    assignedTo: null,
  },
]

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [viewTicket, setViewTicket] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredTickets = tickets
    .filter(
      (ticket) =>
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((ticket) => {
      if (activeTab === "all") return true
      if (activeTab === "open") return ticket.status === "open"
      if (activeTab === "in-progress") return ticket.status === "in-progress"
      if (activeTab === "closed") return ticket.status === "closed"
      return true
    })

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support Ticket Management</h1>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" /> Create Ticket
        </Button>
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
                    <Checkbox id="high" className="mr-2" />
                    <Label htmlFor="high">High Priority</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="unassigned" className="mr-2" />
                    <Label htmlFor="unassigned">Unassigned</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="recent" className="mr-2" />
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

              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
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
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => toggleTicketSelection(ticket.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{ticket.customerName}</span>
                        <span className="text-xs text-muted-foreground">{ticket.customerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "outline"
                            : ticket.status === "in-progress"
                              ? "secondary"
                              : "default"
                        }
                      >
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
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {ticket.assignedTo ? (
                        ticket.assignedTo
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                          Unassigned
                        </Badge>
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
                                      <AvatarFallback>{viewTicket.customerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{viewTicket.customerName}</h3>
                                      <p className="text-sm text-muted-foreground">{viewTicket.customerId}</p>
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
                                  <h4 className="text-base font-medium">{viewTicket.subject}</h4>
                                  <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                                    <p>{viewTicket.description}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Created At</Label>
                                    <p>{formatDate(viewTicket.createdAt)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Last Updated</Label>
                                    <p>{formatDate(viewTicket.updatedAt)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Category</Label>
                                    <p className="capitalize">{viewTicket.category}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Assigned To</Label>
                                    <p>
                                      {viewTicket.assignedTo ? (
                                        viewTicket.assignedTo
                                      ) : (
                                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                                          Unassigned
                                        </Badge>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {viewTicket.resolution && (
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Resolution</Label>
                                    <div className="mt-1 rounded-md bg-muted p-3 text-sm">
                                      <p>{viewTicket.resolution}</p>
                                    </div>
                                  </div>
                                )}

                                {viewTicket.status !== "closed" && (
                                  <div>
                                    <Label htmlFor="response">Response</Label>
                                    <Textarea id="response" placeholder="Type your response here..." className="mt-1" />
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter>
                              {viewTicket?.status !== "closed" ? (
                                <>
                                  {!viewTicket?.assignedTo && <Button variant="outline">Assign to Me</Button>}
                                  <Button variant="outline">
                                    <Clock className="mr-2 h-4 w-4" /> Mark In Progress
                                  </Button>
                                  <Button>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Resolve & Close
                                  </Button>
                                </>
                              ) : (
                                <Button variant="outline">Reopen Ticket</Button>
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
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" /> View Customer
                            </DropdownMenuItem>
                            {ticket.status !== "closed" && (
                              <>
                                {!ticket.assignedTo && (
                                  <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" /> Assign to Me
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Clock className="mr-2 h-4 w-4" /> Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Resolve & Close
                                </DropdownMenuItem>
                              </>
                            )}
                            {ticket.status === "closed" && (
                              <DropdownMenuItem>
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
