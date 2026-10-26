import { Suspense } from "react"
import { CatalogueClient } from "@/components/directory/catalogue-client"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/tools")
}

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CatalogueClient basePath="/tools" />
    </Suspense>
  )
}
