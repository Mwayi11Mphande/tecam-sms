"use client"

import { Printer } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

// import { ReceiptPDF } from "@/components/pdf/receipt/ReceiptPDF"

export interface ServiceItem {
  id: string
  description: string
  category: string
  quantity: number
  unitPrice: number
  total: number
  date: string
  customerName?: string
  customerPhone?: string
  notes?: string
  status: "pending" | "completed" | "invoiced"
  serviceId?: string
}

interface ServiceReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: ServiceItem | null
  formatDate: (date: string) => string
}

export function ServiceReceiptModal({
  open,
  onOpenChange,
  service,
  formatDate,
}: ServiceReceiptModalProps) {
  if (!service) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Service Receipt
          </DialogTitle>

          <DialogDescription>
            Service ID: {service.serviceId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Uncomment when ReceiptPDF is ready */}

          {/*
          <ReceiptPDF
            services={[service]}
            subtotal={service.total}
            tax={service.total * 0.08}
            total={service.total * 1.08}
            paymentMethod="cash"
            transactionId={
              service.serviceId ||
              `SRV-${Date.now().toString().slice(-6)}`
            }
            customerInfo={{
              name: service.customerName,
              phone: service.customerPhone,
            }}
          />
          */}

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Service Date: {formatDate(service.date)}</p>
              <p>• Category: {service.category}</p>
              <p>• Quantity: {service.quantity}</p>

              {service.notes && (
                <p>• Notes: {service.notes}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}