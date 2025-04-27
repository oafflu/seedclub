"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Plus, TrendingUp, Wallet, History, Bell, Users, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function MobileDashboard() {
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const storedUserName = localStorage.getItem("userName")

    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    setUserName(storedUserName || "User")
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-xl font-bold">{userName}</h1>
          </div>
          <Link href="/mobile/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                3
              </span>
            </Button>
          </Link>
        </div>

        {/* Balance Card */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">$12,450.00</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span className="text-sm font-medium">+12.4%</span>
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild className="flex-1" size="sm">
                <Link href="/mobile/wallet/add-funds">
                  <Plus className="mr-1 h-4 w-4" /> Add Funds
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="sm">
                <Link href="/mobile/withdraw">
                  <ArrowUpRight className="mr-1 h-4 w-4" /> Withdraw
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="mb-3 font-medium">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          <Link href="/mobile/wallet" className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="mt-1 text-xs">Wallet</span>
          </Link>
          <Link href="/mobile/invest" className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Sprout className="h-5 w-5 text-green-600" />
            </div>
            <span className="mt-1 text-xs">Invest</span>
          </Link>
          <Link href="/mobile/history" className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <span className="mt-1 text-xs">History</span>
          </Link>
          <Link href="/mobile/referrals" className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <span className="mt-1 text-xs">Refer</span>
          </Link>
        </div>
      </div>

      {/* Investment Jars */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Your Investment Jars</h2>
          <Link href="/mobile/jars" className="text-xs text-primary">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">10% Growth Jar</p>
                    <p className="text-xs text-muted-foreground">12 months • Matures Dec 2025</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$5,000</p>
                  <p className="text-xs text-green-600">+$125.00</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span>Progress</span>
                  <span>25%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: "25%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">12% Growth Jar</p>
                    <p className="text-xs text-muted-foreground">24 months • Matures Mar 2027</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$3,500</p>
                  <p className="text-xs text-green-600">+$105.00</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span>Progress</span>
                  <span>15%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-green-600" style={{ width: "15%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Sprout className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">15% Growth Jar</p>
                    <p className="text-xs text-muted-foreground">36 months • Matures Mar 2028</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2,000</p>
                  <p className="text-xs text-green-600">+$75.00</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span>Progress</span>
                  <span>8%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-blue-600" style={{ width: "8%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Recent Transactions</h2>
          <Link href="/mobile/history" className="text-xs text-primary">
            View All
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="border-b p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Plus className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Deposit</p>
                    <p className="text-xs text-muted-foreground">Apr 15, 2025</p>
                  </div>
                </div>
                <p className="font-medium text-green-600">+$1,000.00</p>
              </div>
            </div>
            <div className="border-b p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Sprout className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Investment</p>
                    <p className="text-xs text-muted-foreground">Apr 12, 2025</p>
                  </div>
                </div>
                <p className="font-medium text-muted-foreground">-$2,000.00</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Withdrawal</p>
                    <p className="text-xs text-muted-foreground">Apr 5, 2025</p>
                  </div>
                </div>
                <p className="font-medium text-muted-foreground">-$500.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
