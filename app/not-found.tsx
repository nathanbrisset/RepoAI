import type { Metadata } from "next"
import NotFoundView from "@/components/not-found-view"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "This page is not part of the AI Tools Ninja directory.",
  path: "/",
  noIndex: true,
  canonical: false,
})

export default function NotFound() {
  return <NotFoundView />
}
