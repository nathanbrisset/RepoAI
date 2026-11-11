import { Suspense } from "react"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import RecommendationClient from "./recommendation-client"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/recommendation", PAGE_LOCALE_EN)
}

export default function RecommendationPage() {
  return (
    <Suspense>
      <RecommendationClient />
    </Suspense>
  )
}
