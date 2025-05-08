import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import ToolCard from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, mockTools } from "@/lib/data"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((c) => c.id === params.id)

  if (!category) {
    notFound()
  }

  // Filter tools by category
  const tools = mockTools.filter((tool) => tool.categories.includes(params.id))

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/categories" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Categories
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
            <div className="text-purple-600">{category.icon}</div>
          </div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">{category.description}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium mb-1">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} found
          </p>
          <p className="text-sm text-gray-600">Browse all {category.name.toLowerCase()} tools</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              <SelectItem value="premium">Premium Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg mb-12">
          <h3 className="text-xl font-medium mb-2">No tools found</h3>
          <p className="text-gray-600 mb-6">We couldn't find any tools in this category.</p>
          <Button asChild>
            <Link href="/submit">Submit a Tool</Link>
          </Button>
        </div>
      )}

      {/* Category Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h2 className="text-xl font-bold mb-4">About {category.name} AI Tools</h2>
        <p className="mb-4">
          {category.name} AI tools leverage artificial intelligence to {getCategoryDescription(category.id)}. These
          innovative solutions are transforming how professionals and individuals approach their work in this domain.
        </p>
        <p className="mb-4">
          When choosing a {category.name.toLowerCase()} AI tool, consider factors like ease of use, output quality,
          customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test
          their capabilities before committing to a paid plan.
        </p>
        <p>
          Browse our curated selection of the best {category.name.toLowerCase()} AI tools to find the perfect solution
          for your specific needs and budget.
        </p>
      </div>
    </div>
  )
}

// Helper function to get extended descriptions for categories
function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    "text-generation":
      "create high-quality written content for various purposes, from marketing copy to creative writing",
    "image-generation": "create stunning visuals, artwork, and designs from textual descriptions or other inputs",
    coding: "assist with programming tasks, generate code snippets, debug issues, and optimize existing code",
    audio: "process, generate, and transform audio content, including speech synthesis and voice cloning",
    design: "streamline the design process, generate creative assets, and enhance visual projects",
    productivity: "automate repetitive tasks, organize information, and boost efficiency in various workflows",
    research: "gather, analyze, and synthesize information from various sources to support decision-making",
    video: "create, edit, and enhance video content with minimal manual intervention",
    analytics: "process large datasets, identify patterns, and extract actionable insights",
    data: "clean, transform, and structure data for various applications and analyses",
  }

  return descriptions[categoryId] || "perform various AI-powered tasks with efficiency and accuracy"
}
