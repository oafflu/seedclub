"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  ChevronDown,
  CreditCard,
  BanknoteIcon,
  AlertTriangle,
  Calendar,
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

// Mock data for transactions
const transactions = [
  {
    id: "TX-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    type: "deposit",
    amount: 5000,
    date: "2023-12-15",
    description: "Initial deposit",
    method: "Bank Transfer",
    status: "completed",
    jarId: "JAR-001",
  },
  {
    id: "TX-002",
    customerId: "CUST-002",
    customerName: "Sarah Johnson",
    type: "deposit",
    amount: 10000,
    date: "2023-12-10",
    description: "Initial deposit",
    method: "Credit Card",
    status: "completed",
    jarId: "JAR-002",
  },
  {
    id: "TX-003",
    customerId: "CUST-003",
    customerName: "Michael Chen",
    type: "deposit",
    amount: 15000,
    date: "2023-12-01",
    description: "Initial deposit",
    method: "Bank Transfer",
    status: "completed",
    jarId: "JAR-003",
  },
  {
    id: "TX-004",
    customerId: "CUST-001",
    customerName: "John Smith",
    type: "interest",
    amount: 50,
    date: "2024-01-15",
    description: "Monthly interest",
    method: "System",
    status: "completed",
    jarId: "JAR-001",
  },
  {
    id: "TX-005",
    customerId: "CUST-002",
    customerName: "Sarah Johnson",
    type: "interest",
    amount: 116.67,
    date: "2024-01-10",
    description: "Monthly interest",
    method: "System",
    status: "completed",
    jarId: "JAR-002",
  },
  {
    id: "TX-006",
    customerId: "CUST-003",
    customerName: "Michael Chen",
    type: "interest",
    amount: 200,
    date: "2024-01-01",
    description: "Monthly interest",
    method: "System",
    status: "completed",
    jarId: "JAR-003",
  },
  {
    id: "TX-007",
    customerId: "CUST-004",
    customerName: "Emily Davis",
    type: "deposit",
    amount: 25000,
    date: "2023-11-15",
    description: "Initial deposit",
    method: "Bank Transfer",
    status: "completed",
    jarId: "JAR-004",
  },
  {
    id: "TX-008",
    customerId: "CUST-005",
    customerName: "Robert Wilson",
    type: "withdrawal",
    amount: 2000,
    date: "2024-01-18",
    description: "Partial withdrawal",
    method: "Bank Transfer",
    status: "pending",
    jarId: "JAR-005",
  },
  {
    id: "TX-009",
    customerId: "CUST-007",
    customerName: "David Brown",
    type: "deposit",
    amount: 3000,
    date: "2023-12-01",
    description: "Initial deposit",
    method: "Credit Card",
    status: "completed",
    jarId: "JAR-006",
  },
  {
    id: "TX-010",
    customerId: "CUST-008",
    customerName: "Lisa Martinez",
    type: "deposit",
    amount: 7500,
    date: "2023-11-20",
    description: "Initial deposit",
    method: "Bank Transfer",
    status: "completed",
    jarId: "JAR-007",
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [viewTransaction, setViewTransaction] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  const filteredTransactions = transactions
    .filter(
      (tx) =>
        tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((tx) => {
      if (activeTab === "all") return true
      if (activeTab === "deposits") return tx.type === "deposit"
      if (activeTab === "withdrawals") return tx.type === "withdrawal"
      if (activeTab === "interest") return tx.type === "interest"
      if (activeTab === "pending") return tx.status === "pending"
      return true
    })

  const toggleTransactionSelection = (txId: string) => {
    setSelectedTransactions((prev) => (prev.includes(txId) ? prev.filter((id) => id !== txId) : [...prev, txId]))
  }

  const toggleAllTransactions = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(filteredTransactions.map((tx) => tx.id))
    }
  }

  // Calculate totals
  const totalDeposits = transactions
    .filter((tx) => tx.type === "deposit" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalWithdrawals = transactions
    .filter((tx) => tx.type === "withdrawal" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalInterest = transactions
    .filter((tx) => tx.type === "interest" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const pendingTransactions = transactions
    .filter((tx) => tx.status === "pending")
    .reduce((sum, tx) => sum + tx.amount, 0)

  // Add the following constant to count pending transactions
  const pendingTransactionsCount = transactions.filter((tx) => tx.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/transactions/pending")}
            className="flex items-center"
          >
            <Clock className="mr-2 h-4 w-4 text-amber-500" /> Pending Transactions
            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
              {pendingTransactions.length}
            </Badge>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Record Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Deposits</CardDescription>
            <CardTitle className="text-3xl">${totalDeposits.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span>Completed deposits</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Withdrawals</CardDescription>
            <CardTitle className="text-3xl">${totalWithdrawals.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              <span>Completed withdrawals</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interest Paid</CardDescription>
            <CardTitle className="text-3xl">${totalInterest.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-4 w-4 text-primary" />
              <span>Total interest payments</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Transactions</CardDescription>
            <CardTitle className="text-3xl">${pendingTransactions.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
              <span>Awaiting processing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
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
                    <Checkbox id="bank" className="mr-2" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="card" className="mr-2" />
                    <Label htmlFor="card">Credit Card</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="system" className="mr-2" />
                    <Label htmlFor="system">System</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="deposits">Deposits</TabsTrigger>
                  <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                  <TabsTrigger value="interest">Interest</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
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
                      checked={
                        selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0
                      }
                      onCheckedChange={toggleAllTransactions}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(tx.id)}
                        onCheckedChange={() => toggleTransactionSelection(tx.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{tx.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div
                          className={`mr-2 rounded-full p-1 ${
                            tx.type === "deposit"
                              ? "bg-green-100 text-green-600"
                              : tx.type === "withdrawal"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {tx.type === "deposit" && <ArrowUpRight className="h-3 w-3" />}
                          {tx.type === "withdrawal" && <ArrowDownRight className="h-3 w-3" />}
                          {tx.type === "interest" && <Clock className="h-3 w-3" />}
                        </div>
                        {tx.type}
                      </div>
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {tx.method === "Bank Transfer" && <BanknoteIcon className="mr-1 h-3 w-3" />}
                        {tx.method === "Credit Card" && <CreditCard className="mr-1 h-3 w-3" />}
                        {tx.method === "System" && <Clock className="mr-1 h-3 w-3" />}
                        {tx.method}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "completed" ? "default" : "outline"}>{tx.status}</Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        tx.type === "deposit" || tx.type === "interest"
                          ? "text-green-600"
                          : tx.type === "withdrawal"
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "interest" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setViewTransaction(tx)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>Detailed information about the transaction.</DialogDescription>
                            </DialogHeader>
                            {viewTransaction && (
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`rounded-full p-3 ${
                                      viewTransaction.type === "deposit"
                                        ? "bg-green-100 text-green-600"
                                        : viewTransaction.type === "withdrawal"
                                          ? "bg-red-100 text-red-600"
                                          : "bg-amber-100 text-amber-600"
                                    }`}
                                  >
                                    {viewTransaction.type === "deposit" && <ArrowUpRight className="h-6 w-6" />}
                                    {viewTransaction.type === "withdrawal" && <ArrowDownRight className="h-6 w-6" />}
                                    {viewTransaction.type === "interest" && <Clock className="h-6 w-6" />}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold">{viewTransaction.description}</h3>
                                    <p className="text-sm text-muted-foreground">{viewTransaction.type} transaction</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Transaction ID</Label>
                                    <p>{viewTransaction.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Customer</Label>
                                    <p>
                                      {viewTransaction.customerName} ({viewTransaction.customerId})
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Jar ID</Label>
                                    <p>{viewTransaction.jarId}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Date</Label>
                                    <p>{viewTransaction.date}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Method</Label>
                                    <p>{viewTransaction.method}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <p>
                                      <Badge variant={viewTransaction.status === "completed" ? "default" : "outline"}>
                                        {viewTransaction.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Amount</Label>
                                    <p
                                      className={`font-medium ${
                                        viewTransaction.type === "deposit" || viewTransaction.type === "interest"
                                          ? "text-green-600"
                                          : viewTransaction.type === "withdrawal"
                                            ? "text-red-600"
                                            : ""
                                      }`}
                                    >
                                      {viewTransaction.type === "deposit" || viewTransaction.type === "interest"
                                        ? "+"
                                        : "-"}
                                      ${viewTransaction.amount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline">Print Receipt</Button>
                              {viewTransaction?.status === "pending" && <Button>Approve Transaction</Button>}
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
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {tx.status === "pending" && (
                              <>
                                <DropdownMenuItem>
                                  <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <ArrowDownRight className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                              </>
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
