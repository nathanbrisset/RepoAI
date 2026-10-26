"use client"

import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import { pricingLabel } from "@/lib/i18n/messages"
import { PRICE_FILTERS, priceFilterParam, type PriceFilter } from "@/lib/price-filter"
import { useDirectory } from "./directory-provider"
import { ToolCard } from "./tool-card"

export function CategoryDetailClient({
  categoryId,
  name,
  description,
}: {
  categoryId: string
  name: string
  description: string
}) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { records } = useDirectory()
  const pricing = searchParams.get("pricing")
  const activePrice = PRICE_FILTERS.find((filter) => priceFilterParam(filter) === pricing) || null

  function writePricing(next: PriceFilter | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (next) params.set("pricing", priceFilterParam(next))
    else params.delete("pricing")
    const query = params.toString()
    router.replace(localizeHref(locale, query ? `/categories/${categoryId}?${query}` : `/categories/${categoryId}`), { scroll: false })
  }

  const visible = useMemo(() => {
    return records.filter((tool) => {
      if (!tool.categories.includes(categoryId)) return false
      if (activePrice && tool.priceBucket !== activePrice) return false
      return true
    })
  }, [records, categoryId, activePrice])

  const countLabel = visible.length === 1 ? t.categoryToolsOne : t.categoryToolsMany

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
      <LocaleLink href="/categories" className="font-semibold text-primary">
        ← {t.categoryBackToList}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.categoriesPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      <p className="mt-2 text-sm text-muted-foreground">{fill(countLabel, { count: visible.length })}</p>
      <LocaleLink
        href={`/catalogue?category=${encodeURIComponent(categoryId)}`}
        className="mt-5 inline-flex items-center gap-1 font-semibold text-primary"
      >
        {t.categoryBrowseCatalogue} <ArrowRight className="size-4" />
      </LocaleLink>

      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label={t.priceFilters}>
        {PRICE_FILTERS.map((filter) => {
          const selected = activePrice === filter
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={selected}
              onClick={() => writePricing(selected ? null : (filter as PriceFilter))}
              className={`h-9 rounded-full px-4 text-sm font-semibold ring-1 ring-border ${selected ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              {pricingLabel(locale, filter)}
            </button>
          )
        })}
        {activePrice ? (
          <button type="button" onClick={() => writePricing(null)} className="h-9 rounded-full px-4 text-sm font-semibold text-primary">
            {t.clearFilters}
          </button>
        ) : null}
      </div>

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
    </main>
  )
}
