"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Trash2,
  Printer,
  Search,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Scissors,
  Minus,
  ShoppingCart,
  DollarSign,
  Tag,
  User,
  Phone,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { serviceApi } from "@/lib/services/service.service"
import { saleService } from "@/lib/services/sale.service"
import { formatMK } from "@/lib/currency"

interface ServiceDef {
  id: string
  name: string
  price: number
}

interface CartItem {
  id: string
  serviceId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "MOBILE_MONEY", label: "Mobile Money", icon: Smartphone },
  { value: "CARD", label: "Bank Card", icon: CreditCard },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Landmark },
]

export function ServicesPage() {
  const [services, setServices] = useState<ServiceDef[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("CASH")
  const [amountPaid, setAmountPaid] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [receiptSale, setReceiptSale] = useState<any>(null)
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      setLoading(true)
      setError(null)
      const res = await serviceApi.getAll()
      const data = Array.isArray(res) ? res : ((res as any).services || (res as any).data || [])
      setServices(Array.isArray(data) ? data.filter((s: any) => s.isActive !== false) : [])
    } catch (err: any) {
      setError(err.message || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  )

  function addToCart(svc: ServiceDef) {
    setCart(prev => {
      const existing = prev.find(c => c.serviceId === svc.id)
      if (existing) {
        const qty = existing.quantity + 1
        return prev.map(c =>
          c.serviceId === svc.id
            ? { ...c, quantity: qty, total: qty * c.unitPrice }
            : c
        )
      }
      return [...prev, {
        id: svc.id,
        serviceId: svc.id,
        name: svc.name,
        quantity: 1,
        unitPrice: svc.price,
        total: svc.price,
      }]
    })
  }

  function updateQty(serviceId: string, delta: number) {
    setCart(prev =>
      prev.map(c => {
        if (c.serviceId !== serviceId) return c
        const qty = Math.max(0, c.quantity + delta)
        if (qty === 0) return null
        return { ...c, quantity: qty, total: qty * c.unitPrice }
      }).filter(Boolean) as CartItem[]
    )
  }

  function removeFromCart(serviceId: string) {
    setCart(prev => prev.filter(c => c.serviceId !== serviceId))
  }

  const subtotal = cart.reduce((s, c) => s + c.total, 0)

  function openPayment() {
    if (cart.length === 0) {
      toast.error("Cart is empty")
      return
    }
    setAmountPaid(String(subtotal))
    setSelectedMethod("CASH")
    setPaymentDialogOpen(true)
  }

  async function submitSale() {
    try {
      setSubmitting(true)
      const shopId = localStorage.getItem("shopId") || ""

      const items = cart.map(c => ({
        serviceId: c.serviceId,
        type: "SERVICE" as const,
        name: c.name,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
      }))

      const res = await saleService.create({
        shopId,
        items,
        paymentMethod: selectedMethod,
        amountPaid: parseFloat(amountPaid) || subtotal,
      })

      setPaymentDialogOpen(false)
      setCart([])
      setCustomerName("")
      setCustomerPhone("")
      setAmountPaid("")

      const saleData = (res as any).data || (res as any).sale || res
      setReceiptSale(saleData)
      setReceiptDialogOpen(true)
      toast.success("Sale completed successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to complete sale")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Service POS</h1>
              <p className="text-sm text-muted-foreground">
                Select services, add to cart, and complete the sale
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchServices}>
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Service Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredServices.map((svc) => (
                <Card
                  key={svc.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => addToCart(svc)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <Scissors className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm line-clamp-2">{svc.name}</p>
                      <p className="text-lg font-bold text-primary">{formatMK(svc.price)}</p>
                    </div>
                    <Button size="sm" variant="secondary" className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredServices.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Scissors className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No services found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right: Cart / Checkout */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Click on a service to add it to the cart
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.serviceId} className="flex items-center gap-2 p-2 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{formatMK(item.unitPrice)} each</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.serviceId, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.serviceId, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-bold w-20 text-right">{formatMK(item.total)}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.serviceId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>{formatMK(subtotal)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Customer name (optional)"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Phone (optional)"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={openPayment}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Complete Sale
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Select payment method and confirm the sale</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((pm) => {
                const Icon = pm.icon
                return (
                  <Button
                    key={pm.value}
                    variant={selectedMethod === pm.value ? "default" : "outline"}
                    className="flex flex-col items-center gap-1 h-20"
                    onClick={() => setSelectedMethod(pm.value)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{pm.label}</span>
                  </Button>
                )
              })}
            </div>

            <div className="space-y-1">
              <Label>Total Amount</Label>
              <div className="text-2xl font-bold text-center">{formatMK(subtotal)}</div>
            </div>

            <div className="space-y-1">
              <Label>Amount Paid</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>

            {customerName && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p><span className="text-muted-foreground">Customer:</span> {customerName}</p>
                {customerPhone && <p><span className="text-muted-foreground">Phone:</span> {customerPhone}</p>}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitSale} disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Sale Complete
            </DialogTitle>
            <DialogDescription>
              Receipt #{receiptSale?.receiptNumber || receiptSale?.id?.slice(0, 8) || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <Check className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-lg font-bold text-green-700">Payment Successful</p>
              <p className="text-sm text-green-600">{formatMK(subtotal)} paid via {selectedMethod.replace("_", " ")}</p>
            </div>
            <div className="text-sm space-y-1 text-muted-foreground">
              {cart.map((item) => (
                <div key={item.serviceId} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatMK(item.total)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>{formatMK(subtotal)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReceiptDialogOpen(false); setReceiptSale(null) }}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
