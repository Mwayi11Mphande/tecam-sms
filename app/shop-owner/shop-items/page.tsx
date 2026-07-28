"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  MoreVertical,
  X,
  Loader2,
  AlertCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddProductModal, ProductSubmitData } from "@/components/modal/addProductModal"
import { Product, ProductActionModal } from "@/components/modal/ProductActionModal"
import { productService } from "@/lib/services/product.service"
import { formatMK } from "@/lib/currency"

function computeStatus(stock: number): string {
  if (stock === 0) return "Out of Stock"
  if (stock < 10) return "Low Stock"
  return "In Stock"
}

function mapApiProduct(item: any): Product {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku,
    category: item.category?.name || item.category || "",
    price: String(item.price ?? 0),
    cost: String(item.cost ?? 0),
    stock: item.stockQty ?? 0,
    status: item.status || computeStatus(item.stockQty ?? 0),
    description: item.description,
    isActive: item.isActive ?? true,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export default function ShopItemsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await productService.getAll()
      const data = Array.isArray(res) ? res : ((res as any).data || [])
      if (Array.isArray(data)) {
        setProducts(data.map(mapApiProduct))
      } else {
        setError("Failed to load products")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [actionModalState, setActionModalState] = useState<{
    isOpen: boolean
    mode: 'view' | 'edit' | 'delete'
    product: Product | null
  }>({
    isOpen: false,
    mode: 'view',
    product: null
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    return ["all", ...uniqueCategories]
  }, [products])

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(products.map(p => p.status).filter(Boolean)))
    return ["all", ...uniqueStatuses]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === "all" || 
        product.category === categoryFilter

      const matchesStatus = statusFilter === "all" || 
        product.status === statusFilter

      let matchesStock = true
      if (stockFilter === "inStock") {
        matchesStock = product.stock > 0 && product.status === "In Stock"
      } else if (stockFilter === "lowStock") {
        matchesStock = product.stock > 0 && product.stock < 20
      } else if (stockFilter === "outOfStock") {
        matchesStock = product.stock === 0
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesStock
    })
  }, [products, searchQuery, categoryFilter, statusFilter, stockFilter])

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setStockFilter("all")
  }

  const isFilterActive = searchQuery !== "" || 
    categoryFilter !== "all" || 
    statusFilter !== "all" || 
    stockFilter !== "all"

  const handleAddProduct = async (productData: ProductSubmitData) => {
    try {
      setSaving(true)
      const shopId = localStorage.getItem("shopId") || ""
      await productService.create({
        name: productData.name,
        sku: productData.sku,
        price: parseFloat(productData.price),
        cost: parseFloat(productData.cost),
        stockQty: productData.stock,
        category: productData.category || undefined,
        shopId,
      })
      setIsAddProductModalOpen(false)
      await fetchProducts()
    } catch (err: any) {
      alert(err.message || "Failed to add product")
    } finally {
      setSaving(false)
    }
  }

  const handleOpenModal = (mode: 'view' | 'edit' | 'delete', product: Product) => {
    setActionModalState({
      isOpen: true,
      mode,
      product
    })
  }

  const handleCloseModal = () => {
    setActionModalState({
      isOpen: false,
      mode: 'view',
      product: null
    })
  }

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      setSaving(true)
      await productService.update(String(updatedProduct.id), {
        name: updatedProduct.name,
        sku: updatedProduct.sku,
        price: parseFloat(updatedProduct.price),
        cost: parseFloat(updatedProduct.cost),
        stockQty: updatedProduct.stock,
        category: updatedProduct.category || undefined,
      })
      handleCloseModal()
      await fetchProducts()
    } catch (err: any) {
      alert(err.message || "Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (productId: string | number) => {
    try {
      setSaving(true)
      await productService.delete(String(productId))
      handleCloseModal()
      await fetchProducts()
    } catch (err: any) {
      alert(err.message || "Failed to delete product")
    } finally {
      setSaving(false)
    }
  }

  const stats = useMemo(() => {
    const total = filteredProducts.length
    const inStock = filteredProducts.filter(p => p.status === "In Stock").length
    const lowStock = filteredProducts.filter(p => p.status === "Low Stock").length
    const outOfStock = filteredProducts.filter(p => p.status === "Out of Stock").length
    
    return { total, inStock, lowStock, outOfStock }
  }, [filteredProducts])

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2">Failed to load products</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Items</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => setIsAddProductModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Showing {filteredProducts.length} of {products.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inStock}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.inStock / stats.total) * 100) : 0}% of displayed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-red-500">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
            <p className="text-xs text-red-500">
              Restock needed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, category, or description..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex flex-wrap gap-3 flex-1">
                <div className="min-w-[150px]">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Statuses" : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Stock Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock Levels</SelectItem>
                      <SelectItem value="inStock">In Stock Only</SelectItem>
                      <SelectItem value="lowStock">Low Stock (&lt; 20)</SelectItem>
                      <SelectItem value="outOfStock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                {isFilterActive && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    size="sm"
                    className="h-9"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear Filters
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-9">
                  Export Products
                </Button>
              </div>
            </div>

            {isFilterActive && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {categoryFilter}
                      <button onClick={() => setCategoryFilter("all")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter("all")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {stockFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Stock: {
                        stockFilter === "inStock" ? "In Stock" :
                        stockFilter === "lowStock" ? "Low Stock" :
                        "Out of Stock"
                      }
                      <button onClick={() => setStockFilter("all")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {filteredProducts.length !== products.length && (
                <> out of {products.length} total</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Products</CardTitle>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {isFilterActive 
                  ? "Try adjusting your filters or search query"
                  : "No products available. Add your first product!"}
              </p>
              {isFilterActive && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted p-2 rounded">
                            <Package className="h-4 w-4" />
                          </div>
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {product.sku}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatMK(product.price)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatMK(product.cost)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.stock}</span>
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                          )}
                          {product.stock === 0 && (
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          product.status === "In Stock" ? "default" :
                          product.status === "Low Stock" ? "secondary" : "destructive"
                        }>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenModal('view', product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenModal('edit', product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleOpenModal('delete', product)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {actionModalState.product && (
        <ProductActionModal
          isOpen={actionModalState.isOpen}
          onClose={handleCloseModal}
          mode={actionModalState.mode}
          product={actionModalState.product}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  )
}
