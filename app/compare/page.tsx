import { Suspense } from "react"
import { CompareClient } from "@/components/directory/compare-client"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/compare", PAGE_LOCALE_EN)
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16" />}>
      <CompareClient />
    </Suspense>
  )
}
