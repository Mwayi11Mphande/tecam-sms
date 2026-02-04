// app/shop-owner/staff/page.tsx
"use client"

import { useState } from "react"
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
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StaffActionModal } from "@/components/modal/StaffActionModal"
import { AddStaffModal } from "@/components/modal/AddStaffModal"

// Import the Add Staff Modal component

type StaffMember = {
  id: number
  name: string
  role: string
  email: string
  phone: string
  joinDate: string
  status: string
  avatar: string
  address?: string
  emergencyContact?: string
  department?: string
}

type ModalMode = 'view' | 'edit' | 'schedule' | 'delete'

export default function StaffManagementPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: 1, name: "Alex Johnson", role: "Manager", email: "alex@store.com", phone: "+1 (555) 123-4567", joinDate: "2023-06-15", status: "Active", avatar: "AJ", department: "Management" },
    { id: 2, name: "Sarah Williams", role: "Sales Associate", email: "sarah@store.com", phone: "+1 (555) 987-6543", joinDate: "2023-08-20", status: "Active", avatar: "SW", address: "123 Main St" },
    { id: 3, name: "Mike Chen", role: "Inventory Manager", email: "mike@store.com", phone: "+1 (555) 456-7890", joinDate: "2023-07-10", status: "On Leave", avatar: "MC", emergencyContact: "+1 (555) 111-2222" },
    { id: 4, name: "Emma Brown", role: "Cashier", email: "emma@store.com", phone: "+1 (555) 234-5678", joinDate: "2023-09-05", status: "Active", avatar: "EB" },
    { id: 5, name: "David Wilson", role: "Assistant Manager", email: "david@store.com", phone: "+1 (555) 876-5432", joinDate: "2023-05-22", status: "Active", avatar: "DW", department: "Sales" },
    { id: 6, name: "Lisa Martinez", role: "Sales Associate", email: "lisa@store.com", phone: "+1 (555) 345-6789", joinDate: "2023-10-15", status: "Inactive", avatar: "LM" },
  ])

  const [actionModalState, setActionModalState] = useState<{
    isOpen: boolean
    mode: ModalMode
    staff: StaffMember | null
  }>({
    isOpen: false,
    mode: 'view',
    staff: null
  })

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)

  const staffStats = {
    total: 6,
    active: 4,
    onLeave: 1,
    positions: ["Manager", "Sales Associate", "Inventory Manager", "Cashier", "Assistant Manager"]
  }

  const handleOpenModal = (mode: ModalMode, staff: StaffMember) => {
    setActionModalState({
      isOpen: true,
      mode,
      staff
    })
  }

  const handleCloseModal = () => {
    setActionModalState({
      isOpen: false,
      mode: 'view',
      staff: null
    })
  }

  const handleSaveStaff = (updatedStaff: StaffMember) => {
    setStaffMembers(prev => 
      prev.map(staff => 
        staff.id === updatedStaff.id ? updatedStaff : staff
      )
    )
    // Show success toast
    alert("Staff details updated successfully!")
  }

  const handleDeleteStaff = (staffId: number) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== staffId))
    // Show success toast
    alert("Staff member removed successfully!")
  }

  const handleAddStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    const newId = Math.max(...staffMembers.map(s => s.id)) + 1
    const staffToAdd: StaffMember = {
      ...newStaff,
      id: newId,
      avatar: newStaff.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    setStaffMembers(prev => [...prev, staffToAdd])
    setIsAddStaffModalOpen(false)
    alert("New staff member added successfully!")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your store staff and their roles
          </p>
        </div>
        <Button onClick={() => setIsAddStaffModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across all positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.active}</div>
            <p className="text-xs text-green-500">
              67% availability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.onLeave}</div>
            <p className="text-xs text-orange-500">
              17% of staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Different roles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff by name, role, or email..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Role
            </Button>
            <Button variant="outline">
              Schedule View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{staff.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-muted-foreground">ID: STF-{staff.id.toString().padStart(3, '0')}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      staff.role === "Manager" ? "default" :
                      staff.role === "Assistant Manager" ? "secondary" : "outline"
                    }>
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {staff.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-1 h-3 w-3" />
                        {staff.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {staff.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      staff.status === "Active" ? "default" :
                      staff.status === "On Leave" ? "secondary" : "outline"
                    }>
                      {staff.status}
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
                        <DropdownMenuItem onClick={() => handleOpenModal('view', staff)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenModal('edit', staff)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenModal('schedule', staff)}>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleOpenModal('delete', staff)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Staff
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

      {/* Staff Roles Section */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { role: "Manager", count: 1, permissions: ["Full access", "Staff management", "Financial reports"] },
              { role: "Assistant Manager", count: 1, permissions: ["Sales management", "Inventory access", "Customer service"] },
              { role: "Sales Associate", count: 2, permissions: ["Process sales", "Customer assistance", "Basic inventory"] },
              { role: "Inventory Manager", count: 1, permissions: ["Stock management", "Order placement", "Supplier coordination"] },
              { role: "Cashier", count: 1, permissions: ["Process payments", "Returns handling", "Basic reports"] },
            ].map((role) => (
              <Card key={role.role}>
                <CardHeader>
                  <CardTitle className="text-lg">{role.role}</CardTitle>
                  <div className="text-sm text-muted-foreground">{role.count} member(s)</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.permissions.map((permission) => (
                      <li key={permission} className="flex items-center text-sm">
                        <Shield className="mr-2 h-3 w-3 text-green-600" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Modal */}
      {actionModalState.staff && (
        <StaffActionModal
          isOpen={actionModalState.isOpen}
          onClose={handleCloseModal}
          mode={actionModalState.mode}
          staff={actionModalState.staff}
          onSave={handleSaveStaff}
          onDelete={handleDeleteStaff}
        />
      )}

      {/* Add Staff Modal - You need to create this component */}
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onAddStaff={handleAddStaff}
      />
    </div>
  )
}