"use client"

import { useState, useEffect } from "react"
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
import { toast } from "@/components/ui/use-toast"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [viewTransaction, setViewTransaction] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/admin/transactions')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch transactions')
        }

        setTransactions(data.transactions || [])
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast({
          title: "Error fetching transactions",
          description: "There was a problem loading the transactions.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = transactions
    .filter(
      (tx) =>
        tx.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()),
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
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  const totalWithdrawals = transactions
    .filter((tx) => tx.type === "withdrawal" && tx.status === "completed")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  const totalInterest = transactions
    .filter((tx) => tx.type === "interest" && tx.status === "completed")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  const pendingTransactions = transactions
    .filter((tx) => tx.status === "pending")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  // Add export function
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      // Prepare data for export
      const data = transactions.map((tx) => ({
        'Transaction ID': tx.id,
        'Customer Name': tx.customer?.name || 'N/A',
        'Customer ID': tx.customer_id,
        'Type': tx.type,
        'Amount': tx.amount,
        'Date': new Date(tx.created_at).toLocaleDateString(),
        'Description': tx.description,
        'Method': tx.method,
        'Status': tx.status,
        'Jar': tx.jar?.name || 'N/A'
      }))

      let blob: Blob
      let filename: string

      switch (format) {
        case 'csv':
          // Convert data to CSV
          const csvContent = [
            Object.keys(data[0]).join(','),
            ...data.map((row) => Object.values(row).join(','))
          ].join('\n')
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
          filename = `transactions_export_${format}_${new Date().toISOString().split('T')[0]}.csv`
          break

        case 'excel':
          // Use xlsx library for Excel export
          const XLSX = await import('xlsx')
          const ws = XLSX.utils.json_to_sheet(data)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
          blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          filename = `transactions_export_${format}_${new Date().toISOString().split('T')[0]}.xlsx`
          break

        case 'pdf':
          // Use jspdf and jspdf-autotable for PDF export
          const { jsPDF } = await import('jspdf')
          const { default: autoTable } = await import('jspdf-autotable')
          
          const doc = new jsPDF()
          autoTable(doc, {
            head: [Object.keys(data[0])],
            body: data.map(row => Object.values(row)),
          })
          
          blob = doc.output('blob')
          filename = `transactions_export_${format}_${new Date().toISOString().split('T')[0]}.pdf`
          break

        default:
          throw new Error('Unsupported export format')
      }

      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `Transactions have been exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: "Export failed",
        description: "There was a problem exporting the data",
        variant: "destructive",
      })
    }
  }

  // Add loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
  }

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
              {transactions.filter(tx => tx.status === "pending").length}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Choose format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
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
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No transactions found.
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
                      <TableCell>{tx.customer?.name || 'N/A'}</TableCell>
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
                      <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
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
                        {tx.type === "deposit" || tx.type === "interest" ? "+" : "-"}${tx.amount?.toLocaleString()}
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
                                        {viewTransaction.customer?.name || 'N/A'} ({viewTransaction.customer_id})
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm text-muted-foreground">Jar</Label>
                                      <p>{viewTransaction.jar?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm text-muted-foreground">Date</Label>
                                      <p>{new Date(viewTransaction.created_at).toLocaleString()}</p>
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
                                        ${viewTransaction.amount?.toLocaleString()}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
