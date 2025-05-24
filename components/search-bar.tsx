"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { mockTools } from "@/lib/data"
import { advancedSearch } from "@/lib/recommendation-engine"
import Link from "next/link"

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Array<{ tool: any; match: any; score: number }>>([])
  const router = useRouter()

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      const searchResults = advancedSearch(mockTools, value)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }

  const handleSelect = (toolId: string) => {
    setSearchQuery("")
    setResults([])
    router.push(`/tool/${toolId}`)
  }

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for AI tools..."
          className="pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
      
      {results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={result.tool.id}
                onClick={() => handleSelect(result.tool.id)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{result.tool.name}</span>
                  <span className="text-sm text-gray-500">{result.tool.categories.join(", ")}</span>
                </div>
              </button>
            ))}
      </div>
        </div>
      )}
    </div>
  )
}
