"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import {
  CalendarIcon,
  PiggyBank,
  ArrowRight,
  Upload,
  X,
  Sprout,
  Leaf,
  TreePine as Trees,
  Palmtree as Palm,
  TreeDeciduous as Oak,
  Flower,
} from "lucide-react"
import { use } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Jar name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  minimumAmount: z.coerce.number().min(10, { message: "Minimum investment must be at least $10" }),
  maximumAmount: z.coerce.number().min(0).optional(),
  status: z.boolean(),
  iconType: z.enum(["upload", "default"]),
  iconFile: z.any().optional(),
  iconName: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface JarData {
  id: string
  name: string
  description: string
  term_months: number
  interest_rate: number
  minimum_investment: number
  maximum_investment: number | null
  early_withdrawal_penalty: number | null
  is_active: boolean
  icon_name: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// Add this after the form schema
const defaultIcons = [
  { name: "PiggyBank", component: PiggyBank },
  { name: "Sprout", component: Sprout },
  { name: "Leaf", component: Leaf },
  { name: "Trees", component: Trees },
  { name: "Palm", component: Palm },
  { name: "Oak", component: Oak },
  { name: "Flower", component: Flower },
];

export default function EditJarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("12-month")
  const [previewIcon, setPreviewIcon] = useState<string | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string>("PiggyBank")
  const supabase = createClientComponentClient()

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      minimumAmount: 1000,
      maximumAmount: undefined,
      status: true,
      iconType: "default",
      iconFile: undefined,
      iconName: "PiggyBank",
    },
  })

  // Fetch jar data
  useEffect(() => {
    async function fetchJar() {
      try {
        const response = await fetch(`/api/admin/jars/${resolvedParams.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch jar')
        }

        const jar = data.jar as JarData
        
        // Set the selected tab based on term months
        setSelectedTab(`${jar.term_months}-month`)

        // Set form values
        form.reset({
          name: jar.name,
          description: jar.description,
          minimumAmount: jar.minimum_investment,
          maximumAmount: jar.maximum_investment || undefined,
          status: jar.is_active,
          iconType: "default",
          iconName: jar.icon_name || "PiggyBank",
        })

        // Set selected icon if it exists
        if (jar.icon_name) {
          setSelectedIcon(jar.icon_name)
        }
      } catch (error) {
        console.error('Error fetching jar:', error)
        toast({
          title: "Error fetching jar",
          description: "There was a problem loading the jar details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJar()
  }, [resolvedParams.id, form])

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingIcon(true)

      // Validate file type and size
      if (!file.type.includes('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewIcon(reader.result as string)
        form.setValue("iconType", "upload")
      }
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('Error handling file:', error)
      toast({
        title: "Error uploading file",
        description: "There was a problem uploading your file",
        variant: "destructive",
      })
    } finally {
      setUploadingIcon(false)
    }
  }

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/jars/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API error response:', data)
        console.error('API error property:', data.error)
        let errorMsg = ''
        if (typeof data.error === 'string') {
          errorMsg = data.error
        } else if (typeof data.error === 'object' && data.error !== null) {
          errorMsg = Object.entries(data.error).map(([k, v]) => `${k}: ${v}`).join('; ')
        } else {
          errorMsg = JSON.stringify(data.error)
        }
        throw new Error(errorMsg || 'Failed to update jar')
      }

      toast({
        title: "Success!",
        description: `${values.name} has been updated successfully.`,
        variant: "default",
      })

      setTimeout(() => {
        router.push("/admin/jars")
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error updating jar:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update jar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jar details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Jar</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jar Details</CardTitle>
          <CardDescription>Update the investment jar details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jar Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sprout Fund" {...field} />
                      </FormControl>
                      <FormDescription>A unique name for this investment jar</FormDescription>
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
                        <Textarea
                          placeholder="Describe the investment jar and its benefits..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain the jar's features and benefits to potential investors
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="minimumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Investment</FormLabel>
                        <FormControl>
                          <Input type="number" min={10} placeholder="1000" {...field} />
                        </FormControl>
                        <FormDescription>Minimum amount required to invest</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maximumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Investment (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="10000" {...field} />
                        </FormControl>
                        <FormDescription>Maximum amount allowed per investor</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Jar Icon</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a default icon or upload your own
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="iconType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Type</FormLabel>
                        <FormControl>
                          <Tabs
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                          >
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="default">Default Icons</TabsTrigger>
                              <TabsTrigger value="upload">Upload Icon</TabsTrigger>
                            </TabsList>
                            <TabsContent value="default" className="mt-4">
                              <div className="grid grid-cols-4 gap-4">
                                {defaultIcons.map((icon) => (
                                  <Button
                                    key={icon.name}
                                    type="button"
                                    variant={selectedIcon === icon.name ? "default" : "outline"}
                                    className="h-20 w-full"
                                    onClick={() => {
                                      setSelectedIcon(icon.name);
                                      form.setValue("iconName", icon.name);
                                    }}
                                  >
                                    <div className="flex flex-col items-center space-y-2">
                                      <icon.component className="h-8 w-8" />
                                      <span className="text-xs">{icon.name}</span>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </TabsContent>
                            <TabsContent value="upload" className="mt-4">
                              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  id="icon-upload"
                                />
                                <label
                                  htmlFor="icon-upload"
                                  className="flex flex-col items-center space-y-2 cursor-pointer"
                                >
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Click to upload icon
                                  </span>
                                </label>
                                {previewIcon && (
                                  <div className="mt-4">
                                    <img
                                      src={previewIcon}
                                      alt="Icon preview"
                                      className="h-20 w-20 object-contain"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="mt-2"
                                      onClick={() => {
                                        setPreviewIcon(null);
                                        form.setValue("iconFile", undefined);
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Jar Status</FormLabel>
                        <FormDescription>
                          Toggle to activate or deactivate this jar
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      Update Jar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
