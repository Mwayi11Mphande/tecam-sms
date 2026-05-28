// components/tables/shop-items-table.tsx
"use client"

import { useState } from "react"
import {
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Product } from "@/lib/api/types"

interface ShopItemsTableProps {
  products: Product[]
  onView?: (product: Product) => void
}

export function ShopItemsTable({
  products,
  onView,
}: ShopItemsTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1)

  const [itemsPerPage, setItemsPerPage] =
    useState(10)

  // -----------------------------
  // Pagination
  // -----------------------------

  const totalItems = products.length

  const totalPages = Math.ceil(
    totalItems / itemsPerPage
  )

  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatAmount = (
    amount: number
  ) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getStockStatus = (
    product: Product
  ) => {
    if (product.stockQty === 0) {
      return "Out of Stock"
    }

    if (
      product.stockQty <=
      product.lowStockThreshold
    ) {
      return "Low Stock"
    }

    return "In Stock"
  }

  const getStatusVariant = (
    status: string
  ) => {
    switch (status) {
      case "In Stock":
        return "default"

      case "Low Stock":
        return "secondary"

      case "Out of Stock":
        return "destructive"

      default:
        return "outline"
    }
  }

  // -----------------------------
  // Navigation
  // -----------------------------

  const goToPage = (page: number) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []

    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pageNumbers.push(i)
      }
    } else {
      let start = Math.max(
        1,
        currentPage - 2
      )

      let end = Math.min(
        totalPages,
        start + maxVisiblePages - 1
      )

      if (
        end - start + 1 <
        maxVisiblePages
      ) {
        start = Math.max(
          1,
          end - maxVisiblePages + 1
        )
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {Math.min(
            (currentPage - 1) *
              itemsPerPage +
              1,
            totalItems
          )}
          -
          {Math.min(
            currentPage * itemsPerPage,
            totalItems
          )}{" "}
          of {totalItems} items
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Show:
          </span>

          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">
                10
              </SelectItem>

              <SelectItem value="20">
                20
              </SelectItem>

              <SelectItem value="50">
                50
              </SelectItem>

              <SelectItem value="100">
                100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">
                Product
              </TableHead>

              <TableHead>
                SKU
              </TableHead>

              <TableHead>
                Price
              </TableHead>

              <TableHead>
                Cost
              </TableHead>

              <TableHead>
                Stock
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              {onView && (
                <TableHead>
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    onView ? 7 : 6
                  }
                  className="py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground" />

                    <h3 className="text-lg font-medium">
                      No products found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      No products available
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((product) => {
                const stockStatus =
                  getStockStatus(product)

                return (
                  <TableRow
                    key={product.id}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Package className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <div className="font-medium">
                            {product.name}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Created{" "}
                            {new Date(
                              product.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {product.sku}
                      </code>
                    </TableCell>

                    <TableCell className="font-semibold">
                      Mk{" "}
                      {formatAmount(
                        product.price
                      )}
                    </TableCell>

                    <TableCell>
                      Mk{" "}
                      {formatAmount(
                        product.cost
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`font-medium ${
                          product.stockQty === 0
                            ? "text-red-600"
                            : product.stockQty <=
                              product.lowStockThreshold
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stockQty}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getStatusVariant(
                          stockStatus
                        )}
                      >
                        {stockStatus}
                      </Badge>
                    </TableCell>

                    {onView && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onView(product)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of{" "}
            {totalPages}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                goToPage(currentPage - 1)
              }
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map(
              (pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={
                    currentPage ===
                    pageNumber
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    goToPage(pageNumber)
                  }
                  className="h-8 w-8 p-0"
                >
                  {pageNumber}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                goToPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages
              }
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                goToPage(totalPages)
              }
              disabled={
                currentPage === totalPages
              }
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}