import type { Locale } from "./config"

/** Strip /fr or /en prefix; returns path starting with /. */
export function stripLocalePrefix(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0] || "/"
  if (path === "/fr" || path === "/fr/") return "/"
  if (path.startsWith("/fr/")) {
    const rest = path.slice(3)
    return rest.startsWith("/") ? rest : `/${rest}`
  }
  if (path === "/en" || path === "/en/") return "/"
  if (path.startsWith("/en/")) {
    const rest = path.slice(3)
    return rest.startsWith("/") ? rest : `/${rest}`
  }
  return path.startsWith("/") ? path : `/${path}`
}

export function localeFromPathname(pathname: string): Locale {
  const path = pathname.split("?")[0].split("#")[0] || "/"
  return path === "/fr" || path.startsWith("/fr/") ? "fr" : "en"
}

const LOCALE_AUTO_COOKIE = "locale_auto"

export { LOCALE_AUTO_COOKIE }

/** Prefer French when Accept-Language lists fr ahead of en. */
export function preferredLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en"
  const parts = header
    .split(",")
    .map((part) => {
      const [lang, qPart] = part.trim().split(";")
      const q = qPart?.startsWith("q=") ? Number.parseFloat(qPart.slice(2)) : 1
      return { lang: lang.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of parts) {
    if (lang === "fr" || lang.startsWith("fr-")) return "fr"
    if (lang === "en" || lang.startsWith("en-")) return "en"
  }
  return "en"
}

export function isLikelyCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|bingpreview|linkedinbot|twitterbot|applebot|yandex|baiduspider|duckduckbot/i.test(
    userAgent,
  )
}
