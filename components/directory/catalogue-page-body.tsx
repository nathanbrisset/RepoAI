"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import type { CatalogQueryResult } from "@/lib/directory/catalog-query-types"
import { queryCatalogFromIndex } from "@/lib/directory/catalog-index-query"
import { loadCatalogSearchIndex, prefetchCatalogSearchIndex } from "@/lib/directory/load-catalog-search-index"
import {
  catalogInputFromListingQuery,
  isDefaultListingQuery,
  listingQueryFromSearchParams,
} from "@/lib/directory/listing-query-params"
import { CatalogueClient } from "./catalogue-client"

export function CataloguePageBody({
  basePath,
  initialPage,
}: {
  basePath: "/catalogue" | "/tools"
  initialPage: CatalogQueryResult
}) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const queryUi = useMemo(() => listingQueryFromSearchParams(searchParams), [searchParams])
  const linkParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])
  const [catalogPage, setCatalogPage] = useState<CatalogQueryResult>(initialPage)
  const [loading, setLoading] = useState(false)

  const defaultView = isDefaultListingQuery(queryUi)

  useEffect(() => {
    if (defaultView) {
      setCatalogPage(initialPage)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    void loadCatalogSearchIndex(locale)
      .then((index) => {
        if (cancelled) return
        const result = queryCatalogFromIndex(locale, index, catalogInputFromListingQuery(queryUi))
        setCatalogPage(result)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [defaultView, initialPage, locale, queryUi])

  useEffect(() => {
    if (!defaultView) return
    const onScroll = () => prefetchCatalogSearchIndex(locale)
    window.addEventListener("scroll", onScroll, { once: true, passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [defaultView, locale])

  useEffect(() => {
    if (!defaultView) return
    const onFilterIntent = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (target.closest("[data-catalogue-filter-intent]")) prefetchCatalogSearchIndex(locale)
    }
    document.addEventListener("click", onFilterIntent, { capture: true })
    document.addEventListener("focusin", onFilterIntent, { capture: true })
    return () => {
      document.removeEventListener("click", onFilterIntent, { capture: true })
      document.removeEventListener("focusin", onFilterIntent, { capture: true })
    }
  }, [defaultView, locale])

  return (
    <div data-catalogue-filter-intent className={loading && !defaultView ? "opacity-95" : undefined}>
      <CatalogueClient
        basePath={basePath}
        catalogPage={catalogPage}
        queryUi={queryUi}
        linkSearchParams={linkParams}
        onInteractionIntent={() => prefetchCatalogSearchIndex(locale)}
      />
    </div>
  )
}