import { notFound } from "next/navigation"
import { CategoryPageContent } from "@/lib/pages/category-page-content"
import { categoryCatalog } from "@/lib/category-meta"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400
export const dynamicParams = false

export async function generateStaticParams() {
  return categoryCatalog.map((category) => ({
    category: category.id,
  }))
}

type PageProps = {
  params: Promise<{ category: string }>
}

export async function generateMetadata(props: PageProps) {
  const { category } = await props.params
  if (!categoryCatalog.some((item) => item.id === category)) notFound()
  return metadataFor(`/categories/${category}`, PAGE_LOCALE_EN)
}

export default async function CategoryPage(props: PageProps) {
  return CategoryPageContent({ locale: PAGE_LOCALE_EN, params: props.params })
}
