// app/dev-dashboard/subscriptions/page.tsx
"use client"

import { useState } from "react"
import {
  IconCreditCard,
  IconCurrencyDollar,
  IconCalendarDue,
  IconTrendingUp,
  IconUsers,
  IconBuildingStore,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const subscriptionStats = {
  totalRevenue: 45230,
  activeSubscriptions: 24,
  pendingPayments: 5,
  expiringThisMonth: 3,
  monthlyRecurring: 18450,
  averagePerShop: 769,
}

const subscriptions = [
  {
    id: "1",
    shop: "Tech Haven",
    plan: "Premium",
    status: "active",
    amount: 299,
    nextBilling: "2024-02-15",
    paymentMethod: "Credit Card",
    owner: "John Doe",
  },
  {
    id: "2",
    shop: "Fashion Hub",
    plan: "Professional",
    status: "active",
    amount: 149,
    nextBilling: "2024-02-10",
    paymentMethod: "PayPal",
    owner: "Jane Smith",
  },
  {
    id: "3",
    shop: "Grocery Mart",
    plan: "Basic",
    status: "pending",
    amount: 99,
    nextBilling: "2024-02-18",
    paymentMethod: "Bank Transfer",
    owner: "Bob Johnson",
  },
  {
    id: "4",
    shop: "Bookstore Plus",
    plan: "Professional",
    status: "active",
    amount: 149,
    nextBilling: "2024-02-05",
    paymentMethod: "Credit Card",
    owner: "Alice Brown",
  },
  {
    id: "5",
    shop: "Electronics World",
    plan: "Premium",
    status: "active",
    amount: 299,
    nextBilling: "2024-02-03",
    paymentMethod: "Credit Card",
    owner: "Charlie Wilson",
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">Monitor and manage all shop subscriptions</p>
        </div>
        <Button>
          <IconCreditCard className="mr-2 h-4 w-4" />
          Create Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${subscriptionStats.monthlyRecurring.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">MRR from subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionStats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {subscriptionStats.pendingPayments} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Shop</CardTitle>
            <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${subscriptionStats.averagePerShop}</div>
            <p className="text-xs text-muted-foreground">Average subscription value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <IconCalendarDue className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionStats.expiringThisMonth}</div>
            <p className="text-xs text-muted-foreground">Subscriptions ending this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Subscriptions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Subscription List</CardTitle>
              <CardDescription>
                Manage all active and pending subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.shop}</TableCell>
                      <TableCell>{sub.owner}</TableCell>
                      <TableCell>{sub.plan}</TableCell>
                      <TableCell>
                        <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${sub.amount}</TableCell>
                      <TableCell>{new Date(sub.nextBilling).toLocaleDateString()}</TableCell>
                      <TableCell>{sub.paymentMethod}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment History Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            Latest payment transactions across all shops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Tech Haven</p>
                  <p className="text-sm text-muted-foreground">Premium Plan • Jan 15, 2024</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Completed
                  </Badge>
                  <span className="font-medium">$299.00</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}