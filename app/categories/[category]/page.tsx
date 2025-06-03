import { tools, categories } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Utility to get category metadata by id
function getCategoryById(id: string) {
  return categories.find(cat => cat.id === id)
}

type Props = {
  params: {
    category: string;
  };
};

export default async function Page({ params }: Props) {
  const categoryId = params.category
  const category = getCategoryById(categoryId)

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
          <Link href="/categories">
            <Button variant="outline">Back to Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Filter tools for this category
  const categoryTools = tools.filter(tool =>
    tool.categories.includes(categoryId)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Back link */}
        <div className="mb-6">
          <Link href="/categories" className="text-gray-500 hover:text-gray-800 text-sm flex items-center mb-2">
            <span className="mr-2">←</span> All Categories
          </Link>
        </div>

        {/* Category header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            {category.icon}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-black mb-1">{category.name}</h1>
            <p className="text-lg text-gray-600">{category.description}</p>
          </div>
        </div>

        {/* Purple info box */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2 text-purple-900">About {category.name} AI Tools</h2>
          <p className="text-gray-700 mb-0">{category.about}</p>
        </div>

        {/* Tool count and subheading */}
        <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-lg">{categoryTools.length} tools found</span>
          <span className="text-gray-600 text-sm">Browse all {category.name.toLowerCase()} tools</span>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* No Results Message */}
        {categoryTools.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">Try browsing all tools</p>
            <Link href="/tools">
              <Button variant="outline">View All Tools</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}