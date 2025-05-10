"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, ArrowRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Update the mockJars array to match the jars on the dashboard page
const mockJars = [
  {
    id: "jar1",
    name: "Jar 1",
    initialAmount: 5000,
    currentValue: 5250,
    growthRate: 10,
    term: 12,
    startDate: "2024-12-15",
    maturityDate: "2025-12-15",
    progress: 25,
  },
  {
    id: "jar2",
    name: "Jar 2",
    initialAmount: 10000,
    currentValue: 10700,
    growthRate: 12,
    term: 24,
    startDate: "2024-01-15",
    maturityDate: "2026-01-15",
    progress: 33,
  },
  {
    id: "jar3",
    name: "Jar 3",
    initialAmount: 3000,
    currentValue: 3090,
    growthRate: 15,
    term: 36,
    startDate: "2024-02-15",
    maturityDate: "2027-02-15",
    progress: 8,
  },
]

// MOCK CUSTOMER DATA FOR DEVELOPMENT/DEMO PURPOSES
const mockCustomer = {
  id: 'mock-customer-id',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
}

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

export default function JarsPage() {
  const [jars, setJars] = useState(mockJars)
  const totalValue = jars.reduce((sum, jar) => sum + jar.currentValue, 0)

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Jars</h1>
        <Button asChild>
          <Link href="/mobile/invest">
            <Plus className="mr-1 h-4 w-4" /> New Jar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">{useClientFormattedNumber(totalValue)}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-1 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sort by name</DropdownMenuItem>
                <DropdownMenuItem>Sort by value</DropdownMenuItem>
                <DropdownMenuItem>Sort by growth rate</DropdownMenuItem>
                <DropdownMenuItem>Sort by maturity date</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {jars.map((jar) => (
          <Card key={jar.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{jar.name}</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/mobile/jars/${jar.id}`}>
                    Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                {jar.term} months at {jar.growthRate}% Growth
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Initial Investment</p>
                  <p className="font-medium">{useClientFormattedNumber(jar.initialAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium">{useClientFormattedNumber(jar.currentValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{jar.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Maturity Date</p>
                  <p className="font-medium">{jar.maturityDate}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{jar.progress}%</span>
                </div>
                <Progress value={jar.progress} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
