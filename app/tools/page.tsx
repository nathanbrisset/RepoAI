import { Metadata } from "next"
import { mockTools } from "@/lib/data"
import { pageMetadata } from "@/lib/seo"
import ToolsClient from "./ToolsClient"

export const metadata: Metadata = pageMetadata({
  title: "All AI Tools",
  description: `Browse ${mockTools.length} AI tools. Search by name and filter by Free, Freemium, or Premium, then open a listing to visit the official site.`,
  path: "/tools",
})

export default function Page() {
  return <ToolsClient tools={mockTools} />
} 