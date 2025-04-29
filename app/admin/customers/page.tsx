"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

// Mock data for customers
const customers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    joinDate: "2023-01-15",
    totalInvested: 25000,
    jars: 3,
    kycStatus: "verified",
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    joinDate: "2023-02-22",
    totalInvested: 42000,
    jars: 2,
    kycStatus: "verified",
  },
  {
    id: "CUST-003",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1 (555) 456-7890",
    status: "inactive",
    joinDate: "2023-03-10",
    totalInvested: 15000,
    jars: 1,
    kycStatus: "pending",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    joinDate: "2023-04-05",
    totalInvested: 75000,
    jars: 4,
    kycStatus: "verified",
  },
  {
    id: "CUST-005",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "+1 (555) 876-5432",
    status: "active",
    joinDate: "2023-05-18",
    totalInvested: 30000,
    jars: 2,
    kycStatus: "verified",
  },
  {
    id: "CUST-006",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    joinDate: "2023-06-30",
    totalInvested: 0,
    jars: 0,
    kycStatus: "rejected",
  },
  {
    id: "CUST-007",
    name: "David Brown",
    email: "david.b@example.com",
    phone: "+1 (555) 654-3210",
    status: "active",
    joinDate: "2023-07-12",
    totalInvested: 50000,
    jars: 3,
    kycStatus: "verified",
  },
  {
    id: "CUST-008",
    name: "Lisa Martinez",
    email: "lisa.m@example.com",
    phone: "+1 (555) 789-0123",
    status: "active",
    joinDate: "2023-08-25",
    totalInvested: 18000,
    jars: 1,
    kycStatus: "verified",
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [viewCustomer, setViewCustomer] = useState<any>(null)
  const router = useRouter()

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const toggleAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button onClick={() => router.push("/admin/customers/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer Overview</CardTitle>
          <CardDescription>Manage and monitor all customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
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
                    <Checkbox id="status" className="mr-2" />
                    <Label htmlFor="status">Active Only</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="kyc" className="mr-2" />
                    <Label htmlFor="kyc">KYC Verified</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="invested" className="mr-2" />
                    <Label htmlFor="invested">Has Investments</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onCheckedChange={toggleAllCustomers}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead className="text-right">Total Invested</TableHead>
                  <TableHead className="text-center">Jars</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => toggleCustomerSelection(customer.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.kycStatus === "verified"
                            ? "default"
                            : customer.kycStatus === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {customer.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${customer.totalInvested.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{customer.jars}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setViewCustomer(customer)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                              <DialogDescription>Detailed information about the customer.</DialogDescription>
                            </DialogHeader>
                            {viewCustomer && (
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{viewCustomer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold">{viewCustomer.name}</h3>
                                    <p className="text-sm text-muted-foreground">{viewCustomer.email}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Customer ID</Label>
                                    <p>{viewCustomer.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Phone</Label>
                                    <p>{viewCustomer.phone}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Join Date</Label>
                                    <p>{viewCustomer.joinDate}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <p>
                                      <Badge variant={viewCustomer.status === "active" ? "default" : "secondary"}>
                                        {viewCustomer.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">KYC Status</Label>
                                    <p>
                                      <Badge
                                        variant={
                                          viewCustomer.kycStatus === "verified"
                                            ? "default"
                                            : viewCustomer.kycStatus === "pending"
                                              ? "outline"
                                              : "destructive"
                                        }
                                      >
                                        {viewCustomer.kycStatus}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Total Invested</Label>
                                    <p>${viewCustomer.totalInvested.toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline">Edit Customer</Button>
                              <Button>View Investments</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/customers/edit/${customer.id}`)}
                        >
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
                              <Mail className="mr-2 h-4 w-4" /> Email Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" /> Call Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
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
