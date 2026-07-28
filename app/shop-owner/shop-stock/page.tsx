"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Loader2,
  Save,
  Minus,
  Plus,
} from "lucide-react"
import { productService } from "@/lib/services/product.service"
import { formatMK } from "@/lib/currency"

type StockItem = {
  id: string
  name: string
  sku: string
  category: string
  current: number
  min: number
  max: number
  price: number
  status: "Good" | "Low" | "Out"
}

function computeStatus(current: number, min: number): StockItem["status"] {
  if (current === 0) return "Out"
  if (current <= min) return "Low"
  return "Good"
}

function mapProduct(p: any): StockItem {
  const current = p.stockQty ?? p.stock ?? 0
  const min = p.lowStockThreshold ?? 10
  const max = p.maxStock ?? p.maxStockQty ?? 100
  return {
    id: p.id,
    name: p.name || "",
    sku: p.sku || "",
    category: p.category?.name || p.category || "",
    current,
    min,
    max,
    price: Number(p.price) || 0,
    status: computeStatus(current, min),
  }
}

export default function ShopStockPage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [stockDialogOpen, setStockDialogOpen] = useState(false)
  const [stockAdjustments, setStockAdjustments] = useState<Record<string, { stockQty: number; lowStockThreshold: number }>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const shopId = localStorage.getItem("shopId") || undefined
      const res = await productService.getAll(shopId ? { shopId } : undefined)
      const products = Array.isArray(res) ? res : ((res as any).data || [])
      setAllProducts(products)
      setItems(products.map(mapProduct))
    } catch (err: any) {
      setError(err.message || "Failed to load stock data")
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    const q = searchQuery.toLowerCase()
    return items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    )
  }, [items, searchQuery])

  const totalItems = items.reduce((sum, i) => sum + i.current, 0)
  const lowStock = items.filter(i => i.status === "Low").length
  const outOfStock = items.filter(i => i.status === "Out").length
  const inventoryValue = items.reduce((sum, i) => sum + i.current * i.price, 0)

  function openStockDialog() {
    const adjustments: Record<string, { stockQty: number; lowStockThreshold: number }> = {}
    for (const p of allProducts) {
      adjustments[p.id] = {
        stockQty: p.stockQty ?? p.stock ?? 0,
        lowStockThreshold: p.lowStockThreshold ?? 10,
      }
    }
    setStockAdjustments(adjustments)
    setStockDialogOpen(true)
  }

  async function saveStockAdjustments() {
    try {
      setSaving(true)
      const changed: { id: string; stockQty: number; lowStockThreshold: number }[] = []
      for (const p of allProducts) {
        const adj = stockAdjustments[p.id]
        if (!adj) continue
        const origStock = p.stockQty ?? p.stock ?? 0
        const origThreshold = p.lowStockThreshold ?? 10
        if (adj.stockQty !== origStock || adj.lowStockThreshold !== origThreshold) {
          changed.push({ id: p.id, stockQty: adj.stockQty, lowStockThreshold: adj.lowStockThreshold })
        }
      }

      for (const c of changed) {
        const r = await productService.update(c.id, { stockQty: c.stockQty, lowStockThreshold: c.lowStockThreshold })
        if (r && (r as any).success === false) throw new Error((r as any).message || "Update failed")
      }

      setStockDialogOpen(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message || "Failed to save stock adjustments")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading stock data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <XCircle className="h-10 w-10 mx-auto text-red-500" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Stock</h1>
          <p className="text-muted-foreground">
            Monitor and manage your inventory levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={openStockDialog}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Stock
          </Button>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Order Stock
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across {items.length} product{items.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStock}</div>
            <p className="text-xs text-red-500">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <p className="text-xs text-red-500">
              Restock immediately
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMK(inventoryValue)}</div>
            <p className="text-xs text-green-500">
              Based on current stock & prices
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stock items by name, SKU, or category..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No items match your search." : "No stock items found."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Max Level</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const percentage = item.max > 0 ? (item.current / item.max) * 100 : 0
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category || "—"}</Badge>
                      </TableCell>
                      <TableCell>{item.current}</TableCell>
                      <TableCell>{item.min}</TableCell>
                      <TableCell>{item.max}</TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[120px]">
                          <Progress value={Math.min(percentage, 100)} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === "Good" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Good
                          </Badge>
                        ) : item.status === "Low" ? (
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Low
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="mr-1 h-3 w-3" />
                            Out of Stock
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Update Stock Levels
            </DialogTitle>
            <DialogDescription>
              Adjust stock quantities and low-stock thresholds for your products
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {allProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No products found.</p>
            )}
            {allProducts.map((p) => {
              const adj = stockAdjustments[p.id] || { stockQty: 0, lowStockThreshold: 10 }
              return (
                <div key={p.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.sku}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Stock:</label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setStockAdjustments(prev => ({
                            ...prev,
                            [p.id]: { ...adj, stockQty: Math.max(0, adj.stockQty - 1) },
                          }))
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        className="w-20 h-8 text-center"
                        value={adj.stockQty}
                        onChange={(e) =>
                          setStockAdjustments(prev => ({
                            ...prev,
                            [p.id]: { ...adj, stockQty: Math.max(0, parseInt(e.target.value) || 0) },
                          }))
                        }
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setStockAdjustments(prev => ({
                            ...prev,
                            [p.id]: { ...adj, stockQty: adj.stockQty + 1 },
                          }))
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Min:</label>
                    <Input
                      type="number"
                      min={0}
                      className="w-16 h-8 text-center"
                      value={adj.lowStockThreshold}
                      onChange={(e) =>
                        setStockAdjustments(prev => ({
                          ...prev,
                          [p.id]: { ...adj, lowStockThreshold: Math.max(0, parseInt(e.target.value) || 0) },
                        }))
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveStockAdjustments} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
