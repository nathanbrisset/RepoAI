import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockTools } from "@/lib/data";
import { metaDescription, pageMetadata } from "@/lib/seo";
import ToolPageClient from "./tool-page-client";

// Unknown ids are not rendered as empty shells. Next responds with the not-found page.
export const dynamicParams = false

// Generate static paths for all tools
export async function generateStaticParams() {
  return mockTools.map((tool) => ({
    id: tool.id,
  }))
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = mockTools.find((entry) => entry.id === id);

  if (!tool) {
    notFound();
  }

  return pageMetadata({
    title: tool.name,
    description: metaDescription(
      tool.description,
      `${tool.name} is listed in the AI Tools Ninja directory. Read the summary and open the official website.`
    ),
    path: `/tool/${tool.id}`,
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { id } = await params;
  const tool = mockTools.find((tool) => tool.id === id);

  if (!tool) {
    notFound();
  }

  // Find related tools (same category, exclude self, limit 2)
  const relatedTools = mockTools.filter(
    (t) => t.id !== tool.id && t.categories.some((cat) => tool.categories.includes(cat))
  ).slice(0, 2);

  return <ToolPageClient tool={tool} relatedTools={relatedTools} />;
}
