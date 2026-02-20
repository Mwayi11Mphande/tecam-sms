// components/dev-dashboard/payment-method-chart.tsx
"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const data = [
  { name: "Credit Card", value: 65, color: "#8884d8" },
  { name: "PayPal", value: 20, color: "#82ca9d" },
  { name: "Bank Transfer", value: 15, color: "#ffc658" },
]

export function PaymentMethodChart() {
  return (
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="ml-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}