import { Metadata } from "next"
import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"

export const metadata: Metadata = {
  title: "Top Rated AI Tools | AI Tools Directory",
  description: "Discover the highest rated AI tools in our directory",
}

export default async function TopRatedToolsPage() {
  // Sort tools by rating (highest first)
  const sortedTools = [...mockTools].sort((a, b) => {
    return (b.rating || 0) - (a.rating || 0)
  })

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">Top Rated AI Tools</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 