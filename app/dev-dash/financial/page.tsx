// app/dev-dashboard/financial/page.tsx
"use client"

import { useState } from "react"
import {
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconDownload,
  IconReceipt,
  IconCash,
  IconCreditCard,
  IconBuildingBank,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Badge } from "@/components/ui/badge"
import { PaymentMethodChart } from "@/components/dev-dashboard/payment-method-chart"
import { RevenueChart } from "@/components/dev-dashboard/revenue-chart"

const financialData = {
  totalRevenue: 152450,
  monthlyRevenue: 32450,
  growth: 12.5,
  projectedRevenue: 185000,
  averageTransaction: 189,
  successRate: 98.5,
}

const transactions = [
  {
    id: "1",
    date: "2024-01-15",
    shop: "Tech Haven",
    amount: 299,
    status: "completed",
    method: "Credit Card",
    type: "subscription",
  },
  {
    id: "2",
    date: "2024-01-15",
    shop: "Fashion Hub",
    amount: 149,
    status: "completed",
    method: "PayPal",
    type: "subscription",
  },
  {
    id: "3",
    date: "2024-01-14",
    shop: "Grocery Mart",
    amount: 99,
    status: "pending",
    method: "Bank Transfer",
    type: "subscription",
  },
  {
    id: "4",
    date: "2024-01-14",
    shop: "Bookstore Plus",
    amount: 149,
    status: "completed",
    method: "Credit Card",
    type: "subscription",
  },
  {
    id: "5",
    date: "2024-01-13",
    shop: "Electronics World",
    amount: 299,
    status: "completed",
    method: "Credit Card",
    type: "subscription",
  },
]

export default function FinancialPage() {
  const [dateRange, setDateRange] = useState("month")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground">Track revenue, payments, and financial metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <IconTrendingUp className="h-3 w-3" />
              <span>+{financialData.growth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <IconReceipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.averageTransaction}</div>
            <p className="text-xs text-muted-foreground">Per subscription</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.successRate}%</div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue overview for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest payment transactions across all shops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{transaction.shop}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.method === "Credit Card" ? (
                        <IconCreditCard className="h-4 w-4" />
                      ) : transaction.method === "PayPal" ? (
                        <IconCash className="h-4 w-4" />
                      ) : (
                        <IconBuildingBank className="h-4 w-4" />
                      )}
                      {transaction.method}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payouts Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payouts</CardTitle>
          <CardDescription>
            Scheduled and pending payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Scheduled Payout - Jan 31, 2024</p>
                <p className="text-xs text-muted-foreground">Monthly subscription revenue</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">$24,560</p>
                <p className="text-xs text-muted-foreground">28 transactions</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Scheduled Payout - Feb 15, 2024</p>
                <p className="text-xs text-muted-foreground">Mid-month processing</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">$12,890</p>
                <p className="text-xs text-muted-foreground">15 transactions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}