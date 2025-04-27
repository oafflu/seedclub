"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CreditCard,
  BanknoteIcon,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    createdAt: "2023-10-05",
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
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    createdAt: "2023-09-12",
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
    email: "michael.chen@example.com",
    phone: "+1 (555) 345-6789",
    createdAt: "2023-11-20",
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
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    createdAt: "2023-08-15",
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
    email: "robert.wilson@example.com",
    phone: "+1 (555) 567-8901",
    createdAt: "2023-12-10",
  },
]

// Mock data for transactions
const transactions = [
  {
    id: "TX-001",
    walletId: "WALLET-001",
    type: "deposit",
    amount: 1000,
    date: "2024-01-15",
    method: "Bank Transfer",
    status: "completed",
    reference: "DEP-12345",
    description: "Initial deposit",
  },
  {
    id: "TX-002",
    walletId: "WALLET-001",
    type: "deposit",
    amount: 1500,
    date: "2024-01-10",
    method: "Credit Card",
    status: "completed",
    reference: "DEP-12346",
    description: "Monthly savings",
  },
  {
    id: "TX-003",
    walletId: "WALLET-002",
    type: "deposit",
    amount: 2000,
    date: "2024-01-05",
    method: "Bank Transfer",
    status: "completed",
    reference: "DEP-12347",
    description: "Bonus deposit",
  },
  {
    id: "TX-004",
    walletId: "WALLET-002",
    type: "deposit",
    amount: 3000,
    date: "2023-12-20",
    method: "Bank Transfer",
    status: "completed",
    reference: "DEP-12348",
    description: "Initial deposit",
  },
  {
    id: "TX-005",
    walletId: "WALLET-002",
    type: "deposit",
    amount: 1000,
    date: "2024-01-10",
    method: "Bank Transfer",
    status: "pending",
    reference: "DEP-12349",
    description: "Monthly savings",
  },
  {
    id: "TX-006",
    walletId: "WALLET-004",
    type: "deposit",
    amount: 10000,
    date: "2023-12-15",
    method: "Bank Transfer",
    status: "completed",
    reference: "DEP-12350",
    description: "Initial deposit",
  },
  {
    id: "TX-007",
    walletId: "WALLET-004",
    type: "deposit",
    amount: 2500,
    date: "2024-01-05",
    method: "Credit Card",
    status: "completed",
    reference: "DEP-12351",
    description: "Monthly savings",
  },
  {
    id: "TX-008",
    walletId: "WALLET-004",
    type: "withdrawal",
    amount: 2000,
    date: "2024-01-20",
    method: "Bank Transfer",
    status: "pending",
    reference: "WIT-12352",
    description: "Emergency withdrawal",
  },
]

// Form schemas
const topUpFormSchema = z.object({
  amount: z.coerce.number().min(10, "Amount must be at least $10").max(100000, "Amount cannot exceed $100,000"),
  method: z.enum(["bank_transfer", "credit_card", "debit_card", "manual"]),
  description: z.string().optional(),
})

const withdrawalFormSchema = z.object({
  amount: z.coerce.number().min(10, "Amount must be at least $10"),
  method: z.enum(["bank_transfer", "manual"]),
  description: z.string().optional(),
})

const statusUpdateFormSchema = z.object({
  status: z.enum(["active", "inactive", "frozen"]),
  reason: z.string().min(5, "Please provide a reason for this change").max(200),
})

const createWalletFormSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  initialDeposit: z.coerce.number().min(0).optional(),
  status: z.enum(["active", "inactive"]),
})

export default function WalletManagePage() {
  const router = useRouter()
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState<{
    title: string
    description: string
    action: () => void
  } | null>(null)
  const [activeTab, setActiveTab] = useState("search")

  // Filter wallets based on search term
  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get transactions for selected wallet
  const walletTransactions = transactions
    .filter((tx) => selectedWallet && tx.walletId === selectedWallet.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Forms
  const topUpForm = useForm<z.infer<typeof topUpFormSchema>>({
    resolver: zodResolver(topUpFormSchema),
    defaultValues: {
      amount: 0,
      method: "bank_transfer",
      description: "",
    },
  })

  const withdrawalForm = useForm<z.infer<typeof withdrawalFormSchema>>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: 0,
      method: "bank_transfer",
      description: "",
    },
  })

  const statusUpdateForm = useForm<z.infer<typeof statusUpdateFormSchema>>({
    resolver: zodResolver(statusUpdateFormSchema),
    defaultValues: {
      status: selectedWallet?.status || "active",
      reason: "",
    },
  })

  const createWalletForm = useForm<z.infer<typeof createWalletFormSchema>>({
    resolver: zodResolver(createWalletFormSchema),
    defaultValues: {
      customerId: "",
      initialDeposit: 0,
      status: "active",
    },
  })

  // Reset forms when wallet changes
  const resetForms = () => {
    topUpForm.reset({
      amount: 0,
      method: "bank_transfer",
      description: "",
    })
    withdrawalForm.reset({
      amount: 0,
      method: "bank_transfer",
      description: "",
    })
    statusUpdateForm.reset({
      status: selectedWallet?.status || "active",
      reason: "",
    })
  }

  // Handle wallet selection
  const handleSelectWallet = (wallet: any) => {
    setSelectedWallet(wallet)
    resetForms()
    setActiveTab("details")
  }

  // Handle top-up submission
  const onTopUpSubmit = (data: z.infer<typeof topUpFormSchema>) => {
    setConfirmationAction({
      title: "Confirm Top-Up",
      description: `Are you sure you want to add $${data.amount.toLocaleString()} to ${selectedWallet?.customerName}'s wallet?`,
      action: () => {
        // In a real app, this would call an API
        toast({
          title: "Funds added successfully",
          description: `$${data.amount.toLocaleString()} has been added to ${selectedWallet?.customerName}'s wallet.`,
        })
        setShowConfirmation(false)
        topUpForm.reset()
      },
    })
    setShowConfirmation(true)
  }

  // Handle withdrawal submission
  const onWithdrawalSubmit = (data: z.infer<typeof withdrawalFormSchema>) => {
    // Check if withdrawal amount exceeds balance
    if (data.amount > (selectedWallet?.balance || 0)) {
      toast({
        title: "Insufficient funds",
        description: "The withdrawal amount exceeds the available balance.",
        variant: "destructive",
      })
      return
    }

    setConfirmationAction({
      title: "Confirm Withdrawal",
      description: `Are you sure you want to withdraw $${data.amount.toLocaleString()} from ${selectedWallet?.customerName}'s wallet?`,
      action: () => {
        // In a real app, this would call an API
        toast({
          title: "Withdrawal processed",
          description: `$${data.amount.toLocaleString()} withdrawal from ${selectedWallet?.customerName}'s wallet has been processed.`,
        })
        setShowConfirmation(false)
        withdrawalForm.reset()
      },
    })
    setShowConfirmation(true)
  }

  // Handle status update submission
  const onStatusUpdateSubmit = (data: z.infer<typeof statusUpdateFormSchema>) => {
    setConfirmationAction({
      title: "Confirm Status Change",
      description: `Are you sure you want to change ${selectedWallet?.customerName}'s wallet status to ${data.status}?`,
      action: () => {
        // In a real app, this would call an API
        toast({
          title: "Status updated",
          description: `${selectedWallet?.customerName}'s wallet status has been updated to ${data.status}.`,
        })
        setShowConfirmation(false)
        statusUpdateForm.reset()
      },
    })
    setShowConfirmation(true)
  }

  // Handle create wallet submission
  const onCreateWalletSubmit = (data: z.infer<typeof createWalletFormSchema>) => {
    setConfirmationAction({
      title: "Confirm Wallet Creation",
      description: `Are you sure you want to create a new wallet for customer ${data.customerId}?`,
      action: () => {
        // In a real app, this would call an API
        toast({
          title: "Wallet created",
          description: `A new wallet has been created for customer ${data.customerId}.`,
        })
        setShowConfirmation(false)
        createWalletForm.reset()
        setActiveTab("search")
      },
    })
    setShowConfirmation(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/wallet">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Wallet Management</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Search Wallets</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedWallet}>
            Wallet Details
          </TabsTrigger>
          <TabsTrigger value="transactions" disabled={!selectedWallet}>
            Transactions
          </TabsTrigger>
          <TabsTrigger value="create">Create Wallet</TabsTrigger>
        </TabsList>

        {/* Search Wallets Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find Customer Wallet</CardTitle>
              <CardDescription>Search for a customer wallet by name, ID, or email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search wallets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mt-6 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWallets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No wallets found matching your search
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWallets.map((wallet) => (
                        <TableRow key={wallet.id}>
                          <TableCell className="font-medium">{wallet.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{wallet.customerName}</span>
                              <span className="text-xs text-muted-foreground">{wallet.customerId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                wallet.status === "active"
                                  ? "default"
                                  : wallet.status === "inactive"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {wallet.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">${wallet.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleSelectWallet(wallet)}>
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Details Tab */}
        <TabsContent value="details" className="space-y-4">
          {selectedWallet && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedWallet.customerName}'s Wallet</CardTitle>
                      <CardDescription>{selectedWallet.id}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        selectedWallet.status === "active"
                          ? "default"
                          : selectedWallet.status === "inactive"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-sm"
                    >
                      {selectedWallet.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Current Balance</CardDescription>
                        <CardTitle className="text-3xl">${selectedWallet.balance.toLocaleString()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <BanknoteIcon className="mr-1 h-4 w-4 text-primary" />
                          <span>Available for withdrawal</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Pending Deposits</CardDescription>
                        <CardTitle className="text-3xl">${selectedWallet.pendingDeposits.toLocaleString()}</CardTitle>
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
                        <CardTitle className="text-3xl">
                          ${selectedWallet.pendingWithdrawals.toLocaleString()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                          <span>Awaiting processing</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">Customer ID</Label>
                            <p>{selectedWallet.customerId}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Name</Label>
                            <p>{selectedWallet.customerName}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Email</Label>
                            <p>{selectedWallet.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Phone</Label>
                            <p>{selectedWallet.phone}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Created On</Label>
                            <p>{selectedWallet.createdAt}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Last Transaction</Label>
                            <p>{selectedWallet.lastTransaction}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/customers/edit/${selectedWallet.customerId}`}>
                              View Customer Profile
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Wallet Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button onClick={() => setActiveTab("top-up")} className="h-20" variant="outline">
                            <div className="flex flex-col items-center">
                              <ArrowUpRight className="mb-1 h-5 w-5 text-green-500" />
                              <span>Add Funds</span>
                            </div>
                          </Button>
                          <Button
                            onClick={() => setActiveTab("withdraw")}
                            className="h-20"
                            variant="outline"
                            disabled={selectedWallet.balance <= 0}
                          >
                            <div className="flex flex-col items-center">
                              <ArrowDownRight className="mb-1 h-5 w-5 text-red-500" />
                              <span>Process Withdrawal</span>
                            </div>
                          </Button>
                          <Button onClick={() => setActiveTab("status")} className="h-20" variant="outline">
                            <div className="flex flex-col items-center">
                              <AlertTriangle className="mb-1 h-5 w-5 text-amber-500" />
                              <span>Update Status</span>
                            </div>
                          </Button>
                          <Button onClick={() => setActiveTab("transactions")} className="h-20" variant="outline">
                            <div className="flex flex-col items-center">
                              <CreditCard className="mb-1 h-5 w-5 text-blue-500" />
                              <span>View Transactions</span>
                            </div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Top-Up Form */}
              <Card className={activeTab === "top-up" ? "block" : "hidden"}>
                <CardHeader>
                  <CardTitle>Add Funds</CardTitle>
                  <CardDescription>Add funds to {selectedWallet.customerName}'s wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...topUpForm}>
                    <form onSubmit={topUpForm.handleSubmit(onTopUpSubmit)} className="space-y-6">
                      <FormField
                        control={topUpForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>Enter the amount to add to the wallet</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={topUpForm.control}
                        name="method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="debit_card">Debit Card</SelectItem>
                                <SelectItem value="manual">Manual Adjustment</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Select the method used for this deposit</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={topUpForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Monthly deposit" {...field} />
                            </FormControl>
                            <FormDescription>Add a note about this transaction</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                          Cancel
                        </Button>
                        <Button type="submit">Process Deposit</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Withdrawal Form */}
              <Card className={activeTab === "withdraw" ? "block" : "hidden"}>
                <CardHeader>
                  <CardTitle>Process Withdrawal</CardTitle>
                  <CardDescription>Process a withdrawal from {selectedWallet.customerName}'s wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...withdrawalForm}>
                    <form onSubmit={withdrawalForm.handleSubmit(onWithdrawalSubmit)} className="space-y-6">
                      <div className="rounded-md bg-muted p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Available Balance:</span>
                          <span className="font-bold">${selectedWallet.balance.toLocaleString()}</span>
                        </div>
                      </div>

                      <FormField
                        control={withdrawalForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Withdrawal Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>Enter the amount to withdraw from the wallet</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={withdrawalForm.control}
                        name="method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Withdrawal Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select withdrawal method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="manual">Manual Adjustment</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Select the method used for this withdrawal</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={withdrawalForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Customer requested withdrawal" {...field} />
                            </FormControl>
                            <FormDescription>Add a note about this transaction</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                          Cancel
                        </Button>
                        <Button type="submit">Process Withdrawal</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Status Update Form */}
              <Card className={activeTab === "status" ? "block" : "hidden"}>
                <CardHeader>
                  <CardTitle>Update Wallet Status</CardTitle>
                  <CardDescription>Change the status of {selectedWallet.customerName}'s wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...statusUpdateForm}>
                    <form onSubmit={statusUpdateForm.handleSubmit(onStatusUpdateSubmit)} className="space-y-6">
                      <FormField
                        control={statusUpdateForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Wallet Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="active" id="active" />
                                  <Label htmlFor="active" className="flex items-center">
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                    Active
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="inactive" id="inactive" />
                                  <Label htmlFor="inactive" className="flex items-center">
                                    <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                                    Inactive
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="frozen" id="frozen" />
                                  <Label htmlFor="frozen" className="flex items-center">
                                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                                    Frozen
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>Select the new status for this wallet</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={statusUpdateForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Change</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Customer request, Suspicious activity" {...field} />
                            </FormControl>
                            <FormDescription>Provide a reason for changing the wallet status</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                          Cancel
                        </Button>
                        <Button type="submit">Update Status</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          {selectedWallet && (
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions for {selectedWallet.customerName}'s wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {walletTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No transactions found for this wallet
                          </TableCell>
                        </TableRow>
                      ) : (
                        walletTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.id}</TableCell>
                            <TableCell>{tx.date}</TableCell>
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
                            <TableCell>{tx.method}</TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell>
                              <Badge variant={tx.status === "completed" ? "default" : "secondary"}>{tx.status}</Badge>
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium ${
                                tx.type === "deposit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {tx.type === "deposit" ? "+" : "-"}${tx.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("details")}>
                  Back to Details
                </Button>
                <Button variant="outline">Export Transactions</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Create Wallet Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Wallet</CardTitle>
              <CardDescription>Create a new wallet for an existing customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createWalletForm}>
                <form onSubmit={createWalletForm.handleSubmit(onCreateWalletSubmit)} className="space-y-6">
                  <FormField
                    control={createWalletForm.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CUST-001" {...field} />
                        </FormControl>
                        <FormDescription>Enter the ID of an existing customer</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createWalletForm.control}
                    name="initialDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Deposit (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Enter an initial deposit amount (if any)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createWalletForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select wallet status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Set the initial status of the wallet</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("search")}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Wallet</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmationAction?.title}</DialogTitle>
            <DialogDescription>{confirmationAction?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={() => confirmationAction?.action()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
