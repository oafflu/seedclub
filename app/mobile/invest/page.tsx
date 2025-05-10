"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  Wallet,
  CreditCard,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React from "react"

// Helper for client-only number formatting (use only at top level, not in loops)
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

// Plain formatting function for use in render loops
function formatNumber(num: number | string | null | undefined) {
  if (num === null || num === undefined) return ""
  return Number(num).toLocaleString()
}

// MOCK CUSTOMER DATA FOR DEVELOPMENT/DEMO PURPOSES
const mockCustomer = {
  id: 'mock-customer-id',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  walletBalance: 3750,
}

export default function InvestPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedJar, setSelectedJar] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [walletBalance, setWalletBalance] = useState(mockCustomer.walletBalance)
  const [showSuccess, setShowSuccess] = useState(false)
  const [jars, setJars] = useState<any[]>([])
  const [investmentTerms, setInvestmentTerms] = useState<any[]>([])
  const [filteredJars, setFilteredJars] = useState<any[]>([])

  // Fetch jars and investment terms from backend
  useEffect(() => {
    async function fetchData() {
      // Fetch jars
      const jarsRes = await fetch("/api/admin/jars")
      const jarsJson = await jarsRes.json()
      setJars(jarsJson.jars || [])
      setFilteredJars(jarsJson.jars || [])
      // Fetch investment terms
      const termsRes = await fetch("/api/admin/settings/investment")
      const termsJson = await termsRes.json()
      setInvestmentTerms(Array.isArray(termsJson.jars) ? termsJson.jars : [])
    }
    fetchData()
  }, [])

  // Filter jars when tab changes (if you want to filter by term, etc.)
  useEffect(() => {
    if (selectedTab === "all") {
      setFilteredJars(jars)
    } else {
      // Optionally filter by term or other criteria
      setFilteredJars(jars)
    }
  }, [selectedTab, jars])

  // Calculate returns
  const calculateReturns = (principal: number, growth: number, term: number) => {
    const years = term / 12
    const futureValue = principal * Math.pow(1 + growth / 100, years)
    const interest = futureValue - principal
    return {
      futureValue: futureValue.toFixed(2),
      interest: interest.toFixed(2),
    }
  }

  const handleInvest = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedJar(null)
      setAmount("")
      setSelectedTerm(null)
      setPaymentMethod("wallet")
    }, 3000)
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link href="/mobile/dashboard">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Choose a New Jar</h1>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-primary">
          Plant a seed in a new jar and watch the fixed growth over a set amount of time
        </h2>
        <p className="text-muted-foreground mt-2">Select from our curated collection of investment jars</p>
      </div>

      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Investment successful!</h3>
              <p className="text-green-700 text-sm">Your new jar has been created. Your funds are now growing.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Jars</TabsTrigger>
          {/* Optionally add more tab filters here */}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredJars.map((jar) => (
              <Card key={jar.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {jar.icon_name ? (
                        <img src={jar.icon_name} alt={jar.name} className="h-10 w-10" />
                      ) : (
                        <span className="h-10 w-10 bg-muted rounded-full" />
                      )}
                      <CardTitle className="text-lg">{jar.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{jar.description}</CardDescription>
                  <div className="flex gap-1 mt-2">
                    {investmentTerms.map((option, idx) => (
                      <Badge key={option.term + '-' + option.apy + '-' + idx} variant="outline" className="text-green-600 bg-green-50">
                        {option.apy}%
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Minimum</span>
                      <span className="font-medium">{formatNumber(jar.minimum_investment)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedJar(jar)}>
                        Select This Jar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {jar.icon_name ? (
                            <img src={jar.icon_name} alt={jar.name} className="h-10 w-10" />
                          ) : (
                            <span className="h-10 w-10 bg-muted rounded-full" />
                          )}
                          Invest in {jar.name}
                        </DialogTitle>
                        <DialogDescription>
                          {jar.description} Minimum ${formatNumber(jar.minimum_investment)}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Investment Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id="amount"
                              type="number"
                              min={jar.minimum_investment}
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Select Term & Growth Rate</Label>
                          <RadioGroup
                            value={selectedTerm || ''}
                            onValueChange={setSelectedTerm}
                            className="grid grid-cols-3 gap-2"
                          >
                            {investmentTerms.map((option, idx) => (
                              <div key={option.term + '-' + option.apy + '-' + idx} className="flex items-center space-x-2">
                                <RadioGroupItem value={String(option.term)} id={String(option.term)} className="sr-only" />
                                <Label
                                  htmlFor={String(option.term)}
                                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent cursor-pointer ${selectedTerm === String(option.term) ? "border-primary bg-primary/5" : ""}`}
                                >
                                  <span className="text-sm font-medium">{option.term} Months</span>
                                  <span className="text-lg font-bold text-green-600">{option.apy}% Growth</span>
                                  <span className="text-xs text-muted-foreground">Min: ${formatNumber(option.min)}</span>
                                  <span className="text-xs text-muted-foreground">Early Fee: {option.earlyFee}%</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="grid grid-cols-2 gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="wallet" id="wallet" className="sr-only" />
                              <Label
                                htmlFor="wallet"
                                className={`flex items-center justify-between rounded-md border-2 border-muted p-3 w-full hover:border-accent cursor-pointer ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : ""}`}
                              >
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4" />
                                  <span>Wallet</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ${formatNumber(walletBalance)}
                                </span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="card" className="sr-only" />
                              <Label
                                htmlFor="card"
                                className={`flex items-center justify-between rounded-md border-2 border-muted p-3 w-full hover:border-accent cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                              >
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span>Add Funds</span>
                                </div>
                                <span className="text-sm text-muted-foreground">+</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {amount && selectedTerm && (
                          <div className="rounded-md bg-muted p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">Investment Summary</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{selectedTerm} Months</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Principal</span>
                                <span className="font-medium">${formatNumber(amount)}</span>
                              </div>
                              {(() => {
                                const termObj = investmentTerms.find(t => String(t.term) === selectedTerm)
                                return termObj ? (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                                      <span className="font-medium text-green-600">{termObj.apy}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Future Value</span>
                                      <span className="font-medium">
                                        ${calculateReturns(Number(amount), termObj.apy, termObj.term).futureValue}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Interest Earned</span>
                                      <span className="font-medium text-green-600">
                                        +${calculateReturns(Number(amount), termObj.apy, termObj.term).interest}
                                      </span>
                                    </div>
                                  </>
                                ) : null
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setSelectedJar(null)}>
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleInvest}
                          disabled={
                            !amount ||
                            !selectedTerm ||
                            Number(amount) < (selectedJar?.minimum_investment || 0) ||
                            (paymentMethod === "wallet" && Number(amount) > walletBalance)
                          }
                        >
                          Plant Seed
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ol className="list-inside list-decimal space-y-2">
            <li>Choose from our curated selection of investment jars</li>
            <li>Select the jar that matches your investment goals</li>
            <li>Choose your preferred term length and growth rate</li>
            <li>Enter the amount you wish to invest (at least the minimum amount)</li>
            <li>Select your payment method and plant your seed</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Your principal is secured and your returns are guaranteed at the stated growth rate. Early withdrawals may
            be subject to penalties.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
