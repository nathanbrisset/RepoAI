import type { ReactNode } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Submit a Tool",
  description: "Suggest an AI tool for the AI Tools Ninja directory. Submissions are reviewed by email before anything is published.",
  path: "/submit",
})

export default function SubmitLayout({ children }: { children: ReactNode }) {
  return children
}
