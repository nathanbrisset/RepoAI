import { notFound } from "next/navigation"
import { GuideDetail } from "@/components/directory/guide-detail"
import { COLLECTION_DEFS } from "@/lib/directory/collections"
import { directoryRecords } from "@/lib/directory/data"
import {
  editorialGuideBySlug,
  editorialGuideSlugs,
  resolveEditorialGuide,
} from "@/lib/directory/editorial-guides"
import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateStaticParams() {
  return editorialGuideSlugs().map((slug) => ({ slug }))
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params
  return metadataFor(`/guides/${slug}`)
}

export default async function GuidePage(props: PageProps) {
  const [{ slug }, locale] = await Promise.all([props.params, getLocale()])
  const def = editorialGuideBySlug(slug)
  if (!def) notFound()

  const collectionDef = COLLECTION_DEFS.find((item) => item.slug === def.collectionSlug)
  const toolsById = new Map(
    directoryRecords(locale).map((record) => [record.id, { name: record.name, logo: record.logo }]),
  )
  const guide = resolveEditorialGuide(def, locale, toolsById, collectionDef?.title[locale] || def.collectionSlug)
  if (!guide) notFound()

  return <GuideDetail guide={guide} />
}
