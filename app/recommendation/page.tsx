import { mockTools } from '@/lib/data'
import { Metadata } from 'next'
import ToolCard from '@/components/tool-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Tool } from '@/lib/types'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'AI Tool Recommendation | AI Tools Ninja',
  description: 'Get personalized AI tool recommendations based on your needs',
}

const categoryNames: Record<string, string> = {
  'audio': 'Audio Processing',
  'image': 'Image Generation',
  'text': 'Text Processing',
  'coding': 'Development',
  'video': 'Video Creation',
  'marketing': 'Marketing',
  'research': 'Research',
  'analytics': 'Analytics',
  'data': 'Data Processing',
  'design': 'Design'
}

function findBestMatch(query: string): { bestMatch: Tool, otherMatches: Tool[] } {
  // Convert query to lowercase for better matching
  const q = query.toLowerCase()
  
  // Define keywords and their corresponding categories/tags
  const keywordMap = {
    'voice': ['audio', 'voice-generation', 'text-to-speech'],
    'speech': ['audio', 'voice-generation', 'text-to-speech'],
    'image': ['image', 'art', 'design'],
    'picture': ['image', 'art', 'design'],
    'code': ['coding', 'development'],
    'programming': ['coding', 'development'],
    'video': ['video', 'animation'],
    'marketing': ['marketing', 'content'],
    'writing': ['text', 'content'],
    'analytics': ['analytics', 'data'],
  }

  // Score each tool based on query relevance
  const scoredTools = mockTools.map(tool => {
    let score = 0
    
    // Check tool name and description
    if (tool.name.toLowerCase().includes(q)) score += 5
    if (tool.description.toLowerCase().includes(q)) score += 3
    
    // Check categories and tags
    tool.categories.forEach(category => {
      if (category.toLowerCase().includes(q)) score += 4
    })
    if (tool.tags) {
      tool.tags.forEach(tag => {
        if (tag.toLowerCase().includes(q)) score += 2
      })
    }
    
    // Check against keyword map
    Object.entries(keywordMap).forEach(([keyword, relatedTerms]) => {
      if (q.includes(keyword)) {
        relatedTerms.forEach(term => {
          if (tool.categories.some(cat => cat.toLowerCase() === term) ||
              (tool.tags && tool.tags.some(tag => tag.toLowerCase() === term))) {
            score += 3
          }
        })
      }
    })
    
    return { tool, score }
  })

  // Sort by score
  scoredTools.sort((a, b) => b.score - a.score)
  
  // Return best match and other matches
  return {
    bestMatch: scoredTools[0].tool,
    otherMatches: scoredTools.slice(1, 7).map(st => st.tool)
  }
}

function getRecommendationReason(tool: Tool, query: string): string[] {
  const reasons: string[] = []
  
  if (tool.rating >= 4.5) {
    reasons.push(`Highly rated (${tool.rating}/5)`)
  }
  
  if (tool.visits > 1000000) {
    reasons.push('Popular among users')
  }
  
  tool.categories.forEach((category) => {
    const categoryName = categoryNames[category]
    if (categoryName) {
      reasons.push(`Specialized in ${categoryName}`)
    }
  })

  return reasons
}

function SearchForm() {
  return (
    <form action="/recommendation" className="w-full max-w-2xl mx-auto mb-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Perfect AI Tool
        </h1>
        <p className="text-center text-muted-foreground text-lg">
          Describe what you're looking to do, and we'll find the best AI tool for your needs
        </p>
        <textarea
          name="q"
          className="w-full min-h-[150px] p-6 rounded-xl border border-input bg-white/50 dark:bg-black/50 backdrop-blur-sm text-lg shadow-inner"
          placeholder="Describe what you're looking to do... (e.g., 'I need to create professional voiceovers for my videos' or 'I want to generate images from text descriptions')"
          required
        />
        <div className="flex justify-center">
          <button 
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-200 hover:scale-105"
          >
            Find AI Tools
          </button>
        </div>
      </div>
    </form>
  )
}

export default function RecommendationPage({ searchParams }: any) {
  const query = searchParams?.q

  // If no query is provided, show the search form
  if (!query) {
    return (
      <div className="container py-12">
        <SearchForm />
      </div>
    )
  }

  const { bestMatch, otherMatches } = findBestMatch(query)
  const reasons = getRecommendationReason(bestMatch, query)

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Perfect AI Tool Match</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Best Match Card */}
        <div className="col-span-1">
          <ToolCard tool={bestMatch} />
        </div>
        
        {/* Recommendation Explanation */}
        <div className="col-span-1 space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Based on your request:
            </h2>
            <p className="text-lg text-muted-foreground mb-6 italic">
              "{query}"
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Why we recommend {bestMatch.name}:</h3>
              <p className="text-muted-foreground">{bestMatch.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {bestMatch.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Other Recommendations */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Other options you might like:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherMatches.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  )
} 