import { Metadata } from "next"
import { mockTools } from "@/lib/data"
import { pageMetadata } from "@/lib/seo"
import ToolCard from "@/components/tool-card"

export const metadata: Metadata = pageMetadata({
  title: "Most Popular AI Tools",
  description: "AI tools in the AI Tools Ninja directory ordered by the visit figures stored on each listing.",
  path: "/category/popular",
})

export default async function PopularToolsPage() {
  // Sort tools by visits (highest first)
  const sortedTools = [...mockTools].sort((a, b) => {
    return (b.visits || 0) - (a.visits || 0)
  })

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">Most Popular AI Tools</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 