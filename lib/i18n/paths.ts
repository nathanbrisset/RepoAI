import { SITE_URL, type Locale } from "./config"

import { localeFromPathname, stripLocalePrefix } from "./locale-detect"

/** Path without a /fr or /en prefix. Query and hash are not included. */
export function stripLocale(pathname: string): string {
  return stripLocalePrefix(pathname)
}

export function localeFromPath(pathname: string): Locale {
  return localeFromPathname(pathname)
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
