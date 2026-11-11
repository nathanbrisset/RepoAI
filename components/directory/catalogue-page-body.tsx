"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { parseCatalogSearchParams, queryCatalogRecords } from "@/lib/directory/catalog-query"
import {
  EMPTY_LISTING_QUERY,
  listingQueryFromSearchParams,
} from "@/lib/directory/listing-query-params"
import { CatalogueClient } from "./catalogue-client"

function paramsFromListingQuery(query: typeof EMPTY_LISTING_QUERY) {
  const params: Record<string, string | string[] | undefined> = {}
  if (query.category) params.category = query.category
  if (query.q) params.q = query.q
  if (query.sort !== "trending") params.sort = query.sort
  if (query.pricing) params.pricing = query.pricing
  if (query.hqCountry) params.hqCountry = query.hqCountry
  if (query.page > 1) params.page = String(query.page)
  return params
}

export function CataloguePageBody({ basePath }: { basePath: "/catalogue" | "/tools" }) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [queryUi, setQueryUi] = useState(EMPTY_LISTING_QUERY)

  useEffect(() => {
    setMounted(true)
    setQueryUi(listingQueryFromSearchParams(searchParams))
  }, [searchParams])

  const catalogPage = useMemo(() => {
    const input = mounted ? paramsFromListingQuery(queryUi) : {}
    return queryCatalogRecords(locale, parseCatalogSearchParams(input))
  }, [locale, queryUi, mounted])

  const linkParams = useMemo(() => {
    if (!mounted) return new URLSearchParams()
    return new URLSearchParams(searchParams.toString())
  }, [mounted, searchParams])

  return (
    <CatalogueClient
      basePath={basePath}
      catalogPage={catalogPage}
      queryUi={mounted ? queryUi : EMPTY_LISTING_QUERY}
      linkSearchParams={linkParams}
    />
  )
}
