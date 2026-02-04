"use client"
import { useState } from "react"
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  Scan, 
  ShoppingCart,
  X,
  Barcode,
  CreditCard,
  Smartphone,
  Wallet,
  Building,
  ChevronLeft,
  Receipt,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PaymentModal } from "../../modal/paymentModal"
import { toast } from "sonner"
import { ReceiptPDF } from "../../pdf/receipt/ReceiptPDF"
import { Label } from "../../ui/label"

// Sample product data
const sampleProducts = [
  { id: 1, name: "iPhone 15 Pro", price: 999000, category: "Electronics", barcode: "123456789" },
  { id: 2, name: "MacBook Air", price: 1299000, category: "Electronics", barcode: "123456790" },
  { id: 3, name: "AirPods Pro", price: 249000, category: "Electronics", barcode: "123456791" },
  { id: 4, name: "Coffee Mug", price: 15000, category: "Home", barcode: "123456792" },
  { id: 5, name: "Wireless Mouse", price: 45000, category: "Electronics", barcode: "123456793" },
  { id: 6, name: "Notebook", price: 8000, category: "Stationery", barcode: "123456794" },
  { id: 7, name: "Water Bottle", price: 25000, category: "Home", barcode: "123456795" },
  { id: 8, name: "USB Cable", price: 12000, category: "Electronics", barcode: "123456796" },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  total: number
}

type PaymentMethod = "cash" | "card" | "mobile" | "bank"

export function PointOfSale() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [customerInfo, setCustomerInfo] = useState<{
    name?: string
    phone?: string
    email?: string
  }>({})
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: ""
  })

  // Filter products based on search and category
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm)
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ["All", ...new Set(sampleProducts.map(p => p.category))]

  // Cart functions
  const addToCart = (product: typeof sampleProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        total: product.price 
      }]
    })
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change)
          return { 
            ...item, 
            quantity: newQuantity, 
            total: newQuantity * item.price 
          }
        }
        return item
      }).filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  // Generate transaction ID
  const generateTransactionId = () => {
    return `TXN-${Date.now().toString().slice(-8)}`
  }

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty", {
        description: "Add items to cart before checkout",
        duration: 3000,
      })
      return
    }
    
    // Show customer info modal before payment
    setShowCustomerModal(true)
  }

  // Handle payment complete
  const handlePaymentComplete = () => {
    const newTransactionId = generateTransactionId()
    setTransactionId(newTransactionId)
    
    // Reset customer info after payment
    setCustomerForm({ name: "", phone: "", email: "" })
    setCustomerInfo({})
    
    // Show success toast
    toast.success("Payment Completed!", {
      description: `Sale of Mk ${formatAmount(total)} processed successfully.`,
      duration: 5000,
      action: {
        label: "View Receipt",
        onClick: () => {
          setShowReceiptModal(true)
        },
      },
    })
    
    // Show receipt modal after a short delay
    setTimeout(() => {
      setShowReceiptModal(true)
    }, 500)
    
    setPaymentModalOpen(false)
  }

  // Handle print receipt
  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      toast.warning("Cannot print empty receipt", {
        description: "Add items to cart first",
        duration: 3000,
      })
      return
    }
    
    const newTransactionId = generateTransactionId()
    setTransactionId(newTransactionId)
    
    // Show receipt modal immediately
    setShowReceiptModal(true)
    
    toast.info("Opening Receipt", {
      description: "Receipt ready for download or print",
      duration: 2000,
    })
  }

  // Simulate barcode scan
  const handleScan = () => {
    if (isScanning) return
    
    setIsScanning(true)
    toast.info("Scanning Barcode...", {
      description: "Please wait while scanning",
      duration: 1500,
    })
    
    setTimeout(() => {
      const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)]
      addToCart(randomProduct)
      
      toast.success("Product Scanned!", {
        description: `${randomProduct.name} added to cart.`,
        duration: 2000,
      })
      
      setIsScanning(false)
    }, 1500)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Format currency helper
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        totalAmount={total}
        onCompletePayment={handlePaymentComplete}
        customerInfo={customerInfo}
      />

      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction Receipt
            </DialogTitle>
            <DialogDescription>
              Transaction ID: {transactionId}
            </DialogDescription>
          </DialogHeader>
          
          <ReceiptPDF
            items={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            paymentMethod={paymentMethod}
            transactionId={transactionId}
            customerInfo={customerInfo}
          />
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowReceiptModal(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowReceiptModal(false)
                toast.info("Sale completed!", {
                  description: "Ready for next customer",
                  duration: 3000,
                })
              }}
              className="flex-1"
            >
              New Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </DialogTitle>
            <DialogDescription>
              Optional: Add customer details for the receipt
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Name</Label>
              <Input
                id="customerName"
                placeholder="Full name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                placeholder="+265 XXX XXX XXX"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomerModal(false)
                setCustomerForm({ name: "", phone: "", email: "" })
              }}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={() => {
                setCustomerInfo({
                  name: customerForm.name.trim() || undefined,
                  phone: customerForm.phone.trim() || undefined,
                  email: customerForm.email.trim() || undefined
                })
                setShowCustomerModal(false)
                setPaymentModalOpen(true)
              }}
              className="flex-1"
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Layout */}
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowCart(!showCart)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <ShoppingCart className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-foreground">
                Point of Sale
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground hidden sm:block">
                Complete sales quickly and efficiently
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {totalItems} items
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (cart.length === 0) {
                  toast.warning("Cart is already empty", { duration: 2000 })
                  return
                }
                clearCart()
                toast.info("Cart Cleared", {
                  description: "All items removed from cart",
                  duration: 2000,
                })
              }}
              disabled={cart.length === 0}
              className="hidden lg:flex"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className={`lg:grid lg:grid-cols-3 gap-6 ${showCart ? 'hidden lg:grid' : ''}`}>
          <div className={`lg:col-span-2 space-y-6 ${showCart ? 'hidden lg:block' : ''}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products or scan barcode..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleScan} 
                      disabled={isScanning}
                      className="flex-1 sm:flex-none"
                    >
                      {isScanning ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Scan className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">
                        {isScanning ? "Scanning..." : "Scan"}
                      </span>
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="w-full mt-4">
                  <div className="flex gap-2 pb-2">
                    {categories.map(category => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Barcode className="h-5 w-5" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-4">
                <ScrollArea className="h-[400px] sm:h-[500px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                    {filteredProducts.map(product => (
                      <Card 
                        key={product.id} 
                        className="cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => {
                          addToCart(product)
                          toast.success("Added to Cart", {
                            description: `${product.name} added to cart`,
                            duration: 2000,
                          })
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                              <p className="text-lg font-bold text-primary mt-2">
                                Mk {formatAmount(product.price)}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(product)
                                toast.success("Added to Cart", {
                                  description: `${product.name} added to cart`,
                                  duration: 2000,
                                })
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{totalItems} items</div>
                  <div className="font-bold text-lg">Mk {formatAmount(total)}</div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (cart.length === 0) {
                        toast.warning("Cart is already empty", { duration: 2000 })
                        return
                      }
                      clearCart()
                      toast.info("Cart Cleared", {
                        description: "All items removed from cart",
                        duration: 2000,
                      })
                    }}
                    disabled={cart.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => setShowCart(true)}
                    disabled={cart.length === 0}
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={`space-y-6 ${!showCart ? 'hidden lg:block' : ''}`}>
            <Card className="lg:sticky lg:top-6">
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowCart(false)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Current Sale</span>
                    </div>
                  </CardTitle>
                  <Badge variant="secondary">
                    Mk {formatAmount(total)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] lg:h-[300px]">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 lg:h-32 text-muted-foreground p-4">
                      <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
                      <p>Cart is empty</p>
                      <p className="text-sm">Add products to get started</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Mk {formatAmount(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">Mk {formatAmount(item.total)}</span>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                  removeFromCart(item.id)
                                  toast.info("Item Removed", {
                                    description: `${item.name} removed from cart`,
                                    duration: 2000,
                                  })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {cart.length > 0 && (
                  <div className="border-t p-4 space-y-2 bg-muted/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>Mk {formatAmount(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%):</span>
                      <span>Mk {formatAmount(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>Mk {formatAmount(total)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Payment Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Select 
                  value={paymentMethod} 
                  onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 mr-2" />
                      Cash
                    </SelectItem>
                    <SelectItem value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Bank Card
                    </SelectItem>
                    <SelectItem value="mobile" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile Money
                    </SelectItem>
                    <SelectItem value="bank" className="flex items-center gap-2">
                      <Building className="h-4 w-4 mr-2" />
                      Bank Transfer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {customerInfo.name ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">{customerInfo.name}</div>
                    {customerInfo.phone && (
                      <div className="text-sm text-muted-foreground">{customerInfo.phone}</div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCustomerForm({ name: "", phone: "", email: "" })
                        setCustomerInfo({})
                      }}
                      className="w-full mt-2"
                    >
                      Change Customer
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCustomerModal(true)}
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                size="lg"
                variant="outline"
                className="h-14"
                onClick={handlePrintReceipt}
                disabled={cart.length === 0}
              >
                <Printer className="h-5 w-5 mr-2" />
                Print Receipt
              </Button>
              <Button
                size="lg"
                className="h-14"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}