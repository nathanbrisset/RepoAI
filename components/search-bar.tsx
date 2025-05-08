"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSearch = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setSearchQuery("")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", searchQuery)
    // You would typically redirect to search results page
    // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center transition-all duration-300 ease-in-out",
          isExpanded ? "w-full md:w-[500px]" : "w-10",
        )}
      >
        {isExpanded ? (
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for AI tools..."
                className="pl-10 pr-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="rounded-l-none">
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
