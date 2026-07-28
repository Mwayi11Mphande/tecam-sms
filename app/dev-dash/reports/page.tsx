// app/dev-dashboard/reports/page.tsx
"use client"

import { useState, useEffect } from "react"
import {
  IconChartBar,
  IconDatabase,
  IconShield,
  IconUsers,
  IconBuildingStore,
  IconServer,
  IconAlertCircle,
  IconCircle,
  IconClock,
  IconDownload,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { devDashService } from "@/lib/services/dev-dash.service"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("usage")
  const [systemHealth, setSystemHealth] = useState<any>({
    status: "healthy",
    uptime: "0%",
    responseTime: "0ms",
    activeUsers: 0,
    activeShops: 0,
    apiCalls: "0",
    errors: 0,
    serverLoad: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    dbConnections: 0,
    dbMaxConnections: 0,
    errorRate: 0,
  })
  const [usageStats, setUsageStats] = useState<any>({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    avgSession: "0m",
    topFeatures: [],
  })
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [healthRes, statsRes] = await Promise.all([
          devDashService.getSystemHealth(),
          devDashService.getStats(),
        ])
        const health = healthRes.data || {}
        const stats = statsRes.data || {}
        setSystemHealth(health)
        setUsageStats(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-96">Loading reports...</div>
  if (error) return <div className="flex items-center justify-center h-96 text-red-500">Error: {error}</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
          <p className="text-muted-foreground">Monitor system health, usage, and audit logs</p>
        </div>
        <Button variant="outline">
          <IconDownload className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* System Health Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {systemHealth.status === "healthy" ? (
              <IconCircle className="h-4 w-4 text-green-500" />
            ) : (
              <IconAlertCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemHealth.status}</div>
            <p className="text-xs text-muted-foreground">Uptime: {systemHealth.uptime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <IconServer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.responseTime}</div>
            <p className="text-xs text-muted-foreground">Average API response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <IconDatabase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.apiCalls}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily active users and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Users</span>
                    <span className="font-medium">{usageStats.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Today</span>
                    <span className="font-medium">{usageStats.activeToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New This Week</span>
                    <span className="font-medium">{usageStats.newThisWeek}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Session</span>
                    <span className="font-medium">{usageStats.avgSession}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most used features this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {usageStats.topFeatures.map((feature: any) => (
                  <div key={feature.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{feature.name}</span>
                      <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                    </div>
                    <Progress value={feature.usage} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>System Health Metrics</CardTitle>
              <CardDescription>Detailed system performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Server Load</span>
                  <span className="text-sm text-muted-foreground">{systemHealth.serverLoad}%</span>
                </div>
                <Progress value={systemHealth.serverLoad} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">{systemHealth.memoryUsed}GB / {systemHealth.memoryTotal}GB</span>
                </div>
                <Progress value={systemHealth.memoryTotal ? (systemHealth.memoryUsed / systemHealth.memoryTotal) * 100 : 0} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database Connections</span>
                  <span className="text-sm text-muted-foreground">{systemHealth.dbConnections} / {systemHealth.dbMaxConnections}</span>
                </div>
                <Progress value={systemHealth.dbMaxConnections ? (systemHealth.dbConnections / systemHealth.dbMaxConnections) * 100 : 0} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-sm text-muted-foreground">{systemHealth.errorRate}%</span>
                </div>
                <Progress value={systemHealth.errorRate} max={5} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Track all system actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                        <div className="mt-1">
                          <IconShield className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{log.user}</span>
                            <Badge variant="outline">{log.action}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.target}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <IconClock className="h-3 w-3" />
                            <span>{log.timestamp}</span>
                            <span>•</span>
                            <span>IP: {log.ip}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}