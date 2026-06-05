"use client"

import { Plus, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ServiceStatus = "pending" | "completed" | "invoiced"

type ServiceCategory =
  | "stationery"
  | "printing"
  | "design"
  | "consultation"
  | "repair"
  | "other"

interface ServiceForm {
  description: string
  category: ServiceCategory
  quantity: number
  unitPrice: number
  customerName: string
  customerPhone: string
  notes: string
  status: ServiceStatus
}

interface ServiceFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  isEditMode: boolean

  serviceForm: ServiceForm

  serviceCategories: {
    value: string
    label: string
  }[]

  calculateTotal: () => number
  formatAmount: (amount: number) => string

  onFormChange: (
    field: keyof ServiceForm,
    value: string | number
  ) => void

  onCancel: () => void
  onSubmit: () => void
}

export function ServiceFormModal({
  open,
  onOpenChange,
  isEditMode,
  serviceForm,
  serviceCategories,
  calculateTotal,
  formatAmount,
  onFormChange,
  onCancel,
  onSubmit,
}: ServiceFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditMode ? "Edit Service" : "Add New Service"}
          </DialogTitle>

          <DialogDescription>
            Enter details of the service performed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Service Description *</Label>

            <Textarea
              id="description"
              rows={3}
              placeholder="e.g., Document printing, Design work, Consultation..."
              value={serviceForm.description}
              onChange={(e) =>
                onFormChange("description", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>

            <Select
              value={serviceForm.category}
              onValueChange={(value) =>
                onFormChange("category", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {serviceCategories.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>

              <Input
                id="quantity"
                type="number"
                min="1"
                value={serviceForm.quantity}
                onChange={(e) =>
                  onFormChange(
                    "quantity",
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="unitPrice">
                Unit Price (Mk) *
              </Label>

              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={serviceForm.unitPrice}
                onChange={(e) =>
                  onFormChange(
                    "unitPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Total:
              </span>

              <span className="text-lg font-bold">
                Mk {formatAmount(calculateTotal())}
              </span>
            </div>
          </div>

          <Separator />

          <h4 className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Information (Optional)
          </h4>

          <div className="space-y-3">
            <div>
              <Label htmlFor="customerName">
                Customer Name
              </Label>

              <Input
                id="customerName"
                placeholder="Full name"
                value={serviceForm.customerName}
                onChange={(e) =>
                  onFormChange(
                    "customerName",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">
                Phone Number
              </Label>

              <Input
                id="customerPhone"
                placeholder="+265 XXX XXX XXX"
                value={serviceForm.customerPhone}
                onChange={(e) =>
                  onFormChange(
                    "customerPhone",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">
              Additional Notes
            </Label>

            <Textarea
              id="notes"
              rows={2}
              placeholder="Any special instructions or details..."
              value={serviceForm.notes}
              onChange={(e) =>
                onFormChange("notes", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>

            <Select
              value={serviceForm.status}
              onValueChange={(value) =>
                onFormChange("status", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pending">
                  Pending
                </SelectItem>
                <SelectItem value="completed">
                  Completed
                </SelectItem>
                <SelectItem value="invoiced">
                  Invoiced
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="flex-1"
            onClick={onSubmit}
          >
            {isEditMode ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Service
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}