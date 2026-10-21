import ToolCard from "@/components/tool-card"
import CategoryFilter from "@/components/category-filter"
import { mockTools } from "@/lib/data"
import { HomeMatch } from "@/components/match-panel"

export default function Home() {
  const newTools = [...mockTools]
    .filter((tool) => tool.dateAdded && tool.status !== "sunset")
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5)

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
        <HomeMatch />

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse by Category</h2>
          <CategoryFilter />
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Newest Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
