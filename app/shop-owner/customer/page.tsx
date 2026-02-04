// app/shop-owner/customers/page.tsx
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
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Star,
  Eye,
  Edit,
  MessageSquare
} from "lucide-react"

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "John Smith", email: "john@example.com", phone: "+1 (555) 123-4567", joinDate: "2024-01-10", orders: 8, totalSpent: "$1,245.50", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 (555) 987-6543", joinDate: "2024-01-05", orders: 5, totalSpent: "$899.99", status: "Active" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", phone: "+1 (555) 456-7890", joinDate: "2023-12-20", orders: 12, totalSpent: "$2,450.75", status: "VIP" },
    { id: 4, name: "Emma Davis", email: "emma@example.com", phone: "+1 (555) 234-5678", joinDate: "2023-12-15", orders: 3, totalSpent: "$450.25", status: "Active" },
    { id: 5, name: "Robert Brown", email: "robert@example.com", phone: "+1 (555) 876-5432", joinDate: "2023-11-30", orders: 15, totalSpent: "$3,789.90", status: "VIP" },
    { id: 6, name: "Lisa Anderson", email: "lisa@example.com", phone: "+1 (555) 345-6789", joinDate: "2023-11-25", orders: 2, totalSpent: "$199.99", status: "Inactive" },
    { id: 7, name: "David Lee", email: "david@example.com", phone: "+1 (555) 765-4321", joinDate: "2023-11-10", orders: 7, totalSpent: "$1,120.50", status: "Active" },
    { id: 8, name: "Maria Garcia", email: "maria@example.com", phone: "+1 (555) 654-3210", joinDate: "2023-10-28", orders: 10, totalSpent: "$1,890.25", status: "Active" },
  ]

  const customerStats = {
    total: 245,
    active: 189,
    vip: 32,
    newThisMonth: 24
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Customer Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.total}</div>
            <p className="text-xs text-green-500">
              +24 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.active}</div>
            <p className="text-xs text-muted-foreground">
              77% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.vip}</div>
            <p className="text-xs text-green-500">
              13% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.newThisMonth}</div>
            <p className="text-xs text-green-500">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers by name, email, or phone..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              Export Customers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-1 h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {customer.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell className="font-medium">{customer.totalSpent}</TableCell>
                  <TableCell>
                    <Badge variant={
                      customer.status === "VIP" ? "default" :
                      customer.status === "Active" ? "secondary" : "outline"
                    }>
                      {customer.status === "VIP" && <Star className="mr-1 h-3 w-3" />}
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}