import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Edit, Printer, Trash2 } from "lucide-react"

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

type Props = {
  services: ServiceItem[]
  onEdit: (service: ServiceItem) => void
  onDelete: (id: string) => void
  onPrint: (service: ServiceItem) => void
  onStatusChange: (id: string, status: ServiceItem["status"]) => void
  formatAmount: (value: number) => string
  formatDate: (date: string) => string
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  onPrint,
  onStatusChange,
  formatAmount,
  formatDate,
}: Props) {
  const getStatusBadge = (status: ServiceItem["status"]) => {
    const map = {
      pending: "text-yellow-600 border-yellow-600",
      completed: "text-green-600",
      invoiced: "text-blue-600",
    }

    return (
      <Badge variant="outline" className={`${map[status]} capitalize`}>
        {status}
      </Badge>
    )
  }

  return (
    <ScrollArea className="h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                No services found
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-mono text-xs">
                  {service.serviceId}
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">{service.description}</p>
                    {service.notes && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {service.notes}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {service.customerName ? (
                    <div>
                      <p className="font-medium">{service.customerName}</p>
                      {service.customerPhone && (
                        <p className="text-xs text-muted-foreground">
                          {service.customerPhone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Walk-in</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{service.category}</Badge>
                </TableCell>

                <TableCell>{formatDate(service.date)}</TableCell>

                <TableCell className="font-bold">
                  Mk {formatAmount(service.total)}
                </TableCell>

                <TableCell>{getStatusBadge(service.status)}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(service)}>
                      <Edit className="h-3 w-3" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => onPrint(service)}>
                      <Printer className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(service.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>

                    {/* Status change */}
                    <select
                      className="h-8 w-32 text-xs border rounded px-2 bg-background"
                      value={service.status}
                      onChange={(e) =>
                        onStatusChange(
                          service.id,
                          e.target.value as ServiceItem["status"]
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="invoiced">Invoiced</option>
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}