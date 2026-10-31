"use client"

import { ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import { pricingLabel } from "@/lib/i18n/messages"
import { PRICE_FILTERS, priceFilterParam, type PriceFilter } from "@/lib/price-filter"
import type { CatalogQueryResult } from "@/lib/directory/catalog-query"
import { ToolCard } from "./tool-card"

export function CategoryDetailClient({
  categoryId,
  name,
  description,
  catalogPage,
}: {
  categoryId: string
  name: string
  description: string
  catalogPage: CatalogQueryResult
}) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pricing = searchParams.get("pricing")
  const activePrice = PRICE_FILTERS.find((filter) => priceFilterParam(filter) === pricing) || null
  const { items: visible, total, page, totalPages } = catalogPage

  function writePricing(next: PriceFilter | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (next) params.set("pricing", priceFilterParam(next))
    else params.delete("pricing")
    params.delete("page")
    const query = params.toString()
    router.replace(localizeHref(locale, query ? `/categories/${categoryId}?${query}` : `/categories/${categoryId}`), { scroll: false })
  }

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage === 1) params.delete("page")
    else params.set("page", String(nextPage))
    const query = params.toString()
    router.replace(localizeHref(locale, query ? `/categories/${categoryId}?${query}` : `/categories/${categoryId}`), { scroll: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const countLabel = total === 1 ? t.categoryToolsOne : t.categoryToolsMany

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
      <LocaleLink href="/categories" className="font-semibold text-primary">
        ← {t.categoryBackToList}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.categoriesPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      <p className="mt-2 text-sm text-muted-foreground">{fill(countLabel, { count: total })}</p>
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
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
          {totalPages > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label={t.pageStatus}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="h-10 rounded-full px-5 text-sm font-semibold ring-1 ring-border enabled:hover:bg-card disabled:opacity-40"
              >
                {t.pagePrev}
              </button>
              <span className="text-sm text-muted-foreground">
                {fill(t.pageStatus, { page: String(page), totalPages: String(totalPages) })}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="h-10 rounded-full px-5 text-sm font-semibold ring-1 ring-border enabled:hover:bg-card disabled:opacity-40"
              >
                {t.pageNext}
              </button>
            </nav>
          ) : null}
        </>
      )}
    </main>
  )
}
