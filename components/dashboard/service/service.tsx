"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Printer, Save, Edit, Check, X, Search, Clock, Calendar, User, FileText, DollarSign, Tag, Layers, ChevronLeft, ArrowLeft } from "lucide-react"
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
import { ServiceSummaryCards } from "./components/ServiceSummaryCards"
import { ServiceFilters } from "./components/ServiceFilters"
import { ServiceTable } from "./components/ServicesTable"
import { ServiceFormModal } from "./modals/ServiceFormModal"
import { ServiceReceiptModal } from "./modals/ServiceReceiptModal"
import { useSalesStore } from "@/stores/sales/useSalesStore"

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
  const { sales, isLoading, error, fetchSales } = useSalesStore()

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

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
        <ServiceSummaryCards
          pending={totals.pending}
          completed={totals.completed}
          total={totals.total}
          formatAmount={formatAmount}
        />
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
            <ServiceFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              serviceCategories={serviceCategories}
              onClear={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedStatus("all")
                toast.info("Filters cleared")
              }}
            />
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
                  <ServiceTable
                    services={filteredServices}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    onPrint={handlePrintService}
                    onStatusChange={handleUpdateStatus}
                    formatAmount={formatAmount}
                    formatDate={formatDate}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ServiceReceiptModal
        open={showReceiptModal}
        onOpenChange={setShowReceiptModal}
        service={selectedServiceForPrint}
        formatDate={formatDate}
      />

      {/* Add/Edit Service Modal */}
      <ServiceFormModal
        open={isAddServiceModalOpen}
        onOpenChange={setIsAddServiceModalOpen}
        isEditMode={isEditMode}
        serviceForm={serviceForm}
        serviceCategories={serviceCategories}
        calculateTotal={calculateTotal}
        formatAmount={formatAmount}
        onFormChange={handleFormChange}
        onCancel={() => {
          setIsAddServiceModalOpen(false)
          resetForm()
        }}
        onSubmit={
          isEditMode
            ? handleUpdateService
            : handleAddService
        }
      />
    </div>
  )
}