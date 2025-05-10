"use client"

import { useState, useEffect } from "react"
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
  Loader2
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
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FilterOptions {
  activeOnly: boolean
  kycVerified: boolean
  hasInvestments: boolean
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [viewCustomer, setViewCustomer] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState<FilterOptions>({
    activeOnly: false,
    kycVerified: false,
    hasInvestments: false,
  })
  const router = useRouter()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/admin/customers")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to load customers")
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error: any) {
      console.error("Error loading customers:", error)
      setError(error.message || "Failed to load customers")
      toast({
        title: "Error",
        description: error.message || "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      // Prepare data for export
      const data = customers.map(customer => ({
        "ID": customer.id,
        "First Name": customer.firstName,
        "Last Name": customer.lastName,
        "Email": customer.email,
        "Phone": customer.phone,
        "Status": customer.status,
        "KYC Status": customer.kycStatus,
        "Total Invested": customer.totalInvested?.toLocaleString() || "0.00",
        "Number of Jars": customer.jars || 0,
        "Join Date": new Date(customer.createdAt).toLocaleDateString(),
        "Address": `${customer.addressLine1 || ""}${customer.addressLine2 ? `, ${customer.addressLine2}` : ""}`,
        "City": customer.city || "",
        "State": customer.state || "",
        "Zip Code": customer.zipCode || "",
        "Country": customer.country || ""
      }));

      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'csv': {
          // Convert data to CSV
          const csvContent = [
            Object.keys(data[0]).join(','),
            ...data.map(row => Object.values(row).join(','))
          ].join('\n');
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          filename = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }

        case 'excel': {
          // Use xlsx library to create Excel file
          const XLSX = await import('xlsx');
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Customers');
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          filename = `customers_export_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        }

        case 'pdf': {
          // Use jspdf and jspdf-autotable for PDF generation
          const { jsPDF } = await import('jspdf');
          const { default: autoTable } = await import('jspdf-autotable');
          
          const doc = new jsPDF();
          autoTable(doc, {
            head: [Object.keys(data[0])],
            body: data.map(row => Object.values(row)),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 139, 202] }
          });
          
          blob = doc.output('blob');
          filename = `customers_export_${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }

        default:
          throw new Error('Unsupported export format');
      }

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Customers have been exported as ${format.toUpperCase()}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting the data",
        variant: "destructive",
        duration: 5000,
      });
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete customer")
      }

      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      })
      loadCustomers()
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateKYCStatus = async (customerId: string, status: "verified" | "pending" | "rejected") => {
    try {
      const customer = customers.find(c => c.id === customerId)
      if (!customer) {
        throw new Error("Customer not found")
      }

      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          status: customer.status,
          kycStatus: status,
          addressLine1: customer.addressLine1,
          addressLine2: customer.addressLine2,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
          country: customer.country,
          dateOfBirth: customer.dateOfBirth,
          taxId: customer.taxId,
          occupation: customer.occupation,
          employerName: customer.employerName,
          annualIncome: customer.annualIncome,
          sourceOfFunds: customer.sourceOfFunds,
          notes: customer.notes,
          receiveMarketingEmails: customer.receiveMarketingEmails
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update KYC status")
      }

      toast({
        title: "Success",
        description: "KYC status updated successfully.",
      })
      loadCustomers()
    } catch (error) {
      console.error("Error updating KYC status:", error)
      toast({
        title: "Error",
        description: "Failed to update KYC status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = async (customerId: string) => {
    try {
      const response = await fetch("/api/admin/customers/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send email")
      }

      toast({
        title: "Success",
        description: "Email sent successfully.",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    const searchMatch =
      (customer.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.id || "").toLowerCase().includes(searchTerm.toLowerCase())

    // Tab filter
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "active" && customer.status === "active") ||
      (activeTab === "inactive" && customer.status === "inactive")

    // Additional filters
    const activeMatch = !filters.activeOnly || customer.status === "active"
    const kycMatch = !filters.kycVerified || customer.kycStatus === "verified"
    const investmentMatch = !filters.hasInvestments || (customer.jars && customer.jars > 0)

    return searchMatch && tabMatch && activeMatch && kycMatch && investmentMatch
  })

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

  const handleFilterChange = (key: keyof FilterOptions) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
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
          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

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
                  <DropdownMenuItem onSelect={() => handleFilterChange("activeOnly")}>
                    <Checkbox id="status" className="mr-2" checked={filters.activeOnly} />
                    <Label htmlFor="status">Active Only</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFilterChange("kycVerified")}>
                    <Checkbox id="kyc" className="mr-2" checked={filters.kycVerified} />
                    <Label htmlFor="kyc">KYC Verified</Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFilterChange("hasInvestments")}>
                    <Checkbox id="invested" className="mr-2" checked={filters.hasInvestments} />
                    <Label htmlFor="invested">Has Investments</Label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-muted-foreground">No customers found</div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/admin/customers/add")}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </div>
          ) : (
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
                    <TableHead>Email</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>View</TableHead>
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
                      <TableCell className="font-mono text-xs">{customer.id}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.first_name}</TableCell>
                      <TableCell>{customer.last_name}</TableCell>
                      <TableCell>
                        <Button
                          variant={customer.is_active ? "default" : "outline"}
                          size="sm"
                          onClick={async () => {
                            const response = await fetch(`/api/admin/customers/${customer.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ is_active: !customer.is_active }),
                            })
                            if (response.ok) loadCustomers()
                          }}
                        >
                          {customer.is_active ? "Active" : "Inactive"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {customer.kyc_status}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setViewCustomer(customer)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/customers/edit/${customer.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {viewCustomer && (
        <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>View and manage customer details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div><b>ID:</b> {viewCustomer.id}</div>
              <div><b>Email:</b> {viewCustomer.email}</div>
              <div><b>First Name:</b> {viewCustomer.first_name}</div>
              <div><b>Last Name:</b> {viewCustomer.last_name}</div>
              <div><b>Status:</b> {viewCustomer.is_active ? "Active" : "Inactive"}</div>
              <div><b>KYC Status:</b> {viewCustomer.kyc_status}</div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setViewCustomer(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}