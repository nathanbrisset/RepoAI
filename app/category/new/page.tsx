import { Metadata } from "next"
import { tools } from "@/lib/data"
import ToolCard from "@/components/tool-card"

export const metadata: Metadata = {
  title: "New AI Tools | AI Tools Directory",
  description: "Discover the latest AI tools added to our directory",
}

export default async function NewToolsPage() {
  // Sort tools by dateAdded (newest first)
  const sortedTools = [...tools].sort((a, b) => {
    const dateA = new Date(a.dateAdded || "1970-01-01")
    const dateB = new Date(b.dateAdded || "1970-01-01")
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">New AI Tools</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 