"use client"
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

// Mock data for demonstration
const mockTransactions = [
  {
    id: "tx1",
    type: "deposit",
    amount: 200,
    date: "2024-03-15",
    description: "Added funds to wallet",
    method: "Bank Transfer",
  },
  {
    id: "tx2",
    type: "investment",
    amount: 500,
    date: "2024-03-10",
    description: "Basic Plan investment",
    method: "Wallet",
  },
  {
    id: "tx3",
    type: "interest",
    amount: 25,
    date: "2024-03-20",
    description: "Interest earned on Basic Plan",
    method: "System",
  },
]

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

export default function HistoryPage() {
  return (
    <div className="container space-y-4 px-4 py-4">
      <h1 className="text-2xl font-bold">Transaction History</h1>

      <Card>
        <CardHeader className="p-4 pb-0">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
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
                        : tx.type === "investment"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {tx.type === "deposit" && <ArrowUpRight className="h-4 w-4" />}
                    {tx.type === "investment" && <ArrowDownRight className="h-4 w-4" />}
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
                      : tx.type === "investment"
                        ? "text-blue-600"
                        : ""
                  }`}
                >
                  {tx.type === "deposit" || tx.type === "interest" ? "+" : "-"}${useClientFormattedNumber(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
