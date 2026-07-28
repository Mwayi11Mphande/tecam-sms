"use client"

import { useState, useEffect } from "react"
import {
  IconCreditCard,
  IconCurrencyDollar,
  IconCalendarDue,
  IconTrendingUp,
  IconUsers,
  IconBuildingStore,
  IconEdit,
  IconBell,
  IconCalendar,
  IconClock,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { formatMK } from "@/lib/currency"
import { subscriptionService } from "@/lib/services/subscription.service"

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [subscriptionStats, setSubscriptionStats] = useState<any>({
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    expiringThisMonth: 0,
    monthlyRecurring: 0,
    averagePerShop: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [shopsRes, statsRes] = await Promise.all([
          subscriptionService.getAll(),
          subscriptionService.getStats(),
        ])
        const shops = shopsRes.data || []
        const stats = statsRes.data || {}
        setSubscriptions(shops.map((shop: any) => ({
          id: shop.id,
          shop: shop.name,
          owner: shop.owner?.fullName || "N/A",
          plan: shop.subscriptionPlan || "Trial",
          status: (shop.subscriptionStatus || "trial").toLowerCase(),
          amount: shop.subscriptionPlan === "BASIC" ? 99 : shop.subscriptionPlan === "PRO" ? 149 : shop.subscriptionPlan === "ENTERPRISE" ? 299 : 0,
          nextBilling: shop.subscriptionExpiry || shop.createdAt,
          paymentMethod: "Card",
        })))
        setSubscriptionStats(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const reminders = subscriptions
    .filter(s => s.plan !== "Trial" && s.nextBilling)
    .map(s => {
      const now = new Date()
      const due = new Date(s.nextBilling)
      const diffMs = due.getTime() - now.getTime()
      const daysUntilDue = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      return { ...s, daysUntilDue }
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<any>(null)
  const [editForm, setEditForm] = useState({ plan: "", status: "", expiry: "", amountPaid: "", paymentMethod: "CASH" })
  const [updating, setUpdating] = useState(false)

  const openEditDialog = (sub: any) => {
    setEditingSub(sub)
    setEditForm({
      plan: sub.plan === "Trial" ? "" : sub.plan,
      status: sub.status.toUpperCase(),
      expiry: sub.nextBilling ? new Date(sub.nextBilling).toISOString().split("T")[0] : "",
      amountPaid: "",
      paymentMethod: "CASH",
    })
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!editingSub) return
    setUpdating(true)
    try {
      await subscriptionService.update(editingSub.id, {
        plan: editForm.plan || undefined,
        status: editForm.status,
        expiry: editForm.expiry || undefined,
        amountPaid: editForm.amountPaid ? Number(editForm.amountPaid) : undefined,
        paymentMethod: editForm.amountPaid ? editForm.paymentMethod : undefined,
      })
      setEditDialogOpen(false)
      setEditingSub(null)
      const shopsRes = await subscriptionService.getAll()
      const shops = shopsRes.data || []
      setSubscriptions(shops.map((shop: any) => ({
        id: shop.id,
        shop: shop.name,
        owner: shop.owner?.fullName || "N/A",
        plan: shop.subscriptionPlan || "Trial",
        status: (shop.subscriptionStatus || "trial").toLowerCase(),
        amount: shop.subscriptionPlan === "BASIC" ? 99 : shop.subscriptionPlan === "PRO" ? 149 : shop.subscriptionPlan === "ENTERPRISE" ? 299 : 0,
        nextBilling: shop.subscriptionExpiry || shop.createdAt,
        paymentMethod: "Card",
      })))
    } catch (err: any) {
      alert(err.message || "Failed to update subscription")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96">Loading subscriptions...</div>
  if (error) return <div className="flex items-center justify-center h-96 text-red-500">Error: {error}</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">Monitor and manage all shop subscriptions</p>
        </div>
        <div />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(subscriptionStats.monthlyRecurring)}</div>
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
            <div className="text-2xl font-bold">{formatMK(subscriptionStats.averagePerShop)}</div>
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
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <IconBell className="h-4 w-4" />
            Payment Reminders
            {reminders.filter(r => r.daysUntilDue <= 7 && r.daysUntilDue > 0).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {reminders.filter(r => r.daysUntilDue <= 7 && r.daysUntilDue > 0).length}
              </Badge>
            )}
          </TabsTrigger>
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
                  {subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.shop}</TableCell>
                        <TableCell>{sub.owner}</TableCell>
                        <TableCell>{sub.plan}</TableCell>
                        <TableCell>
                          <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatMK(sub.amount)}</TableCell>
                        <TableCell>{new Date(sub.nextBilling).toLocaleDateString()}</TableCell>
                        <TableCell>{sub.paymentMethod}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(sub)}>
                            <IconEdit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reminders">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reminders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No upcoming payment reminders
                </CardContent>
              </Card>
            ) : (
              reminders.map((r) => {
                const variant = r.daysUntilDue <= 0 ? "destructive" : r.daysUntilDue <= 7 ? "default" : "secondary"
                const label = r.daysUntilDue <= 0 ? "Overdue" : r.daysUntilDue <= 7 ? "Due Soon" : "Upcoming"
                return (
                  <Card key={r.id} className={r.daysUntilDue <= 7 ? "border-l-4 border-l-red-500" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{r.shop}</span>
                            <Badge variant={variant}>{label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Owner: {r.owner}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-lg font-bold">{formatMK(r.amount)}</p>
                          <p className="text-sm text-muted-foreground">{r.plan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <IconCalendar className="h-4 w-4" />
                          Due: {new Date(r.nextBilling).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <IconClock className="h-4 w-4" />
                          {r.daysUntilDue <= 0
                            ? `${Math.abs(r.daysUntilDue)} days overdue`
                            : r.daysUntilDue === 0
                            ? "Due today"
                            : r.daysUntilDue === 1
                            ? "1 day remaining"
                            : `${r.daysUntilDue} days remaining`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update subscription details for {editingSub?.shop}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-plan">Plan</Label>
              <Select
                value={editForm.plan}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, plan: value }))}
              >
                <SelectTrigger id="edit-plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic - $99/month</SelectItem>
                  <SelectItem value="PRO">Professional - $149/month</SelectItem>
                  <SelectItem value="ENTERPRISE">Premium - $299/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                  <SelectItem value="ACTIVE">Active (Paid)</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expiry">Expiry Date</Label>
              <Input
                id="edit-expiry"
                type="date"
                value={editForm.expiry}
                onChange={(e) => setEditForm(prev => ({ ...prev, expiry: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount Paid</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={editForm.amountPaid}
                onChange={(e) => setEditForm(prev => ({ ...prev, amountPaid: e.target.value }))}
              />
            </div>
            {editForm.amountPaid && Number(editForm.amountPaid) > 0 && (
              <div className="space-y-2">
                <Label htmlFor="edit-payment-method">Payment Method</Label>
                <Select
                  value={editForm.paymentMethod}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger id="edit-payment-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}