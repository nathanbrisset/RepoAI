import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import { getLocale } from "@/lib/i18n/get-locale"
import { translate } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/category/popular")
}

export default async function PopularToolsPage() {
  const locale = await getLocale()
  // Visit counts were unsourced (one card claimed 1.7 billion). List active tools by name instead.
  const sortedTools = [...mockTools]
    .filter((tool) => tool.status !== "sunset")
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{translate(locale, "lists.popularTitle")}</h1>
      <p className="text-gray-600 mb-4 max-w-3xl">{translate(locale, "lists.popularNote")}</p>
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 