import { Suspense } from "react"
import { CompareClient } from "@/components/directory/compare-client"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/compare")
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16" />}>
      <CompareClient />
    </Suspense>
  )
}
