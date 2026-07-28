"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DollarSign,
  Scissors,
  Package,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Ban,
  History,
} from "lucide-react"
import { shopService } from "@/lib/services/shop.service"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

function getTodayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export default function CloseRegisterPage() {
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [todaySales, setTodaySales] = useState<any[]>([])
  const [closedDays, setClosedDays] = useState<any[]>([])
  const [todayClosed, setTodayClosed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [viewHistory, setViewHistory] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const shopId = localStorage.getItem("shopId") || ""

      const { start, end } = getTodayRange()
      const [salesRes, closesRes] = await Promise.all([
        saleService.getAll({ shopId, startDate: start.toISOString(), endDate: end.toISOString() }),
        shopService.getDailyCloses(shopId),
      ])

      const sales = Array.isArray(salesRes) ? salesRes : ((salesRes as any).data || [])
      setTodaySales(Array.isArray(sales) ? sales : [])

      const closes = Array.isArray(closesRes) ? closesRes : ((closesRes as any).data || [])
      setClosedDays(Array.isArray(closes) ? closes : [])

      const todayStr = start.toISOString().split("T")[0]
      setTodayClosed(Array.isArray(closes) && closes.some((c: any) =>
        new Date(c.date).toISOString().split("T")[0] === todayStr
      ))
    } catch (err: any) {
      setError(err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  async function handleCloseDay() {
    try {
      setClosing(true)
      const shopId = localStorage.getItem("shopId") || ""
      await shopService.closeDay(shopId)
      setConfirmOpen(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message || "Failed to close day")
    } finally {
      setClosing(false)
    }
  }

  const totalRevenue = todaySales.reduce((s: number, sale: any) => s + Number(sale.total || 0), 0)
  const totalSales = todaySales.length
  const serviceRevenue = todaySales.reduce((s: number, sale: any) => {
    const items = sale.saleItems || []
    return s + items.filter((i: any) => i.type === "SERVICE").reduce((a: number, i: any) => a + Number(i.total || 0), 0)
  }, 0)
  const productRevenue = todaySales.reduce((s: number, sale: any) => {
    const items = sale.saleItems || []
    return s + items.filter((i: any) => i.type === "PRODUCT").reduce((a: number, i: any) => a + Number(i.total || 0), 0)
  }, 0)

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading register data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Close Register</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-MW", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setViewHistory(!viewHistory)}>
            <History className="mr-2 h-4 w-4" />
            {viewHistory ? "Today's Summary" : "History"}
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />Refresh
          </Button>
        </div>
      </div>

      {viewHistory ? (
        <Card>
          <CardHeader><CardTitle>Closed Days History</CardTitle></CardHeader>
          <CardContent>
            {closedDays.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No closed days yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Product Revenue</TableHead>
                    <TableHead>Service Revenue</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Closed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedDays.map((d: any) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        {new Date(d.date).toLocaleDateString("en-MW", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell>{d.totalSales}</TableCell>
                      <TableCell>{formatMK(d.productRevenue)}</TableCell>
                      <TableCell>{formatMK(d.serviceRevenue)}</TableCell>
                      <TableCell className="font-bold">{formatMK(d.totalRevenue)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(d.closedAt).toLocaleTimeString("en-MW", { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMK(totalRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMK(productRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Scissors className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMK(serviceRevenue)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Today's Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {todaySales.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No transactions today.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todaySales.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell><code className="bg-muted px-2 py-1 rounded text-xs">{sale.receiptNumber}</code></TableCell>
                        <TableCell>{(sale.saleItems || []).length} item{(sale.saleItems || []).length !== 1 ? "s" : ""}</TableCell>
                        <TableCell><Badge variant="outline">{sale.paymentMethod?.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleTimeString("en-MW", { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatMK(Number(sale.total) || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {todayClosed ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">Today's register is already closed</p>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button size="lg" onClick={() => setConfirmOpen(true)} disabled={totalSales === 0}>
                <Ban className="mr-2 h-4 w-4" />
                Close Register
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Today's Register</DialogTitle>
            <DialogDescription>
              This will close the day's sales. Stock will remain unchanged.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Sales</p>
                <p className="text-xl font-bold">{totalSales}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">{formatMK(totalRevenue)}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              After closing, the POS will start fresh tomorrow with a new receipt sequence.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={closing}>Cancel</Button>
            <Button onClick={handleCloseDay} disabled={closing}>
              {closing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Close Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
