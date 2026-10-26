"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import { PRICE_FILTERS, priceFilterParam, type PriceFilter } from "@/lib/price-filter"
import { pricingLabel } from "@/lib/i18n/messages"
import { useDirectory } from "./directory-provider"
import { ToolCard } from "./tool-card"

export type SortMode = "trending" | "new" | "top"

export function CatalogueClient({ basePath }: { basePath: "/catalogue" | "/tools" }) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { records, chips } = useDirectory()
  const category = searchParams.get("category") || ""
  const query = (searchParams.get("q") || "").trim().toLowerCase()
  const sort = (searchParams.get("sort") as SortMode) || "trending"
  const pricing = searchParams.get("pricing")

  const activePrice = PRICE_FILTERS.find((filter) => priceFilterParam(filter) === pricing) || null

  function write(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete("tool")
    const next = params.toString()
    router.replace(localizeHref(locale, next ? `${basePath}?${next}` : basePath), { scroll: false })
  }

  const visible = useMemo(() => {
    const filtered = records.filter((tool) => {
      const matchesCategory = category ? tool.categories.includes(category) : true
      const matchesPrice = activePrice ? tool.priceBucket === activePrice : true
      const haystack = [tool.name, tool.description, tool.tags.join(" "), tool.categories.join(" "), tool.features.join(" ")].join(" ").toLowerCase()
      const matchesQuery = query ? haystack.includes(query) : true
      return matchesCategory && matchesPrice && matchesQuery
    })
    if (sort === "new") {
      return [...filtered].sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""))
    }
    if (sort === "top") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name, locale))
    }
    return filtered
  }, [records, category, activePrice, query, sort, locale])

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.catalogueKicker}</p>
      <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-5xl">{t.catalogueTitle}</h1>
          <p className="mt-3 text-muted-foreground">{fill(t.catalogueCount, { count: visible.length })}</p>
        </div>
        <label className="block md:w-80">
          <span className="sr-only">{t.filterLabel}</span>
          <input
            value={searchParams.get("q") || ""}
            onChange={(event) => write({ q: event.target.value || null })}
            placeholder={t.filterPlaceholder}
            className="h-12 w-full rounded-full bg-card px-5 ring-1 ring-border outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label={t.priceFilters}>
        {PRICE_FILTERS.map((filter) => {
          const selected = activePrice === filter
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={selected}
              onClick={() => write({ pricing: selected ? null : priceFilterParam(filter as PriceFilter) })}
              className={`h-9 rounded-full px-4 text-sm font-semibold ring-1 ring-border ${selected ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              {pricingLabel(locale, filter)}
            </button>
          )
        })}
        {(category || query || activePrice || sort !== "trending") && (
          <button type="button" onClick={() => router.replace(localizeHref(locale, basePath), { scroll: false })} className="h-9 rounded-full px-4 text-sm font-semibold text-primary">
            {t.clearFilters}
          </button>
        )}
      </div>

      {searchParams.get("sort") === "top" ? <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{t.sortTopNote}</p> : null}

      {visible.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-card p-8 ring-1 ring-border">
          <h2 className="font-display text-2xl">{t.noToolsTitle}</h2>
          <p className="mt-2 text-muted-foreground">{t.noToolsBody}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      )}
      <p className="mt-10">
        <LocaleLink href="/categories" className="font-semibold text-primary">
          {fill(t.allCategories, { count: chips.length })}
        </LocaleLink>
      </p>
    </main>
  )
}
