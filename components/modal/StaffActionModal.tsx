// app/shop-owner/staff/components/StaffActionModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  User,
  Mail,
  Phone,
  CalendarIcon,
  Shield,
  Clock,
  Briefcase,
  MapPin,
  AlertTriangle,
  Save,
  Trash2,
  Eye,
  Edit
} from "lucide-react"
import { SetStateAction, useState } from "react"

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

interface StaffActionModalProps {
  isOpen: boolean
  onClose: () => void
  mode: ModalMode
  staff: StaffMember
  onSave?: (updatedStaff: StaffMember) => void
  onDelete?: (staffId: number) => void
}

export function StaffActionModal({
  isOpen,
  onClose,
  mode,
  staff,
  onSave,
  onDelete
}: StaffActionModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedStaff, setEditedStaff] = useState<StaffMember>(staff)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)

  const handleInputChange = (field: keyof StaffMember, value: string) => {
    setEditedStaff(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedStaff)
    }
    onClose()
  }

  const handleDelete = () => {
    if (isDeleteConfirm && onDelete) {
      onDelete(staff.id)
      onClose()
    } else {
      setIsDeleteConfirm(true)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'view': return "Staff Profile"
      case 'edit': return "Edit Staff Details"
      case 'schedule': return "Schedule Management"
      case 'delete': return "Remove Staff Member"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case 'view': return "View and manage staff profile information"
      case 'edit': return "Update staff member details and permissions"
      case 'schedule': return "Manage work schedule and availability"
      case 'delete': return "Remove staff member from the system"
    }
  }

  const renderViewMode = () => (
    <div className="space-y-6">
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-lg">{staff.avatar}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">{staff.name}</h3>
            <Badge variant={staff.status === "Active" ? "default" : "secondary"}>
              {staff.status}
            </Badge>
          </div>
          <Badge variant="outline" className="text-sm">
            {staff.role}
          </Badge>
          <p className="text-sm text-muted-foreground">
            ID: STF-{staff.id.toString().padStart(3, '0')}
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid gap-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="space-y-2 pl-6">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{staff.phone}</span>
            </div>
            {staff.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{staff.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Employment Details */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Employment Details
          </h4>
          <div className="space-y-2 pl-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
              <span>Joined: {staff.joinDate}</span>
            </div>
            {staff.department && (
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span>Department: {staff.department}</span>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact (if available) */}
        {staff.emergencyContact && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergency Contact
            </h4>
            <p className="pl-6">{staff.emergencyContact}</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderEditMode = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>{staff.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatarInitials">Avatar Initials</Label>
          <Input
            id="avatarInitials"
            value={editedStaff.avatar}
            onChange={(e) => handleInputChange('avatar', e.target.value)}
            maxLength={2}
            className="w-20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            <User className="inline h-4 w-4 mr-1" />
            Full Name
          </Label>
          <Input
            id="fullName"
            value={editedStaff.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={editedStaff.role}
            onValueChange={(value) => handleInputChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
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
          <Label htmlFor="email">
            <Mail className="inline h-4 w-4 mr-1" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={editedStaff.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone
          </Label>
          <Input
            id="phone"
            value={editedStaff.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={editedStaff.status}
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="joinDate">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Join Date
          </Label>
          <Input
            id="joinDate"
            type="date"
            value={editedStaff.joinDate}
            onChange={(e) => handleInputChange('joinDate', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={editedStaff.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          value={editedStaff.emergencyContact || ''}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
        />
      </div>
    </div>
  )

  const renderScheduleMode = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        <h4 className="font-medium">Schedule for {staff.name}</h4>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                required
                selected={selectedDate}
                onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Shift Time</Label>
          <Select defaultValue="9-5">
            <SelectTrigger>
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-2">Morning Shift (6 AM - 2 PM)</SelectItem>
              <SelectItem value="9-5">Day Shift (9 AM - 5 PM)</SelectItem>
              <SelectItem value="2-10">Evening Shift (2 PM - 10 PM)</SelectItem>
              <SelectItem value="10-6">Night Shift (10 PM - 6 AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          placeholder="Add any notes about this schedule..."
          rows={3}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h5 className="font-medium mb-2">Upcoming Shifts</h5>
        <div className="space-y-2">
          {['2024-01-15', '2024-01-16', '2024-01-17'].map((date, index) => (
            <div key={date} className="flex items-center justify-between p-2 hover:bg-muted rounded">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                <span>{date}</span>
              </div>
              <Badge variant="outline">
                {index === 0 ? 'Day Shift' : 'Morning Shift'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDeleteMode = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div>
          <h4 className="font-medium text-red-600">Warning: Staff Removal</h4>
          <p className="text-sm text-red-600">
            This action cannot be undone. All associated data will be permanently deleted.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Avatar>
          <AvatarFallback>{staff.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{staff.name}</h4>
          <p className="text-sm text-muted-foreground">{staff.role} • {staff.email}</p>
        </div>
      </div>

      {isDeleteConfirm && (
        <div className="space-y-2">
          <Label htmlFor="confirmDelete" className="text-red-600">
            Type "DELETE" to confirm removal
          </Label>
          <Input
            id="confirmDelete"
            placeholder="Type DELETE here"
            className="border-red-300"
          />
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (mode) {
      case 'view': return renderViewMode()
      case 'edit': return renderEditMode()
      case 'schedule': return renderScheduleMode()
      case 'delete': return renderDeleteMode()
    }
  }

  const renderFooter = () => {
    switch (mode) {
      case 'view':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.location.hash = `#edit=${staff.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </DialogFooter>
        )
      case 'edit':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        )
      case 'schedule':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Schedule
            </Button>
          </DialogFooter>
        )
      case 'delete':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleteConfirm ? 'Confirm Removal' : 'Remove Staff'}
            </Button>
          </DialogFooter>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'view' && <Eye className="h-5 w-5" />}
            {mode === 'edit' && <Edit className="h-5 w-5" />}
            {mode === 'schedule' && <CalendarIcon className="h-5 w-5" />}
            {mode === 'delete' && <Trash2 className="h-5 w-5" />}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  )
}