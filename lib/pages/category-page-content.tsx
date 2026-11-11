import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CategoryPageBody } from "@/components/directory/category-page-body"
import { categoryCatalog } from "@/lib/category-meta"
import type { Locale } from "@/lib/i18n/config"
import { categoryCopy } from "@/lib/i18n/messages"

type PageParams = Promise<{ category: string }>

export async function CategoryPageContent({ locale, params }: { locale: Locale; params: PageParams }) {
  const { category } = await params
  const categoryObj = categoryCatalog.find((item) => item.id === category)
  if (!categoryObj) notFound()

  const copy = categoryCopy(locale, categoryObj.id) || categoryObj

  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CategoryPageBody categoryId={categoryObj.id} name={copy.name} description={copy.description} />
    </Suspense>
  )
}
