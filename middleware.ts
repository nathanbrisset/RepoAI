import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import toolIds from "./content/tool-ids.json"
import taxonomy from "./content/taxonomy.json"
import { LOCALE_COOKIE } from "./lib/i18n/config"
import {
  LOCALE_AUTO_COOKIE,
  isLikelyCrawler,
  localeFromPathname,
  preferredLocaleFromAcceptLanguage,
  stripLocalePrefix,
} from "./lib/i18n/locale-detect"

/**
 * French pages live at /fr/... and are rewritten onto the existing English routes.
 * English is canonical at the site root. /en/... returns 301 to the root path.
 * First visit (no locale cookie): Accept-Language may redirect to /fr/...
 */
const knownTools = new Set(toolIds)
const knownCategories = new Set(taxonomy.categories.map((category) => category.id))
const LEGACY_CATEGORY_LIST_SLUGS = new Set(["new", "popular", "top-rated"])

function slugFromPath(pathname: string, kind: "tool" | "categories" | "category"): string | null {
  const match = pathname.match(new RegExp(`^/(?:fr/|en/)?${kind}/([^/]+)/?$`))
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

function localizedCategoryPath(locale: "en" | "fr", categoryId: string): string {
  return locale === "fr" ? `/fr/categories/${categoryId}` : `/categories/${categoryId}`
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

  // M-12: normalize /en/* → /*
  if (pathname === "/en" || pathname === "/en/") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url, 301)
  }
  if (pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone()
    url.pathname = stripLocalePrefix(pathname)
    return NextResponse.redirect(url, 301)
  }

  const bare = stripLocalePrefix(pathname)
  const locale = localeFromPathname(pathname)
  const isFrench = locale === "fr"

  // M-04: catalogue?category=slug → /categories/slug
  if (bare === "/catalogue" || bare === "/tools") {
    const category = request.nextUrl.searchParams.get("category")
    if (category && knownCategories.has(category)) {
      const url = request.nextUrl.clone()
      url.pathname = localizedCategoryPath(locale, category)
      const pricing = request.nextUrl.searchParams.get("pricing")
      url.search = pricing ? `?pricing=${encodeURIComponent(pricing)}` : ""
      return NextResponse.redirect(url, 301)
    }
  }

  // M-04: /category/:slug (taxonomy slug) → /categories/:slug
  const legacyCategory = slugFromPath(pathname, "category")
  if (legacyCategory && knownCategories.has(legacyCategory) && !LEGACY_CATEGORY_LIST_SLUGS.has(legacyCategory)) {
    const url = request.nextUrl.clone()
    url.pathname = localizedCategoryPath(locale, legacyCategory)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, 301)
  }

  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value
  const autoDone = request.cookies.get(LOCALE_AUTO_COOKIE)?.value

  if (
    request.method === "GET" &&
    !localeCookie &&
    !autoDone &&
    !isLikelyCrawler(request.headers.get("user-agent")) &&
    !isFrench &&
    preferredLocaleFromAcceptLanguage(request.headers.get("accept-language")) === "fr"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = bare === "/" ? "/fr" : `/fr${bare}`
    const response = NextResponse.redirect(url, 302)
    response.cookies.set(LOCALE_AUTO_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
    return response
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)
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
  url.pathname = bare
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
