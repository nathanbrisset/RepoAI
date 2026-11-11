import { GuidePageContent } from "@/lib/pages/guide-page-content"
import { editorialGuideSlugs } from "@/lib/directory/editorial-guides"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"

export function generateStaticParams() {
  return editorialGuideSlugs().map((slug) => ({ slug }))
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params
  return metadataFor(`/guides/${slug}`, PAGE_LOCALE_EN)
}

export default async function GuidePage(props: PageProps) {
  return GuidePageContent({ locale: PAGE_LOCALE_EN, params: props.params })
}
