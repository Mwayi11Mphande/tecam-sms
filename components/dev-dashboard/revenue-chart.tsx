// components/dev-dashboard/revenue-chart.tsx
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 12450,
    subscriptions: 18,
  },
  {
    name: "Feb",
    revenue: 13980,
    subscriptions: 20,
  },
  {
    name: "Mar",
    revenue: 15890,
    subscriptions: 22,
  },
  {
    name: "Apr",
    revenue: 16780,
    subscriptions: 23,
  },
  {
    name: "May",
    revenue: 18450,
    subscriptions: 24,
  },
  {
    name: "Jun",
    revenue: 21090,
    subscriptions: 28,
  },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Revenue
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ${payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Subscriptions
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[1].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="currentColor"
          strokeWidth={2}
          className="stroke-primary"
        />
        <Line
          type="monotone"
          dataKey="subscriptions"
          stroke="currentColor"
          strokeWidth={2}
          className="stroke-muted-foreground"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}