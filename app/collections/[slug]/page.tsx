import { notFound } from "next/navigation"
import { CollectionDetail } from "@/components/directory/collection-detail"
import { COLLECTION_DEFS } from "@/lib/directory/collections"
import { resolvedCollections, resolvedRecipes } from "@/lib/directory/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateStaticParams() {
  return COLLECTION_DEFS.map((collection) => ({ slug: collection.slug }))
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params
  return metadataFor(`/collections/${slug}`)
}

export default async function CollectionPage(props: PageProps) {
  const [{ slug }, locale] = await Promise.all([props.params, getLocale()])
  const collection = resolvedCollections(locale).find((item) => item.slug === slug)
  if (!collection) notFound()
  const recipes = slug === "recettes-et-stacks" ? resolvedRecipes(locale) : undefined
  return <CollectionDetail collection={collection} recipes={recipes} />
}
