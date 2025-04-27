"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Wallet,
  CreditCard,
  BanknoteIcon,
  AlertTriangle,
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
import Link from "next/link"

// Mock data for wallets
const wallets = [
  {
    id: "WALLET-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    balance: 2500,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    lastTransaction: "2024-01-15",
    status: "active",
  },
  {
    id: "WALLET-002",
    customerId: "CUST-002",
    customerName: "Sarah Johnson",
    balance: 5000,
    pendingDeposits: 1000,
    pendingWithdrawals: 0,
    lastTransaction: "2024-01-10",
    status: "active",
  },
  {
    id: "WALLET-003",
    customerId: "CUST-003",
    customerName: "Michael Chen",
    balance: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    lastTransaction: "2023-12-01",
    status: "inactive",
  },
  {
    id: "WALLET-004",
    customerId: "CUST-004",
    customerName: "Emily Davis",
    balance: 12500,
    pendingDeposits: 0,
    pendingWithdrawals: 2000,
    lastTransaction: "2024-01-20",
    status: "active",
  },
  {
    id: "WALLET-005",
    customerId: "CUST-005",
    customerName: "Robert Wilson",
    balance: 3500,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    lastTransaction: "2024-01-05",
    status: "active",
  },
  {
    id: "WALLET-006",
    customerId: "CUST-007",
    customerName: "David Brown",
    balance: 8000,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    lastTransaction: "2024-01-12",
    status: "active",
  },
  {
    id: "WALLET-007",
    customerId: "CUST-008",
    customerName: "Lisa Martinez",
    balance: 1500,
    pendingDeposits: 500,
    pendingWithdrawals: 0,
    lastTransaction: "2024-01-18",
    status: "active",
  },
]

// Mock data for recent wallet transactions
const recentTransactions = [
  {
    id: "TX-101",
    walletId: "WALLET-002",
    customerId: "CUST-002",
    customerName: "Sarah Johnson",
    type: "deposit",
    amount: 1000,
    date: "2024-01-10",
    method: "Bank Transfer",
    status: "pending",
  },
  {
    id: "TX-102",
    walletId: "WALLET-004",
    customerId: "CUST-004",
    customerName: "Emily Davis",
    type: "withdrawal",
    amount: 2000,
    date: "2024-01-20",
    method: "Bank Transfer",
    status: "pending",
  },
  {
    id: "TX-103",
    walletId: "WALLET-007",
    customerId: "CUST-008",
    customerName: "Lisa Martinez",
    type: "deposit",
    amount: 500,
    date: "2024-01-18",
    method: "Credit Card",
    status: "pending",
  },
  {
    id: "TX-104",
    walletId: "WALLET-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    type: "deposit",
    amount: 1500,
    date: "2024-01-15",
    method: "Bank Transfer",
    status: "completed",
  },
  {
    id: "TX-105",
    walletId: "WALLET-006",
    customerId: "CUST-007",
    customerName: "David Brown",
    type: "deposit",
    amount: 3000,
    date: "2024-01-12",
    method: "Credit Card",
    status: "completed",
  },
]

export default function WalletManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWallets, setSelectedWallets] = useState<string[]>([])
  const [viewWallet, setViewWallet] = useState<any>(null)

  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.customerId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleWalletSelection = (walletId: string) => {
    setSelectedWallets((prev) => (prev.includes(walletId) ? prev.filter((id) => id !== walletId) : [...prev, walletId]))
  }

  const toggleAllWallets = () => {
    if (selectedWallets.length === filteredWallets.length) {
      setSelectedWallets([])
    } else {
      setSelectedWallets(filteredWallets.map((w) => w.id))
    }
  }

  // Calculate totals
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)
  const totalPendingDeposits = wallets.reduce((sum, wallet) => sum + wallet.pendingDeposits, 0)
  const totalPendingWithdrawals = wallets.reduce((sum, wallet) => sum + wallet.pendingWithdrawals, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wallet Management</h1>
        <Button asChild>
          <Link href="/admin/wallet/manage">
            <Wallet className="mr-2 h-4 w-4" /> Manage Wallet
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Wallets</CardDescription>
            <CardTitle className="text-3xl">{wallets.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Wallet className="mr-1 h-4 w-4 text-primary" />
              <span>{wallets.filter((w) => w.status === "active").length} active wallets</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-3xl">${totalBalance.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <BanknoteIcon className="mr-1 h-4 w-4 text-primary" />
              <span>Across all customer wallets</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Deposits</CardDescription>
            <CardTitle className="text-3xl">${totalPendingDeposits.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span>Awaiting processing</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Withdrawals</CardDescription>
            <CardTitle className="text-3xl">${totalPendingWithdrawals.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              <span>Awaiting processing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer Wallets</CardTitle>
          <CardDescription>Manage all customer wallet accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search wallets..."
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
                    <Checkbox id="active" className="mr-2" />
                    <Label htmlFor="active">Active Only</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="pending" className="mr-2" />
                    <Label htmlFor="pending">With Pending Transactions</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="balance" className="mr-2" />
                    <Label htmlFor="balance">With Balance &gt; $0</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                      checked={selectedWallets.length === filteredWallets.length && filteredWallets.length > 0}
                      onCheckedChange={toggleAllWallets}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Pending Deposits</TableHead>
                  <TableHead className="text-right">Pending Withdrawals</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedWallets.includes(wallet.id)}
                        onCheckedChange={() => toggleWalletSelection(wallet.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{wallet.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{wallet.customerName}</span>
                        <span className="text-xs text-muted-foreground">{wallet.customerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={wallet.status === "active" ? "default" : "secondary"}>{wallet.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">${wallet.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {wallet.pendingDeposits > 0 ? (
                        <span className="text-green-600">+${wallet.pendingDeposits.toLocaleString()}</span>
                      ) : (
                        "$0"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {wallet.pendingWithdrawals > 0 ? (
                        <span className="text-red-600">-${wallet.pendingWithdrawals.toLocaleString()}</span>
                      ) : (
                        "$0"
                      )}
                    </TableCell>
                    <TableCell>{wallet.lastTransaction}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setViewWallet(wallet)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Wallet Details</DialogTitle>
                              <DialogDescription>Detailed information about the customer wallet.</DialogDescription>
                            </DialogHeader>
                            {viewWallet && (
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="rounded-full bg-primary/10 p-3">
                                    <Wallet className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold">{viewWallet.customerName}'s Wallet</h3>
                                    <p className="text-sm text-muted-foreground">{viewWallet.id}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Customer ID</Label>
                                    <p>{viewWallet.customerId}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <p>
                                      <Badge variant={viewWallet.status === "active" ? "default" : "secondary"}>
                                        {viewWallet.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Current Balance</Label>
                                    <p className="font-medium">${viewWallet.balance.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Last Transaction</Label>
                                    <p>{viewWallet.lastTransaction}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Pending Deposits</Label>
                                    <p className="text-green-600">
                                      {viewWallet.pendingDeposits > 0
                                        ? `+$${viewWallet.pendingDeposits.toLocaleString()}`
                                        : "$0"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Pending Withdrawals</Label>
                                    <p className="text-red-600">
                                      {viewWallet.pendingWithdrawals > 0
                                        ? `-$${viewWallet.pendingWithdrawals.toLocaleString()}`
                                        : "$0"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline">View Transactions</Button>
                              <Button>Manage Wallet</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" /> Add Funds
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowDownRight className="mr-2 h-4 w-4 text-red-500" /> Process Withdrawal
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" /> Freeze Wallet
                            </DropdownMenuItem>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Transactions</CardTitle>
          <CardDescription>Transactions awaiting approval or processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions
                  .filter((tx) => tx.status === "pending")
                  .map((tx) => (
                    <TableRow key={tx.id}>
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
                          {tx.type}
                        </div>
                      </TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {tx.method === "Bank Transfer" ? (
                            <BanknoteIcon className="mr-1 h-3 w-3" />
                          ) : (
                            <CreditCard className="mr-1 h-3 w-3" />
                          )}
                          {tx.method}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          tx.type === "deposit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "deposit" ? "+" : "-"}${tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-3 w-3" /> View
                          </Button>
                          <Button size="sm">
                            {tx.type === "deposit" ? (
                              <>
                                <ArrowUpRight className="mr-2 h-3 w-3" /> Approve
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="mr-2 h-3 w-3" /> Process
                              </>
                            )}
                          </Button>
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
