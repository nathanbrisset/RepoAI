import { AIToolCard } from "@/components/ai-tool-card"
import { aiTools } from "@/data/ai-tools"
import { notFound } from "next/navigation"

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

  if (categoryTools.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryTools.map((tool) => (
          <AIToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 