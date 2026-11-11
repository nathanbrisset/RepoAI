"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { queryCategoryRecords } from "@/lib/directory/catalog-query"
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
  const pricing = searchParams.get("pricing") || undefined
  const pageRaw = Number.parseInt(searchParams.get("page") || "1", 10)
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
  const catalogPage = useMemo(
    () => queryCategoryRecords(locale, categoryId, pricing, page),
    [locale, categoryId, pricing, page],
  )

  return (
    <CategoryDetailClient
      categoryId={categoryId}
      name={name}
      description={description}
      catalogPage={catalogPage}
    />
  )
}
