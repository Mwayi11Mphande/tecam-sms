"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from "lucide-react"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

export default function ShopReportsPage() {
  const [totalSales, setTotalSales] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [averageOrder, setAverageOrder] = useState(0)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [uniqueCustomers, setUniqueCustomers] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (!userStr) return
        const user = JSON.parse(userStr)
        const shopId = user.shopId || user.shop?.id
        if (!shopId) return

        const res = await saleService.getAll({ shopId })
        const sales = res.data || []

        const total = sales.reduce((sum: number, s: any) => sum + (s.total || s.amount || 0), 0)
        const count = sales.length
        const avg = count > 0 ? total / count : 0

        const customers = new Set(sales.map((s: any) => s.customerId || s.customer))
        const productMap = new Map<string, { quantity: number; revenue: number }>()

        for (const sale of sales) {
          const items = sale.items || []
          for (const item of items) {
            const qty = item.quantity || 1
            const price = item.unitPrice || item.price || 0
            const existing = productMap.get(item.name)
            if (existing) {
              existing.quantity += qty
              existing.revenue += qty * price
            } else {
              productMap.set(item.name, { quantity: qty, revenue: qty * price })
            }
          }
        }

        const products = Array.from(productMap.entries())
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setTotalSales(total)
        setOrdersCount(count)
        setAverageOrder(avg)
        setTopProducts(products)
        setUniqueCustomers(customers.size)
      } catch (err) {
        console.error("Failed to load report data", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const timePeriods = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"]
  const reportTypes = ["Sales Report", "Inventory Report", "Customer Report", "Financial Report", "Performance Report"]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & Revenue Reports</h1>
          <p className="text-muted-foreground">
            Analyze your shop's performance and revenue trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="last-30-days">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((period) => (
                <SelectItem key={period} value={period.toLowerCase().replace(/\s+/g, '-')}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {reportTypes.map((type, index) => (
          <Card key={type} className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-3 rounded-full ${
                  index === 0 ? 'bg-blue-100 text-blue-600' :
                  index === 1 ? 'bg-green-100 text-green-600' :
                  index === 2 ? 'bg-purple-100 text-purple-600' :
                  index === 3 ? 'bg-orange-100 text-orange-600' :
                  'bg-pink-100 text-pink-600'
                }`}>
                  {index === 0 ? <BarChart3 className="h-6 w-6" /> :
                   index === 1 ? <Package className="h-6 w-6" /> :
                   index === 2 ? <Users className="h-6 w-6" /> :
                   index === 3 ? <DollarSign className="h-6 w-6" /> :
                   <TrendingUp className="h-6 w-6" />}
                </div>
                <h3 className="font-semibold">{type}</h3>
                <p className="text-xs text-muted-foreground">View detailed analysis</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Report Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Sales Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center">
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Sales Chart</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center p-4 bg-muted rounded-lg animate-pulse">
                      <div className="h-8 w-24 bg-muted-foreground/20 rounded mx-auto mb-2" />
                      <div className="h-4 w-16 bg-muted-foreground/20 rounded mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Sales Chart</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{formatMK(totalSales)}</p>
                    <p className="text-sm text-green-600">Total Sales</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{ordersCount}</p>
                    <p className="text-sm text-blue-600">Orders</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">{formatMK(averageOrder)}</p>
                    <p className="text-sm text-purple-600">Average Order</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
                      <div className="ml-2 h-4 w-32 bg-muted-foreground/20 rounded" />
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-muted-foreground/20 rounded ml-auto mb-1" />
                      <div className="h-3 w-12 bg-muted-foreground/20 rounded ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{index + 1}.</span>
                      <span className="ml-2 text-sm">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatMK(product.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No products sold yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-20 bg-muted-foreground/20 rounded" />
                <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatMK(totalSales)}</div>
                <p className="text-xs text-muted-foreground">
                  {ordersCount > 0 ? `${ordersCount} order${ordersCount !== 1 ? 's' : ''} total` : 'No sales yet'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Reach</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-20 bg-muted-foreground/20 rounded" />
                <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{uniqueCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  unique customers
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-20 bg-muted-foreground/20 rounded" />
                <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Data unavailable
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-20 bg-muted-foreground/20 rounded" />
                <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Data unavailable
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="print">Printable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Preview</Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
