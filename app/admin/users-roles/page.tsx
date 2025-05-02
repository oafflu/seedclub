"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  UserCog,
  CheckCircle,
  XCircle,
  Lock,
  Loader2,
  User,
  Mail,
  Shield,
  Copy,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminService } from "@/lib/services/admin"
import type { AdminUser, AdminRole, AdminPermission } from "@/types/database"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Textarea } from "@/components/ui/textarea"
import { utils, write } from 'xlsx'
import { exportToPDF } from './pdf-export'

export default function RolesAndPermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [viewUser, setViewUser] = useState<AdminUser | null>(null)
  const [viewRole, setViewRole] = useState<AdminRole | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [permissions, setPermissions] = useState<AdminPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [cloneRoleData, setCloneRoleData] = useState<{
    roleId: string;
    name: string;
    description: string;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newRole, setNewRole] = useState({ name: "", description: "" })
  const [newUser, setNewUser] = useState({ email: "", firstName: "", lastName: "", roleId: "" })
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData, permissionsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getRoles(),
        adminService.getPermissions()
      ])
      setUsers(usersData)
      setRoles(rolesData)
      setPermissions(permissionsData)
    } catch (error: any) {
      console.error('Error loading data:', error)
      const errorMessage = typeof error.message === 'string' ? error.message : 'Failed to load data'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredRoles = roles.filter(
    (role): role is AdminRole => {
      if (!role?.name) return false
      const searchTermLower = searchTerm.toLowerCase()
      return (
        role.name.toLowerCase().includes(searchTermLower) ||
        (role.description?.toLowerCase() || '').includes(searchTermLower)
      )
    }
  )

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const handleCreateUser = async (userData: Partial<AdminUser>) => {
    try {
      await adminService.createUser(userData)
      await loadData()
      toast.success('User created successfully')
    } catch (error: any) {
      console.error('Error creating user:', error)
      const errorMessage = typeof error.message === 'string' ? error.message : 'Failed to create user'
      toast.error(errorMessage)
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Check if current user is super_admin
      const { data: currentUser, error: currentUserError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (currentUserError || !currentUser || currentUser.role !== 'super_admin') {
        throw new Error('Only super admins can edit users')
      }

      // Update user in admin_users table
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // If role is being updated, also update auth metadata
      if (updates.role) {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          userId,
          { user_metadata: { role: updates.role } }
        )
        if (authUpdateError) throw authUpdateError
      }

      toast.success('User updated successfully')
      loadData()
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await adminService.deleteUser(id)
      await loadData()
      toast.success('User deleted successfully')
    } catch (error: any) {
      console.error('Error deleting user:', error)
      const errorMessage = typeof error.message === 'string' ? error.message : 'Failed to delete user'
      toast.error(errorMessage)
    }
  }

  const handleCreateRole = async (roleData: Partial<AdminRole>) => {
    try {
      await adminService.createRole(roleData)
      await loadData()
      toast.success('Role created successfully')
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error('Failed to create role')
    }
  }

  const handleUpdateRole = async (roleId: string, updates: Partial<AdminRole>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Check if current user is super_admin
      const { data: currentUser, error: currentUserError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (currentUserError || !currentUser || currentUser.role !== 'super_admin') {
        throw new Error('Only super admins can edit roles')
      }

      // Update role
      const { error: updateError } = await supabase
        .from('admin_roles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', roleId)

      if (updateError) throw updateError

      toast.success('Role updated successfully')
      loadData()
    } catch (error: any) {
      console.error('Error updating role:', error)
      toast.error(error.message || 'Failed to update role')
    }
  }

  const handleDeleteRole = async (id: string) => {
    try {
      await adminService.deleteRole(id)
      await loadData()
      toast.success('Role deleted successfully')
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error('Failed to delete role')
    }
  }

  const handleUpdateRolePermissions = async (roleId: string, permissionIds: string[]) => {
    try {
      await adminService.updateRolePermissions(roleId, permissionIds)
      await loadData()
      toast.success('Role permissions updated successfully')
    } catch (error) {
      console.error('Error updating role permissions:', error)
      toast.error('Failed to update role permissions')
    }
  }

  // Format date
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const CloneRoleDialog = () => {
    if (!cloneRoleData) return null

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await adminService.cloneRole(
          cloneRoleData.roleId,
          cloneRoleData.name,
          cloneRoleData.description
        )
        toast.success('Role cloned successfully')
        setCloneRoleData(null)
        loadData()
      } catch (error) {
        console.error('Error cloning role:', error)
        toast.error('Failed to clone role')
      }
    }

    return (
      <Dialog open={!!cloneRoleData} onOpenChange={() => setCloneRoleData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Role</DialogTitle>
            <DialogDescription>
              Create a new role by cloning an existing one. The new role will inherit all permissions from the selected role.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={cloneRoleData.name}
                  onChange={(e) => setCloneRoleData({ ...cloneRoleData, name: e.target.value })}
                  placeholder="Enter role name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Input
                  id="roleDescription"
                  value={cloneRoleData.description}
                  onChange={(e) => setCloneRoleData({ ...cloneRoleData, description: e.target.value })}
                  placeholder="Enter role description"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCloneRoleData(null)}>
                Cancel
              </Button>
              <Button type="submit">Clone Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // First check if the current user has super_admin role
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw new Error('Authentication error: ' + sessionError.message)
      if (!session) throw new Error('Not authenticated')

      // Get the current user's role from the admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (adminError) {
        console.error('Admin role check error details:', {
          error: adminError,
          userId: session.user.id,
          query: 'admin_users table query failed'
        })
        throw new Error(`Error checking admin role: ${adminError.message || 'Unknown error'}`)
      }

      if (!adminData) {
        throw new Error('Admin user not found in database')
      }

      if (adminData.role !== 'super_admin') {
        throw new Error('Insufficient permissions. Only super admins can create admin users.')
      }

      // Create the admin user with Supabase auth
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role, // Store role in auth metadata
          },
        }
      })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        throw signUpError
      }

      if (!user) {
        throw new Error('No user created')
      }

      // Create admin profile without password
      const { data: newAdmin, error: profileError } = await supabase
        .from('admin_users')
        .insert([
          {
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: role,
            encrypted_password: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (profileError) {
        // If profile creation fails, clean up the auth user
        await supabase.auth.admin.deleteUser(user.id)
        
        console.error('Profile creation error details:', {
          error: profileError,
          userId: user.id,
          data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: role
          }
        })
        throw new Error(`Failed to create admin profile: ${profileError.message || 'Unknown error'}`)
      }

      toast.success('Admin user created successfully')

      setEmail("")
      setPassword("")
      setRole("admin")
      setIsDialogOpen(false)
      
      loadData()
    } catch (error: any) {
      console.error('Admin creation error:', error)
      const errorMessage = typeof error.message === 'string' 
        ? error.message 
        : "Failed to create admin user"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRole = async () => {
    try {
      await adminService.createRole(newRole)
      setIsAddingRole(false)
      setNewRole({ name: "", description: "" })
      loadData()
      toast.success('Role created successfully')
    } catch (error: any) {
      console.error('Error creating role:', error)
      const errorMessage = typeof error?.message === 'string' ? error.message : 'Failed to create role'
      toast.error(errorMessage)
    }
  }

  const handleAddUser = async () => {
    try {
      const user = await adminService.createUser({
        email: newUser.email,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        role: "admin"
      })

      if (newUser.roleId) {
        await adminService.updateUserRole(user.id, newUser.roleId)
      }

      setIsAddingUser(false)
      setNewUser({ email: "", firstName: "", lastName: "", roleId: "" })
      loadData()
      toast.success('User created successfully')
    } catch (error: any) {
      console.error('Error creating user:', error)
      const errorMessage = typeof error?.message === 'string' ? error.message : 'Failed to create user'
      toast.error(errorMessage)
    }
  }

  const handleCloneRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    const newName = prompt("Enter name for the cloned role:", `${role.name} (Copy)`)
    if (!newName) return

    try {
      await adminService.cloneRole(roleId, newName, role.description || "")
      loadData()
      toast.success('Role cloned successfully')
    } catch (error: any) {
      console.error('Error cloning role:', error)
      const errorMessage = typeof error.message === 'string' ? error.message : "Failed to clone role"
      toast.error(errorMessage)
    }
  }

  const handleInitiatePasswordReset = async (userId: string) => {
    try {
      await adminService.initiatePasswordReset(userId)
      toast.success('Password reset email has been sent')
    } catch (error: any) {
      console.error('Error initiating password reset:', error)
      const errorMessage = typeof error.message === 'string' ? error.message : 'Failed to send password reset email'
      toast.error(errorMessage)
    }
  }

  const exportToExcel = (users: AdminUser[]) => {
    const worksheet = utils.json_to_sheet(users.map(user => ({
      'ID': user.id,
      'First Name': user.first_name,
      'Last Name': user.last_name,
      'Email': user.email,
      'Role': user.role,
      'Status': user.is_active ? 'Active' : 'Inactive',
      'Last Login': user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never',
      'Created At': new Date(user.created_at).toLocaleString()
    })))

    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Users')
    
    // Generate buffer
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' })
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'admin_users.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToCSV = (users: AdminUser[]) => {
    const csvContent = users.map(user => [
      user.id,
      user.first_name || '',
      user.last_name || '',
      user.email,
      user.role,
      user.is_active ? 'Active' : 'Inactive',
      user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never',
      new Date(user.created_at).toLocaleString()
    ].join(',')).join('\n')

    const header = 'ID,First Name,Last Name,Email,Role,Status,Last Login,Created At\n'
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'admin_users.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Admin User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Create a new admin user with specific permissions. Only super admins can create new admin users.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Admin Role</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles
                        .filter((role): role is AdminRole => Boolean(role?.name))
                        .map((availableRole) => (
                          <SelectItem key={availableRole.id} value={availableRole.name!}>
                            {availableRole.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Admin User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage users who have access to the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
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
                        <Checkbox id="active-users" className="mr-2" />
                        <Label htmlFor="active-users">Active Only</Label>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Checkbox id="admin-role" className="mr-2" />
                        <Label htmlFor="admin-role">Administrators</Label>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Checkbox id="recent-login" className="mr-2" />
                        <Label htmlFor="recent-login">Recent Login</Label>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={() => exportToExcel(filteredUsers)}>
                        Export to Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToPDF(filteredUsers)}>
                        Export to PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToCSV(filteredUsers)}>
                        Export to CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-6 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={Boolean(selectedUsers.length === filteredUsers.length && filteredUsers.length > 0)}
                          onCheckedChange={toggleAllUsers}
                        />
                      </TableHead>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.id.split('-')[0]}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.first_name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.email}
                              </div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "default" : "secondary"} className="capitalize">
                            {user.is_active ? 'active' : 'inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.last_login_at)}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setViewUser(user)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                  <DialogDescription>Detailed information about the user.</DialogDescription>
                                </DialogHeader>
                                {viewUser && (
                                  <div className="grid gap-4 py-4">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarFallback className="text-lg">
                                          {viewUser.first_name?.[0] || viewUser.email[0].toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-lg font-semibold">
                                          {viewUser.first_name && viewUser.last_name 
                                            ? `${viewUser.first_name} ${viewUser.last_name}`
                                            : viewUser.email}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm text-muted-foreground">User ID</Label>
                                        <p>{viewUser.id}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Role</Label>
                                        <p className="capitalize">{viewUser.role}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Status</Label>
                                        <div>
                                          <Badge
                                            variant={viewUser.is_active ? "default" : "secondary"}
                                            className="capitalize"
                                          >
                                            {viewUser.is_active ? 'active' : 'inactive'}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Last Login</Label>
                                        <p>{formatDate(viewUser.last_login_at)}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Created At</Label>
                                        <p>{formatDate(viewUser.created_at)}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Failed Login Attempts</Label>
                                        <p>{viewUser.failed_login_attempts}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {
                                    if (!viewUser) return
                                    handleUpdateUser(viewUser.id, {
                                      is_active: !viewUser.is_active
                                    })
                                  }}>
                                    {viewUser?.is_active ? 'Deactivate' : 'Activate'} User
                                  </Button>
                                  <Button onClick={() => viewUser && handleInitiatePasswordReset(viewUser.id)}>
                                    Reset Password
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                  <DialogDescription>
                                    Update user details and permissions. Only super admins can edit users.
                                  </DialogDescription>
                                </DialogHeader>
                                {editingUser && (
                                  <form onSubmit={async (e) => {
                                    e.preventDefault()
                                    const formData = new FormData(e.currentTarget)
                                    await handleUpdateUser(editingUser.id, {
                                      first_name: formData.get('firstName') as string,
                                      last_name: formData.get('lastName') as string,
                                      email: formData.get('email') as string,
                                      role: formData.get('role') as string,
                                      is_active: formData.get('isActive') === 'true'
                                    })
                                    setIsEditingUser(false)
                                  }}>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="firstName">First Name</Label>
                                          <Input
                                            id="firstName"
                                            name="firstName"
                                            defaultValue={editingUser.first_name || ''}
                                            required
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="lastName">Last Name</Label>
                                          <Input
                                            id="lastName"
                                            name="lastName"
                                            defaultValue={editingUser.last_name || ''}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                          id="email"
                                          name="email"
                                          type="email"
                                          defaultValue={editingUser.email}
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select name="role" defaultValue={editingUser.role}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {roles.map((role) => (
                                              <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Label htmlFor="isActive">Active Status</Label>
                                        <Switch
                                          id="isActive"
                                          name="isActive"
                                          defaultChecked={editingUser.is_active}
                                          onCheckedChange={(checked) => {
                                            const form = document.querySelector('form')
                                            if (form) {
                                              const input = form.querySelector('input[name="isActive"]')
                                              if (input) {
                                                (input as HTMLInputElement).value = checked.toString()
                                              }
                                            }
                                          }}
                                        />
                                        <input type="hidden" name="isActive" value={editingUser.is_active.toString()} />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="button" variant="outline" onClick={() => setIsEditingUser(false)}>
                                        Cancel
                                      </Button>
                                      <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                  </form>
                                )}
                              </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <UserCog className="mr-2 h-4 w-4" /> Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => viewUser && handleInitiatePasswordReset(viewUser.id)}>
                                  <Lock className="mr-2 h-4 w-4" /> Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this user?')) {
                                      handleDeleteUser(user.id)
                                    }
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
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
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">{role.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          const newName = prompt('Enter new role name:', role.name)
                          if (newName && newName !== role.name) {
                            handleUpdateRole(role.id, { name: newName })
                          }
                        }}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const newDesc = prompt('Enter new description:', role.description)
                          if (newDesc !== null && newDesc !== role.description) {
                            handleUpdateRole(role.id, { description: newDesc })
                          }
                        }}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Description
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
                            handleDeleteRole(role.id)
                          }
                        }}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Users with this role:</span>
                      <span className="font-medium">
                        {users.filter(u => u.role === role.name).length}
                      </span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Key Permissions:</h3>
                      <ul className="space-y-1 text-sm">
                        {permissions
                          .filter(p => p.resource === role.name)
                          .map(permission => (
                            <li key={permission.id} className="flex items-center">
                              <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                              {permission.description || permission.name}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Role Permissions</DialogTitle>
                        <DialogDescription>Detailed permissions for this role.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold capitalize">{role.name}</h3>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {['dashboard', 'customers', 'transactions', 'reports', 'settings', 'users'].map(resource => (
                            <div key={resource} className="space-y-3">
                              <h4 className="text-sm font-medium capitalize">{resource} Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {permissions
                                  .filter(p => p.resource === resource)
                                  .map(permission => (
                                    <div key={permission.id} className="flex items-center justify-between space-x-2">
                                      <Label htmlFor={`${resource}-${permission.action}`}>
                                        {permission.description || permission.name}
                                      </Label>
                                      <Switch
                                        id={`${resource}-${permission.action}`}
                                        checked={true}
                                        onCheckedChange={(checked) => {
                                          // TODO: Implement permission toggle
                                          toast.info('Permission update coming soon')
                                        }}
                                      />
                                    </div>
                                  ))}
                              </div>
                              <Separator />
                            </div>
                          ))}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setCloneRoleData({
                            roleId: role.id,
                            name: `${role.name} (Copy)`,
                            description: role.description || ''
                          })
                        }}>Clone Role</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>
                          Update role details and permissions. Only super admins can edit roles.
                        </DialogDescription>
                      </DialogHeader>
                      {editingRole && (
                        <form onSubmit={async (e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)
                          await handleUpdateRole(editingRole.id, {
                            name: formData.get('name') as string,
                            description: formData.get('description') as string
                          })
                          setIsEditingRole(false)
                        }}>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Role Name</Label>
                              <Input
                                id="name"
                                name="name"
                                defaultValue={editingRole.name}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                name="description"
                                defaultValue={editingRole.description || ''}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Permissions</Label>
                              <div className="grid grid-cols-2 gap-4">
                                {permissions
                                  .filter(p => p.resource === editingRole.name)
                                  .map(permission => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={permission.id}
                                        defaultChecked={true}
                                        onCheckedChange={(checked) => {
                                          // TODO: Implement permission toggle
                                          toast.info('Permission update coming soon')
                                        }}
                                      />
                                      <Label htmlFor={permission.id}>
                                        {permission.description || permission.name}
                                      </Label>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditingRole(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Role</CardTitle>
              <CardDescription>Define a new role with custom permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                await handleCreateRole({
                  name: formData.get('roleName') as string,
                  description: formData.get('roleDescription') as string,
                })
              }}>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input id="roleName" name="roleName" placeholder="Enter role name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleDescription">Description</Label>
                      <Input id="roleDescription" name="roleDescription" placeholder="Enter role description" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseRole">Base Role (Optional)</Label>
                    <Select name="baseRole">
                      <SelectTrigger id="baseRole">
                        <SelectValue placeholder="Select a base role to copy permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Start with permissions from an existing role, or leave blank to start from scratch
                    </p>
                  </div>
                </div>
                <CardFooter className="px-0">
                  <Button type="submit" className="ml-auto">Create Role</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <CloneRoleDialog />
    </div>
  )
}
