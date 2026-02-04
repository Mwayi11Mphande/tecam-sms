"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Wallet, Building, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type PaymentMethod = "cash" | "card" | "mobile" | "bank"
type MobileProvider = "tnm" | "airtel"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalAmount: number
  onCompletePayment: () => void
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}

export function PaymentModal({
  open,
  onOpenChange,
  totalAmount,
  onCompletePayment,
  customerInfo
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [mobileProvider, setMobileProvider] = useState<MobileProvider>("tnm")
  const [mobileNumber, setMobileNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cashReceived, setCashReceived] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0
    return received - totalAmount
  }

  const handleSubmit = () => {
    onCompletePayment()
    onOpenChange(false)
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {customerInfo && (customerInfo.name || customerInfo.phone) && (
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Customer
                </span>
              </div>
              <div className="text-sm space-y-1">
                {customerInfo.name && (
                  <div className="text-blue-800 dark:text-blue-200">
                    Name: {customerInfo.name}
                  </div>
                )}
                {customerInfo.phone && (
                  <div className="text-blue-700 dark:text-blue-300">
                    Phone: {customerInfo.phone}
                  </div>
                )}
                {customerInfo.email && (
                  <div className="text-blue-700 dark:text-blue-300">
                    Email: {customerInfo.email}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Complete Payment</DialogTitle>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              MK{formatAmount(totalAmount)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Method Selection */}
          <div>
            <h3 className="font-medium mb-2 text-foreground">Select Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="grid grid-cols-2 gap-2"
            >
              {[
                { value: "cash", icon: Wallet, label: "Cash" },
                { value: "card", icon: CreditCard, label: "Bank Card" },
                { value: "mobile", icon: Smartphone, label: "Mobile Money" },
                { value: "bank", icon: Building, label: "Bank Transfer" },
              ].map((method) => (
                <div key={method.value}>
                  <RadioGroupItem
                    value={method.value}
                    id={method.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.value}
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer bg-card"
                  >
                    <method.icon className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-sm text-foreground">{method.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Form Based on Selection */}
          <div className="space-y-3">
            {paymentMethod === "mobile" && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Label className="mb-2 block text-sm text-foreground">
                      Select Mobile Provider
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={mobileProvider === "tnm" ? "default" : "outline"}
                        className={`flex-1 ${mobileProvider === "tnm" ? "bg-green-600 hover:bg-green-700" : ""}`}
                        onClick={() => setMobileProvider("tnm")}
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">T</span>
                        </div>
                        TNM Mpamba
                      </Button>
                      
                      <Button
                        type="button"
                        variant={mobileProvider === "airtel" ? "default" : "outline"}
                        className={`flex-1 ${mobileProvider === "airtel" ? "bg-red-600 hover:bg-red-700" : ""}`}
                        onClick={() => setMobileProvider("airtel")}
                      >
                        <div className="w-5 h-5 rounded-full bg-red-500 mr-2 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        Airtel Money
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber" className="text-sm text-foreground">
                      Mobile Number
                    </Label>
                    <Input
                      id="mobileNumber"
                      placeholder="Enter mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Amount to be deducted:
                    </div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      MK{formatAmount(totalAmount)}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      You will receive a confirmation message
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "card" && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm text-foreground">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="expiry" className="text-sm text-foreground">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm text-foreground">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "cash" && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Label htmlFor="cashReceived" className="text-sm text-foreground">
                      Amount Received
                    </Label>
                    <Input
                      id="cashReceived"
                      placeholder="Enter amount received"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {cashReceived && (
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 dark:text-green-300">Change Due:</span>
                        <span className="text-lg font-bold text-green-900 dark:text-green-200">
                          MK{formatAmount(calculateChange())}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {paymentMethod === "bank" && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Label htmlFor="accountNumber" className="text-sm text-foreground">
                      Account Number (Optional)
                    </Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter account number for reference"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide account number for transaction tracking
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      <span className="font-bold">Important:</span> Cashier make sure the customer provides account number
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium text-foreground">
                {paymentMethod === "mobile" 
                  ? `${mobileProvider === "tnm" ? "TNM Mpamba" : "Airtel Money"}` 
                  : paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total Amount:</span>
              <span className="text-foreground">MK{formatAmount(totalAmount)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={
              (paymentMethod === "mobile" && !mobileNumber) ||
              (paymentMethod === "card" && !cardNumber) ||
              (paymentMethod === "cash" && (!cashReceived || calculateChange() < 0))
            }
          >
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}