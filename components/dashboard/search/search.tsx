// components/pos/search-container.tsx
"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchContainerProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export function SearchContainer({ 
  searchTerm, 
  setSearchTerm,
  hasActiveFilters = false,
  onClearFilters
}: SearchContainerProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-9 text-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearFilters}
          className="h-9 px-3 border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}