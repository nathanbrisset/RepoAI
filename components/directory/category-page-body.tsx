"use client"

import { useEffect, useMemo, useState } from "react"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const catalogPage = useMemo(() => {
    const pricing = mounted ? searchParams.get("pricing") || undefined : undefined
    const pageRaw = Number.parseInt(mounted ? searchParams.get("page") || "1" : "1", 10)
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
    return queryCategoryRecords(locale, categoryId, pricing, page)
  }, [locale, categoryId, searchParams, mounted])

  return (
    <CategoryDetailClient
      categoryId={categoryId}
      name={name}
      description={description}
      catalogPage={catalogPage}
    />
  )
}
