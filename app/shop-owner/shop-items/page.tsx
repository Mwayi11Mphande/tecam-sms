// app/shop-owner/shop-items/page.tsx
"use client"

import { useState, useMemo } from "react"
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
  X
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
import { AddProductModal } from "@/components/modal/addProductModal"
import { Product, ProductActionModal } from "@/components/modal/ProductActionModal"

export default function ShopItemsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", price: "$99.99", cost: "$45.00", stock: 45, status: "In Stock", description: "Premium wireless headphones with noise cancellation", salesCount: 24, createdAt: "2023-06-15" },
    { id: 2, name: "Smart Watch", sku: "SW-002", category: "Electronics", price: "$199.99", cost: "$85.00", stock: 12, status: "Low Stock", description: "Smart watch with health monitoring features", salesCount: 18, createdAt: "2023-08-20" },
    { id: 3, name: "Laptop Backpack", sku: "LB-003", category: "Accessories", price: "$49.99", cost: "$22.50", stock: 0, status: "Out of Stock", description: "Water-resistant laptop backpack with USB port", salesCount: 32, createdAt: "2023-07-10" },
    { id: 4, name: "USB-C Cable", sku: "UC-004", category: "Accessories", price: "$19.99", cost: "$8.50", stock: 125, status: "In Stock", description: "High-speed USB-C charging cable, 2m length", salesCount: 87, createdAt: "2023-09-05" },
    { id: 5, name: "Phone Case", sku: "PC-005", category: "Accessories", price: "$29.99", cost: "$12.00", stock: 87, status: "In Stock", description: "Shockproof phone case with screen protector", salesCount: 45, createdAt: "2023-05-22" },
    { id: 6, name: "Bluetooth Speaker", sku: "BS-006", category: "Electronics", price: "$79.99", cost: "$35.00", stock: 23, status: "In Stock", description: "Portable Bluetooth speaker with 12h battery", salesCount: 29, createdAt: "2023-10-15" },
    { id: 7, name: "Desk Lamp", sku: "DL-007", category: "Home", price: "$39.99", cost: "$18.00", stock: 8, status: "Low Stock", description: "LED desk lamp with adjustable brightness", salesCount: 16, createdAt: "2023-04-18" },
    { id: 8, name: "Notebook Set", sku: "NS-008", category: "Stationery", price: "$24.99", cost: "$10.00", stock: 56, status: "In Stock", description: "Premium notebook set with pen holder", salesCount: 38, createdAt: "2023-03-12" },
  ])

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

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    return ["all", ...uniqueCategories]
  }, [products])

  // Get unique statuses for filter dropdown
  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(products.map(p => p.status)))
    return ["all", ...uniqueStatuses]
  }, [products])

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query filter
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = categoryFilter === "all" || 
        product.category === categoryFilter

      // Status filter
      const matchesStatus = statusFilter === "all" || 
        product.status === statusFilter

      // Stock filter
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

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setStockFilter("all")
  }

  // Check if any filter is active
  const isFilterActive = searchQuery !== "" || 
    categoryFilter !== "all" || 
    statusFilter !== "all" || 
    stockFilter !== "all"

  const handleAddProduct = (productData: any) => {
    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name: productData.name,
      sku: productData.sku,
      category: productData.category,
      price: `$${parseFloat(productData.price).toFixed(2)}`,
      cost: `$${parseFloat(productData.cost).toFixed(2)}`,
      stock: productData.stock,
      status: productData.stock === 0 ? "Out of Stock" : 
              productData.stock < 10 ? "Low Stock" : "In Stock",
      description: productData.description,
      supplier: productData.supplier,
      barcode: productData.barcode,
      weight: productData.weight,
      dimensions: productData.dimensions,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setProducts(prev => [...prev, newProduct])
    setIsAddProductModalOpen(false)
    alert("Product added successfully!")
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

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )
    handleCloseModal()
    alert("Product updated successfully!")
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
    handleCloseModal()
    alert("Product deleted successfully!")
  }

  // Calculate statistics based on filtered products
  const stats = useMemo(() => {
    const total = filteredProducts.length
    const inStock = filteredProducts.filter(p => p.status === "In Stock").length
    const lowStock = filteredProducts.filter(p => p.status === "Low Stock").length
    const outOfStock = filteredProducts.filter(p => p.status === "Out of Stock").length
    
    return { total, inStock, lowStock, outOfStock }
  }, [filteredProducts])

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

      {/* Quick Stats */}
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
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

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex flex-wrap gap-3 flex-1">
                {/* Category Filter */}
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

                {/* Status Filter */}
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

                {/* Stock Level Filter */}
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

              {/* Action Buttons */}
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

            {/* Active Filters Display */}
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

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {filteredProducts.length !== products.length && (
                <> out of {products.length} total</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
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
                      <TableCell className="font-medium">{product.price}</TableCell>
                      <TableCell className="text-muted-foreground">{product.cost}</TableCell>
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

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Product Action Modal */}
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