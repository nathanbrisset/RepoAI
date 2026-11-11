import { buildPageMetadata } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import NotFoundPage from "./not-found-client"

export const dynamic = "force-static"

export function generateMetadata() {
  return buildPageMetadata(PAGE_LOCALE_EN, "/__missing")
}

export default function NotFound() {
  return <NotFoundPage />
}
