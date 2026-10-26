import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import { getLocale } from "@/lib/i18n/get-locale"
import { translate } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/category/new")
}

export default async function NewToolsPage() {
  const locale = await getLocale()
  // Sort tools by dateAdded (newest first)
  const sortedTools = [...mockTools].sort((a, b) => {
    const dateA = new Date(a.dateAdded || "1970-01-01")
    const dateB = new Date(b.dateAdded || "1970-01-01")
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{translate(locale, "lists.newTitle")}</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 