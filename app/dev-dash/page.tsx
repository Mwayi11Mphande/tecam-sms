"use client"

import { useState, useEffect } from "react"
import { 
  IconBuildingStore, 
  IconUsers, 
  IconCurrencyDollar, 
  IconCreditCard,
  IconTrendingUp,
  IconAlertCircle,
  IconCircle,
  IconClock
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dev-dashboard/overview"
import { RecentPayments } from "@/components/dev-dashboard/recent-payments"
import { SubscriptionStatus } from "@/components/dev-dashboard/subscription-status"
import { devDashService } from "@/lib/services/dev-dash.service"
import { paymentService } from "@/lib/services/payment.service"

export default function DevDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      devDashService.getStats(),
      paymentService.getStats(),
    ]).then(([statsRes, paymentRes]) => {
      setStats({ ...statsRes.data, payments: paymentRes.data })
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconClock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
              <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalShops || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingApprovals || 0} pending approvals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats?.monthlyRevenue || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground text-green-600 dark:text-green-400">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments</CardTitle>
              <IconCreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.payments?.summary?.totalTransactions || 0}</div>
              <p className="text-xs text-muted-foreground text-amber-600 dark:text-amber-400">
                Total: ${(stats?.payments?.summary?.totalRevenue || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue from all shops (Last 6 months)
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Current subscription distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionStatus />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                Latest 5 subscription payments received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentPayments />
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <IconAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pending Shop Approvals</p>
                  <p className="text-xs text-muted-foreground">{stats?.pendingApprovals || 0} shops waiting for review</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <IconCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <IconTrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly Growth</p>
                  <p className="text-xs text-muted-foreground">{stats?.totalShops > 0 ? "+new signups" : "No data yet"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}