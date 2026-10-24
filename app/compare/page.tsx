import { Suspense } from "react"
import { listedTools } from "@/lib/catalog"
import { toDirectoryTool } from "@/lib/directory/tools"
import { getLocale } from "@/lib/i18n/get-locale"
import { toolForLocale } from "@/lib/i18n/localize-tool"
import { metadataFor } from "@/lib/i18n/metadata"
import { CompareClient } from "./compare-client"

export function generateMetadata() {
  return metadataFor("/compare")
}

export default async function ComparePage() {
  const locale = await getLocale()
  const tools = listedTools.map((tool) => toDirectoryTool(toolForLocale(tool, locale)))
  return (
    <Suspense fallback={null}>
      <CompareClient tools={tools} />
    </Suspense>
  )
}
