import type { MetadataRoute } from "next"
import { categories, allTools } from "@/lib/data"
import { absoluteUrl, languageAlternates } from "@/lib/i18n/paths"

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/submit",
  "/recommendation",
  "/categories",
  "/tools",
  "/category/new",
  "/category/popular",
  "/category/top-rated",
]

function catalogDate(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; lastModified?: Date }[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...categories.map((category) => ({ path: `/categories/${category.id}` })),
    ...allTools.map((tool) => ({
      path: `/tool/${tool.id}`,
      lastModified: catalogDate(tool.lastVerified) || catalogDate(tool.dateAdded),
    })),
  ]

  return pages.flatMap(({ path, lastModified }) => {
    const languages = languageAlternates(path)
    return (["en", "fr"] as const).map((locale) => ({
      url: absoluteUrl(locale, path),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages },
    }))
  })
}
