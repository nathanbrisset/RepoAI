"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import ToolCard from "@/components/tool-card"
import { Badge } from "@/components/ui/badge"
import type { Tool } from "@/lib/types"
import { pricingLabel } from "@/lib/i18n/messages"
import { localizeHref, stripLocale } from "@/lib/i18n/paths"
import { useLocale } from "@/components/locale-provider"
import {
  PRICE_FILTER_OPTIONS,
  matchesPriceFilter,
  priceFilterFromParam,
  priceFilterParam,
  type PriceFilter,
} from "@/lib/price-filter"

interface PricingToolsGridProps {
  tools: Tool[]
  initialPricing?: string | null
}

export default function PricingToolsGrid({ tools, initialPricing = null }: PricingToolsGridProps) {
  const router = useRouter()
  const pathname = usePathname() || "/"
  const initialFilter = priceFilterFromParam(initialPricing)
  const [selectedPricing, setSelectedPricing] = useState<PriceFilter | null>(initialFilter)
  const locale = useLocale()

  useEffect(() => {
    setSelectedPricing(initialFilter)
  }, [initialFilter])

  function selectPricing(label: PriceFilter) {
    const next = selectedPricing === label ? null : label
    setSelectedPricing(next)
    const bare = stripLocale(pathname)
    const href = localizeHref(locale, next ? `${bare}?pricing=${priceFilterParam(next)}` : bare)
    router.replace(href, { scroll: false })
  }

  const filteredTools = tools.filter((tool) => matchesPriceFilter(tool, selectedPricing))

  return (
    <div className="space-y-8">
      {/* Pricing Filter - right aligned at the top */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div /> {/* Empty div for left alignment, can be replaced with category info if needed */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
          {PRICE_FILTER_OPTIONS.map(({ label, className }) => (
            <button
              key={label}
              type="button"
              onClick={() => selectPricing(label)}
              className="shrink-0 focus:outline-none"
              aria-pressed={selectedPricing === label}
              data-pricing={priceFilterParam(label)}
            >
              <Badge className={
                `${className} whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors ${
                  selectedPricing === label ? "border-navy bg-navy text-white" : "hover:bg-secondary"
                }`
              }>
                {pricingLabel(locale, label)}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 