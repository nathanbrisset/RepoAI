import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockTools } from "@/lib/data"
import { 
  MessageSquare, 
  Image, 
  Mic, 
  Palette, 
  Clock, 
  Code,
  FileText,
  Video,
  BarChart,
  Database
} from "lucide-react"

// Map categories to their icons and descriptions
const categoryInfo: Record<string, { icon: any, description: string }> = {
  "Text Generation": {
    icon: MessageSquare,
    description: "AI tools for writing, content creation, and text processing"
  },
  "Image Generation": {
    icon: Image,
    description: "Create and edit images, graphics, and visual content"
  },
  "Coding": {
    icon: Code,
    description: "AI assistants for programming and development"
  },
  "Audio & Speech": {
    icon: Mic,
    description: "Generate and process audio, voice, and speech"
  },
  "Design": {
    icon: Palette,
    description: "AI tools for UI/UX, graphic design, and visual creation"
  },
  "Productivity": {
    icon: Clock,
    description: "Tools to enhance workflow and task management"
  },
  "Research": {
    icon: Database,
    description: "AI tools for data analysis, research, and scientific discovery"
  },
  "Video": {
    icon: Video,
    description: "Create, edit, and enhance videos with AI"
  },
  "Analytics": {
    icon: BarChart,
    description: "Data analysis, insights, and business intelligence"
  },
  "Data Processing": {
    icon: Database,
    description: "Process, clean, and transform data with AI"
  }
}

export default function CategoriesPage() {
  // Get unique categories from all tools
  const categories = Array.from(
    new Set(mockTools.flatMap(tool => tool.categories))
  ).sort()

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-left">Browse Categories</h1>
          <p className="text-xl text-gray-600 mb-0 text-left">Explore AI tools by category to find the perfect solution for your needs</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 flex-shrink-0 w-full md:w-auto flex justify-start md:justify-end">
          <Link href="/tools" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium shadow hover:bg-purple-700 transition w-full md:w-auto text-center">
            See all Tools
          </Link>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const categoryTools = mockTools.filter(tool =>
            tool.categories.includes(category)
          )
          const { icon: Icon, description } = categoryInfo[category] || { icon: FileText, description: "AI tools for various purposes" }
          
          return (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>{category}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {categoryTools.length} tools available
                    </span>
                    <span className="text-purple-600 text-sm font-medium">
                      View tools →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
