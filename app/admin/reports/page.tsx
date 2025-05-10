"use client"

import { useState, useEffect } from "react"
import {
  Download,
  Calendar,
  BarChart3,
  PieChartIcon,
  LineChart,
  TrendingUp,
  Users,
  PiggyBank,
  CreditCard,
  Gift,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  LineChart as RechartsLineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

const COLORS = ["#204854", "#286578", "#d97a4b", "#dedddd"]

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("monthly")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined })
  const [dashboard, setDashboard] = useState<any>({})
  const [jars, setJars] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const [dashboardRes, jarsRes, customersRes] = await Promise.all([
        fetch('/api/admin/dashboard').then(r => r.json()),
        fetch('/api/admin/jars').then(r => r.json()),
        fetch('/api/admin/customers').then(r => r.json()),
      ])
      setDashboard(dashboardRes)
      setJars(jarsRes.jars || [])
      setCustomers(Array.isArray(customersRes) ? customersRes : [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Date range filter logic for all charts (example: filter dashboard.overview by dateRange)
  // ...

  // Export handler
  const handleExport = async (formatType: 'csv' | 'excel' | 'pdf') => {
    // Example: export dashboard.overview as CSV/Excel/PDF
    const data = dashboard.overview || []
    if (!data.length) return
    if (formatType === 'csv') {
      const csvRows = [
        Object.keys(data[0]).join(','),
        ...data.map((row: any) => Object.values(row).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      ]
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (formatType === 'excel') {
      const XLSX = await import('xlsx')
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Report')
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `report_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (formatType === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()
      autoTable(doc, {
        head: [Object.keys(data[0])],
        body: data.map((row: any) => Object.values(row)),
      })
      doc.save(`report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker
            value={dateRange}
            onChange={(range) => {
              if (range && typeof (range as any).from !== 'undefined') setDateRange(range as DateRange)
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" /> CSV Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <Download className="mr-2 h-4 w-4" /> Excel Spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" /> PDF Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">{loading ? '--' : dashboard.totalCustomers?.toLocaleString() ?? '--'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="mr-1 h-4 w-4 text-primary" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Invested</CardDescription>
                <CardTitle className="text-3xl">{loading ? '--' : `$${dashboard.totalInvested?.toLocaleString() ?? dashboard.totalValueLocked?.toLocaleString() ?? '--'}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <PiggyBank className="mr-1 h-4 w-4 text-primary" />
                  <span>+15% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly Revenue</CardDescription>
                <CardTitle className="text-3xl">{loading ? '--' : `$${dashboard.monthlyRevenue?.toLocaleString() ?? '--'}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CreditCard className="mr-1 h-4 w-4 text-primary" />
                  <span>+18% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Conversion Rate</CardDescription>
                <CardTitle className="text-3xl">{loading ? '--' : `${dashboard.conversionRate?.toFixed(2) ?? '--'}%`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-primary" />
                  <span>+2.1% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

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
                    <AreaChart data={dashboard.investmentGrowthData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#204854" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#204854" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#204854"
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.userGrowthData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} users`, "Total Users"]} />
                      <Bar dataKey="users" fill="#d97a4b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
                        data={dashboard.jarDistributionData || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {(dashboard.jarDistributionData || []).map((entry: any, index: number) => (
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

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Visitor to customer conversion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={dashboard.conversionRateData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Conversion Rate"]} />
                      <Line type="monotone" dataKey="rate" stroke="#204854" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Investments Tab */}
        <TabsContent value="investments" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Growth by Type</CardTitle>
              <CardDescription>Comparing growth across different jar types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {/* Placeholder for investment-specific charts */}
                <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Investment Growth Chart</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Detailed investment analytics by jar type and time period
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interest Payments</CardTitle>
                <CardDescription>Monthly interest payments to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for interest payment chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Interest Payment Trends</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Monthly interest payments across all jar types
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maturity Forecast</CardTitle>
                <CardDescription>Upcoming jar maturities by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for maturity forecast chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Maturity Timeline</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Forecast of upcoming jar maturities and expected payouts
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>Breakdown of user base by key demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {/* Placeholder for user demographics charts */}
                <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <PieChartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">User Demographics</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Age, location, and investment preferences of your user base
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Customer retention rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for user retention chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Retention Analysis</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Monthly and cohort-based retention metrics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Active users and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for user activity chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">User Engagement</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Daily and monthly active users and key engagement metrics
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Performance</CardTitle>
              <CardDescription>Monthly referral growth and conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.referralData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} referrals`, "Total Referrals"]} />
                    <Bar dataKey="referrals" fill="#286578" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Top referral channels and sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for referral sources chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Referral Channels</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Breakdown of referrals by source and channel</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral ROI</CardTitle>
                <CardDescription>Return on investment for referral program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for referral ROI chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Referral Program ROI</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cost per acquisition and lifetime value of referred customers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Monthly transaction volume by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {/* Placeholder for transaction volume chart */}
                <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Transaction Analysis</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Detailed breakdown of deposits, withdrawals, and interest payments
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Transaction breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for payment methods chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Payment Method Analysis</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Distribution of transactions by payment method
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Success Rate</CardTitle>
                <CardDescription>Success and failure rates for transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for transaction success rate chart */}
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <PieChartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">Transaction Status</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Success, failure, and pending transaction rates
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
