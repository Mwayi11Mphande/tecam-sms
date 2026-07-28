"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Clock,
  Eye,
  Edit,
  MoreVertical,
  CalendarDays,
  Trash2,
  Key,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddStaffModal } from "@/components/modal/AddStaffModal"
import { userService } from "@/lib/services/user.service"

export default function StaffManagementPage() {
  const [staffMembers, setStaffMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [passwordResetModal, setPasswordResetModal] = useState<{ open: boolean; staff: any }>({ open: false, staff: null })
  const [newPassword, setNewPassword] = useState("")
  const [resetting, setResetting] = useState(false)

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await userService.getStaff()
      setStaffMembers(res.data || [])
    } catch (err) {
      console.error("Failed to load staff:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStaff() }, [])

  const staffStats = {
    total: staffMembers.length,
    active: staffMembers.filter((s: any) => s.isActive).length,
  }

  const handleAddStaff = async (data: { fullName: string; email: string; password: string }) => {
    try {
      await userService.createCashier({ fullName: data.fullName, email: data.email, password: data.password })
      await fetchStaff()
      setIsAddStaffModalOpen(false)
    } catch (err: any) {
      alert(err.message || "Failed to add staff member")
    }
  }

  const handleResetPassword = async () => {
    if (!passwordResetModal.staff || !newPassword) return
    setResetting(true)
    try {
      await userService.resetPassword(passwordResetModal.staff.id, newPassword)
      setPasswordResetModal({ open: false, staff: null })
      setNewPassword("")
      alert("Password reset successfully")
    } catch (err: any) {
      alert(err.message || "Failed to reset password")
    } finally {
      setResetting(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96">Loading staff...</div>

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your store staff and their roles</p>
        </div>
        <Button onClick={() => setIsAddStaffModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.active}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff by name or email..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Role
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          {staffMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No staff members yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Add your first staff member to get started.
              </p>
              <Button onClick={() => setIsAddStaffModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff: any) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {(staff.fullName || "ST").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staff.fullName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{staff.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {staff.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={staff.isActive ? "default" : "secondary"}>
                        {staff.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPasswordResetModal({ open: true, staff })}>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onAddStaff={handleAddStaff}
      />

      <Dialog open={passwordResetModal.open} onOpenChange={(open) => !open && setPasswordResetModal({ open: false, staff: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for {passwordResetModal.staff?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The staff member can change this after logging in.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPasswordResetModal({ open: false, staff: null }); setNewPassword("") }}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resetting || !newPassword}>
              {resetting ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
