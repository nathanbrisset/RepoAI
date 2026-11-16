import { notFound } from "next/navigation"
import { GuideDetail } from "@/components/directory/guide-detail"
import { COLLECTION_DEFS } from "@/lib/directory/collections"
import { directoryRecords } from "@/lib/directory/data"
import { editorialGuideBySlug, resolveEditorialGuide } from "@/lib/directory/editorial-guides"
import type { Locale } from "@/lib/i18n/config"

type PageParams = Promise<{ slug: string }>

export async function GuidePageContent({ locale, params }: { locale: Locale; params: PageParams }) {
  const { slug } = await params
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
