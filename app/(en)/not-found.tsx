import type { Metadata } from "next"
import { translate } from "@/lib/i18n/messages"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import NotFoundPage from "../not-found-client"

export const dynamic = "force-static"

export function generateMetadata(): Metadata {
  return {
    title: translate(PAGE_LOCALE_EN, "meta.notFoundTitle"),
    description: translate(PAGE_LOCALE_EN, "meta.notFoundDescription"),
    robots: { index: false, follow: true },
  }
}

export default function NotFound() {
  return <NotFoundPage />
}
