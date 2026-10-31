import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CategoryDetailClient } from "@/components/directory/category-detail-client"
import { queryCategoryRecords } from "@/lib/directory/catalog-query"
import { categoryCatalog } from "@/lib/category-meta"
import { getLocale } from "@/lib/i18n/get-locale"
import { categoryCopy } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"

export const dynamicParams = false

export async function generateStaticParams() {
  return categoryCatalog.map((category) => ({
    category: category.id,
  }))
}

type PageProps = {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(props: PageProps) {
  const { category } = await props.params
  if (!categoryCatalog.some((item) => item.id === category)) notFound()
  return metadataFor(`/categories/${category}`)
}

export default async function CategoryPage(props: PageProps) {
  const { category } = await props.params
  const categoryObj = categoryCatalog.find((item) => item.id === category)
  if (!categoryObj) notFound()

  const locale = await getLocale()
  const copy = categoryCopy(locale, categoryObj.id) || categoryObj
  const params = await props.searchParams
  const pricing = typeof params.pricing === "string" ? params.pricing : undefined
  const pageRaw = Number.parseInt(typeof params.page === "string" ? params.page : "1", 10)
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
  const catalogPage = queryCategoryRecords(locale, categoryObj.id, pricing, page)

  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CategoryDetailClient
        categoryId={categoryObj.id}
        name={copy.name}
        description={copy.description}
        catalogPage={catalogPage}
      />
    </Suspense>
  )
}
