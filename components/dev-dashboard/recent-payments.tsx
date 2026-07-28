// components/dev-dashboard/recent-payments.tsx
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatMK } from "@/lib/currency"

interface Payment {
  id: string
  shop: string
  amount: number
  status: string
  date: string
  plan: string
}

interface RecentPaymentsProps {
  payments?: Payment[]
}

export function RecentPayments({ payments = [] }: RecentPaymentsProps) {
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {payment.shop.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium leading-none">{payment.shop}</p>
              <p className="text-sm text-muted-foreground">
                {payment.plan} • {payment.date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                {payment.status}
              </Badge>
              <span className="font-medium">{formatMK(payment.amount)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}