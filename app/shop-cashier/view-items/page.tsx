"use client"

import { useState, useMemo } from "react"
import { Package, Download, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchContainer } from "@/components/dashboard/search/search"
import { ShopItemsTable } from "@/components/table/view-items"

type ProductItem = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: string;
  cost: string;
  stock: number;
  status: string;
  description?: string;
  supplier?: string;
}

// Sample product data (same as before)
const productsData: ProductItem[] = [
  // ... your sample data
]

export default function ViewShopItems() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  // Extract unique categories and statuses
  const categories = useMemo(() => {
    return [...new Set(productsData.map(item => item.category))].filter(Boolean)
  }, [productsData])

  const statuses = useMemo(() => {
    return [...new Set(productsData.map(item => item.status))].filter(Boolean)
  }, [productsData])

  // Filter products
  const filteredProducts = useMemo(() => {
    return productsData.filter((item) => {
      const matchesSearch = searchTerm === "" || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      let matchesStock = true
      if (stockFilter === "inStock") {
        matchesStock = item.stock > 0
      } else if (stockFilter === "lowStock") {
        matchesStock = item.stock > 0 && item.stock < 20
      } else if (stockFilter === "outOfStock") {
        matchesStock = item.stock === 0
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesStock
    })
  }, [searchTerm, statusFilter, categoryFilter, stockFilter])

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setStockFilter("all")
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || categoryFilter !== "all" || stockFilter !== "all"

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      <div className="@container/main flex flex-1 flex-col gap-6 p-6">
        
        {/* Header Section - Simplified */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-card rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Shop Items
              </h1>
              <p className="text-muted-foreground mt-1">View inventory items - Read Only</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Simple search in header */}
            <SearchContainer 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm bg-primary/10 text-primary px-3 py-1.5">
                {filteredProducts.length} items
              </Badge>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Stock</p>
              <h3 className="text-2xl font-bold text-foreground">
                {productsData.filter(p => p.status === "In Stock").length}
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <h3 className="text-2xl font-bold text-foreground">
                {productsData.filter(p => p.status === "Low Stock").length}
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <h3 className="text-2xl font-bold text-foreground">
                {productsData.filter(p => p.status === "Out of Stock").length}
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <h3 className="text-2xl font-bold text-foreground">
                ${productsData.reduce((sum, item) => {
                  const price = parseFloat(item.price.replace('$', '')) || 0
                  return sum + (price * item.stock)
                }, 0).toFixed(2)}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Stock Level</label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="inStock">In Stock</SelectItem>
                <SelectItem value="lowStock">Low Stock</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Active Filters</label>
            <div className="text-sm">
              {hasActiveFilters ? (
                <div className="flex flex-wrap gap-1">
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      Status: {statusFilter}
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      Category: {categoryFilter}
                    </Badge>
                  )}
                  {stockFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      Stock: {stockFilter}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">No filters applied</span>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" />
              Products Inventory ({filteredProducts.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ShopItemsTable 
              products={filteredProducts}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}