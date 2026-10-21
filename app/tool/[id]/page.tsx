import { notFound } from "next/navigation";
import { allTools, mockTools } from "@/lib/data";
import ToolPageClient from "./tool-page-client";

// Generate static paths for all tools
export async function generateStaticParams() {
  return allTools.map((tool) => ({
    id: tool.id,
  }))
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function ToolPage({ params }: PageProps) {
  const { id } = await params;
  const tool = allTools.find((tool) => tool.id === id);

  if (!tool) {
    notFound();
  }

  // Find related tools (same category, exclude self, limit 2)
  const relatedTools = mockTools.filter(
    (t) => t.id !== tool.id && t.categories.some((cat) => tool.categories.includes(cat))
  ).slice(0, 2);

  return <ToolPageClient tool={tool} relatedTools={relatedTools} />;
}
