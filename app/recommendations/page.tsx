import { notFound } from "next/navigation"
import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

type Props = {
  params: {}
  searchParams: { query?: string }
}

export default function RecommendationsPage({ searchParams }: any) {
  const query = searchParams?.query

  if (!query) {
    notFound()
  }

  // Enhanced recommendation logic
  const matchedTools = mockTools
    .map(tool => {
      const { matchScore, matchReasons } = calculateMatchScore(tool, query)
      return {
        ...tool,
        matchScore,
        matchReasons
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)

  const topMatch = matchedTools[0]
  const alternativeMatches = matchedTools.slice(1, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-black">Your AI Tools Ninja Recommendation</h1>

        {/* Hero Top Match */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-center items-center border border-gray-200 min-h-[420px] md:min-h-[480px]">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-stretch">
              {/* Left side - Tool Image */}
              <div className="flex items-center justify-center h-full bg-white min-h-[260px] md:min-h-[420px] ml-6 md:ml-10 md:mr-10">
                <img
                  src={topMatch.image || "/placeholder.svg"}
                  alt={topMatch.name}
                  className="object-contain max-h-[180px] md:max-h-[320px] rounded-xl border border-gray-100"
                  style={{margin: 'auto'}}
                />
              </div>
              {/* Right side - Tool Info (compact card) */}
              <div className="flex flex-col justify-center items-start h-full p-6 md:p-10 max-w-xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{topMatch.name}</h2>
                <p className="text-base md:text-lg text-gray-700 mb-4 line-clamp-3">{topMatch.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full">
                  <h3 className="font-semibold text-gray-800 mb-2 text-base">Why we recommend this tool</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    {generateLongDescription(topMatch)}
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 text-xs">
                    <li><b>Categories:</b> {(topMatch.categories || []).join(", ")}</li>
                    <li><b>Tags:</b> {(topMatch.tags || []).join(", ")}</li>
                    <li><b>Popularity:</b> {topMatch.visits?.toLocaleString()} visits</li>
                    <li><b>Rating:</b> {topMatch.rating?.toFixed(1)} / 5</li>
                    {topMatch.matchReasons && (
                      <li className="mt-2"><b>Matched on:</b> {topMatch.matchReasons.join(", ")}</li>
                    )}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-4 w-full items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Rating:</span>
                    <span>{topMatch.rating?.toFixed(1)}/5</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Category:</span>
                    <span>{(topMatch.categories || []).join(", ")}</span>
                  </div>
                  <Button asChild className="ml-auto px-6 py-2 text-base font-semibold">
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

// Enhanced matching algorithm with partial and weighted matches
function calculateMatchScore(tool: any, query: string): { matchScore: number, matchReasons: string[] } {
  const queryLower = query.toLowerCase()
  const words = queryLower.split(/\s+/)
  let score = 0
  let matchReasons: string[] = []

  // Helper for partial match
  const partialMatch = (text: string, word: string) => text.includes(word) || word.includes(text)

  // Check tags
  if (tool.tags) {
    for (const tag of tool.tags) {
      for (const word of words) {
        if (partialMatch(tag.toLowerCase(), word)) {
          score += 5
          matchReasons.push(`tag (${tag})`)
        }
      }
    }
  }

  // Check subcategory
  if (tool.subcategory) {
    for (const word of words) {
      if (partialMatch(tool.subcategory.toLowerCase(), word)) {
        score += 4
        matchReasons.push(`subcategory (${tool.subcategory})`)
      }
    }
  }

  // Check categories
  if (tool.categories) {
    for (const cat of tool.categories) {
      for (const word of words) {
        if (partialMatch(cat.toLowerCase(), word)) {
          score += 3
          matchReasons.push(`category (${cat})`)
        }
      }
    }
  }

  // Check name and description
  const toolText = `${tool.name} ${tool.description}`.toLowerCase()
  for (const word of words) {
    if (toolText.includes(word)) {
      score += 1
      matchReasons.push(`description/name`)
    }
  }

  // Boost score based on rating and visits
  score += tool.rating * 0.5
  score += Math.log(tool.visits) * 0.1

  // Remove duplicate reasons
  matchReasons = [...new Set(matchReasons)]

  return { matchScore: score, matchReasons }
}

function generateLongDescription(tool: any): string {
  const tags = tool.tags || [];
  return `"${tool.name}" is a top-rated AI tool in the field of ${tool.categories.join(", ")}. ${tool.description} It is especially useful for tasks related to ${tags.join(", ")}. With a rating of ${tool.rating.toFixed(1)} and over ${tool.visits.toLocaleString()} visits, it is trusted by many users. Whether you're looking for ${tool.subcategory.replace(/-/g, ' ')}, or just want to explore new AI solutions, this tool is a great match for your needs.`;
} 