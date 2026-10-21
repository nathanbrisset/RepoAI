import { SITE_URL, type Locale } from "./config"

/** Path without a /fr prefix. Query and hash are not included. */
export function stripLocale(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0] || "/"
  if (path === "/fr" || path === "/fr/") return "/"
  if (path.startsWith("/fr/")) {
    const rest = path.slice(3)
    return rest.startsWith("/") ? rest : `/${rest}`
  }
  return path.startsWith("/") ? path : `/${path}`
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en"
}

/** Prefix an internal path for the active locale. External URLs are unchanged. */
export function localizeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href

  const hashIndex = href.indexOf("#")
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : ""
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href
  const queryIndex = beforeHash.indexOf("?")
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : ""
  const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash
  const bare = stripLocale(path || "/")
  const localized = locale === "fr" ? (bare === "/" ? "/fr" : `/fr${bare}`) : bare
  return `${localized}${query}${hash}`
}

export function absoluteUrl(locale: Locale, pathname: string): string {
  const localized = localizeHref(locale, stripLocale(pathname))
  if (localized === "/") return `${SITE_URL}/`
  return `${SITE_URL}${localized}`
}

export function languageAlternates(pathname: string) {
  const en = absoluteUrl("en", pathname)
  const fr = absoluteUrl("fr", pathname)
  return {
    en,
    fr,
    "x-default": en,
  }
}
