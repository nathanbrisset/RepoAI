import Link from "next/link"
import ToolCard from "@/components/tool-card"
import CategoryFilter from "@/components/category-filter"
import FeaturedTool from "@/components/featured-tool"
import { mockTools } from "@/lib/data"

export default function Home() {
  // Get the newest tools (last 5 added)
  const newTools = [...mockTools]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5)

  // Get the most visited tools (top 5)
  const mostVisited = [...mockTools].sort((a, b) => b.visits - a.visits).slice(0, 5)

  // Get the top rated tools (top 5)
  const topRated = [...mockTools].sort((a, b) => b.rating - a.rating).slice(0, 5)

  // Get a featured tool (highest combination of rating and visits)
  const featuredTool = [...mockTools].sort((a, b) => b.rating * b.visits - a.rating * a.visits)[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AITools.ninja</h1>
          <p className="text-xl mb-8 max-w-2xl text-center">
            Your comprehensive directory of AI tools for every use case. Find, compare, and choose the perfect AI
            solution for your needs.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Featured Tool */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Tool</h2>
          <FeaturedTool tool={featuredTool} />
        </section>
        {/* Category Filter */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse by Category</h2>
          <CategoryFilter />
        </section>
        {/* New Tools */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New AI Tools</h2>
            <Link href="/category/new" className="text-purple-600 hover:text-purple-800 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
        {/* Most Visited */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Most Visited</h2>
            <Link href="/category/popular" className="text-purple-600 hover:text-purple-800 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostVisited.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
        {/* Top Rated */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Top Rated</h2>
            <Link href="/category/top-rated" className="text-purple-600 hover:text-purple-800 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRated.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
