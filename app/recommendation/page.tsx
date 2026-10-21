import { Suspense } from "react"
import { metadataFor } from "@/lib/i18n/metadata"
import RecommendationClient from "./recommendation-client"

export function generateMetadata() {
  return metadataFor("/recommendation")
}

export default function RecommendationPage() {
  return (
    <Suspense>
      <RecommendationClient />
    </Suspense>
  )
}
