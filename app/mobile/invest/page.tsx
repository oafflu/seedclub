"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  Sprout,
  SproutIcon as Seedling,
  Flower,
  TreePine,
  TreesIcon as Plant,
  Wheat,
  Sun,
  TreeDeciduous,
  Leaf,
  LeafyGreenIcon as Greenhouse,
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

// Jar templates from admin
const jarTemplates = [
  {
    id: "JAR-001",
    name: "Sprout Fund",
    description: "For your small but mighty savings.",
    minimumAmount: 1000,
    icon: "Sprout",
    customIcon: null,
  },
  {
    id: "JAR-002",
    name: "Sapling Stash",
    description: "A growing reserve for future goals.",
    minimumAmount: 2000,
    icon: "Seedling",
    customIcon: null,
  },
  {
    id: "JAR-003",
    name: "Blossom Budget",
    description: "Watch your savings bloom!",
    minimumAmount: 3000,
    icon: "Flower",
    customIcon: null,
  },
  {
    id: "JAR-004",
    name: "Evergreen Reserve",
    description: "Always thriving, never fading.",
    minimumAmount: 1500,
    icon: "TreePine",
    customIcon: null,
  },
  {
    id: "JAR-005",
    name: "The Growth Pot",
    description: "Like a plant, but for your money.",
    minimumAmount: 2500,
    icon: "Plant",
    customIcon: null,
  },
  {
    id: "JAR-006",
    name: "Harvest Jar",
    description: "Save now, reap later.",
    minimumAmount: 5000,
    icon: "Wheat",
    customIcon: null,
  },
  {
    id: "JAR-007",
    name: "Sunshine Savings",
    description: "Giving your goals the light they need.",
    minimumAmount: 1000,
    icon: "Sun",
    customIcon: null,
  },
  {
    id: "JAR-008",
    name: "Rooted Reserves",
    description: "Building a strong foundation.",
    minimumAmount: 2000,
    icon: "TreeDeciduous",
    customIcon: null,
  },
  {
    id: "JAR-009",
    name: "Fertile Funds",
    description: "Planting today for a rich tomorrow.",
    minimumAmount: 3000,
    icon: "Leaf",
    customIcon: null,
  },
  {
    id: "JAR-010",
    name: "The Greenhouse",
    description: "Where small investments grow big.",
    minimumAmount: 1200,
    icon: "Greenhouse",
    customIcon: null,
  },
]

// Growth options
const growthOptions = [
  { value: "12-month", label: "12 Months", growth: 10 },
  { value: "24-month", label: "24 Months", growth: 12 },
  { value: "36-month", label: "36 Months", growth: 15 },
]

export default function InvestPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedJar, setSelectedJar] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("12-month")
  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [walletBalance, setWalletBalance] = useState(3750) // Mock wallet balance
  const [showSuccess, setShowSuccess] = useState(false)
  const [filteredTemplates, setFilteredTemplates] = useState(jarTemplates)

  // Filter templates when tab changes
  useEffect(() => {
    if (selectedTab === "all") {
      setFilteredTemplates(jarTemplates)
    } else {
      const termMonths = selectedTab.split("-")[0]
      setFilteredTemplates(jarTemplates)
    }
  }, [selectedTab])

  // Calculate potential returns
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
    // In a real app, this would submit the investment
    console.log("Creating jar with:", {
      jarId: selectedJar.id,
      amount: Number(amount),
      term: selectedTerm,
      paymentMethod: paymentMethod,
    })

    setShowSuccess(true)

    // Reset after investment
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedJar(null)
      setAmount("")
      setSelectedTerm("12-month")
      setPaymentMethod("wallet")
    }, 3000)
  }

  // Get the selected Growth option
  const getSelectedGrowthOption = () => {
    return growthOptions.find((option) => option.value === selectedTerm) || growthOptions[0]
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
          <TabsTrigger value="12-month">12 Months</TabsTrigger>
          <TabsTrigger value="24-month">24 Months</TabsTrigger>
          <TabsTrigger value="36-month">36 Months</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredTemplates.map((jar) => {
              const IconComponent = getIconComponent(jar.icon)

              return (
                <Card key={jar.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {jar.customIcon ? (
                          <img src={jar.customIcon || "/placeholder.svg"} alt={jar.name} className="h-5 w-5" />
                        ) : (
                          <IconComponent className="h-5 w-5 text-primary" />
                        )}
                        <CardTitle className="text-lg">{jar.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{jar.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Minimum</span>
                        <span className="font-medium">${jar.minimumAmount.toLocaleString()}</span>
                      </div>
                      <div className="h-[1px] bg-border my-1"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Growth Options</span>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-green-600 bg-green-50">
                            10%
                          </Badge>
                          <Badge variant="outline" className="text-green-600 bg-green-50">
                            12%
                          </Badge>
                          <Badge variant="outline" className="text-green-600 bg-green-50">
                            15%
                          </Badge>
                        </div>
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
                            {jar.customIcon ? (
                              <img src={jar.customIcon || "/placeholder.svg"} alt={jar.name} className="h-5 w-5" />
                            ) : (
                              React.createElement(getIconComponent(selectedJar?.icon || "Sprout"), {
                                className: "h-5 w-5 text-primary",
                              })
                            )}
                            Invest in {selectedJar?.name}
                          </DialogTitle>
                          <DialogDescription>
                            {selectedJar?.description} Minimum ${selectedJar?.minimumAmount.toLocaleString()}.
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
                                min={selectedJar?.minimumAmount}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Select Term & Growth Rate</Label>
                            <RadioGroup
                              value={selectedTerm}
                              onValueChange={setSelectedTerm}
                              className="grid grid-cols-3 gap-2"
                            >
                              {growthOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                  <Label
                                    htmlFor={option.value}
                                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent cursor-pointer ${
                                      selectedTerm === option.value ? "border-primary bg-primary/5" : ""
                                    }`}
                                  >
                                    <span className="text-sm font-medium">{option.label}</span>
                                    <span className="text-lg font-bold text-green-600">{option.growth}% Growth</span>
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
                                  className={`flex items-center justify-between rounded-md border-2 border-muted p-3 w-full hover:border-accent cursor-pointer ${
                                    paymentMethod === "wallet" ? "border-primary bg-primary/5" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Wallet className="h-4 w-4" />
                                    <span>Wallet</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    ${walletBalance.toLocaleString()}
                                  </span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="card" id="card" className="sr-only" />
                                <Label
                                  htmlFor="card"
                                  className={`flex items-center justify-between rounded-md border-2 border-muted p-3 w-full hover:border-accent cursor-pointer ${
                                    paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                                  }`}
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

                          {amount && Number(amount) >= (selectedJar?.minimumAmount || 0) && (
                            <div className="rounded-md bg-muted p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">Investment Summary</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{getSelectedGrowthOption().label}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Principal</span>
                                  <span className="font-medium">${Number(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                                  <span className="font-medium text-green-600">
                                    {getSelectedGrowthOption().growth}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Future Value</span>
                                  <span className="font-medium">
                                    $
                                    {
                                      calculateReturns(
                                        Number(amount),
                                        getSelectedGrowthOption().growth,
                                        Number.parseInt(getSelectedGrowthOption().value),
                                      ).futureValue
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Interest Earned</span>
                                  <span className="font-medium text-green-600">
                                    +$
                                    {
                                      calculateReturns(
                                        Number(amount),
                                        getSelectedGrowthOption().growth,
                                        Number.parseInt(getSelectedGrowthOption().value),
                                      ).interest
                                    }
                                  </span>
                                </div>
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
                              Number(amount) < (selectedJar?.minimumAmount || 0) ||
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
              )
            })}
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
