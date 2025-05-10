"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, ArrowUpRight, ArrowDownRight, Clock, CreditCard, BanknoteIcon as Bank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

function formatNumber(num: number | string | null | undefined) {
  if (num === null || num === undefined) return ""
  return Number(num).toLocaleString()
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("transactions")
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const action = searchParams.get("action")

  useEffect(() => {
    // Handle action query parameter
    if (action === "add-funds") {
      setActiveTab("deposit")
    } else if (action === "withdraw") {
      setActiveTab("withdraw")
    }
  }, [action])

  useEffect(() => {
    async function fetchWalletData() {
      setLoading(true)
      try {
        const supabase = createClientComponentClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setBalance(0)
          setTransactions([])
          setLoading(false)
          return
        }
        // Fetch wallet for this customer
        const { data: wallet } = await supabase
          .from("wallets")
          .select("id, balance")
          .eq("customer_id", session.user.id)
          .single()
        if (!wallet) {
          setBalance(0)
          setTransactions([])
          setLoading(false)
          return
        }
        setBalance(Number(wallet.balance) || 0)
        // Fetch transactions for this wallet
        const { data: txs } = await supabase
          .from("wallet_transactions")
          .select("id, type, amount, date:created_at, description, method, status")
          .eq("wallet_id", wallet.id)
          .order("created_at", { ascending: false })
        setTransactions(txs || [])
      } catch {
        setBalance(0)
        setTransactions([])
      }
      setLoading(false)
    }
    fetchWalletData()
  }, [])

  const formattedBalance = useMemo(() => formatNumber(balance), [balance])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Seed Wallet</h1>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">${formattedBalance}</p>
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
              {transactions.map((tx) => (
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
                      <p className="font-medium">{tx.description || tx.type}</p>
                      <div className="flex text-xs text-muted-foreground">
                        <p>{tx.date ? new Date(tx.date).toLocaleDateString() : ""}</p>
                        <p className="ml-2">{tx.method ? `via ${tx.method}` : null}</p>
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
                    {tx.type === "deposit" || tx.type === "interest"
                      ? "+"
                      : tx.type === "withdrawal"
                      ? "-"
                      : ""}
                    ${formatNumber(tx.amount)}
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
