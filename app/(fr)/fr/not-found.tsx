import type { Metadata } from "next"
import { NotFoundDocument } from "@/components/not-found-document"
import { translate } from "@/lib/i18n/messages"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { OG_IMAGE_ALT, OG_IMAGE_HEIGHT, OG_IMAGE_PATH, OG_IMAGE_WIDTH, SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

export function generateMetadata(): Metadata {
  const ogImageUrl = `${SITE_URL}${OG_IMAGE_PATH}`
  return {
    metadataBase: new URL(SITE_URL),
    title: translate(PAGE_LOCALE_FR, "meta.notFoundTitle"),
    description: translate(PAGE_LOCALE_FR, "meta.notFoundDescription"),
    robots: { index: false, follow: true },
    openGraph: {
      images: [
        { url: ogImageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  }
}

export default function FrNotFound() {
  return <NotFoundDocument locale={PAGE_LOCALE_FR} />
}
