import { Suspense } from "react"
import RecommendationClient from "./RecommendationClient"

export default function RecommendationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-3xl px-4 py-16 text-gray-600">Loading recommendations…</div>}>
      <RecommendationClient />
    </Suspense>
  )
}
