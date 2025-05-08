import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { aiTools } from "@/data/ai-tools"
import ToolCard from "@/components/tool-card"
import CategoryFilter from "@/components/category-filter"
import FeaturedTool from "@/components/featured-tool"

export default function Home() {
  // Get the newest tools (last 5 added)
  const newTools = [...aiTools]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5)

  // Get the most visited tool
  const featuredTool = [...aiTools].sort((a, b) => b.visits - a.visits)[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI for everyone</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Your comprehensive directory of AI tools for every use case. Find, compare, and choose the perfect AI
            solution for your needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/tools">
                Browse All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Link href="/submit">Submit a Tool</Link>
            </Button>
          </div>
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
            <Link href="/tools" className="text-purple-600 hover:text-purple-800 font-medium">
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
            <h2 className="text-2xl font-bold text-gray-800">Most Popular Tools</h2>
            <Link href="/tools" className="text-purple-600 hover:text-purple-800 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...aiTools]
              .sort((a, b) => b.visits - a.visits)
              .slice(0, 6)
              .map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore AI Tools?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the perfect AI solutions to enhance your productivity, creativity, and workflow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/tools">
                Browse Directory
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Link href="/submit">Submit a Tool</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
} 