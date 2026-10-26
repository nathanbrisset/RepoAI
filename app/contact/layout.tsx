import type { ReactNode } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about the catalogue, collections, Shorts, or tool submissions — contact aitoolrequest@gmail.com or use the form.",
  path: "/contact",
})

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
