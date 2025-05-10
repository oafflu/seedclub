"use client"

import { useState, useEffect } from "react"
import { Plus, ArrowUpRight, ArrowDownRight, Clock, CreditCard, BanknoteIcon as Bank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

// Mock data for demonstration
const mockTransactions = [
  {
    id: "tx1",
    type: "deposit",
    amount: 2000,
    date: "2024-01-15",
    description: "Added funds to wallet",
    method: "Bank Transfer",
  },
  {
    id: "tx2",
    type: "investment",
    amount: 5000,
    date: "2023-12-10",
    description: "Created Jar",
    method: "Wallet",
  },
  {
    id: "tx3",
    type: "interest",
    amount: 250,
    date: "2024-01-15",
    description: "Jar earnings",
    method: "System",
  },
  {
    id: "tx4",
    type: "deposit",
    amount: 1000,
    date: "2023-11-05",
    description: "Added funds to wallet",
    method: "Credit Card",
  },
  {
    id: "tx5",
    type: "withdrawal",
    amount: 500,
    date: "2023-10-20",
    description: "Withdrawal to bank account",
    method: "Bank Transfer",
  },
]

// MOCK CUSTOMER DATA FOR DEVELOPMENT/DEMO PURPOSES
const mockCustomer = {
  id: 'mock-customer-id',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  walletBalance: 3750,
}

// Helper for client-only number formatting
function useClientFormattedNumber(num: number | string | null | undefined) {
  const [formatted, setFormatted] = useState<string>("")
  useEffect(() => {
    if (num === null || num === undefined) return
    setFormatted("")
    setTimeout(() => {
      setFormatted(Number(num).toLocaleString())
    }, 0)
  }, [num])
  return formatted
}

export default function WalletPage() {
  const [balance, setBalance] = useState(mockCustomer.walletBalance)
  const [activeTab, setActiveTab] = useState("transactions")

  const searchParams = useSearchParams()
  const action = searchParams.get("action")

  useEffect(() => {
    // Handle action query parameter
    if (action === "add-funds") {
      // Automatically open the deposit modal or scroll to deposit section
      setActiveTab("deposit")
    } else if (action === "withdraw") {
      // Automatically open the withdraw modal or scroll to withdraw section
      setActiveTab("withdraw")
    }
  }, [action])

  return (
    <div className="container space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Seed Wallet</h1>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">${useClientFormattedNumber(balance)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/mobile/withdraw">
                  <ArrowDownRight className="mr-1 h-4 w-4" /> Withdraw
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/mobile/wallet/add-funds">
                  <Plus className="mr-1 h-4 w-4" /> Add Funds
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/mobile/wallet/add-funds?method=bank" className="block">
          <Card className="bg-primary/5 transition-colors hover:bg-primary/10">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Bank className="mb-2 h-6 w-6 text-primary" />
              <p className="text-center text-sm font-medium">Bank Transfer</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mobile/wallet/add-funds?method=card" className="block">
          <Card className="bg-primary/5 transition-colors hover:bg-primary/10">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <CreditCard className="mb-2 h-6 w-6 text-primary" />
              <p className="text-center text-sm font-medium">Card Payment</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold">Transaction History</h2>
        <Card>
          <CardHeader className="p-4 pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                <TabsTrigger value="interest">Interest</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <ul className="divide-y">
              {mockTransactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 rounded-full p-2 ${
                        tx.type === "deposit"
                          ? "bg-green-100 text-green-600"
                          : tx.type === "withdrawal"
                            ? "bg-red-100 text-red-600"
                            : tx.type === "investment"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {tx.type === "deposit" && <ArrowUpRight className="h-4 w-4" />}
                      {tx.type === "withdrawal" && <ArrowDownRight className="h-4 w-4" />}
                      {tx.type === "investment" && <Plus className="h-4 w-4" />}
                      {tx.type === "interest" && <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <div className="flex text-xs text-muted-foreground">
                        <p>{tx.date}</p>
                        <p className="ml-2">via {tx.method}</p>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${
                      tx.type === "deposit" || tx.type === "interest"
                        ? "text-green-600"
                        : tx.type === "withdrawal"
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {tx.type === "deposit" || tx.type === "interest" ? "+" : tx.type === "withdrawal" ? "-" : ""}$
                    {useClientFormattedNumber(tx.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
