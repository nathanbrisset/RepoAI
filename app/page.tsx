import Link from "next/link"
import ToolCard from "@/components/tool-card"
import CategoryFilter from "@/components/category-filter"
import { mockTools } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

export const metadata = {
  title: "AITools.ninja - Find the Best AI Tools for Every Use Case",
  description: "Your comprehensive directory of AI tools for every use case. Find, compare, and choose the perfect AI solution for your needs.",
  openGraph: {
    title: "AITools.ninja - Find the Best AI Tools for Every Use Case",
    description: "Your comprehensive directory of AI tools for every use case. Find, compare, and choose the perfect AI solution for your needs.",
    url: "https://aitools.ninja/",
    siteName: "AITools.ninja",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AITools.ninja - Find the Best AI Tools for Every Use Case",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AITools.ninja - Find the Best AI Tools for Every Use Case",
    description: "Your comprehensive directory of AI tools for every use case. Find, compare, and choose the perfect AI solution for your needs.",
    images: ["/og-image.png"],
    site: "@aitoolsninja",
  },
  alternates: {
    canonical: "https://aitools.ninja/",
  },
};

export default function Home() {
  // Get the newest tools (last 5 added)
  const newTools = [...mockTools]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5)

  // Get the most visited tools (top 5)
  const mostVisited = [...mockTools].sort((a, b) => b.visits - a.visits).slice(0, 5)

  // Get the top rated tools (top 5)
  const topRated = [...mockTools].sort((a, b) => b.rating - a.rating).slice(0, 5)

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
        {/* AI Match Recommendation Section */}
        <section className="mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left side - Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="/ai-match-hero.jpg"
                alt="AI Match"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Right side - Text and Input */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Find your AI MATCH!
              </h2>
              <p className="text-lg text-gray-600 mb-6">Whatever you need, there's an AI for it!</p>
              <form action="/match-results" method="GET" className="space-y-4">
                <Textarea
                  placeholder="Describe what you're trying to accomplish..."
                  className="min-h-[150px] resize-none"
                  name="query"
                  required
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Find my A-Match
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse by Category</h2>
          <CategoryFilter />
        </section>

        {/* New Tools */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Newest Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Most Visited */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Most Popular</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostVisited.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Rated</h2>
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
