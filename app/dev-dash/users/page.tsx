// app/dev-dash/users/page.tsx
"use client"

import { useState } from "react"
import { 
  IconUsers, 
  IconSearch, 
  IconFilter,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconMail,
  IconShield,
  IconUserCircle,
  IconBuildingStore,
  IconClock,
  IconCheck,
  IconX,
  IconBan,
  IconKey,
  IconRefresh,
  IconDownload,
  IconUpload,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Types
interface User {
  id: string
  name: string
  email: string
  role: "admin" | "shop_owner" | "staff"
  status: "active" | "inactive" | "suspended" | "pending"
  shopId?: string
  shopName?: string
  joinedDate: string
  lastActive: string
  permissions: string[]
  avatar?: string
  phone?: string
  department?: string
  twoFactorEnabled: boolean
  loginAttempts: number
  notes?: string
}

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@techhaven.com",
    role: "shop_owner",
    status: "active",
    shopId: "1",
    shopName: "Tech Haven",
    joinedDate: "2024-01-15",
    lastActive: "2024-02-20 09:30 AM",
    permissions: ["manage_shop", "view_reports", "manage_staff"],
    phone: "+1 234-567-8901",
    twoFactorEnabled: true,
    loginAttempts: 0,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@fashionhub.com",
    role: "shop_owner",
    status: "active",
    shopId: "2",
    shopName: "Fashion Hub",
    joinedDate: "2024-01-10",
    lastActive: "2024-02-19 18:15 PM",
    permissions: ["manage_shop", "view_reports", "manage_staff"],
    phone: "+1 234-567-8902",
    twoFactorEnabled: false,
    loginAttempts: 0,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@grocerymart.com",
    role: "shop_owner",
    status: "pending",
    shopId: "3",
    shopName: "Grocery Mart",
    joinedDate: "2024-01-18",
    lastActive: "2024-01-18 14:20 PM",
    permissions: ["manage_shop"],
    phone: "+1 234-567-8903",
    twoFactorEnabled: false,
    loginAttempts: 0,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@bookstore.com",
    role: "shop_owner",
    status: "suspended",
    shopId: "4",
    shopName: "Bookstore Plus",
    joinedDate: "2023-12-05",
    lastActive: "2024-02-01 11:45 AM",
    permissions: ["manage_shop", "view_reports"],
    phone: "+1 234-567-8904",
    twoFactorEnabled: true,
    loginAttempts: 5,
    notes: "Suspended due to multiple failed payments",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@electronics.com",
    role: "shop_owner",
    status: "active",
    shopId: "5",
    shopName: "Electronics World",
    joinedDate: "2024-01-03",
    lastActive: "2024-02-20 10:05 AM",
    permissions: ["manage_shop", "view_reports", "manage_staff", "manage_subscription"],
    phone: "+1 234-567-8905",
    twoFactorEnabled: true,
    loginAttempts: 0,
  },
  {
    id: "6",
    name: "Sarah Johnson",
    email: "sarah@techhaven.com",
    role: "staff",
    status: "active",
    shopId: "1",
    shopName: "Tech Haven",
    joinedDate: "2024-02-01",
    lastActive: "2024-02-20 08:45 AM",
    permissions: ["process_sales", "view_inventory"],
    phone: "+1 234-567-8906",
    twoFactorEnabled: false,
    loginAttempts: 0,
  },
  {
    id: "7",
    name: "Mike Peters",
    email: "mike@fashionhub.com",
    role: "staff",
    status: "inactive",
    shopId: "2",
    shopName: "Fashion Hub",
    joinedDate: "2024-01-20",
    lastActive: "2024-02-15 16:30 PM",
    permissions: ["process_sales"],
    phone: "+1 234-567-8907",
    twoFactorEnabled: false,
    loginAttempts: 0,
  },
  {
    id: "8",
    name: "Admin User",
    email: "admin@system.com",
    role: "admin",
    status: "active",
    joinedDate: "2023-01-01",
    lastActive: "2024-02-20 11:20 AM",
    permissions: ["all"],
    phone: "+1 234-567-8908",
    twoFactorEnabled: true,
    loginAttempts: 0,
  },
]

const roleColors = {
  admin: "bg-purple-500",
  shop_owner: "bg-blue-500",
  staff: "bg-green-500",
}

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  suspended: "bg-red-500",
  pending: "bg-yellow-500",
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [activateDialogOpen, setActivateDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [activitySheetOpen, setActivitySheetOpen] = useState(false)
  
  // Form states
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
  })
  
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [suspensionReason, setSuspensionReason] = useState("")
  const [inviteEmails, setInviteEmails] = useState("")
  const [inviteRole, setInviteRole] = useState("staff")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-purple-500",
      shop_owner: "bg-blue-500",
      staff: "bg-green-500",
    }
    return (
      <Badge className={colors[role as keyof typeof colors]}>
        {role.replace("_", " ")}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      suspended: "bg-red-500",
      pending: "bg-yellow-500",
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    )
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      department: user.department || "",
    })
    setEditDialogOpen(true)
  }

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user)
    setSelectedPermissions(user.permissions)
    setPermissionsDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user)
    setSuspensionReason("")
    setSuspendDialogOpen(true)
  }

  const handleActivateUser = (user: User) => {
    setSelectedUser(user)
    setActivateDialogOpen(true)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setResetPasswordDialogOpen(true)
  }

  const handleViewActivity = (user: User) => {
    setSelectedUser(user)
    setActivitySheetOpen(true)
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on users:`, selectedUsers)
    setBulkActionDialogOpen(false)
  }

  const handleSaveEdit = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Updating user:", selectedUser?.id, editFormData)
    setIsProcessing(false)
    setEditDialogOpen(false)
  }

  const handleSavePermissions = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Updating permissions for:", selectedUser?.id, selectedPermissions)
    setIsProcessing(false)
    setPermissionsDialogOpen(false)
  }

  const handleConfirmSuspend = async () => {
    if (!suspensionReason.trim()) {
      alert("Please provide a reason for suspension")
      return
    }
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Suspending user:", selectedUser?.id, "Reason:", suspensionReason)
    setIsProcessing(false)
    setSuspendDialogOpen(false)
  }

  const handleConfirmActivate = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Activating user:", selectedUser?.id)
    setIsProcessing(false)
    setActivateDialogOpen(false)
  }

  const handleConfirmDelete = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Deleting user:", selectedUser?.id)
    setIsProcessing(false)
    setDeleteDialogOpen(false)
  }

  const handleResetPasswordConfirm = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Resetting password for:", selectedUser?.id)
    setIsProcessing(false)
    setResetPasswordDialogOpen(false)
  }

  const handleSendInvites = async () => {
    if (!inviteEmails.trim()) {
      alert("Please enter at least one email address")
      return
    }
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Sending invites to:", inviteEmails, "Role:", inviteRole)
    setIsProcessing(false)
    setInviteDialogOpen(false)
  }

  const permissionsList = [
    { id: "manage_shop", label: "Manage Shop", description: "Full shop management access" },
    { id: "view_reports", label: "View Reports", description: "Access to analytics and reports" },
    { id: "manage_staff", label: "Manage Staff", description: "Add/edit/remove staff members" },
    { id: "manage_subscription", label: "Manage Subscription", description: "Change plan and payment methods" },
    { id: "process_sales", label: "Process Sales", description: "Handle transactions and sales" },
    { id: "view_inventory", label: "View Inventory", description: "View product inventory" },
    { id: "manage_inventory", label: "Manage Inventory", description: "Add/edit/remove products" },
    { id: "view_customers", label: "View Customers", description: "Access customer data" },
    { id: "manage_customers", label: "Manage Customers", description: "Edit customer information" },
  ]

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all users across the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkActionDialogOpen(true)}>
            <IconUpload className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Invite Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Across all shops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Temporarily blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or shop..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="shop_owner">Shop Owner</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.shopName || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IconClock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{user.lastActive}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <Badge variant="outline" className="text-green-600">Enabled</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <IconEye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <IconEdit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
                          <IconShield className="mr-2 h-4 w-4" />
                          Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewActivity(user)}>
                          <IconClock className="mr-2 h-4 w-4" />
                          Activity Log
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "suspended" ? (
                          <DropdownMenuItem onClick={() => handleActivateUser(user)}>
                            <IconCheck className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        ) : user.status === "active" ? (
                          <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                            <IconBan className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <IconKey className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600"
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Role</Label>
                    <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                  </div>
                </div>

                {selectedUser.shopName && (
                  <div>
                    <Label className="text-muted-foreground">Shop</Label>
                    <p className="font-medium">{selectedUser.shopName}</p>
                  </div>
                )}

                {selectedUser.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p>{selectedUser.phone}</p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Security</Label>
                  <div className="mt-2 space-y-2 bg-muted/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Two-Factor Authentication</span>
                      <Badge variant={selectedUser.twoFactorEnabled ? "default" : "secondary"}>
                        {selectedUser.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Login Attempts</span>
                      <Badge variant={selectedUser.loginAttempts > 3 ? "destructive" : "outline"}>
                        {selectedUser.loginAttempts} failed
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Permissions</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedUser.permissions.map((perm) => (
                      <Badge key={perm} variant="outline">
                        {perm.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Activity</Label>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">Joined: {new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                    <p className="text-sm">Last Active: {selectedUser.lastActive}</p>
                  </div>
                </div>

                {selectedUser.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="mt-1 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded">
                      {selectedUser.notes}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={editFormData.role} 
                onValueChange={(value) => setEditFormData({...editFormData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="shop_owner">Shop Owner</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={editFormData.department}
                onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Set permissions for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4 py-4">
              {permissionsList.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPermissions([...selectedPermissions, permission.id])
                      } else {
                        setSelectedPermissions(selectedPermissions.filter(p => p !== permission.id))
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={permission.id} className="font-medium">
                      {permission.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Users Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Users</DialogTitle>
            <DialogDescription>
              Send invitations to new users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="Enter email addresses (one per line)"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with line breaks
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shop_owner">Shop Owner</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Send Welcome Email</Label>
              <div className="flex items-center space-x-2">
                <Switch id="welcome-email" defaultChecked />
                <Label htmlFor="welcome-email">Send welcome email with login instructions</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvites} disabled={isProcessing}>
              {isProcessing ? "Sending..." : "Send Invitations"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Log Sheet */}
      <Sheet open={activitySheetOpen} onOpenChange={setActivitySheetOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Activity Log</SheetTitle>
            <SheetDescription>
              Recent activity for {selectedUser?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 border-b pb-3">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Login successful</p>
                  <p className="text-xs text-muted-foreground">IP: 192.168.1.{100 + i}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Date.now() - i * 3600000).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Confirmation */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for suspending {selectedUser?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter suspension reason..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSuspend} className="bg-yellow-600">
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation */}
      <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate {selectedUser?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmActivate} className="bg-green-600">
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              A password reset email will be sent to {selectedUser?.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPasswordConfirm}>
              Send Reset Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              {selectedUsers.length} users selected
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleBulkAction("export")}
            >
              <IconDownload className="mr-2 h-4 w-4" />
              Export Selected Users
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleBulkAction("activate")}
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Activate Selected
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleBulkAction("suspend")}
            >
              <IconBan className="mr-2 h-4 w-4" />
              Suspend Selected
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-red-600"
              onClick={() => handleBulkAction("delete")}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}