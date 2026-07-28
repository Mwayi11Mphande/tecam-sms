"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Receipt, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { expenseService } from "@/lib/services/expense.service"
import { toast } from "sonner"

const EXPENSE_CATEGORIES = [
  "Utilities",
  "Rent",
  "Supplies",
  "Maintenance",
  "Transport",
  "Salaries",
  "Marketing",
  "Food & Drinks",
  "Miscellaneous",
]

export default function AddExpensePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    category: "",
    description: "",
    amount: "",
    notes: "",
    expenseDate: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category || !form.description || !form.amount) {
      toast.warning("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      await expenseService.create({
        category: form.category,
        description: form.description,
        amount: Number(form.amount),
        notes: form.notes || undefined,
        expenseDate: form.expenseDate,
      })
      toast.success("Expense recorded successfully")
      setForm({ category: "", description: "", amount: "", notes: "", expenseDate: new Date().toISOString().split("T")[0] })
    } catch (err: any) {
      toast.error(err.message || "Failed to record expense")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Record Expense</h1>
          <p className="text-muted-foreground">Submit a business expense for tracking</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Expense Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Input
                placeholder="What was this expense for?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Amount (MK) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.expenseDate}
                onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Additional details..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Receipt className="h-4 w-4 mr-2" />}
              {submitting ? "Saving..." : "Record Expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
