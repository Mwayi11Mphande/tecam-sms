"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Printer,
  Share2,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  DownloadCloud,
  FileText,
  PieChart,
  Activity,
  Target,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  BarChart,
  LineChart,
  Layers
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Sample data interface
interface ServiceSale {
  id: string
  serviceId: string
  date: string
  customer: string
  phone?: string
  serviceDescription: string
  category: string
  quantity: number
  unitPrice: number
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  notes?: string
}

interface ServiceSummary {
  period: string
  totalServices: number
  totalRevenue: number
  averageServiceValue: number
  completedServices: number
  pendingServices: number
  topCategory: string
  revenueGrowth: number
  serviceGrowth: number
}

export default function ShopOwnerServicesViewPage() {
  // State for filters
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('today')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list')

  // Sample service data
  const [serviceSales, setServiceSales] = useState<ServiceSale[]>([
    {
      id: "1",
      serviceId: "SRV-2024-001",
      date: new Date().toISOString().split('T')[0],
      customer: "John Smith",
      phone: "+265 991 234 567",
      serviceDescription: "Business Card Design & Printing",
      category: "design",
      quantity: 1,
      unitPrice: 15000,
      amount: 15000,
      status: "completed",
      notes: "Premium card stock"
    },
    {
      id: "2",
      serviceId: "SRV-2024-002",
      date: new Date().toISOString().split('T')[0],
      customer: "Sarah Johnson",
      phone: "+265 992 345 678",
      serviceDescription: "Document Printing (100 pages)",
      category: "printing",
      quantity: 100,
      unitPrice: 50,
      amount: 5000,
      status: "completed",
      notes: "Double-sided printing"
    },
    {
      id: "3",
      serviceId: "SRV-2024-003",
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      customer: "Mike Wilson",
      phone: "+265 993 456 789",
      serviceDescription: "Laptop Repair Service",
      category: "repair",
      quantity: 1,
      unitPrice: 35000,
      amount: 35000,
      status: "completed"
    },
    {
      id: "4",
      serviceId: "SRV-2024-004",
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      customer: "Emma Davis",
      serviceDescription: "Consultation - Business Setup",
      category: "consultation",
      quantity: 2,
      unitPrice: 10000,
      amount: 20000,
      status: "pending"
    },
    {
      id: "5",
      serviceId: "SRV-2024-005",
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
      customer: "Robert Brown",
      phone: "+265 994 567 890",
      serviceDescription: "Flyer Design & Printing",
      category: "design",
      quantity: 1,
      unitPrice: 25000,
      amount: 25000,
      status: "completed"
    },
    {
      id: "6",
      serviceId: "SRV-2024-006",
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
      customer: "Lisa Anderson",
      serviceDescription: "Document Binding (50 copies)",
      category: "stationery",
      quantity: 50,
      unitPrice: 300,
      amount: 15000,
      status: "completed"
    },
    {
      id: "7",
      serviceId: "SRV-2024-007",
      date: new Date(Date.now() - 345600000).toISOString().split('T')[0], // 4 days ago
      customer: "David Lee",
      serviceDescription: "Photocopy Service",
      category: "printing",
      quantity: 500,
      unitPrice: 10,
      amount: 5000,
      status: "cancelled"
    },
    {
      id: "8",
      serviceId: "SRV-2024-008",
      date: new Date(Date.now() - 432000000).toISOString().split('T')[0], // 5 days ago
      customer: "Maria Garcia",
      phone: "+265 995 678 901",
      serviceDescription: "Website Consultation",
      category: "consultation",
      quantity: 1,
      unitPrice: 20000,
      amount: 20000,
      status: "completed"
    },
  ])

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'printing', label: 'Printing & Copying' },
    { value: 'design', label: 'Design Services' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'repair', label: 'Repair Services' },
    { value: 'stationery', label: 'Stationery Services' },
    { value: 'other', label: 'Other Services' }
  ]

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  // Format amount
  const formatAmount = (amount: number) => {
    return `Mk ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
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

  // Get period label - MOVE THIS BEFORE calculateSummary
  const getPeriodLabel = () => {
    switch(timeRange) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      case 'custom': return 'Custom Range'
      default: return 'Today'
    }
  }

  // Get status badge
  const getStatusBadge = (status: ServiceSale['status']) => {
    const variants = {
      completed: { variant: "default", text: "Completed", icon: CheckCircle },
      pending: { variant: "secondary", text: "Pending", icon: Clock },
      cancelled: { variant: "destructive", text: "Cancelled", icon: AlertCircle }
    }
    
    const variant = variants[status]
    const Icon = variant.icon
    
    return (
      <Badge variant={variant.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {variant.text}
      </Badge>
    )
  }

  // Get category badge
  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      printing: "bg-blue-100 text-blue-800 border-blue-200",
      design: "bg-purple-100 text-purple-800 border-purple-200",
      consultation: "bg-green-100 text-green-800 border-green-200",
      repair: "bg-orange-100 text-orange-800 border-orange-200",
      stationery: "bg-yellow-100 text-yellow-800 border-yellow-200",
      other: "bg-gray-100 text-gray-800 border-gray-200"
    }
    
    return (
      <Badge variant="outline" className={`${colors[category] || colors.other} capitalize`}>
        {category}
      </Badge>
    )
  }

  // Calculate summary based on time range - MOVED AFTER getPeriodLabel
  const calculateSummary = (): ServiceSummary => {
    const now = new Date()
    let filtered = [...serviceSales]
    
    // Filter by time range
    switch(timeRange) {
      case 'today':
        const today = now.toISOString().split('T')[0]
        filtered = filtered.filter(sale => sale.date === today)
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(sale => new Date(sale.date) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        filtered = filtered.filter(sale => new Date(sale.date) >= monthAgo)
        break
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        filtered = filtered.filter(sale => new Date(sale.date) >= yearAgo)
        break
      case 'custom':
        if (startDate && endDate) {
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.date)
            return saleDate >= startDate && saleDate <= endDate
          })
        }
        break
    }
    
    // Apply additional filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter)
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(sale => sale.category === categoryFilter)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(sale => 
        sale.customer.toLowerCase().includes(query) ||
        sale.serviceDescription.toLowerCase().includes(query) ||
        sale.serviceId.toLowerCase().includes(query) ||
        sale.phone?.includes(query)
      )
    }

    // Calculate totals
    const totalServices = filtered.length
    const totalRevenue = filtered.reduce((sum, sale) => sum + sale.amount, 0)
    const averageServiceValue = totalServices > 0 ? totalRevenue / totalServices : 0
    const completedServices = filtered.filter(s => s.status === 'completed').length
    const pendingServices = filtered.filter(s => s.status === 'pending').length
    
    // Find top category
    const categoryCounts = filtered.reduce((acc, sale) => {
      acc[sale.category] = (acc[sale.category] || 0) + sale.amount
      return acc
    }, {} as Record<string, number>)
    
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

    return {
      period: getPeriodLabel(), // Now this will work because getPeriodLabel is defined above
      totalServices,
      totalRevenue,
      averageServiceValue,
      completedServices,
      pendingServices,
      topCategory,
      revenueGrowth: 12.5, // Mock growth percentage
      serviceGrowth: 8.2
    }
  }

  const summary = calculateSummary()

  // Get filtered services for display
  const filteredServices = () => {
    let filtered = [...serviceSales]
    
    // Time range filter
    const now = new Date()
    switch(timeRange) {
      case 'today':
        const today = now.toISOString().split('T')[0]
        filtered = filtered.filter(sale => sale.date === today)
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(sale => new Date(sale.date) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        filtered = filtered.filter(sale => new Date(sale.date) >= monthAgo)
        break
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        filtered = filtered.filter(sale => new Date(sale.date) >= yearAgo)
        break
      case 'custom':
        if (startDate && endDate) {
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.date)
            return saleDate >= startDate && saleDate <= endDate
          })
        }
        break
    }
    
    // Additional filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter)
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(sale => sale.category === categoryFilter)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(sale => 
        sale.customer.toLowerCase().includes(query) ||
        sale.serviceDescription.toLowerCase().includes(query) ||
        sale.serviceId.toLowerCase().includes(query) ||
        sale.phone?.includes(query)
      )
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Chart data
  const chartData = [
    { name: 'Mon', services: 4, revenue: 45000 },
    { name: 'Tue', services: 6, revenue: 62000 },
    { name: 'Wed', services: 8, revenue: 78000 },
    { name: 'Thu', services: 5, revenue: 52000 },
    { name: 'Fri', services: 7, revenue: 68000 },
    { name: 'Sat', services: 9, revenue: 85000 },
    { name: 'Sun', services: 3, revenue: 32000 },
  ]

  const categoryData = [
    { name: 'Printing', value: 25, color: '#3b82f6' },
    { name: 'Design', value: 35, color: '#8b5cf6' },
    { name: 'Consultation', value: 20, color: '#10b981' },
    { name: 'Repair', value: 15, color: '#f97316' },
    { name: 'Stationery', value: 5, color: '#f59e0b' },
  ]

  // Handle export
  const handleExport = () => {
    toast.success("Export initiated", {
      description: "Service data will be downloaded shortly",
      duration: 3000,
    })
  }

  // Handle refresh
  const handleRefresh = () => {
    toast.info("Refreshing service data", {
      description: "Fetching latest service records",
      duration: 2000,
    })
  }

  // Handle print
  const handlePrint = (service: ServiceSale) => {
    toast.info("Printing receipt", {
      description: `Receipt for ${service.serviceId}`,
      duration: 2000,
    })
  }

  // Handle view details
  const handleViewDetails = (service: ServiceSale) => {
    toast.info("Viewing service details", {
      description: `Service: ${service.serviceDescription}`,
      duration: 2000,
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Services Overview</h1>
              <p className="text-muted-foreground">
                Track and analyze all service transactions
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Select value={viewMode} onValueChange={(value: 'list' | 'chart') => setViewMode(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  List View
                </div>
              </SelectItem>
              <SelectItem value="chart">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Chart View
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Period:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={timeRange === 'today' ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange('today')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Today
              </Button>
              <Button
                variant={timeRange === 'week' ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                This Week
              </Button>
              <Button
                variant={timeRange === 'month' ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                This Month
              </Button>
              <Button
                variant={timeRange === 'year' ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange('year')}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                This Year
              </Button>
              <Button
                variant={timeRange === 'custom' ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange('custom')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Custom
              </Button>
            </div>
            
            {timeRange === 'custom' && (
              <div className="flex items-center gap-4 ml-auto">
                <div className="space-y-1">
                  <Label htmlFor="start-date">From</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate?.toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-[150px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end-date">To</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate?.toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-[150px]"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalServices}</div>
            <div className="flex items-center text-xs mt-1">
              {summary.serviceGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{summary.serviceGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{summary.serviceGrowth}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-2">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mk {summary.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              {summary.revenueGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{summary.revenueGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{summary.revenueGrowth}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-2">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completedServices}</div>
            <p className="text-xs text-muted-foreground">
              {summary.pendingServices} pending services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{summary.topCategory}</div>
            <p className="text-xs text-muted-foreground">
              Highest revenue generating category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search services by customer, description, or ID..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setCategoryFilter("all")
                setTimeRange('today')
                setStartDate(new Date())
                setEndDate(new Date())
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredServices().length} services for <span className="font-medium">{summary.period}</span>
            {categoryFilter !== 'all' && ` in ${categories.find(c => c.value === categoryFilter)?.label}`}
            {statusFilter !== 'all' && ` (${statusOptions.find(s => s.value === statusFilter)?.label})`}
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Service Transactions</CardTitle>
              <CardDescription>
                Detailed view of all service transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-32">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Layers className="h-12 w-12 mb-2 opacity-50" />
                        <p>No services found</p>
                        <p className="text-sm">Try adjusting your filters or time range</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices().map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {service.serviceId}
                      </TableCell>
                      <TableCell>
                        {formatDate(service.date)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.customer}</div>
                          {service.phone && (
                            <div className="text-xs text-muted-foreground">{service.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{service.serviceDescription}</div>
                          {service.notes && (
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {service.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(service.category)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatAmount(service.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(service.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(service)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePrint(service)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
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

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Service Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(summary.averageServiceValue)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Average revenue per service
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalServices > 0 
                ? `${Math.round((summary.completedServices / summary.totalServices) * 100)}%` 
                : "0%"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Services completed successfully
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingServices}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting completion or payment
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}