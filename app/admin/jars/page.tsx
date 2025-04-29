"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  PiggyBank,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for jars
const jars = [
  {
    id: "JAR-001",
    name: "Sprout Fund",
    description: "For your small but mighty savings.",
    type: "12-month",
    apy: 10,
    minimumAmount: 1000,
    status: "active",
    icon: "Sprout",
  },
  {
    id: "JAR-002",
    name: "Sapling Stash",
    description: "A growing reserve for future goals.",
    type: "24-month",
    apy: 12,
    minimumAmount: 2000,
    status: "active",
    icon: "Seedling",
  },
  {
    id: "JAR-003",
    name: "Blossom Budget",
    description: "Watch your savings bloom!",
    type: "36-month",
    apy: 15,
    minimumAmount: 3000,
    status: "active",
    icon: "Blossom",
  },
  {
    id: "JAR-004",
    name: "Evergreen Reserve",
    description: "Always thriving, never fading.",
    type: "12-month",
    apy: 10,
    minimumAmount: 1500,
    status: "active",
    icon: "Evergreen",
  },
  {
    id: "JAR-005",
    name: "The Growth Pot",
    description: "Like a plant, but for your money.",
    type: "24-month",
    apy: 12,
    minimumAmount: 2500,
    status: "active",
    icon: "Pot",
  },
  {
    id: "JAR-006",
    name: "Harvest Jar",
    description: "Save now, reap later.",
    type: "36-month",
    apy: 15,
    minimumAmount: 5000,
    status: "active",
    icon: "Harvest",
  },
  {
    id: "JAR-007",
    name: "Sunshine Savings",
    description: "Giving your goals the light they need.",
    type: "12-month",
    apy: 10,
    minimumAmount: 1000,
    status: "active",
    icon: "Sunshine",
  },
  {
    id: "JAR-008",
    name: "Rooted Reserves",
    description: "Building a strong foundation.",
    type: "24-month",
    apy: 12,
    minimumAmount: 2000,
    status: "active",
    icon: "Rooted",
  },
  {
    id: "JAR-009",
    name: "Fertile Funds",
    description: "Planting today for a rich tomorrow.",
    type: "36-month",
    apy: 15,
    minimumAmount: 3000,
    status: "active",
    icon: "Fertile",
  },
  {
    id: "JAR-010",
    name: "The Greenhouse",
    description: "Where small investments grow big.",
    type: "12-month",
    apy: 10,
    minimumAmount: 1200,
    status: "active",
    icon: "Greenhouse",
  },
]

export default function JarsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJars, setSelectedJars] = useState<string[]>([])
  const [viewJar, setViewJar] = useState<any>(null)
  const router = useRouter()

  const filteredJars = jars.filter(
    (jar) =>
      jar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jar.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleJarSelection = (jarId: string) => {
    setSelectedJars((prev) => (prev.includes(jarId) ? prev.filter((id) => id !== jarId) : [...prev, jarId]))
  }

  const toggleAllJars = () => {
    if (selectedJars.length === filteredJars.length) {
      setSelectedJars([])
    } else {
      setSelectedJars(filteredJars.map((j) => j.id))
    }
  }

  // Calculate total values
  // const totalInvested = jars.reduce((sum, jar) => sum + jar.initialAmount, 0)
  // const totalCurrentValue = jars.reduce((sum, jar) => sum + jar.currentValue, 0)
  // const totalInterestEarned = totalCurrentValue - totalInvested

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jar Management</h1>
        <Button onClick={() => router.push("/admin/jars/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Jar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jars</CardDescription>
            <CardTitle className="text-3xl">{jars.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <PiggyBank className="mr-1 h-4 w-4 text-primary" />
              <span>Available to customers</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>12-Month Jars</CardDescription>
            <CardTitle className="text-3xl">{jars.filter((j) => j.type === "12-month").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4 text-primary" />
              <span>Short-term options</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>24-36 Month Jars</CardDescription>
            <CardTitle className="text-3xl">
              {jars.filter((j) => j.type === "24-month" || j.type === "36-month").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span>Long-term growth options</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Investment Jars</CardTitle>
          <CardDescription>Manage the investment jars available to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jars..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Checkbox id="12month" className="mr-2" />
                    <Label htmlFor="12month">12-Month Jars</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="24month" className="mr-2" />
                    <Label htmlFor="24month">24-Month Jars</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="36month" className="mr-2" />
                    <Label htmlFor="36month">36-Month Jars</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="maturing">Maturing Soon</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedJars.length === filteredJars.length && filteredJars.length > 0}
                      onCheckedChange={toggleAllJars}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Jar Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Minimum Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJars.map((jar) => (
                  <TableRow key={jar.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedJars.includes(jar.id)}
                        onCheckedChange={() => toggleJarSelection(jar.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{jar.id}</TableCell>
                    <TableCell>{jar.name}</TableCell>
                    <TableCell>{jar.icon}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{jar.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {jar.type} ({jar.apy}% APY)
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${jar.minimumAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={jar.status === "active" ? "success" : "secondary"} className="capitalize">
                        {jar.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setViewJar(jar)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Jar Details</DialogTitle>
                              <DialogDescription>Details about this investment jar</DialogDescription>
                            </DialogHeader>
                            {viewJar && (
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="rounded-full bg-primary/10 p-3">
                                    <PiggyBank className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold">{viewJar.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {viewJar.type} ({viewJar.apy}% APY)
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Jar ID</Label>
                                    <p>{viewJar.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <p className="capitalize">{viewJar.status}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Minimum Amount</Label>
                                    <p>${viewJar.minimumAmount.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">APY Rate</Label>
                                    <p>{viewJar.apy}%</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm text-muted-foreground">Description</Label>
                                    <p>{viewJar.description}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => router.push(`/admin/jars/edit/${viewJar?.id}`)}>
                                Edit Jar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/jars/edit/${jar.id}`)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Usage Statistics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="mr-2 h-4 w-4" /> Adjust Interest Rate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Jar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
