import snapshot from "@/lib/routing/known-paths-snapshot.json"
import { localeFromPathname, stripLocalePrefix } from "@/lib/i18n/locale-detect"

const TOOL_IDS = new Set(snapshot.toolIds)
const CATEGORY_IDS = new Set(snapshot.categoryIds)
const GUIDE_SLUGS = new Set(snapshot.guideSlugs)
const COLLECTION_SLUGS_EN = new Set(snapshot.collectionSlugsEn)
const COLLECTION_SLUGS_FR = new Set(snapshot.collectionSlugsFr)

const EXACT_EN = new Set([
  "/",
  "/about",
  "/about/about",
  "/automations",
  "/catalogue",
  "/categories",
  "/category/new",
  "/category/popular",
  "/category/top-rated",
  "/collections",
  "/compare",
  "/contact",
  "/guides",
  "/legal",
  "/match-results",
  "/privacy",
  "/recommendation",
  "/submit",
  "/submit/submit",
  "/terms",
  "/tools",
  "/tools/tools",
])

const EXACT_FR = new Set([
  "/fr",
  "/fr/about",
  "/fr/automations",
  "/fr/catalogue",
  "/fr/categories",
  "/fr/category/new",
  "/fr/category/popular",
  "/fr/category/top-rated",
  "/fr/collections",
  "/fr/compare",
  "/fr/contact",
  "/fr/guides",
  "/fr/legal",
  "/fr/privacy",
  "/fr/recommendation",
  "/fr/submit",
  "/fr/terms",
  "/fr/tools",
])

export function isKnownPagePath(pathname: string): boolean {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname
  const locale = localeFromPathname(normalized)
  const bare = stripLocalePrefix(normalized)

  if (locale === "fr") {
    if (EXACT_FR.has(normalized)) return true
  } else if (EXACT_EN.has(bare) || EXACT_EN.has(normalized)) return true

  const toolMatch = bare.match(/^\/tool\/([^/]+)$/)
  if (toolMatch) {
    return TOOL_IDS.has(decodeURIComponentSafe(toolMatch[1]))
  }

  const categoryMatch = bare.match(/^\/categories\/([^/]+)$/)
  if (categoryMatch) {
    return CATEGORY_IDS.has(decodeURIComponentSafe(categoryMatch[1]))
  }

  const collectionMatch = bare.match(/^\/collections\/([^/]+)$/)
  if (collectionMatch) {
    const slug = decodeURIComponentSafe(collectionMatch[1])
    return locale === "fr" ? COLLECTION_SLUGS_FR.has(slug) : COLLECTION_SLUGS_EN.has(slug)
  }

  const guideMatch = bare.match(/^\/guides\/([^/]+)$/)
  if (guideMatch) {
    const slug = decodeURIComponentSafe(guideMatch[1])
    return GUIDE_SLUGS.has(slug)
  }

  const legacyCategoryMatch = bare.match(/^\/category\/([^/]+)$/)
  if (legacyCategoryMatch) {
    const slug = decodeURIComponentSafe(legacyCategoryMatch[1])
    return CATEGORY_IDS.has(slug) || slug === "new" || slug === "popular" || slug === "top-rated"
  }

  return false
}

function decodeURIComponentSafe(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
