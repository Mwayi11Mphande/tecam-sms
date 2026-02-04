// app/shop-owner/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign,
  AlertCircle,
  Calendar,
  BarChart3,
  Download,
  Eye,
  Menu
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ShopOwnerDashboard() {
  const stats = [
    { title: "Today's Revenue", value: "$2,450", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
    { title: "Total Orders", value: "156", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
    { title: "New Customers", value: "24", change: "+15.3%", icon: Users, color: "text-purple-600" },
    { title: "Products", value: "245", change: "12 low stock", icon: Package, color: "text-orange-600" },
  ]

  const recentOrders = [
    { id: "#ORD-001", customer: "John Smith", amount: "$249.99", status: "Delivered", date: "2024-01-15" },
    { id: "#ORD-002", customer: "Sarah Johnson", amount: "$149.50", status: "Processing", date: "2024-01-15" },
    { id: "#ORD-003", customer: "Mike Wilson", amount: "$89.99", status: "Pending", date: "2024-01-14" },
    { id: "#ORD-004", customer: "Emma Davis", amount: "$324.75", status: "Delivered", date: "2024-01-14" },
    { id: "#ORD-005", customer: "Robert Brown", amount: "$199.99", status: "Shipped", date: "2024-01-13" },
  ]

  const lowStockItems = [
    { name: "Wireless Headphones", sku: "WH-001", stock: 5, threshold: 10 },
    { name: "Smart Watch", sku: "SW-002", stock: 8, threshold: 15 },
    { name: "Phone Case", sku: "PC-003", stock: 3, threshold: 20 },
    { name: "USB-C Cable", sku: "UC-004", stock: 12, threshold: 25 },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            {/* Mobile sidebar content - you can reuse your sidebar component here */}
            <div className="py-6">
              <h2 className="text-lg font-semibold mb-4">Business Hub</h2>
              {/* Add your mobile navigation here */}
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Jan 15, 2024</span>
              <span className="sm:hidden">Today</span>
            </Button>
            <Button size="sm" className="text-xs sm:text-sm">
              <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section - Responsive */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" className="flex-1 sm:flex-none">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 sm:flex-none">Analytics</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 sm:flex-none">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {/* Recent Orders Card */}
              <Card className="lg:col-span-4">
                <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="space-y-3 sm:space-y-4">
                    {recentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 sm:pb-4 gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{order.id}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                          <span className="font-medium text-sm sm:text-base">{order.amount}</span>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                order.status === 'Delivered' ? 'default' :
                                order.status === 'Processing' ? 'secondary' :
                                order.status === 'Shipped' ? 'outline' : 'destructive'
                              }
                              className="text-xs"
                            >
                              <span className="hidden sm:inline">{order.status}</span>
                              <span className="sm:hidden">{order.status.charAt(0)}</span>
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert Card */}
              <Card className="lg:col-span-3">
                <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl">Low Stock Alert</CardTitle>
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="space-y-3 sm:space-y-4">
                    {lowStockItems.map((item) => (
                      <div 
                        key={item.sku} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-red-50 rounded-lg"
                      >
                        <div className="flex-1 mb-2 sm:mb-0">
                          <p className="font-medium text-sm sm:text-base">{item.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-bold text-sm sm:text-base">{item.stock} left</p>
                          <p className="text-xs text-muted-foreground">Min: {item.threshold}</p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full text-sm sm:text-base" variant="outline" size="sm">
                      View All Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Cards for Mobile */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Wireless Headphones", "Smart Watch", "USB-C Cable"].map((product, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">{product}</span>
                        <Badge variant="outline">{i + 1}st</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-medium text-green-600">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Order Value</span>
                      <span className="font-medium">$89.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}