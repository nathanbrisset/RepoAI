import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import taxonomy from "./content/taxonomy.json"
import { LOCALE_COOKIE } from "./lib/i18n/config"
import {
  LOCALE_AUTO_COOKIE,
  isLikelyCrawler,
  localeFromPathname,
  preferredLocaleFromAcceptLanguage,
  stripLocalePrefix,
} from "./lib/i18n/locale-detect"
import { isKnownPagePath } from "./lib/routing/known-paths"

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

const NOT_FOUND_CACHE = "private, no-cache, no-store, max-age=0, must-revalidate"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  if (!isKnownPagePath(pathname)) {
    const french = localeFromPathname(pathname) === "fr"
    const target = french ? "/fr/404-page" : "/404-page"
    if (request.method === "GET" || request.method === "HEAD") {
      const url = request.nextUrl.clone()
      url.pathname = target
      return NextResponse.rewrite(url, {
        status: 404,
        headers: { "Cache-Control": NOT_FOUND_CACHE },
      })
    }

    const pageUrl = new URL(target, request.url)
    const page = await fetch(pageUrl, { headers: { Accept: "text/html" } })
    const html = await page.text()
    return new NextResponse(html, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": NOT_FOUND_CACHE,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|sitemap.xml|robots.txt|opengraph-image|twitter-image|logos(?:/|$)|brand(?:/|$)|screenshots(?:/|$)|tool-screenshots(?:/|$)|.*\\.[\\w]+$).*)",
  ],
}
