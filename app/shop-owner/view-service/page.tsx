"use client"

import { useState, useEffect, useMemo } from "react"
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
import { serviceApi } from "@/lib/services/service.service"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

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
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('today')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list')

  const [serviceSales, setServiceSales] = useState<ServiceSale[]>([])
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (!userStr) return
        const user = JSON.parse(userStr)
        const shopId = user.shopId || user.shop?.id
        if (!shopId) return

        const [servicesRes, salesRes] = await Promise.all([
          serviceApi.getAll(shopId),
          saleService.getAll({ shopId }),
        ])

        setServices(servicesRes.data || [])

        const sales = salesRes.data || []
        const mapped: ServiceSale[] = []

        sales.forEach((sale: any) => {
          const items = sale.items || []
          items.forEach((item: any) => {
            if (item.type === "service") {
              mapped.push({
                id: sale.id,
                serviceId: item.serviceId || sale.invoiceNo || `SRV-${sale.id}`,
                date: new Date(sale.createdAt || sale.date).toISOString().split("T")[0],
                customer: sale.customerName || sale.customer || "Unknown",
                phone: sale.customerPhone || sale.phone,
                serviceDescription: item.name || item.description,
                category: item.category || "other",
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                amount: (item.unitPrice || 0) * (item.quantity || 1),
                status: sale.status === "completed" ? "completed" : sale.status === "cancelled" ? "cancelled" : "pending",
                notes: item.notes,
              })
            }
          })
        })

        setServiceSales(mapped)
      } catch (err: any) {
        toast.error("Failed to load service data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const categories = useMemo(() => {
    const unique = new Set(serviceSales.map(s => s.category))
    const catMap: Record<string, string> = {
      printing: "Printing & Copying",
      design: "Design Services",
      consultation: "Consultation",
      repair: "Repair Services",
      stationery: "Stationery Services",
      other: "Other Services"
    }
    return [
      { value: 'all', label: 'All Categories' },
      ...Array.from(unique).map(c => ({
        value: c,
        label: catMap[c] || c.charAt(0).toUpperCase() + c.slice(1)
      }))
    ]
  }, [serviceSales])

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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

  const calculateSummary = (): ServiceSummary => {
    const now = new Date()
    let filtered = [...serviceSales]
    
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

    const totalServices = filtered.length
    const totalRevenue = filtered.reduce((sum, sale) => sum + sale.amount, 0)
    const averageServiceValue = totalServices > 0 ? totalRevenue / totalServices : 0
    const completedServices = filtered.filter(s => s.status === 'completed').length
    const pendingServices = filtered.filter(s => s.status === 'pending').length
    
    const categoryCounts = filtered.reduce((acc, sale) => {
      acc[sale.category] = (acc[sale.category] || 0) + sale.amount
      return acc
    }, {} as Record<string, number>)
    
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

    return {
      period: getPeriodLabel(),
      totalServices,
      totalRevenue,
      averageServiceValue,
      completedServices,
      pendingServices,
      topCategory,
      revenueGrowth: 0,
      serviceGrowth: 0
    }
  }

  const summary = calculateSummary()

  const filteredServices = () => {
    let filtered = [...serviceSales]
    
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

  const chartData = (() => {
    const dayMap: Record<string, { services: number; revenue: number }> = {}
    serviceSales.forEach(sale => {
      const dayName = new Date(sale.date).toLocaleDateString("en-US", { weekday: "short" })
      if (!dayMap[dayName]) dayMap[dayName] = { services: 0, revenue: 0 }
      dayMap[dayName].services += sale.quantity
      dayMap[dayName].revenue += sale.amount
    })
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
      name: day,
      services: dayMap[day]?.services || 0,
      revenue: dayMap[day]?.revenue || 0,
    }))
  })()

  const categoryData = (() => {
    const catMap: Record<string, number> = {}
    const colorMap: Record<string, string> = {
      printing: "#3b82f6", design: "#8b5cf6", consultation: "#10b981",
      repair: "#f97316", stationery: "#f59e0b", other: "#6b7280",
    }
    serviceSales.forEach(sale => {
      catMap[sale.category] = (catMap[sale.category] || 0) + sale.amount
    })
    const total = Object.values(catMap).reduce((sum, v) => sum + v, 0)
    return Object.entries(catMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: colorMap[name] || "#6b7280",
    }))
  })()

  const handleExport = () => {
    const csv = [
      ["Service ID","Date","Customer","Description","Category","Quantity","Unit Price","Amount","Status"].join(","),
      ...serviceSales.map(s =>
        [s.serviceId, s.date, s.customer, `"${s.serviceDescription}"`, s.category, s.quantity, s.unitPrice, s.amount, s.status].join(",")
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `service-sales-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Export completed", { duration: 3000 })
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) return
      const user = JSON.parse(userStr)
      const shopId = user.shopId || user.shop?.id
      if (!shopId) return

      const [servicesRes, salesRes] = await Promise.all([
        serviceApi.getAll(shopId),
        saleService.getAll({ shopId }),
      ])

      setServices(servicesRes.data || [])

      const sales = salesRes.data || []
      const mapped: ServiceSale[] = []

      sales.forEach((sale: any) => {
        const items = sale.items || []
        items.forEach((item: any) => {
          if (item.type === "service") {
            mapped.push({
              id: sale.id,
              serviceId: item.serviceId || sale.invoiceNo || `SRV-${sale.id}`,
              date: new Date(sale.createdAt || sale.date).toISOString().split("T")[0],
              customer: sale.customerName || sale.customer || "Unknown",
              phone: sale.customerPhone || sale.phone,
              serviceDescription: item.name || item.description,
              category: item.category || "other",
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || 0,
              amount: (item.unitPrice || 0) * (item.quantity || 1),
              status: sale.status === "completed" ? "completed" : sale.status === "cancelled" ? "cancelled" : "pending",
              notes: item.notes,
            })
          }
        })
      })

      setServiceSales(mapped)
      toast.success("Service data refreshed", { duration: 2000 })
    } catch {
      toast.error("Failed to refresh service data")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = (service: ServiceSale) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    printWindow.document.write(`
      <html><head><title>Receipt - ${service.serviceId}</title>
      <style>body{font-family:monospace;padding:20px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}h2{margin-bottom:4px}.text-right{text-align:right}</style>
      </head><body>
      <h2>Service Receipt</h2>
      <p>${service.serviceId} | ${service.date}</p>
      <hr/>
      <p><strong>Customer:</strong> ${service.customer}${service.phone ? ` (${service.phone})` : ""}</p>
      <hr/>
      <table><tr><th>Description</th><th>Category</th><th class="text-right">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Amount</th></tr>
      <tr><td>${service.serviceDescription}</td><td>${service.category}</td><td class="text-right">${service.quantity}</td><td class="text-right">${formatMK(service.unitPrice)}</td><td class="text-right">${formatMK(service.amount)}</td></tr>
      </table>
      <hr/>
      <p><strong>Status:</strong> ${service.status}</p>
      ${service.notes ? `<p><strong>Notes:</strong> ${service.notes}</p>` : ""}
      </body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

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
              {summary.serviceGrowth > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{summary.serviceGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-muted-foreground">-</span>
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
            <div className="text-2xl font-bold">{formatMK(summary.totalRevenue)}</div>
            <div className="flex items-center text-xs mt-1">
              {summary.revenueGrowth > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{summary.revenueGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-muted-foreground">-</span>
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
                        {formatMK(service.amount)}
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
            <div className="text-2xl font-bold">{formatMK(summary.averageServiceValue)}</div>
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
