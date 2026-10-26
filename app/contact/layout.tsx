import type { ReactNode } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Send a message to AItools.ninja about a listing, a correction, or a partnership. A public email address is not published yet.",
  path: "/contact",
})

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
