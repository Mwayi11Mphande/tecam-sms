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
  Scissors,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

type ServiceTx = {
  id: string
  saleId: string
  receiptNumber: string
  serviceName: string
  quantity: number
  unitPrice: number
  total: number
  date: string
  paymentMethod: string
}

export default function ViewServicesPage() {
  const [transactions, setTransactions] = useState<ServiceTx[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [methodFilter, setMethodFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const shopId = localStorage.getItem("shopId") || undefined
      const res = await saleService.getAll(shopId ? { shopId } : undefined)
      const sales = Array.isArray(res) ? res : ((res as any).data || (res as any).sales || [])

      const txs: ServiceTx[] = []
      for (const sale of sales) {
        const items = sale.saleItems || []
        for (const item of items) {
          if (item.type === "SERVICE") {
            txs.push({
              id: item.id,
              saleId: sale.id,
              receiptNumber: sale.receiptNumber || sale.invoiceNo || "-",
              serviceName: item.name,
              quantity: item.quantity || 1,
              unitPrice: Number(item.unitPrice) || 0,
              total: Number(item.total) || Number(item.unitPrice || 0) * (item.quantity || 1),
              date: sale.createdAt || sale.date,
              paymentMethod: sale.paymentMethod || "-",
            })
          }
        }
      }
      setTransactions(txs)
    } catch (err) {
      setError("Failed to load service transactions")
    } finally {
      setLoading(false)
    }
  }

  const summary = useMemo(() => {
    const totalRevenue = transactions.reduce((s, t) => s + t.total, 0)
    const totalServices = transactions.reduce((s, t) => s + t.quantity, 0)
    const today = new Date().toISOString().split("T")[0]
    const todayTxs = transactions.filter(t =>
      t.date ? new Date(t.date).toISOString().split("T")[0] === today : false
    )
    return { totalRevenue, totalServices, todayCount: todayTxs.length }
  }, [transactions])

  const filtered = useMemo(() =>
    transactions.filter(t => {
      const q = search.toLowerCase()
      const matchesSearch = !search ||
        t.serviceName.toLowerCase().includes(q) ||
        t.receiptNumber.toLowerCase().includes(q)
      const matchesMethod = methodFilter === "all" || t.paymentMethod.toLowerCase() === methodFilter.toLowerCase()
      return matchesSearch && matchesMethod
    }),
    [transactions, search, methodFilter]
  )

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading service transactions...</p>
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">View Services</h1>
            <p className="text-muted-foreground">Service transaction history</p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Done</CardTitle>
            <Scissors className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalServices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(summary.totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.todayCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by service name or receipt..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Service Transactions</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No service transactions found.
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
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.serviceName}</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-xs">{t.receiptNumber}</code></TableCell>
                    <TableCell>{t.quantity}</TableCell>
                    <TableCell>{formatMK(t.unitPrice)}</TableCell>
                    <TableCell className="font-medium">{formatMK(t.total)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.date ? new Date(t.date).toLocaleDateString("en-MW", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                    </TableCell>
                    <TableCell><Badge variant="outline">{t.paymentMethod.replace("_", " ")}</Badge></TableCell>
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
