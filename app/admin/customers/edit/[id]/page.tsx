"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

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

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)

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

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      console.log("Form submission started")
      setIsSubmitting(true)
      console.log("Form submitted with data:", data)

      console.log("Updating customer with ID:", customerId)
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
                            <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                            <SelectItem value="Albania">Albania</SelectItem>
                            <SelectItem value="Algeria">Algeria</SelectItem>
                            <SelectItem value="Andorra">Andorra</SelectItem>
                            <SelectItem value="Angola">Angola</SelectItem>
                            <SelectItem value="Antigua and Barbuda">Antigua and Barbuda</SelectItem>
                            <SelectItem value="Argentina">Argentina</SelectItem>
                            <SelectItem value="Armenia">Armenia</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Austria">Austria</SelectItem>
                            <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                            <SelectItem value="Bahamas">Bahamas</SelectItem>
                            <SelectItem value="Bahrain">Bahrain</SelectItem>
                            <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                            <SelectItem value="Barbados">Barbados</SelectItem>
                            <SelectItem value="Belarus">Belarus</SelectItem>
                            <SelectItem value="Belgium">Belgium</SelectItem>
                            <SelectItem value="Belize">Belize</SelectItem>
                            <SelectItem value="Benin">Benin</SelectItem>
                            <SelectItem value="Bhutan">Bhutan</SelectItem>
                            <SelectItem value="Bolivia">Bolivia</SelectItem>
                            <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
                            <SelectItem value="Botswana">Botswana</SelectItem>
                            <SelectItem value="Brazil">Brazil</SelectItem>
                            <SelectItem value="Brunei">Brunei</SelectItem>
                            <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                            <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                            <SelectItem value="Burundi">Burundi</SelectItem>
                            <SelectItem value="Cabo Verde">Cabo Verde</SelectItem>
                            <SelectItem value="Cambodia">Cambodia</SelectItem>
                            <SelectItem value="Cameroon">Cameroon</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Central African Republic">Central African Republic</SelectItem>
                            <SelectItem value="Chad">Chad</SelectItem>
                            <SelectItem value="Chile">Chile</SelectItem>
                            <SelectItem value="China">China</SelectItem>
                            <SelectItem value="Colombia">Colombia</SelectItem>
                            <SelectItem value="Comoros">Comoros</SelectItem>
                            <SelectItem value="Congo">Congo</SelectItem>
                            <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                            <SelectItem value="Croatia">Croatia</SelectItem>
                            <SelectItem value="Cuba">Cuba</SelectItem>
                            <SelectItem value="Cyprus">Cyprus</SelectItem>
                            <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                            <SelectItem value="Denmark">Denmark</SelectItem>
                            <SelectItem value="Djibouti">Djibouti</SelectItem>
                            <SelectItem value="Dominica">Dominica</SelectItem>
                            <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
                            <SelectItem value="East Timor">East Timor</SelectItem>
                            <SelectItem value="Ecuador">Ecuador</SelectItem>
                            <SelectItem value="Egypt">Egypt</SelectItem>
                            <SelectItem value="El Salvador">El Salvador</SelectItem>
                            <SelectItem value="Equatorial Guinea">Equatorial Guinea</SelectItem>
                            <SelectItem value="Eritrea">Eritrea</SelectItem>
                            <SelectItem value="Estonia">Estonia</SelectItem>
                            <SelectItem value="Eswatini">Eswatini</SelectItem>
                            <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                            <SelectItem value="Fiji">Fiji</SelectItem>
                            <SelectItem value="Finland">Finland</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Gabon">Gabon</SelectItem>
                            <SelectItem value="Gambia">Gambia</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="Ghana">Ghana</SelectItem>
                            <SelectItem value="Greece">Greece</SelectItem>
                            <SelectItem value="Grenada">Grenada</SelectItem>
                            <SelectItem value="Guatemala">Guatemala</SelectItem>
                            <SelectItem value="Guinea">Guinea</SelectItem>
                            <SelectItem value="Guinea-Bissau">Guinea-Bissau</SelectItem>
                            <SelectItem value="Guyana">Guyana</SelectItem>
                            <SelectItem value="Haiti">Haiti</SelectItem>
                            <SelectItem value="Honduras">Honduras</SelectItem>
                            <SelectItem value="Hungary">Hungary</SelectItem>
                            <SelectItem value="Iceland">Iceland</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Indonesia">Indonesia</SelectItem>
                            <SelectItem value="Iran">Iran</SelectItem>
                            <SelectItem value="Iraq">Iraq</SelectItem>
                            <SelectItem value="Ireland">Ireland</SelectItem>
                            <SelectItem value="Israel">Israel</SelectItem>
                            <SelectItem value="Italy">Italy</SelectItem>
                            <SelectItem value="Jamaica">Jamaica</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                            <SelectItem value="Jordan">Jordan</SelectItem>
                            <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="Kiribati">Kiribati</SelectItem>
                            <SelectItem value="Korea, North">Korea, North</SelectItem>
                            <SelectItem value="Korea, South">Korea, South</SelectItem>
                            <SelectItem value="Kosovo">Kosovo</SelectItem>
                            <SelectItem value="Kuwait">Kuwait</SelectItem>
                            <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                            <SelectItem value="Laos">Laos</SelectItem>
                            <SelectItem value="Latvia">Latvia</SelectItem>
                            <SelectItem value="Lebanon">Lebanon</SelectItem>
                            <SelectItem value="Lesotho">Lesotho</SelectItem>
                            <SelectItem value="Liberia">Liberia</SelectItem>
                            <SelectItem value="Libya">Libya</SelectItem>
                            <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
                            <SelectItem value="Lithuania">Lithuania</SelectItem>
                            <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                            <SelectItem value="Madagascar">Madagascar</SelectItem>
                            <SelectItem value="Malawi">Malawi</SelectItem>
                            <SelectItem value="Malaysia">Malaysia</SelectItem>
                            <SelectItem value="Maldives">Maldives</SelectItem>
                            <SelectItem value="Mali">Mali</SelectItem>
                            <SelectItem value="Malta">Malta</SelectItem>
                            <SelectItem value="Marshall Islands">Marshall Islands</SelectItem>
                            <SelectItem value="Mauritania">Mauritania</SelectItem>
                            <SelectItem value="Mauritius">Mauritius</SelectItem>
                            <SelectItem value="Mexico">Mexico</SelectItem>
                            <SelectItem value="Micronesia">Micronesia</SelectItem>
                            <SelectItem value="Moldova">Moldova</SelectItem>
                            <SelectItem value="Monaco">Monaco</SelectItem>
                            <SelectItem value="Mongolia">Mongolia</SelectItem>
                            <SelectItem value="Montenegro">Montenegro</SelectItem>
                            <SelectItem value="Morocco">Morocco</SelectItem>
                            <SelectItem value="Mozambique">Mozambique</SelectItem>
                            <SelectItem value="Myanmar">Myanmar</SelectItem>
                            <SelectItem value="Namibia">Namibia</SelectItem>
                            <SelectItem value="Nauru">Nauru</SelectItem>
                            <SelectItem value="Nepal">Nepal</SelectItem>
                            <SelectItem value="Netherlands">Netherlands</SelectItem>
                            <SelectItem value="New Zealand">New Zealand</SelectItem>
                            <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                            <SelectItem value="Niger">Niger</SelectItem>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                            <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                            <SelectItem value="Norway">Norway</SelectItem>
                            <SelectItem value="Oman">Oman</SelectItem>
                            <SelectItem value="Pakistan">Pakistan</SelectItem>
                            <SelectItem value="Palau">Palau</SelectItem>
                            <SelectItem value="Palestine">Palestine</SelectItem>
                            <SelectItem value="Panama">Panama</SelectItem>
                            <SelectItem value="Papua New Guinea">Papua New Guinea</SelectItem>
                            <SelectItem value="Paraguay">Paraguay</SelectItem>
                            <SelectItem value="Peru">Peru</SelectItem>
                            <SelectItem value="Philippines">Philippines</SelectItem>
                            <SelectItem value="Poland">Poland</SelectItem>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Qatar">Qatar</SelectItem>
                            <SelectItem value="Romania">Romania</SelectItem>
                            <SelectItem value="Russia">Russia</SelectItem>
                            <SelectItem value="Rwanda">Rwanda</SelectItem>
                            <SelectItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</SelectItem>
                            <SelectItem value="Saint Lucia">Saint Lucia</SelectItem>
                            <SelectItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</SelectItem>
                            <SelectItem value="Samoa">Samoa</SelectItem>
                            <SelectItem value="San Marino">San Marino</SelectItem>
                            <SelectItem value="Sao Tome and Principe">Sao Tome and Principe</SelectItem>
                            <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                            <SelectItem value="Senegal">Senegal</SelectItem>
                            <SelectItem value="Serbia">Serbia</SelectItem>
                            <SelectItem value="Seychelles">Seychelles</SelectItem>
                            <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
                            <SelectItem value="Singapore">Singapore</SelectItem>
                            <SelectItem value="Slovakia">Slovakia</SelectItem>
                            <SelectItem value="Slovenia">Slovenia</SelectItem>
                            <SelectItem value="Solomon Islands">Solomon Islands</SelectItem>
                            <SelectItem value="Somalia">Somalia</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                            <SelectItem value="South Sudan">South Sudan</SelectItem>
                            <SelectItem value="Spain">Spain</SelectItem>
                            <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                            <SelectItem value="Sudan">Sudan</SelectItem>
                            <SelectItem value="Suriname">Suriname</SelectItem>
                            <SelectItem value="Sweden">Sweden</SelectItem>
                            <SelectItem value="Switzerland">Switzerland</SelectItem>
                            <SelectItem value="Syria">Syria</SelectItem>
                            <SelectItem value="Taiwan">Taiwan</SelectItem>
                            <SelectItem value="Tajikistan">Tajikistan</SelectItem>
                            <SelectItem value="Tanzania">Tanzania</SelectItem>
                            <SelectItem value="Thailand">Thailand</SelectItem>
                            <SelectItem value="Togo">Togo</SelectItem>
                            <SelectItem value="Tonga">Tonga</SelectItem>
                            <SelectItem value="Trinidad and Tobago">Trinidad and Tobago</SelectItem>
                            <SelectItem value="Tunisia">Tunisia</SelectItem>
                            <SelectItem value="Turkey">Turkey</SelectItem>
                            <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
                            <SelectItem value="Tuvalu">Tuvalu</SelectItem>
                            <SelectItem value="Uganda">Uganda</SelectItem>
                            <SelectItem value="Ukraine">Ukraine</SelectItem>
                            <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Uruguay">Uruguay</SelectItem>
                            <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                            <SelectItem value="Vanuatu">Vanuatu</SelectItem>
                            <SelectItem value="Vatican City">Vatican City</SelectItem>
                            <SelectItem value="Venezuela">Venezuela</SelectItem>
                            <SelectItem value="Vietnam">Vietnam</SelectItem>
                            <SelectItem value="Yemen">Yemen</SelectItem>
                            <SelectItem value="Zambia">Zambia</SelectItem>
                            <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
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
        </form>
      </Form>
    </div>
  )
}
