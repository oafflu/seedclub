"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for customers
const customers = [
  {
    id: "CUST-001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    joinDate: "2023-01-15",
    totalInvested: 25000,
    jars: 3,
    kycStatus: "verified",
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    dateOfBirth: "1985-06-15",
    taxId: "123-45-6789",
    occupation: "Software Engineer",
    employerName: "Tech Corp",
    annualIncome: "$120,000",
    sourceOfFunds: "Employment Income",
    notes: "Premium customer with excellent investment history.",
    receiveMarketingEmails: true,
  },
  {
    id: "CUST-002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    joinDate: "2023-02-22",
    totalInvested: 42000,
    jars: 2,
    kycStatus: "verified",
    address1: "456 Oak Ave",
    address2: "",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States",
    dateOfBirth: "1990-03-22",
    taxId: "987-65-4321",
    occupation: "Marketing Director",
    employerName: "Brand Solutions",
    annualIncome: "$95,000",
    sourceOfFunds: "Employment Income",
    notes: "",
    receiveMarketingEmails: false,
  },
  // Add more customers as needed
]

// Form schema
const customerFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  status: z.enum(["active", "inactive"]),
  kycStatus: z.enum(["verified", "pending", "rejected"]),
  address1: z.string().min(1, { message: "Address is required." }),
  address2: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required." }),
  taxId: z.string().optional(),
  occupation: z.string().optional(),
  employerName: z.string().optional(),
  annualIncome: z.string().optional(),
  sourceOfFunds: z.string().optional(),
  notes: z.string().optional(),
  receiveMarketingEmails: z.boolean().default(false),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customer, setCustomer] = useState<any>(null)

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "active",
      kycStatus: "pending",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      dateOfBirth: "",
      taxId: "",
      occupation: "",
      employerName: "",
      annualIncome: "",
      sourceOfFunds: "",
      notes: "",
      receiveMarketingEmails: false,
    },
  })

  // Fetch customer data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCustomer = customers.find((c) => c.id === customerId)
      if (foundCustomer) {
        setCustomer(foundCustomer)
        form.reset({
          firstName: foundCustomer.firstName,
          lastName: foundCustomer.lastName,
          email: foundCustomer.email,
          phone: foundCustomer.phone,
          status: foundCustomer.status as "active" | "inactive",
          kycStatus: foundCustomer.kycStatus as "verified" | "pending" | "rejected",
          address1: foundCustomer.address1,
          address2: foundCustomer.address2,
          city: foundCustomer.city,
          state: foundCustomer.state,
          zipCode: foundCustomer.zipCode,
          country: foundCustomer.country,
          dateOfBirth: foundCustomer.dateOfBirth,
          taxId: foundCustomer.taxId,
          occupation: foundCustomer.occupation,
          employerName: foundCustomer.employerName,
          annualIncome: foundCustomer.annualIncome,
          sourceOfFunds: foundCustomer.sourceOfFunds,
          notes: foundCustomer.notes,
          receiveMarketingEmails: foundCustomer.receiveMarketingEmails,
        })
      } else {
        toast({
          title: "Customer not found",
          description: "The requested customer could not be found.",
          variant: "destructive",
        })
        router.push("/admin/customers")
      }
      setIsLoading(false)
    }, 1000)
  }, [customerId, form, router])

  function onSubmit(data: CustomerFormValues) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      toast({
        title: "Customer updated successfully",
        description: `${data.firstName} ${data.lastName}'s information has been updated.`,
      })
      setIsSubmitting(false)
      router.push("/admin/customers")
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <Skeleton className="h-10 w-full" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            Edit Customer: {customer?.firstName} {customer?.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/customers")}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
            {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="financial">Financial Information</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Edit the customer's basic personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Details Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>Edit the customer's contact information and address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />
                  <h3 className="text-lg font-medium">Address Information</h3>

                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt 4B" {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Information Tab */}
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                  <CardDescription>Edit the customer's financial details for KYC and compliance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID / SSN</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX-XX-XXXX" {...field} />
                        </FormControl>
                        <FormDescription>Used for tax reporting purposes only.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <FormControl>
                            <Input placeholder="$75,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sourceOfFunds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source of Funds</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source of funds" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Employment Income">Employment Income</SelectItem>
                              <SelectItem value="Investments">Investments</SelectItem>
                              <SelectItem value="Inheritance">Inheritance</SelectItem>
                              <SelectItem value="Business Income">Business Income</SelectItem>
                              <SelectItem value="Savings">Savings</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="kycStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select KYC status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional information about the customer's financial situation or KYC status."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Configure the customer's account status and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Inactive accounts cannot log in or perform transactions.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receiveMarketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Communications</FormLabel>
                          <FormDescription>
                            Receive emails about new investment opportunities and platform updates.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/customers")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
