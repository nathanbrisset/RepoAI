"use client"

import { useState } from "react"
import ToolCard from "@/components/tool-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Tool } from "@/lib/types"

interface ToolsClientProps {
  tools: Tool[]
}

const PRICING_OPTIONS = [
  { label: "Free", className: "bg-gray-200 text-gray-800" },
  { label: "Freemium", className: "bg-gradient-to-r from-blue-500 to-green-400 text-white" },
  { label: "Premium", className: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" },
]

export default function ToolsClient({ tools }: ToolsClientProps) {
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filteredTools = tools.filter(tool => {
    const matchesQuery =
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    const matchesPricing = selectedPricing ? tool.isPremium === selectedPricing : true
    return matchesQuery && matchesPricing
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-4 text-black">AI Tools Directory</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Browse our comprehensive collection of {tools.length} AI tools. Find the perfect solution for your needs.
            </p>
          </div>
          {/* Pricing Filter - right aligned */}
          <div className="flex gap-3 justify-center md:justify-end items-center">
            {PRICING_OPTIONS.map(({ label, className }) => (
              <button
                key={label}
                onClick={() => setSelectedPricing(selectedPricing === label ? null : label)}
                className="focus:outline-none"
                aria-pressed={selectedPricing === label}
              >
                <Badge className={
                  `${className} px-4 py-2 text-base rounded-lg transition-colors border-2 ${
                    selectedPricing === label ? 'border-black scale-105 shadow' : 'border-transparent opacity-80 hover:opacity-100'
                  }`
                }>
                  {label}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form className="relative" onSubmit={e => { e.preventDefault(); }}>
            <Input
              type="search"
              placeholder="Search tools by name, description, or tags..."
              className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={query}
              onChange={e => setQuery(e.target.value)}
              name="query"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all tools</p>
            <Link href="/tools">
              <Button variant="outline">View All Tools</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 