import { getLocale, getRequestPathname } from "@/lib/i18n/get-locale"
import { buildPageMetadata } from "@/lib/i18n/metadata"
import NotFoundPage from "./not-found-client"

export async function generateMetadata() {
  const [locale, pathname] = await Promise.all([getLocale(), getRequestPathname()])
  return buildPageMetadata(locale, pathname)
}

export default function NotFound() {
  return <NotFoundPage />
}
