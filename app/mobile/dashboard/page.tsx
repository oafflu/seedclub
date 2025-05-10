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

  const calculateProjectedProfit = (amount: number, rate: number, progress: number) => {
    return (amount * (rate / 100) * (progress / 100)).toFixed(2)
  }

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

          {/* Sprout Fund Jar */}
          <Card className="bg-white rounded-[20px] shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 relative">
                    <Image 
                      src="/assets/icons/sprout-jar.svg" 
                      alt="Sprout Fund" 
                      width={20} 
                      height={20}
                    />
                  </div>
                  <span className="text-[16px] font-medium text-gray-900">Sprout Fund</span>
                </div>
                <div className="bg-[#ECFDF3] px-2.5 py-1 rounded-full">
                  <p className="text-[13px] text-[#039855] font-medium flex items-center gap-1">
                    <span className="text-lg">↗</span> 10% Growth for 12 months
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Amount Invested</p>
                  <p className="text-[20px] font-semibold text-gray-900">$5,000</p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Maturity Date</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-[15px] text-gray-900">Dec 15, 2025</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-600">Maturity Progress</span>
                  <span className="text-gray-600">{sproutFundSimulation.currentProgress}% Complete</span>
                </div>
                <div className="relative">
                  <div className="h-[4px] w-full bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-[4px] bg-[#1B4242] rounded-full" 
                      style={{ width: `${sproutFundSimulation.currentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-600">Current: {sproutFundSimulation.currentProgress}%</span>
                  <span className="text-gray-600">Simulated: {sproutFundSimulation.simulatedProgress}%</span>
                </div>
                <div className="relative h-4 flex items-center">
                  <div 
                    className="absolute top-[6px] left-0 h-1 bg-[#1B4242] rounded-full" 
                    style={{ width: `${sproutFundSimulation.currentProgress}%` }}
                  />
                  <Slider
                    defaultValue={[sproutFundSimulation.currentProgress]}
                    max={100}
                    step={1}
                    className="absolute w-full"
                    onValueChange={(value) => {
                      const simulatedValue = value[0]
                      const projectedProfit = calculateProjectedProfit(
                        sproutFundSimulation.investedAmount,
                        sproutFundSimulation.growthRate,
                        simulatedValue
                      )
                      setSproutFundSimulation(prev => ({
                        ...prev,
                        simulatedProgress: simulatedValue,
                        projectedProfit: Number(projectedProfit)
                      }))
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Current Profit</p>
                  <p className="text-[15px] text-[#039855] font-medium">
                    +${sproutFundSimulation.currentProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Projected Profit</p>
                  <p className="text-[15px] text-[#039855] font-medium">
                    +${sproutFundSimulation.projectedProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sapling Stash Jar */}
          <Card className="bg-white rounded-[20px] shadow-sm overflow-hidden mt-4">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 relative">
                    <Image 
                      src="/assets/icons/sapling-jar.svg" 
                      alt="Sapling Stash" 
                      width={20} 
                      height={20}
                    />
                  </div>
                  <span className="text-[16px] font-medium text-gray-900">Sapling Stash</span>
                </div>
                <div className="bg-[#ECFDF3] px-2.5 py-1 rounded-full">
                  <p className="text-[13px] text-[#039855] font-medium flex items-center gap-1">
                    <span className="text-lg">↗</span> 12% Growth for 24 months
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Amount Invested</p>
                  <p className="text-[20px] font-semibold text-gray-900">$10,000</p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Maturity Date</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-[15px] text-gray-900">Jan 15, 2026</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-600">Maturity Progress</span>
                  <span className="text-gray-600">{saplingStashSimulation.currentProgress}% Complete</span>
                </div>
                <div className="relative">
                  <div className="h-[4px] w-full bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-[4px] bg-[#1B4242] rounded-full" 
                      style={{ width: `${saplingStashSimulation.currentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-600">Current: {saplingStashSimulation.currentProgress}%</span>
                  <span className="text-gray-600">Simulated: {saplingStashSimulation.simulatedProgress}%</span>
                </div>
                <div className="relative h-4 flex items-center">
                  <div 
                    className="absolute top-[6px] left-0 h-1 bg-[#1B4242] rounded-full" 
                    style={{ width: `${saplingStashSimulation.currentProgress}%` }}
                  />
                  <Slider
                    defaultValue={[saplingStashSimulation.currentProgress]}
                    max={100}
                    step={1}
                    className="absolute w-full"
                    onValueChange={(value) => {
                      const simulatedValue = value[0]
                      const projectedProfit = calculateProjectedProfit(
                        saplingStashSimulation.investedAmount,
                        saplingStashSimulation.growthRate,
                        simulatedValue
                      )
                      setSaplingStashSimulation(prev => ({
                        ...prev,
                        simulatedProgress: simulatedValue,
                        projectedProfit: Number(projectedProfit)
                      }))
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Current Profit</p>
                  <p className="text-[15px] text-[#039855] font-medium">
                    +${saplingStashSimulation.currentProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Projected Profit</p>
                  <p className="text-[15px] text-[#039855] font-medium">
                    +${saplingStashSimulation.projectedProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blossom Budget Jar */}
          <Card className="bg-white rounded-[20px] shadow-sm overflow-hidden mt-4">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 relative">
                    <Image 
                      src="/assets/icons/blossom-jar.svg" 
                      alt="Blossom Budget" 
                      width={20} 
                      height={20}
                    />
                  </div>
                  <span className="text-[16px] font-medium text-gray-900">Blossom Budget</span>
                </div>
                <div className="bg-[#ECFDF3] px-2.5 py-1 rounded-full">
                  <p className="text-[13px] text-[#039855] font-medium flex items-center gap-1">
                    <span className="text-lg">↗</span> 15% Growth for 36 months
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Amount Invested</p>
                  <p className="text-[20px] font-semibold text-gray-900">$3,000</p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Maturity Date</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-[15px] text-gray-900">Feb 15, 2027</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-600">Maturity Progress</span>
                  <span className="text-gray-600">{blossomBudgetSimulation.currentProgress}% Complete</span>
                </div>
                <div className="relative">
                  <div className="h-[4px] w-full bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-[4px] bg-[#1B4242] rounded-full" 
                      style={{ width: `${blossomBudgetSimulation.currentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-600">Current: {blossomBudgetSimulation.currentProgress}%</span>
                  <span className="text-gray-600">Simulated: {blossomBudgetSimulation.simulatedProgress}%</span>
                </div>
                <div className="relative h-4 flex items-center">
                  <div 
                    className="absolute top-[6px] left-0 h-1 bg-[#1B4242] rounded-full" 
                    style={{ width: `${blossomBudgetSimulation.currentProgress}%` }}
                  />
                  <Slider
                    defaultValue={[blossomBudgetSimulation.currentProgress]}
                    max={100}
                    step={1}
                    className="absolute w-full"
                    onValueChange={(value) => {
                      const simulatedValue = value[0]
                      const projectedProfit = calculateProjectedProfit(
                        blossomBudgetSimulation.investedAmount,
                        blossomBudgetSimulation.growthRate,
                        simulatedValue
                      )
                      setBlossomBudgetSimulation(prev => ({
                        ...prev,
                        simulatedProgress: simulatedValue,
                        projectedProfit: Number(projectedProfit)
                      }))
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Current Profit</p>
                  <p className="text-[15px] text-[#039855] font-medium">
                    +${blossomBudgetSimulation.currentProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 mb-1">Projected Profit</p>
                  <p className="text-[15px] text-[#039855] font-medium">
                    +${blossomBudgetSimulation.projectedProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <span className="text-xs text-gray-600">Create Jar</span>
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
