import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileText } from "lucide-react"

type Props = {
  searchTerm: string
  setSearchTerm: (v: string) => void

  selectedCategory: string
  setSelectedCategory: (v: string) => void

  selectedStatus: string
  setSelectedStatus: (v: string) => void

  currentDate: string
  setCurrentDate: (v: string) => void

  serviceCategories: { value: string; label: string }[]

  onClear: () => void
}

export function ServiceFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  currentDate,
  setCurrentDate,
  serviceCategories,
  onClear,
}: Props) {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        <div>
          <Label>Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {serviceCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="invoiced">Invoiced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={onClear}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}