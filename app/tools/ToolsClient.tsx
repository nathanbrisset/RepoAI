"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ToolCard from "@/components/tool-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Tool } from "@/lib/types"
import { categories } from "@/lib/data"
import { pricingLabel } from "@/lib/i18n/messages"
import { localizeTool } from "@/lib/i18n/localize-tool"
import { localizeHref } from "@/lib/i18n/paths"
import LocaleLink from "@/components/locale-link"
import { useLocale, useT } from "@/components/locale-provider"
import {
  PRICE_FILTER_OPTIONS,
  matchesPriceFilter,
  priceFilterFromParam,
  priceFilterParam,
  type PriceFilter,
} from "@/lib/price-filter"

interface ToolsClientProps {
  tools: Tool[]
  initialCategory?: string | null
  initialPricing?: string | null
}

export default function ToolsClient({ tools, initialCategory = null, initialPricing = null }: ToolsClientProps) {
  const router = useRouter()
  const initial = categories.some((category) => category.id === initialCategory) ? initialCategory : null
  const initialFilter = priceFilterFromParam(initialPricing)
  const [selectedPricing, setSelectedPricing] = useState<PriceFilter | null>(initialFilter)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initial)
  const [query, setQuery] = useState("")
  const locale = useLocale()
  const t = useT()

  useEffect(() => {
    setSelectedCategory(initial)
  }, [initial])

  useEffect(() => {
    setSelectedPricing(initialFilter)
  }, [initialFilter])

  function writeQuery(category: string | null, pricing: PriceFilter | null) {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (pricing) params.set("pricing", priceFilterParam(pricing))
    const next = params.toString()
    router.replace(localizeHref(locale, next ? `/tools?${next}` : "/tools"), { scroll: false })
  }

  function selectCategory(id: string | null) {
    setSelectedCategory(id)
    writeQuery(id, selectedPricing)
  }

  function selectPricing(label: PriceFilter) {
    const next = selectedPricing === label ? null : label
    setSelectedPricing(next)
    writeQuery(selectedCategory, next)
  }

  const filteredTools = tools.filter(tool => {
    const french = localizeTool(tool, "fr")
    const haystack = [
      tool.name,
      tool.description,
      tool.longDescription,
      french.description,
      french.longDescription,
      ...(tool.tags || []),
      ...(french.tags || []),
    ].join(" ").toLowerCase()
    const matchesQuery = haystack.includes(query.toLowerCase())
    const matchesPricing = matchesPriceFilter(tool, selectedPricing)
    const matchesCategory = selectedCategory ? tool.categories.includes(selectedCategory) : true
    return matchesQuery && matchesPricing && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-4 text-black">{t("tools.title")}</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              {t("tools.subtitle", { count: tools.length })}
            </p>
          </div>
          {/* Pricing Filter - right aligned */}
          <div className="flex gap-3 justify-center md:justify-end items-center">
            {PRICE_FILTER_OPTIONS.map(({ label, className }) => (
              <button
                key={label}
                type="button"
                onClick={() => selectPricing(label)}
                className="focus:outline-none"
                aria-pressed={selectedPricing === label}
                data-pricing={priceFilterParam(label)}
              >
                <Badge className={
                  `${className} px-4 py-2 text-base rounded-lg transition-colors border-2 ${
                    selectedPricing === label ? 'border-black scale-105 shadow' : 'border-transparent opacity-80 hover:opacity-100'
                  }`
                }>
                  {pricingLabel(locale, label)}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={`rounded-full px-3 py-1 text-sm ${selectedCategory === null ? "bg-gray-900 text-white" : "bg-white text-gray-700 border"}`}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(selectedCategory === category.id ? null : category.id)}
              className={`rounded-full px-3 py-1 text-sm ${selectedCategory === category.id ? "bg-gray-900 text-white" : "bg-white text-gray-700 border"}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form className="relative" onSubmit={e => { e.preventDefault(); }}>
            <Input
              type="search"
              placeholder={t("tools.searchPlaceholder")}
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
              {t("tools.search")}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("tools.noneTitle")}</h3>
            <p className="text-gray-600 mb-4">{t("tools.noneBody")}</p>
            <LocaleLink href="/tools">
              <Button variant="outline">{t("tools.viewAll")}</Button>
            </LocaleLink>
          </div>
        )}
      </div>
    </div>
  )
} 