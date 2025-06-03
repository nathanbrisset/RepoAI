import { categories, mockTools } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink } from "lucide-react"
import ToolCard from "@/components/tool-card"
import BackButton from "./BackButton"

// Generate static paths for all categories
export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the category you're looking for.</p>
        <Link href="/categories" className="text-purple-600 hover:text-purple-800 font-medium">← Back to All Categories</Link>
      </div>
    );
  }

  // Get tools in this category
  const tools = mockTools.filter(tool => tool.categories.includes(category.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-gray-500">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">{tools.length} tools</Badge>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8">
        <p className="text-purple-900">
          <span className="font-semibold">About {category.name}:</span> {category.about}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tools found in this category.
          </div>
        ) : (
          tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))
        )}
      </div>
    </div>
  );
}