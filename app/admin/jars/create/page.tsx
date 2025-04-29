"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, addMonths } from "date-fns"
import { CalendarIcon, PiggyBank, ArrowRight, CheckCircle2, XCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Jar name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  minimumAmount: z.coerce.number().min(100, { message: "Minimum investment must be at least $100" }),
  startDate: z.date({ required_error: "Please select a start date" }),
  status: z.boolean().default(true),
  iconType: z.enum(["upload", "default"]),
  iconFile: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateJarPage() {
  const router = useRouter()
  const [calculatedValue12, setCalculatedValue12] = useState<number>(0)
  const [calculatedValue24, setCalculatedValue24] = useState<number>(0)
  const [calculatedValue36, setCalculatedValue36] = useState<number>(0)
  const [maturityDate12, setMaturityDate12] = useState<Date | null>(null)
  const [maturityDate24, setMaturityDate24] = useState<Date | null>(null)
  const [maturityDate36, setMaturityDate36] = useState<Date | null>(null)
  const [previewIcon, setPreviewIcon] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("12-month")

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      minimumAmount: 1000,
      startDate: new Date(),
      status: true,
      iconType: "default",
    },
  })

  const { watch, setValue } = form
  const watchInitialAmount = watch("minimumAmount")
  const watchStartDate = watch("startDate")
  const watchIconType = watch("iconType")

  // Calculate maturity dates and expected values
  useEffect(() => {
    if (watchStartDate) {
      // 12-month jar
      const newMaturityDate12 = addMonths(watchStartDate, 12)
      setMaturityDate12(newMaturityDate12)
      const expectedValue12 = watchInitialAmount * Math.pow(1 + 10 / 100, 1)
      setCalculatedValue12(Math.round(expectedValue12))

      // 24-month jar
      const newMaturityDate24 = addMonths(watchStartDate, 24)
      setMaturityDate24(newMaturityDate24)
      const expectedValue24 = watchInitialAmount * Math.pow(1 + 12 / 100, 2)
      setCalculatedValue24(Math.round(expectedValue24))

      // 36-month jar
      const newMaturityDate36 = addMonths(watchStartDate, 36)
      setMaturityDate36(newMaturityDate36)
      const expectedValue36 = watchInitialAmount * Math.pow(1 + 15 / 100, 3)
      setCalculatedValue36(Math.round(expectedValue36))
    }
  }, [watchInitialAmount, watchStartDate])

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG or SVG)",
          variant: "destructive",
        })
        return
      }

      // Check if file is PNG or SVG
      if (file.type !== "image/png" && file.type !== "image/svg+xml") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG or SVG file",
          variant: "destructive",
        })
        return
      }

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewIcon(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Set the file in the form
      setValue("iconFile", file)
    }
  }

  // Form submission handler
  function onSubmit(data: FormValues) {
    console.log("Jar created:", data)

    toast({
      title: "Jar created successfully",
      description: `"${data.name}" jar is now available to customers`,
    })

    setTimeout(() => {
      router.push("/admin/jars")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Investment Jar</h1>
        <Button variant="outline" onClick={() => router.push("/admin/jars")}>
          Cancel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Jar Details</CardTitle>
                  <CardDescription>Enter the basic information for this investment jar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jar Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Sprout Fund" {...field} />
                        </FormControl>
                        <FormDescription>A descriptive name for this investment jar</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. For your small but mighty savings" {...field} />
                        </FormControl>
                        <FormDescription>A brief description for customers</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="iconType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jar Icon</FormLabel>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="default-icon"
                              checked={field.value === "default"}
                              onChange={() => field.onChange("default")}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="default-icon" className="text-sm">
                              Use default icon
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="custom-icon"
                              checked={field.value === "upload"}
                              onChange={() => field.onChange("upload")}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="custom-icon" className="text-sm">
                              Upload custom icon
                            </label>
                          </div>
                        </div>
                        <FormDescription>Choose an icon for this jar</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchIconType === "upload" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <label
                          htmlFor="icon-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {previewIcon ? (
                              <img
                                src={previewIcon || "/placeholder.svg"}
                                alt="Icon preview"
                                className="w-16 h-16 mb-2"
                              />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG or SVG (MAX. 800x800px)</p>
                              </>
                            )}
                          </div>
                          <input
                            id="icon-upload"
                            type="file"
                            accept=".png,.svg"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {previewIcon && (
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewIcon(null)
                              setValue("iconFile", undefined)
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                  <CardDescription>Set the financial parameters for this jar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="minimumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Investment</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <Input type="number" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Minimum investment amount for this jar</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">APY Rates</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>12-Month Term</span>
                        <span className="font-medium text-green-600">10% APY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>24-Month Term</span>
                        <span className="font-medium text-green-600">12% APY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>36-Month Term</span>
                        <span className="font-medium text-green-600">15% APY</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      All jars offer these three APY options for customers to choose from
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timing</CardTitle>
                  <CardDescription>Set the start date for this investment jar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When the investment period begins</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>Set the initial status of this jar</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>Determines if this jar is active and available to customers</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => router.push("/admin/jars")}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Jar</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Jar Preview</CardTitle>
              <CardDescription>Expected value at maturity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="12-month" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="12-month">12 Months</TabsTrigger>
                  <TabsTrigger value="24-month">24 Months</TabsTrigger>
                  <TabsTrigger value="36-month">36 Months</TabsTrigger>
                </TabsList>
                <TabsContent value="12-month" className="pt-4">
                  <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {previewIcon ? (
                          <img
                            src={previewIcon || "/placeholder.svg"}
                            alt="Jar icon"
                            className="h-20 w-20 opacity-20"
                          />
                        ) : (
                          <PiggyBank className="h-20 w-20 text-primary/20" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">${watchInitialAmount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <ArrowRight className="mx-4 h-6 w-6 text-muted-foreground" />
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {previewIcon ? (
                          <img
                            src={previewIcon || "/placeholder.svg"}
                            alt="Jar icon"
                            className="h-24 w-24 opacity-30"
                          />
                        ) : (
                          <PiggyBank className="h-24 w-24 text-primary/30" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">${calculatedValue12.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum Investment</span>
                      <span className="font-medium">${watchInitialAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <span className="font-medium">10% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Term Length</span>
                      <span className="font-medium">12 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Maturity Date</span>
                      <span className="font-medium">
                        {maturityDate12 ? format(maturityDate12, "MMM d, yyyy") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Interest</span>
                      <span className="font-medium text-green-600">
                        ${(calculatedValue12 - (watchInitialAmount || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="24-month" className="pt-4">
                  <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {previewIcon ? (
                          <img
                            src={previewIcon || "/placeholder.svg"}
                            alt="Jar icon"
                            className="h-20 w-20 opacity-20"
                          />
                        ) : (
                          <PiggyBank className="h-20 w-20 text-primary/20" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">${watchInitialAmount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <ArrowRight className="mx-4 h-6 w-6 text-muted-foreground" />
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {previewIcon ? (
                          <img
                            src={previewIcon || "/placeholder.svg"}
                            alt="Jar icon"
                            className="h-24 w-24 opacity-30"
                          />
                        ) : (
                          <PiggyBank className="h-24 w-24 text-primary/30" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">${calculatedValue24.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum Investment</span>
                      <span className="font-medium">${watchInitialAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <span className="font-medium">12% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Term Length</span>
                      <span className="font-medium">24 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Maturity Date</span>
                      <span className="font-medium">
                        {maturityDate24 ? format(maturityDate24, "MMM d, yyyy") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Interest</span>
                      <span className="font-medium text-green-600">
                        ${(calculatedValue24 - (watchInitialAmount || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="36-month" className="pt-4">
                  <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {previewIcon ? (
                          <img
                            src={previewIcon || "/placeholder.svg"}
                            alt="Jar icon"
                            className="h-20 w-20 opacity-20"
                          />
                        ) : (
                          <PiggyBank className="h-20 w-20 text-primary/20" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">${watchInitialAmount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <ArrowRight className="mx-4 h-6 w-6 text-muted-foreground" />
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {previewIcon ? (
                          <img
                            src={previewIcon || "/placeholder.svg"}
                            alt="Jar icon"
                            className="h-24 w-24 opacity-30"
                          />
                        ) : (
                          <PiggyBank className="h-24 w-24 text-primary/30" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">${calculatedValue36.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum Investment</span>
                      <span className="font-medium">${watchInitialAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <span className="font-medium">15% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Term Length</span>
                      <span className="font-medium">36 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Maturity Date</span>
                      <span className="font-medium">
                        {maturityDate36 ? format(maturityDate36, "MMM d, yyyy") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Interest</span>
                      <span className="font-medium text-green-600">
                        ${(calculatedValue36 - (watchInitialAmount || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">No early withdrawal fees</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Interest compounds daily</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Early withdrawal may affect APY</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
