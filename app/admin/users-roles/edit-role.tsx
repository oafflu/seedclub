"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { adminService } from "@/lib/services/admin"
import type { AdminRole, AdminPermission } from "@/types/database"
import { useToast } from "@/components/ui/use-toast"

interface EditRoleProps {
  roleId: string
}

export default function EditRole({ roleId }: EditRoleProps) {
  const [role, setRole] = useState<AdminRole | null>(null)
  const [permissions, setPermissions] = useState<AdminPermission[]>([])
  const [rolePermissions, setRolePermissions] = useState<string[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [roleId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [roleData, permissionsData, rolePermissionsData] = await Promise.all([
        adminService.getRoleById(roleId),
        adminService.getPermissions(),
        adminService.getRolePermissions(roleId)
      ])

      setRole(roleData)
      setName(roleData.name)
      setDescription(roleData.description || "")
      setPermissions(permissionsData)
      setRolePermissions(rolePermissionsData.map(p => p.id))
    } catch (error: any) {
      console.error('Error loading role data:', error)
      setError(error.message || "Failed to load role data")
      toast({
        title: "Error",
        description: error.message || "Failed to load role data",
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
      // Update role details
      await adminService.updateRole(roleId, {
        name,
        description
      })

      // Update role permissions
      await adminService.updateRolePermissions(roleId, rolePermissions)

      toast({
        title: "Success",
        description: "Role updated successfully",
      })

      router.push("/admin/users-roles")
    } catch (error: any) {
      console.error('Error updating role:', error)
      setError(error.message || "Failed to update role")
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setRolePermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  if (isLoading && !role) {
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
          Back to Roles
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Role</CardTitle>
            <CardDescription>
              Update role details and manage permissions
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
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter role description"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions</h3>
              {['dashboard', 'customers', 'transactions', 'reports', 'settings', 'users'].map(resource => (
                <div key={resource} className="space-y-4">
                  <h4 className="text-sm font-medium capitalize">{resource} Permissions</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {permissions
                      .filter(p => p.resource === resource)
                      .map(permission => (
                        <div key={permission.id} className="flex items-center justify-between space-x-2">
                          <Label htmlFor={permission.id} className="flex-1">
                            {permission.description || permission.name}
                          </Label>
                          <Switch
                            id={permission.id}
                            checked={rolePermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                      ))
                    }
                  </div>
                  <Separator />
                </div>
              ))}
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