"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, BanknoteIcon as Bank, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function AddFundsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMethod = searchParams.get("method") || "card"

  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState(initialMethod)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Predefined amounts
  const quickAmounts = [100, 500, 1000, 5000]

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      // Redirect back to wallet after completion
      setTimeout(() => {
        router.push("/wallet")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/wallet">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add Funds</h1>
      </div>

      {!isComplete ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  required
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(quickAmount.toString())}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center cursor-pointer">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center cursor-pointer">
                    <Bank className="mr-2 h-5 w-5 text-primary" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Use the following details to make a bank transfer:</p>
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <p>
                      <strong>Account Name:</strong> Seed Club Inc.
                    </p>
                    <p>
                      <strong>Account Number:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Routing Number:</strong> 987654321
                    </p>
                    <p>
                      <strong>Reference:</strong> SC-{Math.floor(Math.random() * 1000000)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={!amount || isProcessing}>
            {isProcessing ? "Processing..." : `Add $${amount || "0"}`}
          </Button>
        </form>
      ) : (
        <Card className="text-center py-8">
          <CardContent>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Funds Added Successfully!</h2>
            <p className="text-muted-foreground mb-6">${amount} has been added to your wallet.</p>
            <p className="text-sm text-muted-foreground">Redirecting to wallet...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
