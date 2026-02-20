// components/dev-dashboard/recent-payments.tsx
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const payments = [
  {
    id: "1",
    shop: "Tech Haven",
    amount: 299.99,
    status: "completed",
    date: "2024-01-15",
    plan: "Premium",
  },
  {
    id: "2",
    shop: "Fashion Hub",
    amount: 149.99,
    status: "completed",
    date: "2024-01-14",
    plan: "Professional",
  },
  {
    id: "3",
    shop: "Grocery Mart",
    amount: 99.99,
    status: "pending",
    date: "2024-01-14",
    plan: "Basic",
  },
  {
    id: "4",
    shop: "Bookstore Plus",
    amount: 299.99,
    status: "completed",
    date: "2024-01-13",
    plan: "Premium",
  },
  {
    id: "5",
    shop: "Electronics World",
    amount: 149.99,
    status: "completed",
    date: "2024-01-12",
    plan: "Professional",
  },
]

export function RecentPayments() {
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
              <span className="font-medium">${payment.amount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}