import { Metadata } from "next"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import { Search } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Tools Directory - Find the Best AI Tools for Your Needs",
  description: "Browse our comprehensive directory of AI tools. Filter by category, search by name or description, and find the perfect AI solution for your needs.",
}

export default function Page() {
  const query = ""
  const filteredTools = mockTools.filter(tool => 
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(query))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-black">AI Tools Directory</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our comprehensive collection of AI tools. Find the perfect solution for your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form className="relative">
            <Input
              type="search"
              placeholder="Search tools by name, description, or tags..."
              className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              defaultValue={query}
              name="query"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all tools</p>
            <Link href="/tools">
              <Button variant="outline">View All Tools</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 