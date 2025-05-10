import ToolCard from "@/components/tool-card"
import { mockTools } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Image as ImageIcon, Mic, Palette, Clock, Code, FileText, Video, BarChart, Database } from "lucide-react"

// Category info with icons and descriptions
const categoryInfo: Record<string, { icon: any, description: string, color: string }> = {
  "text": {
    icon: MessageSquare,
    description: "AI tools for writing, content creation, and text processing",
    color: "bg-purple-50 text-purple-600"
  },
  "image": {
    icon: ImageIcon,
    description: "Create and edit images, graphics, and visual content",
    color: "bg-pink-50 text-pink-600"
  },
  "Text Generation": {
    icon: MessageSquare,
    description: "AI tools for writing, content creation, and text processing",
    color: "bg-purple-50 text-purple-600"
  },
  "Image Generation": {
    icon: ImageIcon,
    description: "Create and edit images, graphics, and visual content",
    color: "bg-pink-50 text-pink-600"
  },
  "Coding": {
    icon: Code,
    description: "AI assistants for programming and development",
    color: "bg-blue-50 text-blue-600"
  },
  "Audio & Speech": {
    icon: Mic,
    description: "Generate and process audio, voice, and speech",
    color: "bg-yellow-50 text-yellow-600"
  },
  "Design": {
    icon: Palette,
    description: "AI tools for UI/UX, graphic design, and visual creation",
    color: "bg-green-50 text-green-600"
  },
  "Productivity": {
    icon: Clock,
    description: "Tools to enhance workflow and task management",
    color: "bg-orange-50 text-orange-600"
  },
  "Research": {
    icon: Database,
    description: "AI tools for data analysis, research, and scientific discovery",
    color: "bg-indigo-50 text-indigo-600"
  },
  "Video": {
    icon: Video,
    description: "Create, edit, and enhance videos with AI",
    color: "bg-red-50 text-red-600"
  },
  "Analytics": {
    icon: BarChart,
    description: "Data analysis, insights, and business intelligence",
    color: "bg-violet-50 text-violet-600"
  },
  "Data Processing": {
    icon: Database,
    description: "Process, clean, and transform data with AI",
    color: "bg-teal-50 text-teal-600"
  }
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = await decodeURIComponent(params.category)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Filter tools by category
  const categoryTools = mockTools.filter(tool =>
    tool.categories.some(category =>
      category.toLowerCase() === categoryName.toLowerCase()
    )
  )

  if (categoryTools.length === 0) {
    notFound()
  }

  // Get icon, description, and color for the category
  const info = categoryInfo[categoryName] || { icon: FileText, description: "AI tools for various purposes.", color: "bg-gray-100 text-gray-500" }
  const Icon = info.icon

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Sticky header for title, description, and filter */}
      <div className="sticky top-16 z-20 bg-white pt-4 pb-4 mb-8 shadow-sm border-b">
        {/* Back link */}
        <div className="mb-2">
          <Link href="/categories" className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" />
            All Categories
          </Link>
        </div>
        {/* Title and icon */}
        <div className="flex items-center mb-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${info.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 uppercase">{categoryName}</h1>
        </div>
        {/* Description */}
        <p className="text-lg text-gray-600 mb-4">{info.description}</p>
        {/* Filter bar */}
        <div className="bg-gray-50 border rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span className="font-semibold">{categoryTools.length} tools found</span>
            <span className="ml-2 text-gray-500">Browse all {categoryName.toLowerCase()} tools</span>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <select className="border rounded-md px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Top Rated</option>
              <option>Most Visited</option>
            </select>
            <select className="border rounded-md px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
              <option>All Prices</option>
              <option>Free</option>
              <option>Paid</option>
              <option>Freemium</option>
            </select>
          </div>
        </div>
      </div>
      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
} 