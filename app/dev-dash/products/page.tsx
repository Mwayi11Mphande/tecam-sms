"use client"

import { useState, useEffect } from "react"
import {
  IconPackage,
  IconPlus,
  IconEdit,
  IconTrash,
  IconBuildingStore,
  IconSearch,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { shopService } from "@/lib/services/shop.service"
import { productService } from "@/lib/services/product.service"
import { categoryService } from "@/lib/services/category.service"

export default function ProductsPage() {
  const [shops, setShops] = useState<any[]>([])
  const [selectedShopId, setSelectedShopId] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", sku: "", price: "", cost: "", stockQty: "0", categoryId: "" })

  useEffect(() => {
    shopService.getAll().then(res => {
      const data = res.data || []
      setShops(data)
      if (data.length > 0) setSelectedShopId(data[0].id)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedShopId) return
    Promise.all([
      productService.getAll({ shopId: selectedShopId }),
      categoryService.getAll(selectedShopId),
    ]).then(([prodRes, catRes]) => {
      setProducts((prodRes as any).data || prodRes || [])
      setCategories((catRes as any).data || catRes || [])
    }).catch(console.error)
  }, [selectedShopId])

  const openAddDialog = () => {
    setEditingProduct(null)
    setForm({ name: "", sku: "", price: "", cost: "", stockQty: "0", categoryId: "" })
    setDialogOpen(true)
  }

  const openEditDialog = (product: any) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      cost: String(product.cost),
      stockQty: String(product.stockQty || 0),
      categoryId: product.categoryId || "",
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.sku || !form.price) return
    setSaving(true)
    try {
      const data = {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        cost: Number(form.cost) || 0,
        stockQty: Number(form.stockQty) || 0,
        categoryId: form.categoryId || undefined,
        shopId: selectedShopId,
      }
      if (editingProduct) {
        await productService.update(editingProduct.id, data)
      } else {
        await productService.create(data)
      }
      setDialogOpen(false)
      const prodRes = await productService.getAll({ shopId: selectedShopId })
      setProducts((prodRes as any).data || prodRes || [])
    } catch (err: any) {
      alert(err.message || "Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await productService.delete(deleteTarget.id)
      setDeleteTarget(null)
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    } catch (err: any) {
      alert(err.message || "Failed to delete product")
    }
  }

  const filtered = products.filter((p: any) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage products across all shops</p>
        </div>
        <Button onClick={openAddDialog}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Shop</Label>
              <Select value={selectedShopId} onValueChange={setSelectedShopId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shop" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Search</Label>
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or SKU..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPackage className="h-5 w-5" />
            Product List
            {selectedShopId && <span className="text-sm font-normal text-muted-foreground">— {shops.find(s => s.id === selectedShopId)?.name}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No products found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                    <TableCell>${Number(p.cost).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={p.stockQty > 0 ? "default" : "destructive"}>
                        {p.stockQty}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.category?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "ACTIVE" ? "default" : "secondary"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(p)}>
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)}>
                          <IconTrash className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product details" : "Add a new product to the shop"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm(p => ({ ...p, sku: e.target.value }))} placeholder="SKU-001" />
              </div>
              <div className="space-y-2">
                <Label>Stock Qty</Label>
                <Input type="number" min="0" value={form.stockQty} onChange={(e) => setForm(p => ({ ...p, stockQty: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Cost ($)</Label>
                <Input type="number" step="0.01" min="0" value={form.cost} onChange={(e) => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm(p => ({ ...p, categoryId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No category</SelectItem>
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.sku || !form.price}>
              {saving ? "Saving..." : editingProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteTarget?.name}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
