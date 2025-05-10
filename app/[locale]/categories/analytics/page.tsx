import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ToolCard from "@/components/tool-card"
import { mockTools } from "@/lib/data"

export default function AnalyticsCategoryPage() {
  const categoryName = "Analytics"
  const categoryTools = mockTools.filter(tool =>
    tool.categories.includes("Analytics")
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
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600 max-w-3xl">
          Browse our collection of analytics AI tools. Find the perfect solution for your needs.
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h2 className="text-xl font-bold mb-4">About Analytics AI Tools</h2>
        <p className="mb-4">
          Analytics AI tools leverage artificial intelligence to enhance and automate data analysis, reporting, and insight generation. These innovative solutions are transforming how professionals and organizations make data-driven decisions.
        </p>
        <p className="mb-4">
          When choosing an analytics AI tool, consider factors like ease of use, integration capabilities, output quality, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.
        </p>
        <p>
          Browse our curated selection of the best analytics AI tools to find the perfect solution for your specific needs and budget.
        </p>
      </div>
    </div>
  )
} 