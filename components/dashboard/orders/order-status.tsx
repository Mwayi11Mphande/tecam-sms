// components/orders/order-status.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function OrderStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Pending</span>
            <span className="text-sm text-muted-foreground">24 orders</span>
          </div>
          <Progress value={30} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Processing</span>
            <span className="text-sm text-muted-foreground">18 orders</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Shipped</span>
            <span className="text-sm text-muted-foreground">42 orders</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Delivered</span>
            <span className="text-sm text-muted-foreground">156 orders</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}