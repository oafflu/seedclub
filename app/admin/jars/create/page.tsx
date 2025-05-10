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
  Trees,
  Flower,
  TreeDeciduous,
  Palmtree
} from "lucide-react"
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
import { logAuditEvent } from "@/lib/services/audit-logger"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define default icons
const defaultIcons = [
  { name: 'piggy-bank', icon: PiggyBank, label: 'Piggy Bank' },
  { name: 'sprout', icon: Sprout, label: 'Sprout' },
  { name: 'leaf', icon: Leaf, label: 'Leaf' },
  { name: 'trees', icon: Trees, label: 'Trees' },
  { name: 'palm', icon: Palmtree, label: 'Palm Tree' },
  { name: 'oak', icon: TreeDeciduous, label: 'Oak Tree' },
  { name: 'flower', icon: Flower, label: 'Flower' }
]

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  minimumAmount: z.coerce.number().min(10, "Minimum amount must be at least 10"),
  maximumAmount: z.coerce.number().min(0, "Maximum amount must be positive"),
  status: z.boolean(),
  iconType: z.string(),
  selectedIcon: z.string().optional(),
  iconFile: z.any().nullable()
})

type FormValues = z.infer<typeof formSchema>

export default function CreateJarPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("12-month")
  const [previewIcon, setPreviewIcon] = useState<string | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Generate a secure hash for the password
  const generateSecureHash = (email: string) => {
    return btoa(email + '_' + Date.now()).replace(/[^a-zA-Z0-9]/g, '')
  }

  // Ensure admin role exists
  const ensureAdminRole = async () => {
    // Check if admin role exists
    const { data: existingRole, error: checkError } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('name', 'admin')
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      // Role doesn't exist, create it
      const { data: newRole, error: createError } = await supabase
        .from('admin_roles')
        .insert([{
          name: 'admin',
          description: 'Administrator role with system access'
        }])
        .select()
        .single()

      if (createError) {
        console.error('Failed to create admin role:', createError)
        throw new Error('Failed to create admin role')
      }

      return newRole
    } else if (checkError) {
      console.error('Error checking admin role:', checkError)
      throw new Error('Error checking admin role')
    }

    return existingRole
  }

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError || !session) {
          console.error('Auth error:', authError)
          setError('Authentication failed. Please log in again.')
          router.push("/admin/login")
          return
        }

        // First check if user exists in admin_users
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role, email')
          .eq('id', session.user.id)
          .single()

        if (adminError) {
          // If the user doesn't exist in admin_users, try to create them
          if (adminError.code === 'PGRST116') { // PostgreSQL not found error
            console.log('Creating new admin user for:', session.user.email)
            
            try {
              // First check if a user with this email already exists
              const { data: existingUser, error: existingError } = await supabase
                .from('admin_users')
                .select('id')
                .eq('email', session.user.email)
                .single()

              if (existingUser) {
                // Update the existing user with the new ID
                const { data: updatedUser, error: updateError } = await supabase
                  .from('admin_users')
                  .update({
                    id: session.user.id,
                    last_login_at: new Date().toISOString(),
                    is_active: true
                  })
                  .eq('email', session.user.email)
                  .select()
                  .single()

                if (updateError) {
                  console.error('Failed to update admin user:', updateError)
                  setError(`Failed to update admin user: ${updateError.message || 'Unknown error'}`)
                  return
                }

                setIsAuthenticated(true)
                return
              }

              // Ensure admin role exists
              const adminRole = await ensureAdminRole()

              // Generate a secure hash for the password
              const securePassword = generateSecureHash(session.user.email || '')

              // Create the admin user
              const { data: newAdminUser, error: createUserError } = await supabase
                .from('admin_users')
                .insert([{
                  id: session.user.id,
                  email: session.user.email,
                  first_name: session.user.user_metadata?.first_name || null,
                  last_name: session.user.user_metadata?.last_name || null,
                  last_login_at: new Date().toISOString()
                }])
                .select()
                .single()

              if (createUserError) {
                console.error('Failed to create admin user:', createUserError)
                const errorMessage = createUserError.message || 'Unknown error occurred'
                setError(`Failed to create admin user: ${errorMessage}`)
                return
              }

              // Link the user to the admin role in the junction table
              const { error: linkError } = await supabase
                .from('admin_user_roles')
                .insert([{
                  user_id: session.user.id,
                  role_id: adminRole.id
                }])

              if (linkError) {
                console.error('Failed to link admin role:', linkError)
                // Don't return here, the user is still created
              }

              setIsAuthenticated(true)
              return
            } catch (error: any) {
              console.error('Error in admin user creation process:', error)
              setError(error.message || 'Failed to setup admin user')
              return
            }
          }

          console.error('Admin user error:', adminError)
          setError('Authentication error. Please try logging in again.')
          router.push("/admin/login")
          return
        }

        // Check if user has admin or super_admin role
        if (!['admin', 'super_admin'].includes(adminUser.role)) {
          console.error('Insufficient permissions')
          setError('You do not have permission to access this page.')
          router.push("/admin/dashboard")
          return
        }

        setIsAuthenticated(true)
      } catch (error: any) {
        console.error('Auth check error:', error)
        setError(error.message || 'An unexpected error occurred. Please try again.')
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router, supabase])

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      minimumAmount: 10,
      maximumAmount: 0,
      status: true,
      iconType: "default",
      selectedIcon: "piggy-bank",
      iconFile: null
    }
  })

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      // Reset to default values if no file selected
      setPreviewIcon(null)
      form.setValue("iconFile", null)
      form.setValue("iconType", "default")
      return
    }

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
      }
      reader.readAsDataURL(file)

      // Store file for form submission
      form.setValue("iconFile", file)
      form.setValue("iconType", "custom")
    } catch (error) {
      console.error('Error handling file:', error)
      toast({
        title: "Error uploading file",
        description: "There was a problem uploading your file",
        variant: "destructive",
      })
      // Reset to default values on error
      setPreviewIcon(null)
      form.setValue("iconFile", null)
      form.setValue("iconType", "default")
    } finally {
      setUploadingIcon(false)
    }
  }

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be authenticated to create a jar",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Get current session
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session) {
        throw new Error('Unauthorized - No valid session')
      }

      let iconName = null
      if (data.iconType === "custom" && data.iconFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('jar-icons')
          .upload(`${session.user.id}/${Date.now()}-${data.iconFile.name}`, data.iconFile)

        if (uploadError) throw uploadError
        // Get the public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('jar-icons')
          .getPublicUrl(uploadData.path)
        iconName = publicUrlData.publicUrl
      } else if (data.iconType === "default" && data.selectedIcon) {
        iconName = data.selectedIcon
      }

      // Create jar
      const { data: jar, error: jarError } = await supabase
        .from('jars')
        .insert([{
          name: data.name,
          description: data.description,
          minimum_investment: data.minimumAmount,
          maximum_investment: data.maximumAmount || null,
          is_active: data.status,
          icon_name: iconName,
          created_by: session.user.id
        }])
        .select()
        .single()

      if (jarError) throw jarError

      // Create audit log
      await supabase.from('audit_logs').insert({
        user_id: session.user.id,
        action: 'create',
        resource: 'jars',
        resource_id: jar.id,
        details: {
          name: data.name,
          is_active: data.status
        }
      })

      toast({
        title: "Success!",
        description: `${data.name} has been created successfully.`,
        variant: "default",
      })

      setTimeout(() => {
        router.push("/admin/jars")
        router.refresh()
      }, 1000)

    } catch (err: any) {
      console.error('Error creating jar:', err)
      setError(err.message || 'Error creating jar')
    } finally {
      setIsLoading(false)
    }
  }

  // If not authenticated, show loading state with error if present
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Checking authorization...</h2>
          <p className="text-sm text-muted-foreground">Please wait</p>
          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Jar</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {error && (
        <div className="px-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Jar Details</CardTitle>
          <CardDescription>Configure the investment jar details</CardDescription>
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
                          <Input 
                            type="number" 
                            min={10} 
                            placeholder="10" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value || ''}
                          />
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
                          <Input 
                            type="number" 
                            min={0} 
                            placeholder="10000" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value || ''}
                          />
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
                        <div className="grid gap-4">
                          <div className="flex items-center space-x-4">
                            <Button
                              type="button"
                              variant={field.value === 'default' ? 'default' : 'outline'}
                              className="flex-1"
                              onClick={() => {
                                field.onChange('default')
                                setPreviewIcon(null)
                                form.setValue("iconFile", null)
                              }}
                            >
                              <PiggyBank className="mr-2 h-4 w-4" />
                              Use Default Icon
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'custom' ? 'default' : 'outline'}
                              className="flex-1"
                              onClick={() => document.getElementById('icon-upload')?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Custom Icon
                            </Button>
                            <input
                              id="icon-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </div>

                          {field.value === 'default' && (
                            <FormField
                              control={form.control}
                              name="selectedIcon"
                              render={({ field: iconField }) => (
                                <FormItem>
                                  <div className="grid grid-cols-4 gap-4">
                                    {defaultIcons.map((icon) => {
                                      const Icon = icon.icon
                                      return (
                                        <Button
                                          key={icon.name}
                                          type="button"
                                          variant={iconField.value === icon.name ? 'default' : 'outline'}
                                          className="flex flex-col items-center p-4 h-auto"
                                          onClick={() => iconField.onChange(icon.name)}
                                        >
                                          <Icon className="h-8 w-8 mb-2" />
                                          <span className="text-sm">{icon.label}</span>
                                        </Button>
                                      )
                                    })}
                                  </div>
                                </FormItem>
                              )}
                            />
                          )}

                          {field.value === 'custom' && previewIcon && (
                            <div className="relative aspect-square w-20 overflow-hidden rounded-lg border">
                              <img
                                src={previewIcon}
                                alt="Icon preview"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1"
                                onClick={() => {
                                  setPreviewIcon(null)
                                  field.onChange('default')
                                  form.setValue("iconFile", null)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
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
                        <FormLabel className="text-base">Activate Jar</FormLabel>
                        <FormDescription>
                          Make this jar available to customers immediately
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
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Jar
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
