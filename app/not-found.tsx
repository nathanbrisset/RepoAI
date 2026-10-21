import type { Metadata } from "next"
import NotFoundView from "@/components/not-found-view"
import { pageMetadata } from "@/lib/seo"

const notFoundMetadata = pageMetadata({
  title: "Page not found",
  description: "This page is not part of the AI Tools Ninja directory.",
  path: "/",
  canonical: false,
})

export const metadata: Metadata = {
  ...notFoundMetadata,
  // A 404 already gets one robots noindex from Next. Setting it again duplicates the tag.
  robots: null,
}

export default function NotFound() {
  return <NotFoundView />
}
