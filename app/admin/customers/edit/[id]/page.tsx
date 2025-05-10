"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"

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
import { CustomerProfile, customerService } from "@/lib/services/customer.service"

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
  receiveMarketingEmails: z.boolean(),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

// Add a full country list for the select
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  // Guard clause for invalid customerId
  if (!customerId || customerId === "null" || customerId === "undefined") {
    useEffect(() => {
      router.push("/admin/customers")
    }, [router])
    return <div className="p-8 text-center text-destructive font-semibold">Invalid customer ID.</div>
  }

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [kyc, setKyc] = useState<any>(null)
  const [kycLoading, setKycLoading] = useState(true)
  const supabase = createClientComponentClient()

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
    async function fetchCustomer() {
      try {
        setIsLoading(true)
        const data = await customerService.getCustomerById(customerId)
        if (!data) {
          throw new Error("Customer not found")
        }
        setCustomer(data)
        form.reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          status: data.status || "active",
          kycStatus: data.kycStatus || "pending",
          address1: data.addressLine1 || "",
          address2: data.addressLine2 || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: data.country || "United States",
          dateOfBirth: data.dateOfBirth || "",
          taxId: data.taxId || "",
          occupation: data.occupation || "",
          employerName: data.employerName || "",
          annualIncome: data.annualIncome?.toString() || "",
          sourceOfFunds: data.sourceOfFunds || "",
          notes: data.notes || "",
          receiveMarketingEmails: Boolean(data.receiveMarketingEmails),
        })
      } catch (error) {
        console.error("Error fetching customer:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch customer",
          variant: "destructive",
        })
        router.push("/admin/customers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId, form, router])

  useEffect(() => {
    async function fetchKyc() {
      setKycLoading(true)
      const { data, error } = await supabase
        .from("kyc_verifications")
        .select("*")
        .eq("customer_id", customerId)
        .single()
      setKyc(data)
      setKycLoading(false)
    }
    if (customerId) fetchKyc()
  }, [customerId])

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      console.log("Form submission started")
      setIsSubmitting(true)
      console.log("Form submitted with data:", data)

      console.log("Updating customer with ID:", customerId)
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        date_of_birth: data.dateOfBirth,
        occupation: data.occupation,
        employer_name: data.employerName,
        // ... other fields ...
      }
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
      const updatedCustomer = await customerService.updateCustomer(customerId, {
        ...data,
        // Map address fields correctly
        addressLine1: data.address1,
        addressLine2: data.address2,
        // Convert annualIncome to number if it exists
        annualIncome: data.annualIncome ? parseFloat(data.annualIncome) : undefined,
      })
      console.log("Customer updated successfully:", updatedCustomer)

      toast({
        title: "Success",
        description: `${data.firstName} ${data.lastName}'s information has been updated.`,
        duration: 5000,
      })
      
      // Small delay to ensure the toast is visible
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push("/admin/customers")
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update customer",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKycStatus = async (status: "verified" | "rejected") => {
    await supabase.from("kyc_verifications").update({ status, updated_at: new Date().toISOString() }).eq("customer_id", customerId)
    setKyc((prev: any) => ({ ...prev, status }))
    toast({ title: `KYC ${status === "verified" ? "approved" : "rejected"}` })
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
          <Button 
            type="submit"
            form="customer-edit-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form 
          id="customer-edit-form"
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-8"
        >
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="financial">Financial Information</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
              <TabsTrigger value="kyc">KYC</TabsTrigger>
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
                            {countryList.map((country) => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
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

            {/* KYC Tab */}
            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Verification</CardTitle>
                  <CardDescription>Review the customer's submitted KYC details and documents. Approve or reject below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {kycLoading ? (
                    <Skeleton className="h-8 w-48" />
                  ) : customer?.kyc ? (
                    <>
                      <div className="space-y-2">
                        <div><b>Status:</b> <span className="capitalize">{customer.kyc.status}</span></div>
                        <div><b>Full Name:</b> {customer.kyc.fullName}</div>
                        <div><b>Date of Birth:</b> {customer.kyc.dateOfBirth}</div>
                        <div><b>Nationality:</b> {customer.kyc.nationality}</div>
                        <div><b>Tax Country:</b> {customer.kyc.taxCountry}</div>
                        <div><b>ID Type:</b> {customer.kyc.documentType}</div>
                        <div><b>ID Number:</b> {customer.kyc.idNumber}</div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div>
                          <b>ID Document (Front):</b>
                          {customer.kyc.frontUrl ? (
                            customer.kyc.frontUrl.endsWith('.pdf') ? (
                              <a href={customer.kyc.frontUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                            ) : (
                              <Image src={customer.kyc.frontUrl} alt="ID Front" width={200} height={120} className="rounded border mt-2" />
                            )
                          ) : <span className="text-muted-foreground">Not uploaded</span>}
                        </div>
                        <div>
                          <b>ID Document (Back):</b>
                          {customer.kyc.backUrl ? (
                            customer.kyc.backUrl.endsWith('.pdf') ? (
                              <a href={customer.kyc.backUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                            ) : (
                              <Image src={customer.kyc.backUrl} alt="ID Back" width={200} height={120} className="rounded border mt-2" />
                            )
                          ) : <span className="text-muted-foreground">Not uploaded</span>}
                        </div>
                        <div>
                          <b>Selfie with ID:</b>
                          {customer.kyc.selfieUrl ? (
                            customer.kyc.selfieUrl.endsWith('.pdf') ? (
                              <a href={customer.kyc.selfieUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                            ) : (
                              <Image src={customer.kyc.selfieUrl} alt="Selfie" width={200} height={120} className="rounded border mt-2" />
                            )
                          ) : <span className="text-muted-foreground">Not uploaded</span>}
                        </div>
                      </div>
                      <Separator />
                      <div className="flex gap-4">
                        <Button variant="default" disabled={customer.kyc.status === "verified"} onClick={() => handleKycStatus("verified")}>Approve KYC</Button>
                        <Button variant="destructive" disabled={customer.kyc.status === "rejected"} onClick={() => handleKycStatus("rejected")}>Reject KYC</Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground">No KYC submission found for this customer.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
