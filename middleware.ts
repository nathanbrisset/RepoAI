import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import toolIds from "./content/tool-ids.json"
import taxonomy from "./content/taxonomy.json"

/**
 * French pages live at /fr/... and are rewritten onto the existing English routes.
 * The locale comes from the URL only. The `locale` cookie is written by the
 * language switcher and is never used to redirect, so crawlers are not bounced.
 *
 * Unknown /tool/:id and /categories/:id paths are rewritten to a route that
 * does not exist, so Next answers with a real 404. A dynamic page that calls
 * notFound() stays on HTTP 200 when the root layout reads request headers,
 * and app/loading.tsx can send that response before the 404 is decided.
 */
const knownTools = new Set(toolIds)
const knownCategories = new Set(taxonomy.categories.map((category) => category.id))

function slugFromPath(pathname: string, kind: "tool" | "categories"): string | null {
  const match = pathname.match(new RegExp(`^/(?:fr/)?${kind}/([^/]+)/?$`))
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/")
  requestHeaders.set("x-locale", isFrench ? "fr" : "en")

  const toolId = slugFromPath(pathname, "tool")
  const categoryId = slugFromPath(pathname, "categories")
  if ((toolId && !knownTools.has(toolId)) || (categoryId && !knownCategories.has(categoryId))) {
    const url = request.nextUrl.clone()
    url.pathname = "/__missing"
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  if (!isFrench) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname.replace(/^\/fr/, "") || "/"
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
