"use client"

import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import type { CatalogQueryResult } from "@/lib/directory/catalog-query"
import { listingPageHref } from "@/lib/directory/catalog-query"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { cn } from "@/lib/utils"

export function ListingPagination({
  barePath,
  catalogPage,
  linkSearchParams,
}: {
  barePath: string
  catalogPage: Pick<CatalogQueryResult, "page" | "totalPages">
  linkSearchParams: URLSearchParams
}) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { page, totalPages } = catalogPage

  if (totalPages <= 1) return null

  const linkClass =
    "inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold ring-1 ring-border hover:bg-card"

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label={t.pageStatus}>
      {page > 1 ? (
        <LocaleLink
          href={listingPageHref(barePath, linkSearchParams, page - 1)}
          scroll={false}
          className={linkClass}
        >
          {t.pagePrev}
        </LocaleLink>
      ) : (
        <span className={cn(linkClass, "opacity-40")} aria-disabled="true">
          {t.pagePrev}
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        {fill(t.pageStatus, { page: String(page), totalPages: String(totalPages) })}
      </span>
      {page < totalPages ? (
        <LocaleLink
          href={listingPageHref(barePath, linkSearchParams, page + 1)}
          scroll={false}
          className={linkClass}
        >
          {t.pageNext}
        </LocaleLink>
      ) : (
        <span className={cn(linkClass, "opacity-40")} aria-disabled="true">
          {t.pageNext}
        </span>
      )}
    </nav>
  )
}
