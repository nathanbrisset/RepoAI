import { Suspense } from "react"
import type { Metadata } from "next"
import { ResultsMatch } from "@/components/match-panel"

export const metadata: Metadata = {
  title: "Find your AI MATCH",
  description: "Describe a task and get active AI tools that fit.",
}

export default function RecommendationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <ResultsMatch />
        </Suspense>
      </div>
    </div>
  )
}
