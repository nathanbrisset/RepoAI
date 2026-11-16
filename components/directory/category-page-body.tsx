"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { queryCategoryRecords } from "@/lib/directory/catalog-query"
import { EMPTY_LISTING_QUERY, listingQueryFromSearchParams } from "@/lib/directory/listing-query-params"
import { CategoryDetailClient } from "./category-detail-client"

export function CategoryPageBody({
  categoryId,
  name,
  description,
}: {
  categoryId: string
  name: string
  description: string
}) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [queryUi, setQueryUi] = useState(EMPTY_LISTING_QUERY)

  useEffect(() => {
    setMounted(true)
    setQueryUi(listingQueryFromSearchParams(searchParams))
  }, [searchParams])

  const catalogPage = useMemo(() => {
    const pricing = mounted ? queryUi.pricing || undefined : undefined
    const page = mounted ? queryUi.page : 1
    return queryCategoryRecords(locale, categoryId, pricing, page)
  }, [locale, categoryId, queryUi, mounted])

  const linkParams = useMemo(() => {
    if (!mounted) return new URLSearchParams()
    return new URLSearchParams(searchParams.toString())
  }, [mounted, searchParams])

  return (
    <CategoryDetailClient
      categoryId={categoryId}
      name={name}
      description={description}
      catalogPage={catalogPage}
      pricing={mounted ? queryUi.pricing : null}
      linkSearchParams={linkParams}
    />
  )
}
