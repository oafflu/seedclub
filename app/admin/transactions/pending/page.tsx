"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  Eye,
  Calendar,
  FileText,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Mock data for pending transactions
const pendingTransactions = [
  {
    id: "TX-008",
    customerId: "CUST-005",
    customerName: "Robert Wilson",
    type: "withdrawal",
    amount: 2000,
    date: "2024-01-18",
    submittedDate: "2024-01-18T09:23:45",
    description: "Partial withdrawal",
    method: "Bank Transfer",
    status: "pending",
    jarId: "JAR-005",
    accountNumber: "****4567",
    bankName: "First National Bank",
    routingNumber: "****1234",
    reason: "Emergency funds needed",
    documents: ["withdrawal_request.pdf"],
    history: [
      { action: "Submitted", timestamp: "2024-01-18T09:23:45", by: "Robert Wilson" },
      { action: "Documentation verified", timestamp: "2024-01-18T10:15:22", by: "System" },
      { action: "Pending approval", timestamp: "2024-01-18T10:15:30", by: "System" },
    ],
  },
  {
    id: "TX-012",
    customerId: "CUST-008",
    customerName: "Lisa Martinez",
    type: "withdrawal",
    amount: 5000,
    date: "2024-01-20",
    submittedDate: "2024-01-20T14:08:12",
    description: "Full withdrawal",
    method: "Bank Transfer",
    status: "pending",
    jarId: "JAR-007",
    accountNumber: "****7890",
    bankName: "Chase Bank",
    routingNumber: "****5678",
    reason: "Moving to new investment opportunity",
    documents: ["withdrawal_form.pdf", "id_verification.jpg"],
    history: [
      { action: "Submitted", timestamp: "2024-01-20T14:08:12", by: "Lisa Martinez" },
      { action: "Documentation verified", timestamp: "2024-01-20T15:30:05", by: "Admin (Jane Smith)" },
      { action: "Pending approval", timestamp: "2024-01-20T15:31:45", by: "System" },
    ],
  },
  {
    id: "TX-015",
    customerId: "CUST-010",
    customerName: "Daniel Rodriguez",
    type: "deposit",
    amount: 15000,
    date: "2024-01-22",
    submittedDate: "2024-01-22T11:45:33",
    description: "Additional deposit",
    method: "Wire Transfer",
    status: "pending",
    jarId: "JAR-010",
    accountNumber: "N/A",
    bankName: "Bank of America",
    routingNumber: "N/A",
    reason: "Investing additional funds",
    documents: ["proof_of_funds.pdf"],
    history: [
      { action: "Submitted", timestamp: "2024-01-22T11:45:33", by: "Daniel Rodriguez" },
      { action: "Pending verification", timestamp: "2024-01-22T11:45:40", by: "System" },
    ],
  },
  {
    id: "TX-018",
    customerId: "CUST-012",
    customerName: "Jennifer Taylor",
    type: "deposit",
    amount: 8000,
    date: "2024-01-23",
    submittedDate: "2024-01-23T16:20:18",
    description: "Initial deposit",
    method: "ACH Transfer",
    status: "pending",
    jarId: "JAR-012",
    accountNumber: "N/A",
    bankName: "Wells Fargo",
    routingNumber: "N/A",
    reason: "Starting new investment",
    documents: ["new_customer_form.pdf"],
    history: [
      { action: "Submitted", timestamp: "2024-01-23T16:20:18", by: "Jennifer Taylor" },
      { action: "Documentation verified", timestamp: "2024-01-23T17:05:11", by: "Admin (John Doe)" },
      { action: "Pending funds verification", timestamp: "2024-01-23T17:06:30", by: "System" },
    ],
  },
  {
    id: "TX-020",
    customerId: "CUST-015",
    customerName: "James Anderson",
    type: "withdrawal",
    amount: 3500,
    date: "2024-01-24",
    submittedDate: "2024-01-24T10:12:55",
    description: "Partial withdrawal",
    method: "Bank Transfer",
    status: "pending",
    jarId: "JAR-015",
    accountNumber: "****2345",
    bankName: "TD Bank",
    routingNumber: "****8901",
    reason: "Personal expense",
    documents: ["withdrawal_request.pdf", "authorization_form.pdf"],
    history: [
      { action: "Submitted", timestamp: "2024-01-24T10:12:55", by: "James Anderson" },
      { action: "Documentation verified", timestamp: "2024-01-24T11:30:22", by: "Admin (Sarah Jones)" },
      { action: "Pending approval", timestamp: "2024-01-24T11:32:10", by: "System" },
    ],
  },
]

export default function PendingTransactionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [viewTransaction, setViewTransaction] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionTransaction, setActionTransaction] = useState<any>(null)

  const filteredTransactions = pendingTransactions
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

  const handleApproveTransaction = (transaction: any) => {
    setActionTransaction(transaction)
    setShowApprovalDialog(true)
  }

  const handleRejectTransaction = (transaction: any) => {
    setActionTransaction(transaction)
    setShowRejectionDialog(true)
  }

  const confirmApproval = () => {
    // Here you would implement the actual approval logic, API call, etc.
    toast({
      title: "Transaction Approved",
      description: `Transaction ${actionTransaction.id} has been successfully approved.`,
    })
    setShowApprovalDialog(false)
    setApprovalNotes("")
    setActionTransaction(null)
  }

  const confirmRejection = () => {
    // Here you would implement the actual rejection logic, API call, etc.
    toast({
      title: "Transaction Rejected",
      description: `Transaction ${actionTransaction.id} has been rejected.`,
    })
    setShowRejectionDialog(false)
    setRejectionReason("")
    setActionTransaction(null)
  }

  const bulkApprove = () => {
    // Here you would implement the bulk approval logic
    toast({
      title: "Transactions Approved",
      description: `${selectedTransactions.length} transactions have been approved.`,
    })
    setSelectedTransactions([])
  }

  const bulkReject = () => {
    // Here you would implement the bulk rejection logic
    toast({
      title: "Transactions Rejected",
      description: `${selectedTransactions.length} transactions have been rejected.`,
    })
    setSelectedTransactions([])
  }

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/transactions")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Pending Transactions</h1>
          </div>
          <p className="text-muted-foreground">Review and approve or reject pending transactions.</p>
        </div>
        {selectedTransactions.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedTransactions.length} selected</span>
            <Button
              variant="outline"
              onClick={bulkApprove}
              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Approve Selected
            </Button>
            <Button
              variant="outline"
              onClick={bulkReject}
              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
            >
              <XCircle className="mr-2 h-4 w-4" /> Reject Selected
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Transactions Queue</CardTitle>
          <CardDescription>
            Transactions awaiting review and approval. Currently showing {filteredTransactions.length} pending
            transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by customer, ID, description..."
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
                    <Checkbox id="wire" className="mr-2" />
                    <Label htmlFor="wire">Wire Transfer</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="ach" className="mr-2" />
                    <Label htmlFor="ach">ACH Transfer</Label>
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
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No pending transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(tx.id)}
                          onCheckedChange={() => toggleTransactionSelection(tx.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{tx.customerName}</span>
                          <span className="text-xs text-muted-foreground">{tx.customerId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`mr-2 rounded-full p-1 ${
                              tx.type === "deposit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {tx.type === "deposit" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                          </div>
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>{formatDateTime(tx.submittedDate)}</TableCell>
                      <TableCell>{tx.method}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          tx.type === "deposit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "deposit" ? "+" : "-"}${tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setViewTransaction(tx)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Review detailed information about the pending transaction.
                                </DialogDescription>
                              </DialogHeader>
                              {viewTransaction && (
                                <div className="grid gap-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`rounded-full p-3 ${
                                        viewTransaction.type === "deposit"
                                          ? "bg-green-100 text-green-600"
                                          : "bg-red-100 text-red-600"
                                      }`}
                                    >
                                      {viewTransaction.type === "deposit" ? (
                                        <ArrowUpRight className="h-6 w-6" />
                                      ) : (
                                        <ArrowDownRight className="h-6 w-6" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {viewTransaction.type === "deposit" ? "Deposit" : "Withdrawal"} -{" "}
                                        {viewTransaction.id}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">{viewTransaction.description}</p>
                                    </div>
                                    <div className="ml-auto">
                                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        <Clock className="mr-1 h-3 w-3" /> Pending
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Transaction Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <Label className="text-muted-foreground">Transaction ID</Label>
                                          <p className="font-medium">{viewTransaction.id}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Date Submitted</Label>
                                          <p className="font-medium">{formatDateTime(viewTransaction.submittedDate)}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Amount</Label>
                                          <p
                                            className={`font-medium ${
                                              viewTransaction.type === "deposit" ? "text-green-600" : "text-red-600"
                                            }`}
                                          >
                                            {viewTransaction.type === "deposit" ? "+" : "-"}$
                                            {viewTransaction.amount.toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Method</Label>
                                          <p className="font-medium">{viewTransaction.method}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Jar ID</Label>
                                          <p className="font-medium">{viewTransaction.jarId}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Reason</Label>
                                          <p className="font-medium">{viewTransaction.reason}</p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Customer Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid grid-cols-1 gap-3 text-sm">
                                        <div>
                                          <Label className="text-muted-foreground">Customer Name</Label>
                                          <p className="font-medium">{viewTransaction.customerName}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Customer ID</Label>
                                          <p className="font-medium">{viewTransaction.customerId}</p>
                                        </div>
                                        {viewTransaction.type === "withdrawal" && (
                                          <>
                                            <div>
                                              <Label className="text-muted-foreground">Bank Name</Label>
                                              <p className="font-medium">{viewTransaction.bankName}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Account Number</Label>
                                              <p className="font-medium">{viewTransaction.accountNumber}</p>
                                            </div>
                                          </>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-lg">Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex flex-wrap gap-3">
                                        {viewTransaction.documents.map((doc: string, idx: number) => (
                                          <Button key={idx} variant="outline" className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {doc}
                                          </Button>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-lg">Transaction History</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                      <div className="px-6">
                                        {viewTransaction.history.map((item: any, idx: number) => (
                                          <div key={idx} className="flex items-start py-3">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary bg-primary/10">
                                              <Clock className="h-3 w-3 text-primary" />
                                            </div>
                                            <div className="ml-4 space-y-1">
                                              <p className="text-sm font-medium">{item.action}</p>
                                              <div className="flex items-center text-xs text-muted-foreground">
                                                <span>{formatDateTime(item.timestamp)}</span>
                                                <span className="mx-2">•</span>
                                                <span>{item.by}</span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setViewTransaction(null)
                                    handleRejectTransaction(viewTransaction)
                                  }}
                                  className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Reject Transaction
                                </Button>
                                <Button
                                  onClick={() => {
                                    setViewTransaction(null)
                                    handleApproveTransaction(viewTransaction)
                                  }}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" /> Approve Transaction
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveTransaction(tx)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-100"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRejectTransaction(tx)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Transaction</DialogTitle>
            <DialogDescription>
              You are about to approve transaction {actionTransaction?.id}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Approve Confirmation</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      By approving this transaction, funds will be{" "}
                      {actionTransaction?.type === "deposit" ? "deposited into" : "withdrawn from"} the customer's
                      account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="approval-notes">Notes (optional)</Label>
              <Textarea
                id="approval-notes"
                placeholder="Add any notes regarding this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>

            {actionTransaction?.type === "withdrawal" && (
              <div className="rounded-md bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Important Notice</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Please ensure you have verified the customer's identity and withdrawal request before approving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproval} className="bg-green-600 text-white hover:bg-green-700">
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transaction</DialogTitle>
            <DialogDescription>
              You are about to reject transaction {actionTransaction?.id}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Rejection Confirmation</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>The customer will be notified that their transaction has been rejected.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="rejection-reason" className="required">
                Reason for Rejection
              </Label>
              <Select onValueChange={setRejectionReason} defaultValue={rejectionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insufficient-documentation">Insufficient Documentation</SelectItem>
                  <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                  <SelectItem value="verification-failed">Verification Failed</SelectItem>
                  <SelectItem value="policy-violation">Policy Violation</SelectItem>
                  <SelectItem value="customer-request">Customer Request</SelectItem>
                  <SelectItem value="other">Other (specify in notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rejection-notes">Additional Notes</Label>
              <Textarea
                id="rejection-notes"
                placeholder="Provide additional details about this rejection..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRejection}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={!rejectionReason}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
