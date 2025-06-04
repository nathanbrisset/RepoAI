"use client"

import { useState } from "react"
import ToolCard from "@/components/tool-card"
import { Badge } from "@/components/ui/badge"
import type { Tool } from "@/lib/types"

interface PricingToolsGridProps {
  tools: Tool[]
}

const PRICING_OPTIONS = [
  { label: "Free", className: "bg-gray-200 text-gray-800" },
  { label: "Freemium", className: "bg-gradient-to-r from-blue-500 to-green-400 text-white" },
  { label: "Premium", className: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" },
]

export default function PricingToolsGrid({ tools }: PricingToolsGridProps) {
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null)

  const filteredTools = selectedPricing
    ? tools.filter(tool => tool.isPremium === selectedPricing)
    : tools

  return (
    <div className="space-y-8">
      {/* Pricing Filter - right aligned at the top */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div /> {/* Empty div for left alignment, can be replaced with category info if needed */}
        <div className="flex gap-2 justify-center md:justify-end items-center">
          {PRICING_OPTIONS.map(({ label, className }) => (
            <button
              key={label}
              onClick={() => setSelectedPricing(selectedPricing === label ? null : label)}
              className="focus:outline-none"
              aria-pressed={selectedPricing === label}
            >
              <Badge className={
                `${className} px-2 py-1 text-xs rounded-md transition-colors border-2 ${
                  selectedPricing === label ? 'border-black scale-105 shadow' : 'border-transparent opacity-80 hover:opacity-100'
                }`
              }>
                {label}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 