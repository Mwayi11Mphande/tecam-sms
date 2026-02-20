// app/dev-dash/shops/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  IconBuildingStore, 
  IconSearch, 
  IconFilter,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconCreditCard,
  IconCheck,
  IconX,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconCurrencyDollar,
  IconUsers,
  IconPackage,
  IconReceipt,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data - replace with actual API calls
const shops = [
  {
    id: "1",
    name: "Tech Haven",
    owner: "John Doe",
    email: "john@techhaven.com",
    phone: "+1 234-567-8901",
    status: "active",
    plan: "Premium",
    joinedDate: "2024-01-15",
    revenue: 12450,
    staff: 5,
    address: "123 Tech Street, Silicon Valley, CA 94025",
    description: "Electronics and gadgets store",
    lastPayment: "2024-02-01",
    nextBilling: "2024-03-01",
    paymentMethod: "Visa **** 4242",
    totalOrders: 1250,
    avgOrderValue: 99.50,
  },
  {
    id: "2",
    name: "Fashion Hub",
    owner: "Jane Smith",
    email: "jane@fashionhub.com",
    phone: "+1 234-567-8902",
    status: "active",
    plan: "Professional",
    joinedDate: "2024-01-10",
    revenue: 8450,
    staff: 3,
    address: "456 Fashion Ave, New York, NY 10018",
    description: "Clothing and accessories boutique",
    lastPayment: "2024-02-01",
    nextBilling: "2024-03-01",
    paymentMethod: "PayPal",
    totalOrders: 890,
    avgOrderValue: 95.00,
  },
  {
    id: "3",
    name: "Grocery Mart",
    owner: "Bob Johnson",
    email: "bob@grocerymart.com",
    phone: "+1 234-567-8903",
    status: "pending",
    plan: "Basic",
    joinedDate: "2024-01-18",
    revenue: 0,
    staff: 2,
    address: "789 Market St, Chicago, IL 60607",
    description: "Local grocery and fresh produce",
    lastPayment: null,
    nextBilling: null,
    paymentMethod: "Bank Transfer",
    totalOrders: 0,
    avgOrderValue: 0,
  },
  {
    id: "4",
    name: "Bookstore Plus",
    owner: "Alice Brown",
    email: "alice@bookstore.com",
    phone: "+1 234-567-8904",
    status: "suspended",
    plan: "Professional",
    joinedDate: "2023-12-05",
    revenue: 5600,
    staff: 4,
    address: "321 Reader's Lane, Boston, MA 02108",
    description: "Independent bookstore and café",
    lastPayment: "2024-01-15",
    nextBilling: "2024-02-15",
    paymentMethod: "Visa **** 1234",
    totalOrders: 450,
    avgOrderValue: 45.00,
    suspensionReason: "Payment failed for 2 consecutive months",
  },
  {
    id: "5",
    name: "Electronics World",
    owner: "Charlie Wilson",
    email: "charlie@electronics.com",
    phone: "+1 234-567-8905",
    status: "active",
    plan: "Premium",
    joinedDate: "2024-01-03",
    revenue: 18900,
    staff: 8,
    address: "555 Digital Drive, Austin, TX 78701",
    description: "Consumer electronics and repairs",
    lastPayment: "2024-02-01",
    nextBilling: "2024-03-01",
    paymentMethod: "Amex **** 9876",
    totalOrders: 2100,
    avgOrderValue: 150.00,
  },
]

// Types
interface Shop {
  id: string
  name: string
  owner: string
  email: string
  phone: string
  status: string
  plan: string
  joinedDate: string
  revenue: number
  staff: number
  address: string
  description: string
  lastPayment: string | null
  nextBilling: string | null
  paymentMethod: string
  totalOrders: number
  avgOrderValue: number
  suspensionReason?: string
}

export default function ShopsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [statsSheetOpen, setStatsSheetOpen] = useState(false)
  
  // Form states
  const [editFormData, setEditFormData] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    plan: "",
  })
  
  const [rejectionReason, setRejectionReason] = useState("")
  const [suspensionReason, setSuspensionReason] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || shop.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewShop = (shop: Shop) => {
    setSelectedShop(shop)
    setViewDialogOpen(true)
  }

  const handleEditShop = (shop: Shop) => {
    setSelectedShop(shop)
    setEditFormData({
      name: shop.name,
      owner: shop.owner,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      description: shop.description,
      plan: shop.plan,
    })
    setEditDialogOpen(true)
  }

  const handleManageSubscription = (shop: Shop) => {
    setSelectedShop(shop)
    setSelectedPlan(shop.plan)
    setSubscriptionDialogOpen(true)
  }

  const handleDeleteShop = (shop: Shop) => {
    setSelectedShop(shop)
    setDeleteDialogOpen(true)
  }

  const handleApproveShop = (shop: Shop) => {
    setSelectedShop(shop)
    setApproveDialogOpen(true)
  }

  const handleRejectShop = (shop: Shop) => {
    setSelectedShop(shop)
    setRejectionReason("")
    setRejectDialogOpen(true)
  }

  const handleSuspendShop = (shop: Shop) => {
    setSelectedShop(shop)
    setSuspensionReason("")
    setSuspendDialogOpen(true)
  }

  const handleRecordPayment = (shop: Shop) => {
    setSelectedShop(shop)
    setPaymentAmount("")
    setPaymentMethod("")
    setPaymentDialogOpen(true)
  }

  const handleViewStats = (shop: Shop) => {
    setSelectedShop(shop)
    setStatsSheetOpen(true)
  }

  const handleSaveEdit = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Updating shop:", selectedShop?.id, editFormData)
    setIsProcessing(false)
    setEditDialogOpen(false)
    // Show success toast/message
  }

  const handleConfirmDelete = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Deleting shop:", selectedShop?.id)
    setIsProcessing(false)
    setDeleteDialogOpen(false)
  }

  const handleConfirmApprove = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Approving shop:", selectedShop?.id)
    setIsProcessing(false)
    setApproveDialogOpen(false)
  }

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Rejecting shop:", selectedShop?.id, "Reason:", rejectionReason)
    setIsProcessing(false)
    setRejectDialogOpen(false)
  }

  const handleConfirmSuspend = async () => {
    if (!suspensionReason.trim()) {
      alert("Please provide a reason for suspension")
      return
    }
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Suspending shop:", selectedShop?.id, "Reason:", suspensionReason)
    setIsProcessing(false)
    setSuspendDialogOpen(false)
  }

  const handleUpdateSubscription = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Updating subscription for:", selectedShop?.id, "New plan:", selectedPlan)
    setIsProcessing(false)
    setSubscriptionDialogOpen(false)
  }

  const handleRecordPaymentSubmit = async () => {
    if (!paymentAmount || !paymentMethod) {
      alert("Please fill in all payment details")
      return
    }
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Recording payment:", {
      shopId: selectedShop?.id,
      amount: paymentAmount,
      method: paymentMethod
    })
    setIsProcessing(false)
    setPaymentDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
          <p className="text-muted-foreground">Manage all shops and their owners</p>
        </div>
        <Button onClick={() => router.push("/dev-dash/shops/create")}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create New Shop
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shops</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Shops</CardTitle>
              <CardDescription>
                Total {shops.length} shops registered on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search shops by name, owner, or email..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <IconFilter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("suspended")}>
                      Suspended
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShops.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell className="font-medium">{shop.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{shop.owner.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{shop.owner}</p>
                              <p className="text-xs text-muted-foreground">{shop.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(shop.status)}</TableCell>
                        <TableCell>{shop.plan}</TableCell>
                        <TableCell>{new Date(shop.joinedDate).toLocaleDateString()}</TableCell>
                        <TableCell>${shop.revenue.toLocaleString()}</TableCell>
                        <TableCell>{shop.staff}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <IconDotsVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewShop(shop)}>
                                <IconEye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditShop(shop)}>
                                <IconEdit className="mr-2 h-4 w-4" />
                                Edit Shop
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageSubscription(shop)}>
                                <IconCreditCard className="mr-2 h-4 w-4" />
                                Manage Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRecordPayment(shop)}>
                                <IconCurrencyDollar className="mr-2 h-4 w-4" />
                                Record Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewStats(shop)}>
                                <IconPackage className="mr-2 h-4 w-4" />
                                View Statistics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {shop.status === "pending" ? (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => handleApproveShop(shop)}
                                    className="text-green-600"
                                  >
                                    <IconCheck className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleRejectShop(shop)}
                                    className="text-red-600"
                                  >
                                    <IconX className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              ) : shop.status === "active" ? (
                                <DropdownMenuItem 
                                  onClick={() => handleSuspendShop(shop)}
                                  className="text-yellow-600"
                                >
                                  <IconX className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteShop(shop)}
                                className="text-red-600"
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Shop Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
            <DialogDescription>
              Detailed information about the shop
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">{selectedShop.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedShop.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedShop.description}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedShop.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Plan</Label>
                    <p className="font-medium">{selectedShop.plan}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Owner Information</Label>
                  <div className="mt-2 space-y-2 bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <IconUser className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedShop.owner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconMail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedShop.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedShop.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="mt-1 text-sm">{selectedShop.address}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Payment Information</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2 bg-muted/50 p-3 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Last Payment</p>
                      <p className="font-medium">{selectedShop.lastPayment || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Next Billing</p>
                      <p className="font-medium">{selectedShop.nextBilling || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{selectedShop.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Statistics</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 p-2 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                      <p className="font-bold">{selectedShop.totalOrders}</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Avg Order</p>
                      <p className="font-bold">${selectedShop.avgOrderValue}</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Staff</p>
                      <p className="font-bold">{selectedShop.staff}</p>
                    </div>
                  </div>
                </div>

                {selectedShop.suspensionReason && (
                  <div>
                    <Label className="text-muted-foreground">Suspension Reason</Label>
                    <p className="mt-1 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded">
                      {selectedShop.suspensionReason}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Joined Date</Label>
                  <p className="mt-1 text-sm flex items-center gap-2">
                    <IconCalendar className="h-4 w-4" />
                    {new Date(selectedShop.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shop Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Update shop information
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={editFormData.owner}
                  onChange={(e) => setEditFormData({...editFormData, owner: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select 
                  value={editFormData.plan} 
                  onValueChange={(value) => setEditFormData({...editFormData, plan: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Subscription Dialog */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Update subscription plan for {selectedShop?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <p className="text-sm font-medium">{selectedShop.plan}</p>
              </div>
              
              <div className="space-y-2">
                <Label>New Plan</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg">
                    <RadioGroupItem value="Basic" id="basic" />
                    <Label htmlFor="basic" className="flex-1">
                      <div className="font-medium">Basic</div>
                      <p className="text-sm text-muted-foreground">$99/month - Up to 3 staff</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg">
                    <RadioGroupItem value="Professional" id="professional" />
                    <Label htmlFor="professional" className="flex-1">
                      <div className="font-medium">Professional</div>
                      <p className="text-sm text-muted-foreground">$149/month - Up to 10 staff</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg">
                    <RadioGroupItem value="Premium" id="premium" />
                    <Label htmlFor="premium" className="flex-1">
                      <div className="font-medium">Premium</div>
                      <p className="text-sm text-muted-foreground">$299/month - Unlimited staff</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium">Billing Information</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Next billing date: {selectedShop.nextBilling || 'Not scheduled'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Payment method: {selectedShop.paymentMethod}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscriptionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubscription} disabled={isProcessing}>
              {isProcessing ? "Updating..." : "Update Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a manual payment for {selectedShop?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="299.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference (Optional)</Label>
                <Input
                  id="reference"
                  placeholder="Invoice # or transaction ID"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sendReceipt" />
                <Label htmlFor="sendReceipt">Send receipt to customer</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPaymentSubmit} disabled={isProcessing}>
              {isProcessing ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shop Statistics Sheet */}
      <Sheet open={statsSheetOpen} onOpenChange={setStatsSheetOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Shop Statistics</SheetTitle>
            <SheetDescription>
              Performance metrics for {selectedShop?.name}
            </SheetDescription>
          </SheetHeader>
          {selectedShop && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${selectedShop.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Lifetime</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedShop.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Order Value</span>
                      <span className="font-medium">${selectedShop.avgOrderValue}</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Staff Efficiency</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Last Order</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Payment</span>
                      <span className="text-muted-foreground">{selectedShop.lastPayment || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Staff Logins Today</span>
                      <span className="text-muted-foreground">{Math.floor(selectedShop.staff * 0.8)} active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedShop?.name} and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Shop Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Shop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedShop?.name}?
              The shop owner will be notified and can start using the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApprove} className="bg-green-600">
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Shop Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Shop</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting {selectedShop?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReject} className="bg-red-600">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Shop Dialog */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Shop</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for suspending {selectedShop?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter suspension reason..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSuspend} className="bg-yellow-600">
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}