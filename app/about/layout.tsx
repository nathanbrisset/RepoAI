import type { ReactNode } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "AItools.ninja is a hand-curated directory of AI tools for solopreneurs and indie hackers — less noise, better leads.",
  path: "/about",
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
