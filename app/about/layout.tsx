import type { ReactNode } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "AItools.ninja organizes publicly available information about AI tools so you can compare categories, pricing labels, and official websites.",
  path: "/about",
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
