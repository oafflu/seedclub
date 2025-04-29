"use client"

import { useState } from "react"
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

// Mock data for admin users
const adminUsers = [
  {
    id: "USER-001",
    name: "John Admin",
    email: "john.admin@seedclub.com",
    role: "administrator",
    status: "active",
    lastLogin: "2024-01-20T14:30:00Z",
    createdAt: "2023-01-15T10:00:00Z",
    avatar: null,
  },
  {
    id: "USER-002",
    name: "Sarah Manager",
    email: "sarah.manager@seedclub.com",
    role: "manager",
    status: "active",
    lastLogin: "2024-01-19T09:15:00Z",
    createdAt: "2023-02-10T11:30:00Z",
    avatar: null,
  },
  {
    id: "USER-003",
    name: "Michael Support",
    email: "michael.support@seedclub.com",
    role: "support",
    status: "active",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-03-05T09:00:00Z",
    avatar: null,
  },
  {
    id: "USER-004",
    name: "Emily Analyst",
    email: "emily.analyst@seedclub.com",
    role: "analyst",
    status: "active",
    lastLogin: "2024-01-17T11:20:00Z",
    createdAt: "2023-04-12T14:15:00Z",
    avatar: null,
  },
  {
    id: "USER-005",
    name: "Robert Viewer",
    email: "robert.viewer@seedclub.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2023-12-15T10:30:00Z",
    createdAt: "2023-05-20T08:45:00Z",
    avatar: null,
  },
]

// Mock data for roles
const roles = [
  {
    id: "ROLE-001",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 1,
    isDefault: false,
    permissions: {
      dashboard: { view: true, edit: true },
      customers: { view: true, edit: true, create: true, delete: true },
      jars: { view: true, edit: true, create: true, delete: true },
      transactions: { view: true, edit: true, create: true, delete: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true },
      users: { view: true, edit: true, create: true, delete: true },
    },
  },
  {
    id: "ROLE-002",
    name: "Manager",
    description: "Manage customers, jars, and transactions",
    userCount: 1,
    isDefault: false,
    permissions: {
      dashboard: { view: true, edit: false },
      customers: { view: true, edit: true, create: true, delete: false },
      jars: { view: true, edit: true, create: true, delete: false },
      transactions: { view: true, edit: true, create: true, delete: false },
      reports: { view: true, export: true },
      settings: { view: false, edit: false },
      users: { view: false, edit: false, create: false, delete: false },
    },
  },
  {
    id: "ROLE-003",
    name: "Support",
    description: "Customer support and basic transaction management",
    userCount: 1,
    isDefault: true,
    permissions: {
      dashboard: { view: true, edit: false },
      customers: { view: true, edit: false, create: false, delete: false },
      jars: { view: true, edit: false, create: false, delete: false },
      transactions: { view: true, edit: false, create: false, delete: false },
      reports: { view: false, export: false },
      settings: { view: false, edit: false },
      users: { view: false, edit: false, create: false, delete: false },
    },
  },
  {
    id: "ROLE-004",
    name: "Analyst",
    description: "View and analyze data, generate reports",
    userCount: 1,
    isDefault: false,
    permissions: {
      dashboard: { view: true, edit: false },
      customers: { view: true, edit: false, create: false, delete: false },
      jars: { view: true, edit: false, create: false, delete: false },
      transactions: { view: true, edit: false, create: false, delete: false },
      reports: { view: true, export: true },
      settings: { view: false, edit: false },
      users: { view: false, edit: false, create: false, delete: false },
    },
  },
  {
    id: "ROLE-005",
    name: "Viewer",
    description: "Read-only access to basic information",
    userCount: 1,
    isDefault: false,
    permissions: {
      dashboard: { view: true, edit: false },
      customers: { view: true, edit: false, create: false, delete: false },
      jars: { view: true, edit: false, create: false, delete: false },
      transactions: { view: true, edit: false, create: false, delete: false },
      reports: { view: false, export: false },
      settings: { view: false, edit: false },
      users: { view: false, edit: false, create: false, delete: false },
    },
  },
]

export default function UsersRolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [viewUser, setViewUser] = useState<any>(null)
  const [viewRole, setViewRole] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("users")

  const filteredUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User & Role Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
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
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="mt-6 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
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
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
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
                          <Badge variant={user.status === "active" ? "default" : "secondary"} className="capitalize">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                                        <AvatarFallback className="text-lg">{viewUser.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-lg font-semibold">{viewUser.name}</h3>
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
                                        <p>
                                          <Badge
                                            variant={viewUser.status === "active" ? "default" : "secondary"}
                                            className="capitalize"
                                          >
                                            {viewUser.status}
                                          </Badge>
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Last Login</Label>
                                        <p>{formatDate(viewUser.lastLogin)}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Created At</Label>
                                        <p>{formatDate(viewUser.createdAt)}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline">Edit User</Button>
                                  <Button>Reset Password</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
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
                                <DropdownMenuItem>
                                  <Lock className="mr-2 h-4 w-4" /> Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem>
                                    <XCircle className="mr-2 h-4 w-4 text-amber-500" /> Deactivate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Activate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
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
                    {role.isDefault && (
                      <Badge variant="outline" className="text-primary border-primary">
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Users with this role:</span>
                      <span className="font-medium">{role.userCount}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Key Permissions:</h3>
                      <ul className="space-y-1 text-sm">
                        {role.permissions.dashboard.view && (
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            View Dashboard
                          </li>
                        )}
                        {role.permissions.customers.view && (
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            View Customers
                          </li>
                        )}
                        {role.permissions.customers.edit && (
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            Edit Customers
                          </li>
                        )}
                        {role.permissions.transactions.view && (
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            View Transactions
                          </li>
                        )}
                        {role.permissions.reports.view && (
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            View Reports
                          </li>
                        )}
                        {role.permissions.settings.edit && (
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                            Edit Settings
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setViewRole(role)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Role Permissions</DialogTitle>
                        <DialogDescription>Detailed permissions for this role.</DialogDescription>
                      </DialogHeader>
                      {viewRole && (
                        <div className="grid gap-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold capitalize">{viewRole.name}</h3>
                              <p className="text-sm text-muted-foreground">{viewRole.description}</p>
                            </div>
                            {viewRole.isDefault && (
                              <Badge variant="outline" className="text-primary border-primary">
                                Default
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Dashboard Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="dashboard-view">View Dashboard</Label>
                                  <Switch id="dashboard-view" checked={viewRole.permissions.dashboard.view} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="dashboard-edit">Edit Dashboard</Label>
                                  <Switch id="dashboard-edit" checked={viewRole.permissions.dashboard.edit} disabled />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Customer Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="customers-view">View Customers</Label>
                                  <Switch id="customers-view" checked={viewRole.permissions.customers.view} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="customers-edit">Edit Customers</Label>
                                  <Switch id="customers-edit" checked={viewRole.permissions.customers.edit} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="customers-create">Create Customers</Label>
                                  <Switch
                                    id="customers-create"
                                    checked={viewRole.permissions.customers.create}
                                    disabled
                                  />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="customers-delete">Delete Customers</Label>
                                  <Switch
                                    id="customers-delete"
                                    checked={viewRole.permissions.customers.delete}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Transaction Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="transactions-view">View Transactions</Label>
                                  <Switch
                                    id="transactions-view"
                                    checked={viewRole.permissions.transactions.view}
                                    disabled
                                  />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="transactions-edit">Edit Transactions</Label>
                                  <Switch
                                    id="transactions-edit"
                                    checked={viewRole.permissions.transactions.edit}
                                    disabled
                                  />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="transactions-create">Create Transactions</Label>
                                  <Switch
                                    id="transactions-create"
                                    checked={viewRole.permissions.transactions.create}
                                    disabled
                                  />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="transactions-delete">Delete Transactions</Label>
                                  <Switch
                                    id="transactions-delete"
                                    checked={viewRole.permissions.transactions.delete}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Report Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="reports-view">View Reports</Label>
                                  <Switch id="reports-view" checked={viewRole.permissions.reports.view} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="reports-export">Export Reports</Label>
                                  <Switch id="reports-export" checked={viewRole.permissions.reports.export} disabled />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Settings Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="settings-view">View Settings</Label>
                                  <Switch id="settings-view" checked={viewRole.permissions.settings.view} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="settings-edit">Edit Settings</Label>
                                  <Switch id="settings-edit" checked={viewRole.permissions.settings.edit} disabled />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">User Management Permissions</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="users-view">View Users</Label>
                                  <Switch id="users-view" checked={viewRole.permissions.users.view} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="users-edit">Edit Users</Label>
                                  <Switch id="users-edit" checked={viewRole.permissions.users.edit} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="users-create">Create Users</Label>
                                  <Switch id="users-create" checked={viewRole.permissions.users.create} disabled />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                  <Label htmlFor="users-delete">Delete Users</Label>
                                  <Switch id="users-delete" checked={viewRole.permissions.users.delete} disabled />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline">Clone Role</Button>
                        <Button>Edit Role</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
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
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Enter role description" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base-role">Base Role (Optional)</Label>
                  <Select>
                    <SelectTrigger id="base-role">
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

                <div className="space-y-2">
                  <Label htmlFor="default-role" className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span>Make Default Role</span>
                      <p className="text-sm text-muted-foreground">New users will be assigned this role by default</p>
                    </div>
                    <Switch id="default-role" />
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Create Role</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
