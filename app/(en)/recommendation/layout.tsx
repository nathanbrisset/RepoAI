import type { ReactNode } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "AI Recommendations",
  description: "Describe what you want to do and get a short list of AI tools from the AItools.ninja directory.",
  path: "/recommendation",
})

export default function RecommendationLayout({ children }: { children: ReactNode }) {
  return children
}
