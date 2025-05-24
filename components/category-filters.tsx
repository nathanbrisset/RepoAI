"use client"
import { useEffect } from "react"

interface CategoryFiltersProps {
  tools: any[]
  onFilterChange: (filteredTools: any[]) => void
}

export default function CategoryFilters({ tools, onFilterChange }: CategoryFiltersProps) {
  useEffect(() => {
    onFilterChange(tools)
  }, [tools, onFilterChange])
  return null
} 