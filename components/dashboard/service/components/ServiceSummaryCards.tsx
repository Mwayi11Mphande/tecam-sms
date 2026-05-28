import { Card, CardContent } from "@/components/ui/card"
import { Clock, Check, DollarSign } from "lucide-react"

type Props = {
  pending: number
  completed: number
  total: number
  formatAmount: (value: number) => string
}

export function ServiceSummaryCards({
  pending,
  completed,
  total,
  formatAmount,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending Services</p>
            <p className="text-2xl font-bold">Mk {formatAmount(pending)}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Completed Services</p>
            <p className="text-2xl font-bold">Mk {formatAmount(completed)}</p>
          </div>
          <Check className="h-8 w-8 text-green-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">Mk {formatAmount(total)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}