"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { adminService } from "@/lib/services/admin"
import type { AdminUser, AdminRole } from "@/types/database"
import { useToast } from "@/components/ui/use-toast"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    roleId: "",
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [userData, rolesData] = await Promise.all([
        adminService.getUserById(params.id),
        adminService.getRoles()
      ])

      setUser(userData)
      setRoles(rolesData)
      setFormData({
        email: userData.email,
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        roleId: userData.role || "",
        isActive: userData.is_active
      })
    } catch (error: any) {
      console.error('Error loading user data:', error)
      setError(error.message || "Failed to load user data")
      toast({
        title: "Error",
        description: error.message || "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Update user details
      await adminService.updateUser(params.id, {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        is_active: formData.isActive
      })

      // Update user role if changed
      if (user?.role !== formData.roleId) {
        await adminService.updateUserRole(params.id, formData.roleId)
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      router.push("/admin/users-roles")
    } catch (error: any) {
      console.error('Error updating user:', error)
      setError(error.message || "Failed to update user")
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/users-roles")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>
              Update user details and role assignment
            </CardDescription>
          </CardHeader>

          {error && (
            <div className="px-6">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}>
                </Switch>
                <Label htmlFor="isActive">Active Account</Label>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading} className="ml-auto">
              {isLoading ? (
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
          </CardFooter>
        </Card>
      </form>
    </div>
  )
} 