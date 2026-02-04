// app/shop-owner/shop-stock/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3
} from "lucide-react"

export default function ShopStockPage() {
  const stockItems = [
    { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", current: 45, min: 10, max: 100, status: "Good" },
    { id: 2, name: "Smart Watch", sku: "SW-002", category: "Electronics", current: 12, min: 15, max: 80, status: "Low" },
    { id: 3, name: "USB-C Cable", sku: "UC-004", category: "Accessories", current: 125, min: 20, max: 200, status: "Good" },
    { id: 4, name: "Phone Case", sku: "PC-005", category: "Accessories", current: 87, min: 25, max: 150, status: "Good" },
    { id: 5, name: "Bluetooth Speaker", sku: "BS-006", category: "Electronics", current: 23, min: 15, max: 75, status: "Good" },
    { id: 6, name: "Desk Lamp", sku: "DL-007", category: "Home", current: 8, min: 10, max: 50, status: "Low" },
    { id: 7, name: "Notebook Set", sku: "NS-008", category: "Stationery", current: 56, min: 30, max: 200, status: "Good" },
    { id: 8, name: "Coffee Mug", sku: "CM-009", category: "Home", current: 0, min: 5, max: 50, status: "Out" },
  ]

  const stockSummary = {
    totalItems: 356,
    lowStock: 12,
    outOfStock: 8,
    inventoryValue: "$45,678.90"
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
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Stock
          </Button>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Order Stock
          </Button>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockSummary.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockSummary.lowStock}</div>
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
            <div className="text-2xl font-bold">{stockSummary.outOfStock}</div>
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
            <div className="text-2xl font-bold">{stockSummary.inventoryValue}</div>
            <p className="text-xs text-green-500">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search stock items..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Status
            </Button>
            <Button variant="outline">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stock Levels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
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
              {stockItems.map((item) => {
                const percentage = (item.current / item.max) * 100
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.current}</TableCell>
                    <TableCell>{item.min}</TableCell>
                    <TableCell>{item.max}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={percentage} className="h-2" />
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
        </CardContent>
      </Card>
    </div>
  )
}