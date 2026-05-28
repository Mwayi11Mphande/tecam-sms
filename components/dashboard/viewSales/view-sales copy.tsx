// components/pos/view-sales.tsx
"use client"

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

// Mock data - replace with actual API calls
const mockSalesData = {
  summary: {
    totalSales: 8500000,
    totalItems: 145,
    totalCustomers: 32,
    averageTransaction: 265625,
    todaySales: 1250000,
    yesterdaySales: 980000,
    growth: 27.6
  },
  recentTransactions: [
    { id: "TXN-98456701", customer: "John Doe", items: 3, total: 345000, time: "10:30 AM", payment: "Cash" },
    { id: "TXN-98456702", customer: "Alice Smith", items: 5, total: 890000, time: "11:15 AM", payment: "Card" },
    { id: "TXN-98456703", customer: "Bob Johnson", items: 2, total: 189000, time: "11:45 AM", payment: "Mobile Money" },
    { id: "TXN-98456704", customer: "Sarah Williams", items: 1, total: 249000, time: "12:30 PM", payment: "Cash" },
    { id: "TXN-98456705", customer: "Mike Brown", items: 4, total: 456000, time: "1:15 PM", payment: "Bank Transfer" },
  ],
  topSellingItems: [
    { name: "iPhone 15 Pro", sold: 12, revenue: 11988000 },
    { name: "AirPods Pro", sold: 25, revenue: 6225000 },
    { name: "MacBook Air", sold: 5, revenue: 6495000 },
    { name: "Wireless Mouse", sold: 18, revenue: 810000 },
    { name: "USB Cable", sold: 32, revenue: 384000 },
  ]
}

export function ViewSales() {
  const { summary, recentTransactions, topSellingItems } = mockSalesData
  const today = format(new Date(), "MMMM dd, yyyy")

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

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