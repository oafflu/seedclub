"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Plus,
  ArrowUpRight,
  Clock,
  ChevronRight,
  CreditCard,
  Wallet,
  Sprout,
  ArrowDown,
  LifeBuoy,
  Calendar,
  Percent,
  SproutIcon as Seedling,
  Flower,
  TreePine,
  TreesIcon as Plant,
  Wheat,
  Sun,
  TreeDeciduous,
  Leaf,
  LeafyGreenIcon as Greenhouse,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

// Function to get the icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Sprout":
      return Sprout
    case "Seedling":
      return Seedling
    case "Flower":
      return Flower
    case "TreePine":
      return TreePine
    case "Plant":
      return Plant
    case "Wheat":
      return Wheat
    case "Sun":
      return Sun
    case "TreeDeciduous":
      return TreeDeciduous
    case "Leaf":
      return Leaf
    case "Greenhouse":
      return Greenhouse
    default:
      return Sprout
  }
}

// Mock data for demonstration
const mockJars = [
  {
    id: "jar1",
    name: "Sprout Fund",
    initialAmount: 5000,
    currentValue: 5250,
    growthRate: 10,
    term: 12, // months
    startDate: "2024-12-15",
    maturityDate: "2025-12-15",
    progress: 5,
    icon: "Sprout",
  },
  {
    id: "jar2",
    name: "Sapling Stash",
    initialAmount: 10000,
    currentValue: 10700,
    growthRate: 12,
    term: 24, // months
    startDate: "2024-01-15",
    maturityDate: "2026-01-15",
    progress: 10,
    icon: "Seedling",
  },
  {
    id: "jar3",
    name: "Blossom Budget",
    initialAmount: 3000,
    currentValue: 3090,
    growthRate: 15,
    term: 36, // months
    startDate: "2024-02-15",
    maturityDate: "2027-02-15",
    progress: 8,
    icon: "Flower",
  },
]

const mockTransactions = [
  {
    id: "tx1",
    type: "deposit",
    amount: 2000,
    date: "2023-12-15",
    description: "Added funds to wallet",
  },
  {
    id: "tx2",
    type: "investment",
    amount: 5000,
    date: "2023-12-10",
    description: "Created Jar",
  },
  {
    id: "tx3",
    type: "interest",
    amount: 250,
    date: "2024-01-15",
    description: "Jar earnings",
  },
]

export default function DashboardPage() {
  const [totalJarValue, setTotalJarValue] = useState(0)
  const [accountBalance, setAccountBalance] = useState(3750)
  const [profit, setProfit] = useState(1250)
  const [userName, setUserName] = useState("Adrian")
  const [jars, setJars] = useState(
    mockJars.map((jar) => ({
      ...jar,
      simulatedProgress: jar.progress,
    })),
  )

  // Calculate total jar value
  const total = jars.reduce((sum, jar) => sum + jar.currentValue, 0)

  // Calculate projected profit based on progress percentage
  const calculateProjectedProfit = (jar, progressPercentage) => {
    const { initialAmount, growthRate, term } = jar

    // Calculate the time elapsed in years based on the progress percentage
    const timeElapsedInYears = (progressPercentage / 100) * (term / 12)

    // Calculate compound interest: P(1 + r)^t
    // Where P is principal, r is annual rate (as decimal), and t is time in years
    const annualRate = growthRate / 100
    const projectedValue = initialAmount * Math.pow(1 + annualRate, timeElapsedInYears)

    // Return profit (projected value - initial amount)
    return projectedValue - initialAmount
  }

  // Handle slider change
  const handleSliderChange = (jarId, newValue) => {
    setJars((prevJars) => prevJars.map((jar) => (jar.id === jarId ? { ...jar, simulatedProgress: newValue[0] } : jar)))
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      {/* Welcome Message */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Hi {userName},</h1>
        <p className="text-sm text-muted-foreground">Welcome back to your dashboard</p>
      </div>

      {/* Account Section */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-700">Account</p>
              <p className="text-3xl font-bold">$ {accountBalance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Available Funds</p>
            </div>
            <div className="flex flex-col items-end">
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 mb-2">
                <CreditCard className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground">Wallet Balance</span>
            </div>
          </div>
          <Button variant="ghost" className="mt-4 w-full justify-center rounded-xl bg-gray-100 py-6" asChild>
            <Link href="/mobile/wallet">
              Go to Wallet <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Profit Section */}
      <Card className="bg-ivory shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <p className="text-3xl font-bold">${profit.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">/ This year</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-primary-teal">Profit</span>
              <span className="text-xs text-muted-foreground">Total earnings</span>
              <Button variant="ghost" size="icon" className="rounded-full bg-primary-teal text-ivory mt-1">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jar Summary */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Jar Summary</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mobile/jars">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="mt-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${total.toLocaleString()}</p>
              </div>
              <Button asChild>
                <Link href="/mobile/invest">
                  <Plus className="mr-1 h-4 w-4" /> New Jar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Jars Progress Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Jars</h2>
          <p className="text-sm text-muted-foreground">Drag to simulate growth</p>
        </div>

        <div className="mt-3 space-y-4">
          {jars.map((jar) => {
            const projectedProfit = calculateProjectedProfit(jar, jar.simulatedProgress)
            const currentProfit = calculateProjectedProfit(jar, jar.progress)
            const IconComponent = getIconComponent(jar.icon)

            return (
              <Card key={jar.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">{jar.name}</h3>
                    </div>
                    <div className="flex items-center rounded-full bg-green-100 px-2 py-1">
                      <Percent className="mr-1 h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">
                        {jar.growthRate}% Growth for {jar.term} months
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Amount Invested</p>
                      <p className="font-medium">${jar.initialAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Maturity Date</p>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                        <p className="font-medium">{formatDate(jar.maturityDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium">Current: {jar.progress}%</span>
                    <span className="text-xs font-medium">Simulated: {jar.simulatedProgress}%</span>
                  </div>

                  <div className="mb-4 relative">
                    {/* Background progress bar (actual progress) */}
                    <Progress value={jar.progress} className="h-2 bg-gray-100" />

                    {/* Slider for simulating future progress */}
                    <div className="mt-4">
                      <Slider
                        defaultValue={[jar.progress]}
                        value={[jar.simulatedProgress]}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleSliderChange(jar.id, value)}
                        className="py-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Profit</p>
                      <p className="font-medium text-green-600">
                        +${currentProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Projected Profit</p>
                      <p className="font-medium text-green-600">
                        +${projectedProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-3 text-xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link href="/mobile/wallet?action=add-funds" className="block transition-transform hover:scale-105">
            <Card className="bg-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Wallet className="mb-2 h-6 w-6 text-blue-500" />
                <p className="text-center text-sm font-medium">Add Funds</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mobile/invest" className="block transition-transform hover:scale-105">
            <Card className="bg-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Sprout className="mb-2 h-6 w-6 text-green-500" />
                <p className="text-center text-sm font-medium">Create Jar</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mobile/withdraw" className="block transition-transform hover:scale-105">
            <Card className="bg-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <ArrowDown className="mb-2 h-6 w-6 text-purple-500" />
                <p className="text-center text-sm font-medium">Withdraw</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mobile/support" className="block transition-transform hover:scale-105">
            <Card className="bg-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <LifeBuoy className="mb-2 h-6 w-6 text-amber-500" />
                <p className="text-center text-sm font-medium">Support</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mobile/wallet">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="mt-3">
          <CardContent className="p-0">
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
                      {tx.type === "investment" && <Plus className="h-4 w-4" />}
                      {tx.type === "interest" && <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${tx.type === "deposit" || tx.type === "interest" ? "text-green-600" : ""}`}
                  >
                    {tx.type === "deposit" || tx.type === "interest" ? "+" : ""}${tx.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
