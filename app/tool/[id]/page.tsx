import { mockTools } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink, ThumbsUp } from "lucide-react"
import ToolCard from "@/components/tool-card"
import ToolPageClient from "./tool-page-client"

// Generate static paths for all tools
export async function generateStaticParams() {
  return mockTools.map((tool) => ({
    id: tool.id,
  }))
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

export default function ToolPage({ params }: { params: { id: string } }) {
  const tool = mockTools.find((t) => t.id === params.id);

  if (!tool) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the tool you're looking for.</p>
        <Link href="/tools" className="text-purple-600 hover:text-purple-800 font-medium">← Back to All Tools</Link>
      </div>
    );
  }

  // Related tools: same first category, exclude self
  const relatedTools = mockTools.filter(
    t => t.id !== tool.id && t.categories[0] === tool.categories[0]
  ).slice(0, 2);

  return <ToolPageClient tool={tool} relatedTools={relatedTools} />;
}
