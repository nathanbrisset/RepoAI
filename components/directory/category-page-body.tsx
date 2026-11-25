"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import type { CatalogQueryResult } from "@/lib/directory/catalog-query-types"
import { queryCatalogFromIndex } from "@/lib/directory/catalog-index-query"
import { loadCatalogSearchIndex, prefetchCatalogSearchIndex } from "@/lib/directory/load-catalog-search-index"
import {
  catalogInputFromListingQuery,
  listingQueryFromSearchParams,
} from "@/lib/directory/listing-query-params"
import { CategoryDetailClient } from "./category-detail-client"

function isDefaultCategoryQuery(ui: ReturnType<typeof listingQueryFromSearchParams>) {
  return !ui.q && !ui.pricing && !ui.hqCountry && ui.page === 1 && ui.sort === "trending"
}

export function CategoryPageBody({
  categoryId,
  name,
  description,
  initialPage,
}: {
  categoryId: string
  name: string
  description: string
  initialPage: CatalogQueryResult
}) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const queryUi = useMemo(() => listingQueryFromSearchParams(searchParams), [searchParams])
  const [catalogPage, setCatalogPage] = useState<CatalogQueryResult>(initialPage)

  const defaultView = isDefaultCategoryQuery(queryUi)

  useEffect(() => {
    if (defaultView) {
      setCatalogPage(initialPage)
      return
    }

    let cancelled = false
    void loadCatalogSearchIndex(locale)
      .then((index) => {
        if (cancelled) return
        const input = catalogInputFromListingQuery({ ...queryUi, category: categoryId })
        setCatalogPage(queryCatalogFromIndex(locale, index, input))
      })

    return () => {
      cancelled = true
    }
  }, [categoryId, defaultView, initialPage, locale, queryUi])

  useEffect(() => {
    if (!defaultView) return
    const onScroll = () => prefetchCatalogSearchIndex(locale)
    window.addEventListener("scroll", onScroll, { once: true, passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [defaultView, locale])

  const linkParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  return (
    <CategoryDetailClient
      categoryId={categoryId}
      name={name}
      description={description}
      catalogPage={catalogPage}
      pricing={queryUi.pricing}
      linkSearchParams={linkParams}
      onInteractionIntent={() => prefetchCatalogSearchIndex(locale)}
    />
  )
}