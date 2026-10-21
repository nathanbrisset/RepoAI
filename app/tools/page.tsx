import { Metadata } from "next"
import { mockTools } from "@/lib/data"
import ToolsClient from "./ToolsClient"

export const metadata: Metadata = {
  title: "AI Tools Directory - Find the Best AI Tools for Your Needs",
  description: "Browse our comprehensive directory of AI tools. Filter by category, search by name or description, and find the perfect AI solution for your needs.",
  alternates: {
    canonical: "https://aitools.ninja/tools",
  },
}

type PageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const requested = Array.isArray(params.category) ? params.category[0] : params.category
  return <ToolsClient tools={mockTools} initialCategory={requested ?? null} />
} 