import { mockTools } from "@/lib/data"
import { ToolCardGrid } from "@/components/directory/tool-card-grid"
import { translate } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/category/popular", PAGE_LOCALE_EN)
}

export default function PopularToolsPage() {
  const sortedTools = [...mockTools]
    .filter((tool) => tool.status !== "sunset")
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{translate(PAGE_LOCALE_EN, "lists.popularTitle")}</h1>
      <p className="text-gray-600 mb-4 max-w-3xl">{translate(PAGE_LOCALE_EN, "lists.popularNote")}</p>
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
      <ToolCardGrid tools={sortedTools} />
    </div>
  )
}
