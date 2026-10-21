import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * French pages live at /fr/... and are rewritten onto the existing English routes.
 * The locale comes from the URL only. The `locale` cookie is written by the
 * language switcher and is never used to redirect, so crawlers are not bounced.
 */
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
