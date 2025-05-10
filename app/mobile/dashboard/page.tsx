"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Plus, TrendingUp, Wallet, Bell, CircleDollarSign, HelpCircle, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

// MOCK CUSTOMER DATA FOR DEVELOPMENT/DEMO PURPOSES
const mockCustomer = {
  id: 'mock-customer-id',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
}

// Add JarCard component for each customer jar
function JarCard({ custJar, adminJar, termObj }: { custJar: any, adminJar: any, termObj: any }) {
  const [simulatedProgress, setSimulatedProgress] = useState(custJar.progress)
  // Simple interest calculation
  function calculateSimpleInterest(amount: number, apy: number, progress: number) {
    return (amount * (apy / 100) * (progress / 100)).toFixed(2)
  }
  const currentProfit = Number(calculateSimpleInterest(custJar.investedAmount, termObj.apy, custJar.progress))
  const projectedProfit = Number(calculateSimpleInterest(custJar.investedAmount, termObj.apy, simulatedProgress))
  const maturityDate = (() => {
    const d = new Date(custJar.startDate)
    d.setMonth(d.getMonth() + Number(custJar.term))
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  })()
  return (
    <Card className="bg-white rounded-[20px] shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              {adminJar.icon_name ? (
                <img src={adminJar.icon_name} alt={adminJar.name} width={40} height={40} />
              ) : (
                <span className="h-10 w-10 bg-muted rounded-full block" />
              )}
            </div>
            <span className="text-[16px] font-medium text-gray-900">{adminJar.name || 'Jar'}</span>
          </div>
          <div className="bg-[#ECFDF3] px-2.5 py-1 rounded-full">
            <p className="text-[13px] text-[#039855] font-medium flex items-center gap-1">
              <span className="text-lg">↗</span> {termObj.apy}% Growth for {termObj.term} months
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[13px] text-gray-500 mb-1">Amount Invested</p>
            <p className="text-[20px] font-semibold text-gray-900">${custJar.investedAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[13px] text-gray-500 mb-1">Maturity Date</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <p className="text-[15px] text-gray-900">{maturityDate}</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-gray-600">Maturity Progress</span>
            <span className="text-gray-600">{custJar.progress}% Complete</span>
          </div>
          <div className="relative">
            <div className="h-[4px] w-full bg-gray-200 rounded-full">
              <div className="absolute top-0 left-0 h-[4px] bg-[#1B4242] rounded-full" style={{ width: `${custJar.progress}%` }} />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-gray-600">Current: {custJar.progress}%</span>
            <span className="text-gray-600">Simulated: {simulatedProgress}%</span>
          </div>
          <div className="relative h-4 flex items-center">
            <div className="absolute top-[6px] left-0 h-1 bg-[#1B4242] rounded-full" style={{ width: `${custJar.progress}%` }} />
            <Slider
              defaultValue={[custJar.progress]}
              max={100}
              step={1}
              className="absolute w-full"
              onValueChange={(value) => setSimulatedProgress(value[0])}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[13px] text-gray-500 mb-1">Current Profit</p>
            <p className="text-[15px] text-[#039855] font-medium">+${currentProfit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[13px] text-gray-500 mb-1">Projected Profit</p>
            <p className="text-[15px] text-[#039855] font-medium">+${projectedProfit.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MobileDashboard() {
  const [userName, setUserName] = useState(`${mockCustomer.firstName} ${mockCustomer.lastName}`)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [sproutFundSimulation, setSproutFundSimulation] = useState({
    currentProgress: 5,
    simulatedProgress: 5,
    currentProfit: 23.88,
    projectedProfit: 23.88,
    investedAmount: 5000,
    growthRate: 10,
  })

  const [saplingStashSimulation, setSaplingStashSimulation] = useState({
    currentProgress: 10,
    simulatedProgress: 10,
    currentProfit: 229.25,
    projectedProfit: 229.25,
    investedAmount: 10000,
    growthRate: 12,
  })

  const [blossomBudgetSimulation, setBlossomBudgetSimulation] = useState({
    currentProgress: 8,
    simulatedProgress: 8,
    currentProfit: 102.34,
    projectedProfit: 102.34,
    investedAmount: 3000,
    growthRate: 15,
  })

  // State for admin jars and interest settings
  const [adminJars, setAdminJars] = useState<any[]>([])
  const [interestSettings, setInterestSettings] = useState<any[]>([])
  const [customerJars, setCustomerJars] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const fetchUserName = async () => {
      try {
        // Get session from Supabase client
        const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient()
        const { data: { session } } = await supabase.auth.getSession()
        let name = ''
        if (session?.user) {
          // Direct fetch with correct headers
          const headers = new Headers({
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            Authorization: `Bearer ${session.access_token}`,
            Accept: 'application/json',
          })
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/customers?select=first_name,last_name&id=eq.${session.user.id}`,
            {
              headers,
            }
          )
          const arr = await res.json()
          const customer = arr && arr[0]
          if (customer) {
            name = (customer.first_name || '') + (customer.last_name ? ' ' + customer.last_name : '')
          }
        }
        if (!name.trim()) {
          name = 'User'
        }
        setUserName(name)
        setIsLoading(false)
      } catch {
        setUserName('User')
        setIsLoading(false)
      }
    }
    fetchUserName()
  }, [mounted, router])

  // Fetch admin jars and interest settings on mount
  useEffect(() => {
    if (!mounted) return
    async function fetchData() {
      try {
        const jarsRes = await fetch("/api/admin/jars")
        const jarsJson = await jarsRes.json()
        setAdminJars(jarsJson.jars || [])
        const termsRes = await fetch("/api/admin/settings/investment")
        const termsJson = await termsRes.json()
        setInterestSettings(Array.isArray(termsJson.jars) ? termsJson.jars : [])
        // Mock customer jars (simulate investments)
        setCustomerJars([
          {
            id: 'cust-jar-1',
            jarId: jarsJson.jars?.[0]?.id || '',
            investedAmount: 5000,
            startDate: '2024-01-01',
            term: 12, // months
            progress: 5, // percent
          },
          {
            id: 'cust-jar-2',
            jarId: jarsJson.jars?.[1]?.id || '',
            investedAmount: 10000,
            startDate: '2024-01-15',
            term: 24,
            progress: 10,
          },
          {
            id: 'cust-jar-3',
            jarId: jarsJson.jars?.[2]?.id || '',
            investedAmount: 3000,
            startDate: '2024-02-15',
            term: 36,
            progress: 8,
          },
        ])
      } catch (e) {
        // fallback: no jars
        setAdminJars([])
        setInterestSettings([])
        setCustomerJars([])
      }
    }
    fetchData()
  }, [mounted])

  if (!mounted || isLoading || userName === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="pb-20 bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#F5F5F5] p-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#1A1A1A] mb-1">Hi {userName},</h1>
          <p className="text-[14px] text-gray-600">Welcome back to your dashboard</p>
        </div>

        {/* Account Balance Card */}
        <Card className="mt-4 bg-white rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] text-[#1A1A1A] font-medium mb-1">Account</p>
                <p className="text-[32px] font-semibold tracking-tight mb-1">$ 3,750</p>
                <p className="text-[14px] text-gray-600">Available Funds</p>
              </div>
              <div className="text-right">
                <Wallet className="h-5 w-5 text-gray-600 mb-1" />
                <p className="text-[13px] text-gray-600">Wallet Balance</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-[#F5F5F5] hover:bg-gray-200 text-[#1A1A1A] justify-center items-center h-[52px] text-[15px] font-medium gap-2"
              asChild
            >
              <Link href="/mobile/wallet">
                Go to Wallet
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profit Card */}
        <Card className="mt-4 bg-white rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[32px] font-semibold tracking-tight mb-1">$1,250</p>
                <p className="text-[14px] text-gray-600">/ This year</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[15px] text-[#1A1A1A] font-medium">Profit</p>
                  <p className="text-[13px] text-gray-600">Total earnings</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#1B4242] flex items-center justify-center cursor-pointer hover:bg-[#153434]">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jar Summary Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[20px] font-semibold text-[#1A1A1A]">Jar Summary</h2>
            <Link 
              href="/mobile/jars" 
              className="text-[14px] text-[#1A1A1A] flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <Card className="bg-white rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-gray-600 mb-1">Total Value</p>
                  <p className="text-[32px] font-semibold tracking-tight">$19,040</p>
                </div>
                <Button 
                  className="bg-[#1B4242] hover:bg-[#153434] text-white h-10 px-4 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  New Jar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Jars Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[20px] font-semibold text-[#1A1A1A]">Your Jars</h2>
            <p className="text-[14px] text-gray-600">Drag to simulate growth</p>
          </div>
          {customerJars.map((custJar, idx) => {
            const adminJar = adminJars.find(j => j.id === custJar.jarId) || {}
            const termObj = interestSettings.find(t => String(t.term) === String(custJar.term)) || interestSettings[0] || { apy: 0, term: custJar.term }
            // Add mb-6 to all but the last card
            const isLast = idx === customerJars.length - 1
            return (
              <div key={custJar.id} className={!isLast ? 'mb-6' : ''}>
                <JarCard custJar={custJar} adminJar={adminJar} termObj={termObj} />
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-[20px] font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            <Link href="/mobile/wallet/add-funds" className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <CircleDollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Add Funds</span>
            </Link>
            <Link href="/mobile/jars/create" className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Invest</span>
            </Link>
            <Link href="/mobile/withdraw" className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <ArrowUpRight className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-600">Withdraw</span>
            </Link>
            <Link href="/mobile/support" className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-xs text-gray-600">Support</span>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-semibold text-[#1A1A1A]">Recent Transactions</h2>
            <Link href="/mobile/history" className="text-[14px] text-[#1A1A1A] flex items-center">
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
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
                      <p className="font-medium">Added funds to wallet</p>
                      <p className="text-xs text-gray-600">2023-12-15</p>
                    </div>
                  </div>
                  <p className="font-medium text-green-600">+$2,000</p>
                </div>
              </div>
              <div className="border-b p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Created Jar</p>
                      <p className="text-xs text-gray-600">2023-12-10</p>
                    </div>
                  </div>
                  <p className="font-medium">$5,000</p>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Jar earnings</p>
                      <p className="text-xs text-gray-600">2024-01-15</p>
                    </div>
                  </div>
                  <p className="font-medium text-green-600">+$250</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
