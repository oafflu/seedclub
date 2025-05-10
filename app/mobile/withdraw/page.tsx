"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BanknoteIcon as Bank, CreditCard, ChevronRight, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Mock data for bank accounts and cards
const paymentMethods = [
  {
    id: "bank1",
    type: "bank",
    name: "Chase Bank",
    accountNumber: "****6789",
    icon: Bank,
  },
  {
    id: "bank2",
    type: "bank",
    name: "Bank of America",
    accountNumber: "****4321",
    icon: Bank,
  },
  {
    id: "card1",
    type: "card",
    name: "Visa Credit Card",
    accountNumber: "****5678",
    icon: CreditCard,
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

// Helper for client-only random reference
function useClientRandomRef() {
  const [ref, setRef] = useState<string>("")
  useEffect(() => {
    setRef("")
    setTimeout(() => {
      setRef("WD-" + Math.floor(Math.random() * 1000000))
    }, 0)
  }, [])
  return ref
}

export default function WithdrawPage() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [selectedBankId, setSelectedBankId] = useState("")
  const { toast } = useToast()

  // Fetch user's bank accounts
  useEffect(() => {
    async function fetchBankAccounts() {
      const supabase = createClientComponentClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data, error } = await supabase
        .from("customer_bank_accounts")
        .select("id, bank_name, account_number, routing_number, account_holder_name")
        .eq("customer_id", session.user.id)
      if (!error) setBankAccounts(data || [])
    }
    fetchBankAccounts()
  }, [])

  // Handle withdrawal submit
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClientComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { error } = await supabase
      .from("wallet_withdrawals")
      .insert({
        customer_id: session.user.id,
        amount: Number(amount),
        bank_account_id: selectedBankId,
        status: "pending",
      })
    if (!error) {
      toast({ title: "Withdrawal requested", description: "Your withdrawal request has been submitted." })
      setAmount("")
      setSelectedBankId("")
    } else {
      toast({ title: "Error", description: error.message })
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "")
    // Prevent multiple decimal points
    const parts = value.split(".")
    if (parts.length > 2) {
      return
    }
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return
    }
    setAmount(value)
  }

  const handleContinue = () => {
    if (step === 1) {
      if (!amount || Number.parseFloat(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid withdrawal amount",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedBankId)

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/mobile/wallet">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Withdraw Funds</h1>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 1 ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <p className="mt-1 text-xs">Amount</p>
        </div>
        <div className="h-1 flex-1 bg-muted my-1">
          <div className="h-full bg-primary transition-all" style={{ width: step > 1 ? "100%" : "0%" }}></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 2 ? <Check className="h-5 w-5" /> : "2"}
          </div>
          <p className="mt-1 text-xs">Method</p>
        </div>
        <div className="h-1 flex-1 bg-muted my-1">
          <div className="h-full bg-primary transition-all" style={{ width: step > 2 ? "100%" : "0%" }}></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <p className="mt-1 text-xs">Confirm</p>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Withdrawal Amount</CardTitle>
            <CardDescription>How much would you like to withdraw?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">$</div>
                <Input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8 text-lg"
                />
              </div>
              <div className="flex justify-between rounded-lg bg-muted p-3">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <span className="font-medium">$3,750.00</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Withdrawal Method</CardTitle>
            <CardDescription>Choose where to send your funds</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedBankId} onValueChange={setSelectedBankId} className="space-y-3">
              {bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className={`flex cursor-pointer items-center justify-between rounded-md border-2 border-muted p-4 hover:border-accent ${
                    selectedBankId === bank.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={bank.id} id={bank.id} />
                    <div className="rounded-full bg-muted p-2">
                      <Bank className="h-5 w-5" />
                    </div>
                    <div>
                      <Label htmlFor={bank.id} className="font-medium">
                        {bank.bank_name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{bank.account_number}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </RadioGroup>
            <Button variant="outline" className="mt-4 w-full justify-center" asChild>
              <Link href="/mobile/profile/payment-methods">Add New Payment Method</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Withdrawal</CardTitle>
            <CardDescription>Please review your withdrawal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-xl font-bold">{useClientFormattedNumber(amount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">{useClientFormattedNumber(amount)}</span>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Withdrawal Method</h3>
                <div className="flex items-center space-x-3">
                  {selectedPaymentMethod && (
                    <>
                      <div className="rounded-full bg-muted p-2">
                        <Bank className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedPaymentMethod.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedPaymentMethod.accountNumber}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start rounded-lg bg-amber-50 p-4 text-amber-800">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Processing Time</p>
                  <p>Withdrawals typically take 1-3 business days to process depending on your bank.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
