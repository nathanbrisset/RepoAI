import { mockTools } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink, ThumbsUp } from "lucide-react"
import ToolCard from "@/components/tool-card"
import ToolPageClient from "./tool-page-client"
import { notFound } from "next/navigation"

// Generate static paths for all tools
export async function generateStaticParams() {
  return mockTools.map((tool) => ({
    id: tool.id,
  }))
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

export default function ToolPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const tool = mockTools.find((t) => t.id === id);

  if (!tool) {
    notFound();
  }

  // Related tools: same first category, exclude self
  const relatedTools = mockTools.filter(
    t => t.id !== tool.id && t.categories[0] === tool.categories[0]
  ).slice(0, 2);

  return <ToolPageClient tool={tool} relatedTools={relatedTools} />;
}
