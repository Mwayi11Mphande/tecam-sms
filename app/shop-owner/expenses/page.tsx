"use client"

import { useState, useEffect, useMemo } from "react"
import { Receipt, TrendingDown, Calendar, Search, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { expenseService } from "@/lib/services/expense.service"
import { formatMK } from "@/lib/currency"

export default function ExpenseTrackingPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const [res, totalRes] = await Promise.all([
          expenseService.getAll(),
          expenseService.getTotal(),
        ])
        setExpenses(res.data || [])
        setTotalExpenses(Number(totalRes.data?.total || 0))
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const categories = useMemo(() => {
    return [...new Set(expenses.map((e) => e.category))].filter(Boolean)
  }, [expenses])

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter
      const matchesSearch = !searchTerm ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.recordedBy?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [expenses, categoryFilter, searchTerm])

  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return expenses
      .filter((e) => e.expenseDate?.startsWith(today))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
  }, [expenses])

  if (loading) return <div className="flex flex-1 items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading expenses...</p></div>

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Expense Tracking</h1>
            <p className="text-muted-foreground">Monitor and track all business expenses</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <h3 className="text-2xl font-bold">{formatMK(totalExpenses)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Today</p>
            <h3 className="text-2xl font-bold">{formatMK(todayTotal)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">This Month</p>
            <h3 className="text-2xl font-bold">{formatMK(totalExpenses)}</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            All Expenses ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No expenses recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((exp: any) => (
                    <TableRow key={exp.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(exp.expenseDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exp.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{exp.description}</TableCell>
                      <TableCell>{exp.recordedBy?.fullName || "N/A"}</TableCell>
                      <TableCell className="text-right font-medium">{formatMK(Number(exp.amount))}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
