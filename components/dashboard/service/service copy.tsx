"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Edit, 
  Check,
  X,
  Search,
  Clock,
  Calendar,
  User,
  FileText,
  DollarSign,
  Tag,
  Layers,
  ChevronLeft,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReceiptPDF } from "@/components/pdf/receipt/ReceiptPDF"

interface ServiceItem {
  id: string
  description: string
  category: string
  quantity: number
  unitPrice: number
  total: number
  date: string
  customerName?: string
  customerPhone?: string
  notes?: string
  status: 'pending' | 'completed' | 'invoiced'
  serviceId?: string
}

type ServiceCategory = 'stationery' | 'printing' | 'design' | 'consultation' | 'repair' | 'other'

export function ServicesPage() {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    // Sample data for testing
    {
      id: "1",
      description: "Document Printing",
      category: "printing",
      quantity: 10,
      unitPrice: 50,
      total: 500,
      date: new Date().toISOString().split('T')[0],
      customerName: "John Doe",
      customerPhone: "+265 991 234 567",
      notes: "Black and white printing",
      status: "completed",
      serviceId: "SRV-001"
    },
    {
      id: "2",
      description: "Business Card Design",
      category: "design",
      quantity: 1,
      unitPrice: 15000,
      total: 15000,
      date: new Date().toISOString().split('T')[0],
      customerName: "Jane Smith",
      customerPhone: "+265 992 345 678",
      status: "pending",
      serviceId: "SRV-002"
    }
  ])
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentDate, setCurrentDate] = useState("")
  const [selectedServiceForPrint, setSelectedServiceForPrint] = useState<ServiceItem | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    description: "",
    category: "stationery" as ServiceCategory,
    quantity: 1,
    unitPrice: 0,
    customerName: "",
    customerPhone: "",
    notes: "",
    status: "pending" as ServiceItem['status']
  })

  // Initialize current date
  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toISOString().split('T')[0]
    setCurrentDate(formattedDate)
  }, [])

  // Service categories
  const serviceCategories = [
    { value: 'stationery', label: 'Stationery Services' },
    { value: 'printing', label: 'Printing & Copying' },
    { value: 'design', label: 'Design Services' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'repair', label: 'Repair Services' },
    { value: 'other', label: 'Other Services' }
  ]

  // Filter services
  const filteredServices = serviceItems.filter(service => {
    const matchesSearch = 
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customerPhone?.includes(searchTerm) ||
      service.serviceId?.includes(searchTerm)
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || service.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate totals
  const calculateTotals = () => {
    const totals = filteredServices.reduce((acc, service) => {
      acc.pending += service.status === 'pending' ? service.total : 0
      acc.completed += service.status === 'completed' ? service.total : 0
      acc.total += service.total
      return acc
    }, { pending: 0, completed: 0, total: 0 })
    
    return totals
  }

  const totals = calculateTotals()

  // Handle form changes
  const handleFormChange = (field: keyof typeof serviceForm, value: any) => {
    setServiceForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Calculate total price
  const calculateTotal = () => {
    return serviceForm.quantity * serviceForm.unitPrice
  }

  // Reset form
  const resetForm = () => {
    setServiceForm({
      description: "",
      category: "stationery",
      quantity: 1,
      unitPrice: 0,
      customerName: "",
      customerPhone: "",
      notes: "",
      status: "pending"
    })
    setIsEditMode(false)
    setEditingServiceId(null)
  }

  // Generate service ID
  const generateServiceId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `SRV-${timestamp}-${random}`
  }

  // Add new service
  const handleAddService = () => {
    if (!serviceForm.description.trim()) {
      toast.error("Description is required", {
        description: "Please enter a description for the service",
      })
      return
    }

    if (serviceForm.unitPrice <= 0) {
      toast.error("Invalid price", {
        description: "Please enter a valid price",
      })
      return
    }

    const newService: ServiceItem = {
      id: generateServiceId(),
      serviceId: generateServiceId(),
      description: serviceForm.description,
      category: serviceForm.category,
      quantity: serviceForm.quantity,
      unitPrice: serviceForm.unitPrice,
      total: calculateTotal(),
      date: currentDate,
      customerName: serviceForm.customerName.trim() || undefined,
      customerPhone: serviceForm.customerPhone.trim() || undefined,
      notes: serviceForm.notes.trim() || undefined,
      status: serviceForm.status
    }

    setServiceItems(prev => [newService, ...prev])
    setIsAddServiceModalOpen(false)
    resetForm()
    
    toast.success("Service added successfully!", {
      description: `Service recorded for Mk ${formatAmount(newService.total)}`,
    })
  }

  // Edit service
  const handleEditService = (service: ServiceItem) => {
    setServiceForm({
      description: service.description,
      category: service.category as ServiceCategory,
      quantity: service.quantity,
      unitPrice: service.unitPrice,
      customerName: service.customerName || "",
      customerPhone: service.customerPhone || "",
      notes: service.notes || "",
      status: service.status
    })
    setEditingServiceId(service.id)
    setIsEditMode(true)
    setIsAddServiceModalOpen(true)
  }

  // Update service
  const handleUpdateService = () => {
    if (!serviceForm.description.trim()) {
      toast.error("Description is required")
      return
    }

    if (serviceForm.unitPrice <= 0) {
      toast.error("Invalid price")
      return
    }

    setServiceItems(prev => 
      prev.map(service => 
        service.id === editingServiceId 
          ? {
              ...service,
              description: serviceForm.description,
              category: serviceForm.category,
              quantity: serviceForm.quantity,
              unitPrice: serviceForm.unitPrice,
              total: calculateTotal(),
              customerName: serviceForm.customerName.trim() || undefined,
              customerPhone: serviceForm.customerPhone.trim() || undefined,
              notes: serviceForm.notes.trim() || undefined,
              status: serviceForm.status
            }
          : service
      )
    )

    setIsAddServiceModalOpen(false)
    resetForm()
    
    toast.success("Service updated successfully!")
  }

  // Delete service
  const handleDeleteService = (id: string) => {
    setServiceItems(prev => prev.filter(service => service.id !== id))
    toast.info("Service removed", {
      description: "Service has been deleted",
    })
  }

  // Update service status
  const handleUpdateStatus = (id: string, newStatus: ServiceItem['status']) => {
    setServiceItems(prev => 
      prev.map(service => 
        service.id === id ? { ...service, status: newStatus } : service
      )
    )
    
    const statusText = newStatus === 'completed' ? 'Completed' : 
                     newStatus === 'invoiced' ? 'Invoiced' : 'Pending'
    
    toast.info(`Status updated to ${statusText}`)
  }

  // Format currency
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get status badge
  const getStatusBadge = (status: ServiceItem['status']) => {
    const variants = {
      pending: { variant: "outline", color: "text-yellow-600 border-yellow-600" },
      completed: { variant: "default", color: "text-green-600" },
      invoiced: { variant: "secondary", color: "text-blue-600" }
    }
    
    const variant = variants[status]
    
    return (
      <Badge variant={variant.variant as any} className={`${variant.color} capitalize`}>
        {status}
      </Badge>
    )
  }

  // Quick add presets
  const quickAddPresets = [
    { description: "Document Printing", category: "printing", price: 500 },
    { description: "Photocopy Service", category: "printing", price: 100 },
    { description: "Business Card Design", category: "design", price: 15000 },
    { description: "Flyer Design", category: "design", price: 25000 },
    { description: "Lamination Service", category: "stationery", price: 2000 },
    { description: "Binding Service", category: "stationery", price: 3000 },
    { description: "Consultation Hour", category: "consultation", price: 20000 },
    { description: "Computer Repair", category: "repair", price: 35000 }
  ]

  const handleQuickAdd = (preset: typeof quickAddPresets[0]) => {
    setServiceForm(prev => ({
      ...prev,
      description: preset.description,
      category: preset.category as ServiceCategory,
      unitPrice: preset.price
    }))
    setIsAddServiceModalOpen(true)
  }

  // Handle print service receipt
  const handlePrintService = (service: ServiceItem) => {
    setSelectedServiceForPrint(service)
    setShowReceiptModal(true)
    
    toast.info("Opening receipt...", {
      description: `Service: ${service.description}`,
      duration: 2000,
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Layers className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-foreground">
                  Services Management
                </h1>
                <p className="text-sm lg:text-base text-muted-foreground hidden sm:block">
                  Record and manage services performed
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={() => setIsAddServiceModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Services</p>
                  <p className="text-2xl font-bold">Mk {formatAmount(totals.pending)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Services</p>
                  <p className="text-2xl font-bold">Mk {formatAmount(totals.completed)}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">Mk {formatAmount(totals.total)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Quick Actions & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Add Presets */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Quick Add
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {quickAddPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleQuickAdd(preset)}
                    >
                      <span className="truncate">{preset.description}</span>
                      <Badge variant="secondary" className="ml-auto">
                        Mk {formatAmount(preset.price)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div>
                  <Label htmlFor="category-filter">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {serviceCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="invoiced">Invoiced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date-filter">Date</Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedStatus("all")
                    toast.info("Filters cleared")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search services, customers, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Services Table */}
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center h-32">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-12 w-12 mb-2 opacity-50" />
                              <p>No services found</p>
                              <p className="text-sm">Add your first service to get started</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-mono text-xs">
                              {service.serviceId}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{service.description}</p>
                                {service.notes && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {service.notes}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {service.customerName ? (
                                <div>
                                  <p className="font-medium">{service.customerName}</p>
                                  {service.customerPhone && (
                                    <p className="text-xs text-muted-foreground">
                                      {service.customerPhone}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Walk-in</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {service.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(service.date)}
                            </TableCell>
                            <TableCell className="font-bold">
                              Mk {formatAmount(service.total)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(service.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePrintService(service)}
                                >
                                  <Printer className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <Select
                                  value={service.status}
                                  onValueChange={(value: ServiceItem['status']) => 
                                    handleUpdateStatus(service.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="invoiced">Invoiced</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Service Receipt
            </DialogTitle>
            <DialogDescription>
              Service ID: {selectedServiceForPrint?.serviceId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedServiceForPrint && (
            <div className="space-y-4">
              <ReceiptPDF
                services={[selectedServiceForPrint]}
                subtotal={selectedServiceForPrint.total}
                tax={selectedServiceForPrint.total * 0.08}
                total={selectedServiceForPrint.total * 1.08}
                paymentMethod="cash"
                transactionId={selectedServiceForPrint.serviceId || `SRV-${Date.now().toString().slice(-6)}`}
                customerInfo={{
                  name: selectedServiceForPrint.customerName,
                  phone: selectedServiceForPrint.customerPhone
                }}
              />
              
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Service Date: {formatDate(selectedServiceForPrint.date)}</p>
                  <p>• Category: {selectedServiceForPrint.category}</p>
                  <p>• Quantity: {selectedServiceForPrint.quantity}</p>
                  {selectedServiceForPrint.notes && (
                    <p>• Notes: {selectedServiceForPrint.notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReceiptModal(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Service Modal */}
      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {isEditMode ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              Enter details of the service performed
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Description */}
            <div>
              <Label htmlFor="description">Service Description *</Label>
              <Textarea
                id="description"
                placeholder="e.g., Document printing, Design work, Consultation..."
                value={serviceForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={serviceForm.category} 
                onValueChange={(value: ServiceCategory) => handleFormChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={serviceForm.quantity}
                  onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Price (Mk) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={serviceForm.unitPrice}
                  onChange={(e) => handleFormChange('unitPrice', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            {/* Total Display */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-bold">Mk {formatAmount(calculateTotal())}</span>
              </div>
            </div>
            
            {/* Customer Information */}
            <Separator />
            <h4 className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information (Optional)
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Full name"
                  value={serviceForm.customerName}
                  onChange={(e) => handleFormChange('customerName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  placeholder="+265 XXX XXX XXX"
                  value={serviceForm.customerPhone}
                  onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                />
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or details..."
                value={serviceForm.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={2}
              />
            </div>
            
            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={serviceForm.status} 
                onValueChange={(value: ServiceItem['status']) => handleFormChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="invoiced">Invoiced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddServiceModalOpen(false)
                resetForm()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={isEditMode ? handleUpdateService : handleAddService}
              className="flex-1"
            >
              {isEditMode ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Service
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}