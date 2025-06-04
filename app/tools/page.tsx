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

export default function Page() {
  return <ToolsClient tools={mockTools} />
} 