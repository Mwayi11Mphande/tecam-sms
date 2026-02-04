// app/shop-owner/staff/components/AddStaffModal.tsx
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, Mail, Key, Phone, Calendar, X, User } from "lucide-react"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onAddStaff: (staff: {
    name: string
    role: string
    email: string
    phone: string
    joinDate: string
    status: string
    avatar: string
  }) => void
}

export function AddStaffModal({ isOpen, onClose, onAddStaff }: AddStaffModalProps) {
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    joinDate: new Date().toISOString().split('T')[0],
    status: "Active"
  })

  const handleInputChange = (field: string, value: string) => {
    setNewStaffData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    onAddStaff({
      ...newStaffData,
      avatar: newStaffData.name.split(' ').map(n => n[0]).join('').toUpperCase() || "ST"
    })
    
    // Reset form
    setNewStaffData({
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      joinDate: new Date().toISOString().split('T')[0],
      status: "Active"
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Staff Member
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new staff member to your store.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={newStaffData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="staff@store.com"
              value={newStaffData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a secure password"
              value={newStaffData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters with letters and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={newStaffData.role}
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                <SelectItem value="Sales Associate">Sales Associate</SelectItem>
                <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                <SelectItem value="Cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={newStaffData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Join Date
            </Label>
            <Input
              id="joinDate"
              type="date"
              value={newStaffData.joinDate}
              onChange={(e) => handleInputChange("joinDate", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newStaffData.name || !newStaffData.email || !newStaffData.password || !newStaffData.role}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Staff Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}