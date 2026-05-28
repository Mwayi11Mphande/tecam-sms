// components/pos/view-sales.tsx
"use client"

import { useEffect, useMemo } from "react"
import { format, isToday, isYesterday } from "date-fns"

import {
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react"

import { useSalesStore } from "@/stores/sales/useSalesStore"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

export function ViewSales() {
  const { sales, fetchSales, isLoading } =
    useSalesStore()

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const today = format(
    new Date(),
    "MMMM dd, yyyy"
  )

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

  // -----------------------------------
  // FILTER SALES
  // -----------------------------------

  const todaySales = useMemo(() => {
    return sales.filter((sale) =>
      isToday(new Date(sale.createdAt))
    )
  }, [sales])

  const yesterdaySales = useMemo(() => {
    return sales.filter((sale) =>
      isYesterday(
        new Date(sale.createdAt)
      )
    )
  }, [sales])

  // -----------------------------------
  // SUMMARY
  // -----------------------------------

  const summary = useMemo(() => {
    const totalSales =
      todaySales.reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      )

    const yesterdayTotal =
      yesterdaySales.reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      )

    const totalItems =
      todaySales.reduce(
        (sum, sale) =>
          sum + sale.totalItems,
        0
      )

    const averageTransaction =
      todaySales.length > 0
        ? totalSales /
        todaySales.length
        : 0

    const growth =
      yesterdayTotal > 0
        ? ((totalSales -
          yesterdayTotal) /
          yesterdayTotal) *
        100
        : 0

    return {
      totalSales,
      totalItems,
      totalTransactions:
        todaySales.length,
      averageTransaction,
      todaySales: totalSales,
      yesterdaySales:
        yesterdayTotal,
      growth,
    }
  }, [todaySales, yesterdaySales])

  // -----------------------------------
  // TOP SELLING ITEMS
  // -----------------------------------

  const topSellingItems = useMemo(() => {
    const itemsMap = new Map<
      string,
      {
        name: string
        sold: number
        revenue: number
      }
    >()

    sales.forEach((sale) => {
      sale.saleItems.forEach((item) => {
        const existing =
          itemsMap.get(item.name)

        if (existing) {
          existing.sold +=
            item.quantity

          existing.revenue += Number(
            item.total
          )
        } else {
          itemsMap.set(item.name, {
            name: item.name,
            sold: item.quantity,
            revenue: Number(
              item.total
            ),
          })
        }
      })
    })

    return Array.from(
      itemsMap.values()
    )
      .sort(
        (a, b) =>
          b.sold - a.sold
      )
      .slice(0, 5)
  }, [sales])

  // -----------------------------------
  // LOADING
  // -----------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-foreground">
            Sales Dashboard
          </h1>

          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {today}
          </p>
        </div>

        <Badge
          variant="outline"
          className="text-sm"
        >
          Live Updates
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Sales */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
              <span>
                Today's Sales
              </span>

              <DollarSign className="h-4 w-4" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              Mk{" "}
              {formatAmount(
                summary.todaySales
              )}
            </div>

            <div className="flex items-center gap-1 text-sm mt-2">
              {summary.growth >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-600" />
              )}

              <span
                className={
                  summary.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {summary.growth.toFixed(
                  1
                )}
                % from yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Items Sold */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center justify-between">
              <span>
                Items Sold Today
              </span>

              <Package className="h-4 w-4" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {summary.totalItems}
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Across all transactions
            </p>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center justify-between">
              <span>
                Transactions Today
              </span>

              <TrendingUp className="h-4 w-4" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {
                summary.totalTransactions
              }
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Completed sales
            </p>
          </CardContent>
        </Card>

        {/* Avg Transaction */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center justify-between">
              <span>
                Avg Transaction
              </span>

              <DollarSign className="h-4 w-4" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              Mk{" "}
              {formatAmount(
                summary.averageTransaction
              )}
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Per sale today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Recent Transactions
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Receipt
                  </TableHead>

                  <TableHead>
                    Cashier
                  </TableHead>

                  <TableHead>
                    Items
                  </TableHead>

                  <TableHead>
                    Total
                  </TableHead>

                  <TableHead>
                    Payment
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sales
                  .slice(0, 10)
                  .map((sale) => (
                    <TableRow
                      key={sale.id}
                    >
                      <TableCell className="font-medium">
                        {
                          sale.receiptNumber
                        }
                      </TableCell>

                      <TableCell>
                        {
                          sale.cashier
                            ?.fullName
                        }
                      </TableCell>

                      <TableCell>
                        {
                          sale.totalItems
                        }
                      </TableCell>

                      <TableCell>
                        Mk{" "}
                        {formatAmount(
                          Number(
                            sale.total
                          )
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {
                            sale.paymentMethod
                          }
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Selling */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Top Selling Items
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Product
                  </TableHead>

                  <TableHead className="text-right">
                    Sold
                  </TableHead>

                  <TableHead className="text-right">
                    Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {topSellingItems.map(
                  (item) => (
                    <TableRow
                      key={item.name}
                    >
                      <TableCell className="font-medium">
                        {
                          item.name
                        }
                      </TableCell>

                      <TableCell className="text-right">
                        {item.sold}
                      </TableCell>

                      <TableCell className="text-right">
                        Mk{" "}
                        {formatAmount(
                          item.revenue
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Today's Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {
                  summary.totalTransactions
                }
              </div>

              <div className="text-sm text-gray-600">
                Transactions
              </div>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  summary.totalItems
                }
              </div>

              <div className="text-sm text-gray-600">
                Total Items Sold
              </div>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                Mk{" "}
                {formatAmount(
                  summary.totalSales
                )}
              </div>

              <div className="text-sm text-gray-600">
                Total Revenue
              </div>
            </div>

            {/* <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {topSellingItems.length}
              </div>

              <div className="text-sm text-gray-600">
                Products Sold
              </div>
            </div> */}
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                Mk{" "}
                {formatAmount(
                  todaySales.reduce(
                    (sum, sale) =>
                      sum + Number(sale.vatAmount),
                    0
                  )
                )}
              </div>

              <div className="text-sm text-gray-600">
                VAT Collected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}