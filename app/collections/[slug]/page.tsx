import { CollectionPageContent } from "@/lib/pages/collection-page-content"
import { COLLECTION_DEFS } from "@/lib/directory/collections"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateStaticParams() {
  return COLLECTION_DEFS.map((collection) => ({ slug: collection.slug }))
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params
  return metadataFor(`/collections/${slug}`, PAGE_LOCALE_EN)
}

export default async function CollectionPage(props: PageProps) {
  return CollectionPageContent({ locale: PAGE_LOCALE_EN, params: props.params })
}
