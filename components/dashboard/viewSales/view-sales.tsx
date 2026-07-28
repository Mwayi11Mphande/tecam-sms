"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown 
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { saleService } from "@/lib/services/sale.service"

interface SalesSummary {
  totalSales: number
  totalItems: number
  totalCustomers: number
  averageTransaction: number
  todaySales: number
  yesterdaySales: number
  growth: number
}

interface Transaction {
  id: string
  customer: string
  items: number
  total: number
  time: string
  payment: string
}

interface TopItem {
  name: string
  sold: number
  revenue: number
}

export function ViewSales() {
  const [summary, setSummary] = useState<SalesSummary>({
    totalSales: 0, totalItems: 0, totalCustomers: 0, averageTransaction: 0,
    todaySales: 0, yesterdaySales: 0, growth: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [topSellingItems, setTopSellingItems] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true)
        const shopId = localStorage.getItem("shopId") || "1"
        const res = await saleService.getAll({ shopId, limit: 50 })
        const sales: any[] = res.data || []

        const todayStr = new Date().toISOString().split('T')[0]
        const todaySales = sales.filter((s: any) =>
          s.createdAt && s.createdAt.startsWith(todayStr)
        )

        const itemCount = todaySales.reduce((sum: number, s: any) => {
          const items = s.saleItems || []
          return sum + items.reduce((iSum: number, i: any) => iSum + (i.quantity || 1), 0)
        }, 0)

        const customers = new Set(todaySales.map((s: any) => s.customerName || s.customerPhone).filter(Boolean))

        const totalSalesAmount = todaySales.reduce((sum: number, s: any) => sum + Number(s.total ?? s.amount ?? 0), 0)

        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const yesterdaySales = sales.filter((s: any) =>
          s.createdAt && s.createdAt.startsWith(yesterdayStr)
        )
        const yesterdayAmount = yesterdaySales.reduce((sum: number, s: any) => sum + Number(s.total ?? s.amount ?? 0), 0)
        const growth = yesterdayAmount > 0 ? ((totalSalesAmount - yesterdayAmount) / yesterdayAmount) * 100 : 0

        setSummary({
          totalSales: sales.reduce((sum: number, s: any) => sum + Number(s.total ?? s.amount ?? 0), 0),
          totalItems: itemCount,
          totalCustomers: customers.size,
          averageTransaction: todaySales.length > 0 ? totalSalesAmount / todaySales.length : 0,
          todaySales: totalSalesAmount,
          yesterdaySales: yesterdayAmount,
          growth: Math.round(growth * 10) / 10
        })

        setRecentTransactions(
          todaySales.slice(0, 5).map((s: any) => ({
            id: s.transactionId || s.id || `TXN-${String(s.id).padStart(8, '0')}`,
            customer: s.customerName || s.customerPhone || "Walk-in",
            items: (s.saleItems || []).reduce((sum: number, i: any) => sum + (i.quantity || 1), 0),
            total: Number(s.total ?? s.amount ?? 0),
            time: s.createdAt ? new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            payment: s.paymentMethod || "Cash"
          }))
        )

        const itemMap = new Map<string, { sold: number; revenue: number }>()
        sales.forEach((s: any) => {
          (s.saleItems || []).forEach((i: any) => {
            const name = i.name || i.productName || "Unknown"
            const qty = i.quantity || 1
            const price = Number(i.unitPrice ?? i.price ?? 0)
            const existing = itemMap.get(name) || { sold: 0, revenue: 0 }
            existing.sold += qty
            existing.revenue += qty * price
            itemMap.set(name, existing)
          })
        })
        setTopSellingItems(
          Array.from(itemMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
        )
      } catch (err: any) {
        setError(err.message || "Failed to load sales data")
      } finally {
        setLoading(false)
      }
    }
    fetchSales()
  }, [])

  const today = format(new Date(), "MMMM dd, yyyy")

  const formatAmount = (amount: number) => {
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  if (loading) return <div className="p-4 space-y-6 flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading sales data...</p></div>
  if (error) return <div className="p-4 space-y-6 flex items-center justify-center min-h-[400px]"><p className="text-destructive">{error}</p></div>

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-foreground">Sales Dashboard</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {today}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Live Updates
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
              <span>Today's Sales</span>
              <DollarSign className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              Mk {formatAmount(summary.todaySales)}
            </div>
            <div className="flex items-center gap-1 text-sm mt-2">
              {summary.growth > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-600" />
              )}
              <span className={summary.growth > 0 ? "text-green-600" : "text-red-600"}>
                {summary.growth}% from yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center justify-between">
              <span>Items Sold Today</span>
              <Package className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {summary.totalItems}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Across all transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center justify-between">
              <span>Customers Today</span>
              <Users className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {summary.totalCustomers}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Transactions with customer info
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center justify-between">
              <span>Avg Transaction</span>
              <TrendingUp className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              Mk {formatAmount(summary.averageTransaction)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Per customer today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.items}</TableCell>
                    <TableCell>Mk {formatAmount(transaction.total)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.payment}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingItems.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.sold}</TableCell>
                    <TableCell className="text-right">
                      Mk {formatAmount(item.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {recentTransactions.length}
              </div>
              <div className="text-sm text-gray-600">Transactions</div>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {topSellingItems.reduce((sum, item) => sum + item.sold, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Items Sold</div>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                Mk {formatAmount(summary.totalSales)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {summary.totalCustomers}
              </div>
              <div className="text-sm text-gray-600">Customers Served</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}