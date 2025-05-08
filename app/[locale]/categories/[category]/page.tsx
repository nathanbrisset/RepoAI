import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ToolCard from "@/components/tool-card"
import { aiTools } from "@/data/ai-tools"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Convert URL parameter to match our category format
  const categoryName = decodeURIComponent(params.category)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  
  // Filter tools by category
  const categoryTools = aiTools.filter(tool => 
    tool.categories.some(category => 
      category.toLowerCase() === categoryName.toLowerCase()
    )
  )

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
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-gray-600 max-w-3xl">
          Browse our collection of {categoryName.toLowerCase()} AI tools. Find the perfect solution for your needs.
        </p>
      </div>

      {/* Tools Grid */}
      {categoryTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg mb-12">
          <h3 className="text-xl font-medium mb-2">No tools found</h3>
          <p className="text-gray-600 mb-6">We couldn't find any tools in this category yet.</p>
          <Link href="/submit" className="text-purple-600 hover:text-purple-800 font-medium">
            Submit a Tool
          </Link>
        </div>
      )}

      {/* Category Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 mt-8">
        <h2 className="text-xl font-bold mb-4">About {categoryName} AI Tools</h2>
        <p className="mb-4">
          {categoryName} AI tools leverage artificial intelligence to enhance and automate various tasks in this domain.
          These innovative solutions are transforming how professionals and individuals approach their work.
        </p>
        <p className="mb-4">
          When choosing a {categoryName.toLowerCase()} AI tool, consider factors like ease of use, output quality,
          customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test
          their capabilities before committing to a paid plan.
        </p>
        <p>
          Browse our curated selection of the best {categoryName.toLowerCase()} AI tools to find the perfect solution
          for your specific needs and budget.
        </p>
      </div>
    </div>
  )
} 