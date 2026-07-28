"use client"

import { useState, useEffect } from "react"
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
  IconBuildingStore,
  IconClock,
  IconCheck,
  IconX,
  IconBan,
  IconKey,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { userService } from "@/lib/services/user.service"

const roleConfig: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "Admin", color: "bg-purple-500" },
  OWNER: { label: "Shop Owner", color: "bg-blue-500" },
  CASHIER: { label: "Staff", color: "bg-green-500" },
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-500" },
  inactive: { label: "Inactive", color: "bg-gray-500" },
  suspended: { label: "Suspended", color: "bg-red-500" },
}

function getRoleBadge(role: string) {
  const config = roleConfig[role] || { label: role, color: "bg-gray-500" }
  return <Badge className={config.color}>{config.label}</Badge>
}

function getStatusBadge(status: string) {
  const config = statusConfig[status] || { label: status, color: "bg-gray-500" }
  return <Badge className={config.color}>{config.label}</Badge>
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [suspensionReason, setSuspensionReason] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ fullName: "", email: "", role: "" })

  useEffect(() => {
    userService.getAll()
      .then(res => setUsers(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.ownedShops?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesRole = filterRole === "all" || user.role === filterRole
    const status = user.isActive ? "active" : "inactive"
    const matchesStatus = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setEditFormData({ fullName: user.fullName, email: user.email, role: user.role })
    setEditDialogOpen(true)
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleSuspendUser = (user: any) => {
    setSelectedUser(user)
    setSuspensionReason("")
    setSuspendDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return
    setIsProcessing(true)
    try {
      await userService.update(selectedUser.id, editFormData)
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editFormData } : u))
      setEditDialogOpen(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    setIsProcessing(true)
    try {
      await userService.delete(selectedUser.id)
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setDeleteDialogOpen(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmSuspend = async () => {
    if (!selectedUser || !suspensionReason.trim()) return
    setIsProcessing(true)
    try {
      await userService.update(selectedUser.id, { isActive: false })
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, isActive: false } : u))
      setSuspendDialogOpen(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleActivateUser = async (user: any) => {
    setIsProcessing(true)
    try {
      await userService.update(user.id, { isActive: true })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: true } : u))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all users across the platform</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : users.length}</div>
            <p className="text-xs text-muted-foreground">Across all shops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === "OWNER").length}</div>
            <p className="text-xs text-muted-foreground">Shop owners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cashiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === "CASHIER").length}</div>
            <p className="text-xs text-muted-foreground">Staff members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or shop..."
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
                  <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
                  <SelectItem value="OWNER">Shop Owner</SelectItem>
                  <SelectItem value="CASHIER">Staff</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const status = user.isActive ? "active" : "inactive"
                  const shopName = user.ownedShops?.[0]?.name || user.shop?.name || "-"
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(status)}</TableCell>
                      <TableCell>{shopName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconClock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
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
                            <DropdownMenuSeparator />
                            {user.isActive ? (
                              <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                                <IconBan className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivateUser(user)}>
                                <IconCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
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
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedUser.fullName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.fullName}</h3>
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
                    <div className="mt-1">{getStatusBadge(selectedUser.isActive ? "active" : "inactive")}</div>
                  </div>
                </div>
                {selectedUser.ownedShops?.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Owned Shops</Label>
                    <div className="mt-1 space-y-1">
                      {selectedUser.ownedShops.map((s: any) => (
                        <p key={s.id} className="font-medium">{s.name}</p>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Joined</Label>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editFormData.role} onValueChange={(v) => setEditFormData({ ...editFormData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
                  <SelectItem value="OWNER">Shop Owner</SelectItem>
                  <SelectItem value="CASHIER">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.fullName}? This action cannot be undone.
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

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {selectedUser?.fullName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSuspend} className="bg-yellow-600">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}