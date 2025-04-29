"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUp, ArrowDown, Calendar, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for charts
const investmentData = [
  { month: "Jan", amount: 1200000 },
  { month: "Feb", amount: 1350000 },
  { month: "Mar", amount: 1500000 },
  { month: "Apr", amount: 1650000 },
  { month: "May", amount: 1800000 },
  { month: "Jun", amount: 2100000 },
  { month: "Jul", amount: 2400000 },
  { month: "Aug", amount: 2700000 },
  { month: "Sep", amount: 3000000 },
  { month: "Oct", amount: 3300000 },
  { month: "Nov", amount: 3700000 },
  { month: "Dec", amount: 4200000 },
]

const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1350 },
  { month: "Mar", users: 1500 },
  { month: "Apr", users: 1650 },
  { month: "May", users: 1800 },
  { month: "Jun", users: 2100 },
  { month: "Jul", users: 2400 },
  { month: "Aug", users: 2700 },
  { month: "Sep", users: 3000 },
  { month: "Oct", users: 3300 },
  { month: "Nov", users: 3700 },
  { month: "Dec", users: 4200 },
]

const jarDistributionData = [
  { name: "12 Month (12%)", value: 45 },
  { name: "24 Month (14%)", value: 35 },
  { name: "36 Month (16%)", value: 20 },
]

const COLORS = ["#204854", "#286578", "#d97a4b", "#dedddd"]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState("weekly")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
          <Button size="sm">Generate Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">4,253</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">from last month</span>
            </div>
            <Progress value={75} className="mt-3 h-1" />
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/admin/customers">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Jars</CardDescription>
            <CardTitle className="text-3xl">3,752</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">8%</span>
              <span className="ml-1">from last month</span>
            </div>
            <Progress value={65} className="mt-3 h-1" />
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/admin/jars">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invested</CardDescription>
            <CardTitle className="text-3xl">$4.2M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">15%</span>
              <span className="ml-1">from last month</span>
            </div>
            <Progress value={85} className="mt-3 h-1" />
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/admin/transactions">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Referrals</CardDescription>
            <CardTitle className="text-3xl">487</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">24%</span>
              <span className="ml-1">from last month</span>
            </div>
            <Progress value={92} className="mt-3 h-1" />
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/admin/referrals">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Revenue</CardDescription>
            <CardTitle className="text-2xl">$325,800</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">18%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Support Tickets</CardDescription>
            <CardTitle className="text-2xl">24 Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-2xl">8.7%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">2.1%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Growth</CardTitle>
            <CardDescription>Total investment growth over time</CardDescription>
            <Tabs defaultValue="monthly" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Investment Amount",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={investmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#204854" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#204854" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="amount" stroke="#204854" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jar Distribution</CardTitle>
            <CardDescription>Distribution of investment jars by term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jarDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {jarDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly user acquisition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} users`, "Total Users"]} />
                <Bar dataKey="users" fill="#d97a4b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system notifications requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
              <div>
                <h4 className="font-medium">Unusual Withdrawal Activity</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple large withdrawals detected from account #38291. May require review.
                </p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
              <div>
                <h4 className="font-medium">System Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Database query performance has degraded by 15% in the last 24 hours.
                </p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">New Users</TabsTrigger>
              <TabsTrigger value="jars">New Jars</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 border-b p-3 font-medium">
              <div>ID</div>
              <div>Name</div>
              <div>Date</div>
              <div>Amount</div>
            </div>
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 p-3">
                  <div className="text-muted-foreground">#{1000 + i}</div>
                  <div>User Name</div>
                  <div>2023-12-{10 + i}</div>
                  <div>${(1200 + i * 100).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
