import { notFound } from "next/navigation"
import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface RecommendationsPageProps {
  searchParams: {
    query?: string
  }
}

export default function RecommendationsPage({ searchParams }: RecommendationsPageProps) {
  const query = searchParams.query

  if (!query) {
    notFound()
  }

  // Simple recommendation logic - can be enhanced with more sophisticated matching
  const matchedTools = mockTools
    .map(tool => ({
      ...tool,
      matchScore: calculateMatchScore(tool, query)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const topMatch = matchedTools[0]
  const alternativeMatches = matchedTools.slice(1, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">AI TOOLS NINJA Recommendation</h1>

        {/* Top Match */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Left side - Tool Image */}
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img
                  src={topMatch.image || "/placeholder.svg"}
                  alt={topMatch.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Right side - Tool Info */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">{topMatch.name}</h2>
                <p className="text-lg text-gray-600 mb-6">{topMatch.description}</p>
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-purple-800 mb-3">Why we recommend this tool</h3>
                  <p className="text-gray-700 mb-2">
                    {generateLongDescription(topMatch)}
                  </p>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li><b>Categories:</b> {topMatch.categories.join(", ")}</li>
                    <li><b>Tags:</b> {(topMatch.tags || []).join(", ")}</li>
                    <li><b>Popularity:</b> {topMatch.visits.toLocaleString()} visits</li>
                    <li><b>Rating:</b> {topMatch.rating.toFixed(1)} / 5</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <span>{topMatch.rating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span>{topMatch.categories.join(", ")}</span>
                  </div>
                  <Button asChild className="w-full">
                    <a href={topMatch.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Matches */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Alternative AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternativeMatches.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// Simple matching algorithm - can be enhanced with more sophisticated NLP
function calculateMatchScore(tool: any, query: string): number {
  const queryLower = query.toLowerCase()
  const toolText = `${tool.name} ${tool.description} ${tool.categories.join(" ")} ${tool.tags.join(" ")}`.toLowerCase()
  
  // Calculate basic text similarity
  const words = queryLower.split(" ")
  let score = 0
  
  words.forEach(word => {
    if (toolText.includes(word)) {
      score += 1
    }
  })

  // Boost score based on rating and visits
  score += tool.rating * 0.5
  score += Math.log(tool.visits) * 0.1

  return score
}

function generateLongDescription(tool: any): string {
  const tags = tool.tags || [];
  return `"${tool.name}" is a top-rated AI tool in the field of ${tool.categories.join(", ")}. ${tool.description} It is especially useful for tasks related to ${tags.join(", ")}. With a rating of ${tool.rating.toFixed(1)} and over ${tool.visits.toLocaleString()} visits, it is trusted by many users. Whether you're looking for ${tool.subcategory.replace(/-/g, ' ')}, or just want to explore new AI solutions, this tool is a great match for your needs.`;
} 