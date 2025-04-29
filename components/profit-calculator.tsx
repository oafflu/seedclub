"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Calculator, TrendingUp, Calendar, DollarSign } from "lucide-react"

export function ProfitCalculator() {
  const [amount, setAmount] = useState(1000)
  const [term, setTerm] = useState("12")
  const [results, setResults] = useState({
    growth: 10,
    interestEarned: 0,
    totalAmount: 0,
    monthlyInterest: 0,
  })

  // Calculate results when amount or term changes
  useEffect(() => {
    const growth = term === "12" ? 10 : term === "24" ? 12 : 15
    const years = Number.parseInt(term) / 12
    const interestEarned = amount * (Math.pow(1 + growth / 100, years) - 1)
    const totalAmount = amount + interestEarned
    const monthlyInterest = interestEarned / Number.parseInt(term)

    setResults({
      growth,
      interestEarned,
      totalAmount,
      monthlyInterest,
    })
  }, [amount, term])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value.replace(/[^0-9.]/g, ""))
    if (!isNaN(value)) {
      setAmount(value)
    } else {
      setAmount(0)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0])
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <span>Investment Calculator</span>
          </CardTitle>
          <CardDescription>Estimate your returns based on investment amount and term length</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="investment-amount">Investment Amount</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input
                id="investment-amount"
                type="text"
                value={formatCurrency(amount).replace("$", "")}
                onChange={handleAmountChange}
                className="flex-1"
              />
            </div>
            <Slider
              value={[amount]}
              min={100}
              max={50000}
              step={100}
              onValueChange={handleSliderChange}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$100</span>
              <span>$50,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Investment Term</Label>
            <RadioGroup value={term} onValueChange={setTerm} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="term-12" />
                <Label htmlFor="term-12" className="flex items-center gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>12 Months (10% Growth)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="term-24" />
                <Label htmlFor="term-24" className="flex items-center gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>24 Months (12% Growth)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="36" id="term-36" />
                <Label htmlFor="term-36" className="flex items-center gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>36 Months (15% Growth)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full">Get Started</Button>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>Projected Returns</span>
          </CardTitle>
          <CardDescription>
            Based on {formatCurrency(amount)} invested for {term} months at {results.growth}% Growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground">Total Return</div>
                <div className="text-2xl font-bold text-primary mt-1">{formatCurrency(results.totalAmount)}</div>
                <div className="text-xs text-muted-foreground mt-1">At maturity date</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground">Interest Earned</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(results.interestEarned)}</div>
                <div className="text-xs text-muted-foreground mt-1">Total interest</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Investment Growth</div>
                <div className="text-sm font-medium text-green-600">+{results.growth}% Growth</div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(results.interestEarned / results.totalAmount) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Principal: {formatCurrency(amount)}</span>
                <span>Interest: {formatCurrency(results.interestEarned)}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium mb-3">Monthly Breakdown</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Interest (Avg.)</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.monthlyInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Growth Rate</span>
                  <span className="font-medium">{results.growth}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Term Length</span>
                  <span className="font-medium">{term} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Maturity Date</span>
                  <span className="font-medium">
                    {new Date(Date.now() + Number.parseInt(term) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
