import { notFound } from "next/navigation"
import { CollectionDetail } from "@/components/directory/collection-detail"
import { resolvedCollections, resolvedRecipesForCollection } from "@/lib/directory/data"
import type { Locale } from "@/lib/i18n/config"

type PageParams = Promise<{ slug: string }>

export async function CollectionPageContent({ locale, params }: { locale: Locale; params: PageParams }) {
  const { slug } = await params
  const collection = resolvedCollections(locale).find((item) => item.slug === slug)
  if (!collection) notFound()
  const recipes = resolvedRecipesForCollection(locale, slug)
  return <CollectionDetail collection={collection} recipes={recipes} />
}
