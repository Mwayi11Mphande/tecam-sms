"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Package,
  Download,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SearchContainer } from "@/components/dashboard/search/search"

import { ShopItemsTable } from "@/components/table/view-items"
import { useProductsStore } from "@/stores/products/productsStore"


export default function ViewShopItems() {
  const {
    products,
    fetchProducts,
    loading,
  } = useProductsStore()

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("all")

  const [
    stockFilter,
    setStockFilter,
  ] = useState("all")

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // -----------------------------------
  // FILTERS
  // -----------------------------------

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.sku
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter

      let matchesStock = true

      if (stockFilter === "inStock") {
        matchesStock =
          item.stockQty > 0
      } else if (
        stockFilter === "lowStock"
      ) {
        matchesStock =
          item.stockQty > 0 &&
          item.stockQty <=
            item.lowStockThreshold
      } else if (
        stockFilter === "outOfStock"
      ) {
        matchesStock =
          item.stockQty === 0
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStock
      )
    })
  }, [
    products,
    searchTerm,
    statusFilter,
    stockFilter,
  ])

  // -----------------------------------
  // SUMMARY
  // -----------------------------------

  const inStockCount =
    products.filter(
      (p) => p.stockQty > 0
    ).length

  const lowStockCount =
    products.filter(
      (p) =>
        p.stockQty > 0 &&
        p.stockQty <=
          p.lowStockThreshold
    ).length

  const outOfStockCount =
    products.filter(
      (p) => p.stockQty === 0
    ).length

  const totalInventoryValue =
    products.reduce((sum, item) => {
      return (
        sum +
        item.price * item.stockQty
      )
    }, 0)

  // -----------------------------------
  // HELPERS
  // -----------------------------------

  const formatAmount = (
    amount: number
  ) => {
    return amount.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setStockFilter("all")
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    stockFilter !== "all"

  // -----------------------------------
  // LOADING
  // -----------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        Loading products...
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      <div className="@container/main flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-card rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Shop Items
              </h1>

              <p className="text-muted-foreground mt-1">
                View inventory items
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <SearchContainer
              searchTerm={
                searchTerm
              }
              setSearchTerm={
                setSearchTerm
              }
              hasActiveFilters={
                hasActiveFilters
              }
              onClearFilters={
                clearFilters
              }
            />

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-sm bg-primary/10 text-primary px-3 py-1.5"
              >
                {
                  filteredProducts.length
                }{" "}
                items
              </Badge>

              <Button
                variant="outline"
                size="sm"
                className="h-9"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                In Stock
              </p>

              <h3 className="text-2xl font-bold text-foreground">
                {inStockCount}
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Low Stock
              </p>

              <h3 className="text-2xl font-bold text-foreground">
                {
                  lowStockCount
                }
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Out of Stock
              </p>

              <h3 className="text-2xl font-bold text-foreground">
                {
                  outOfStockCount
                }
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Inventory Value
              </p>

              <h3 className="text-2xl font-bold text-foreground">
                Mk{" "}
                {formatAmount(
                  totalInventoryValue
                )}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>

            <Select
              value={statusFilter}
              onValueChange={
                setStatusFilter
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Statuses
                </SelectItem>

                <SelectItem value="ACTIVE">
                  ACTIVE
                </SelectItem>

                <SelectItem value="INACTIVE">
                  INACTIVE
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Stock Level
            </label>

            <Select
              value={stockFilter}
              onValueChange={
                setStockFilter
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stock" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Stock
                </SelectItem>

                <SelectItem value="inStock">
                  In Stock
                </SelectItem>

                <SelectItem value="lowStock">
                  Low Stock
                </SelectItem>

                <SelectItem value="outOfStock">
                  Out of Stock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Active Filters
            </label>

            <div className="text-sm">
              {hasActiveFilters ? (
                <div className="flex flex-wrap gap-1">
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      Search: "
                      {
                        searchTerm
                      }
                      "
                    </Badge>
                  )}

                  {statusFilter !==
                    "all" && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      Status:{" "}
                      {
                        statusFilter
                      }
                    </Badge>
                  )}

                  {stockFilter !==
                    "all" && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      Stock:{" "}
                      {
                        stockFilter
                      }
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">
                  No filters
                  applied
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" />
              Products Inventory (
              {
                filteredProducts.length
              }{" "}
              items)
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ShopItemsTable
              products={
                filteredProducts
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}