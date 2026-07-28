"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

export default function SalesManagementPage() {
  const [sales, setSales] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const userStr = localStorage.getItem("user")
        if (!userStr) {
          setError("User not found. Please log in again.")
          return
        }

        const user = JSON.parse(userStr)
        const shopId = user.shopId || user.shop?.id
        if (!shopId) {
          setError("Shop not found. Please log in again.")
          return
        }

        const res = await saleService.getAll({ shopId })
        setSales(res.data || [])
      } catch (err) {
        console.error("Failed to fetch sales", err)
        setError("Failed to load sales data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSales()
  }, [])

  const summary = useMemo(() => {
    const total = sales.reduce((sum: number, s: any) => sum + (s.total || s.amount || 0), 0)
    const today = new Date().toISOString().split("T")[0]
    const todaySales = sales.filter((s: any) => {
      const d = s.createdAt || s.date
      return d ? new Date(d).toISOString().split("T")[0] === today : false
    })
    const todayTotal = todaySales.reduce((sum: number, s: any) => sum + (s.total || s.amount || 0), 0)
    const avg = sales.length > 0 ? total / sales.length : 0
    return { totalSales: total, averageOrder: avg, todaySales: todayTotal }
  }, [sales])

  const filteredSales = useMemo(() => {
    return sales.filter((s: any) => {
      const searchStr = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        (s.invoiceNo || s.id || "").toLowerCase().includes(searchStr) ||
        (s.customerName || s.customer || "").toLowerCase().includes(searchStr)
      const matchesStatus = statusFilter === "all" || (s.status || "").toLowerCase() === statusFilter.toLowerCase()
      const matchesMethod = methodFilter === "all" || (s.paymentMethod || "").toLowerCase() === methodFilter.toLowerCase()
      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [sales, searchQuery, statusFilter, methodFilter])

  const statusVariant = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "completed" || s === "delivered") return "default" as const
    if (s === "pending" || s === "processing") return "secondary" as const
    if (s === "refunded") return "outline" as const
    return "destructive" as const
  }

  const formatDate = (sale: any) => {
    const d = sale.createdAt || sale.date
    return d ? new Date(d).toISOString().split("T")[0] : "-"
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading sales data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">
            View and manage all sales transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 days
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Sales
          </Button>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(summary.totalSales)}</div>
            <p className="text-xs text-green-500">
              +12.5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(summary.averageOrder)}</div>
            <p className="text-xs text-green-500">
              +8.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(summary.todaySales)}</div>
            <p className="text-xs text-green-500">
              +15.3% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-red-500">
              -0.5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales by ID, customer, or amount..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                <SelectItem value="mpamba">MPamba</SelectItem>
                <SelectItem value="airtel money">Airtel Money</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== "all" || methodFilter !== "all"
                ? "No sales match your filters."
                : "No sales data available."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale: any) => (
                  <TableRow key={sale.id || sale.invoiceNo}>
                    <TableCell className="font-medium">{sale.invoiceNo || sale.id || "-"}</TableCell>
                    <TableCell>{formatDate(sale)}</TableCell>
                    <TableCell>{sale.customerName || sale.customer || "Unknown"}</TableCell>
                    <TableCell className="font-medium">{formatMK(sale.total || sale.amount || 0)}</TableCell>
                    <TableCell>{sale.paymentMethod || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(sale.status)}>
                        {sale.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
