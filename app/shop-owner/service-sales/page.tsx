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
  TrendingUp,
  Eye,
  Printer,
  DollarSign,
  Loader2,
  AlertCircle,
  Scissors,
  Clock,
  RefreshCw,
} from "lucide-react"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

type ServiceTransaction = {
  id: string
  saleId: string
  receiptNumber: string
  serviceName: string
  quantity: number
  unitPrice: number
  total: number
  date: string
  cashier: string
  paymentMethod: string
}

export default function ServiceSalesPage() {
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [methodFilter, setMethodFilter] = useState("all")

  useEffect(() => {
    fetchServiceSales()
  }, [])

  async function fetchServiceSales() {
    try {
      setIsLoading(true)
      setError(null)
      const shopId = localStorage.getItem("shopId") || undefined
      const res = await saleService.getAll(shopId ? { shopId } : undefined)
      const sales = Array.isArray(res) ? res : ((res as any).data || (res as any).sales || [])

      const items: ServiceTransaction[] = []
      for (const sale of sales) {
        const saleItems = sale.saleItems || []
        for (const item of saleItems) {
          if (item.type === "SERVICE") {
            items.push({
              id: item.id,
              saleId: sale.id,
              receiptNumber: sale.receiptNumber || sale.invoiceNo || "-",
              serviceName: item.name,
              quantity: item.quantity || 1,
              unitPrice: Number(item.unitPrice) || 0,
              total: Number(item.total) || Number(item.unitPrice || 0) * (item.quantity || 1),
              date: sale.createdAt || sale.date,
              cashier: sale.cashier?.fullName || sale.cashierName || "-",
              paymentMethod: sale.paymentMethod || "-",
            })
          }
        }
      }

      setTransactions(items)
    } catch (err) {
      console.error("Failed to fetch service sales", err)
      setError("Failed to load service transactions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const summary = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
    const totalServices = transactions.reduce((sum, t) => sum + t.quantity, 0)
    const today = new Date().toISOString().split("T")[0]
    const todayTransactions = transactions.filter(t =>
      t.date ? new Date(t.date).toISOString().split("T")[0] === today : false
    )
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0)
    const avgServiceValue = totalServices > 0 ? totalRevenue / totalServices : 0
    return { totalRevenue, totalServices, avgServiceValue, todayRevenue, todayCount: todayTransactions.length }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const searchStr = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        t.serviceName.toLowerCase().includes(searchStr) ||
        t.receiptNumber.toLowerCase().includes(searchStr) ||
        t.cashier.toLowerCase().includes(searchStr)
      const matchesMethod = methodFilter === "all" || t.paymentMethod.toLowerCase() === methodFilter.toLowerCase()
      return matchesSearch && matchesMethod
    })
  }, [transactions, searchQuery, methodFilter])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-MW", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading service transactions...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Service Sales</h1>
          <p className="text-muted-foreground">
            Track all service transactions and revenue
          </p>
        </div>
        <Button variant="outline" onClick={fetchServiceSales}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Done</CardTitle>
            <Scissors className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Total services completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(summary.totalRevenue)}</div>
            <p className="text-xs text-green-500">
              Total revenue from services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Service</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(summary.avgServiceValue)}</div>
            <p className="text-xs text-muted-foreground">
              Average price per service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.todayCount}</div>
            <p className="text-xs text-green-500">
              {formatMK(summary.todayRevenue)} today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by service, receipt, or cashier..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || methodFilter !== "all"
                ? "No transactions match your filters."
                : "No service transactions yet. Services will appear here once cashiers process them."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.serviceName}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-xs">{t.receiptNumber}</code>
                    </TableCell>
                    <TableCell>{t.quantity}</TableCell>
                    <TableCell>{formatMK(t.unitPrice)}</TableCell>
                    <TableCell className="font-medium">{formatMK(t.total)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(t.date)}</TableCell>
                    <TableCell>{t.cashier}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.paymentMethod.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
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
