import { Suspense } from "react"
import RecommendationClient from "./recommendation-client"

export default function RecommendationPage() {
  return (
    <Suspense>
      <RecommendationClient />
    </Suspense>
  )
}
