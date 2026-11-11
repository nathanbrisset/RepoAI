import type { MetadataRoute } from "next"
import { resolvedCollections } from "@/lib/directory/data"
import { editorialGuideSlugs } from "@/lib/directory/editorial-guides"
import { categories, allTools } from "@/lib/data"
import { PAGE_LOCALE_EN, PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { absoluteUrl, languageAlternates } from "@/lib/i18n/paths"

export const dynamic = "force-static"

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/legal",
  "/terms",
  "/submit",
  "/recommendation",
  "/categories",
  "/catalogue",
  "/collections",
  "/automations",
  "/compare",
  "/guides",
]

function catalogDate(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default function sitemap(): MetadataRoute.Sitemap {
  const collectionSlugs = new Set([
    ...resolvedCollections(PAGE_LOCALE_EN).map((collection) => collection.slug),
    ...resolvedCollections(PAGE_LOCALE_FR).map((collection) => collection.slug),
  ])
  const collectionPaths = [...collectionSlugs].map((slug) => ({ path: `/collections/${slug}` }))
  const pages: { path: string; lastModified?: Date }[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...categories.map((category) => ({ path: `/categories/${category.id}` })),
    ...collectionPaths,
    ...editorialGuideSlugs().map((slug) => ({ path: `/guides/${slug}` })),
    ...allTools
      .filter((tool) => tool.status !== "renamed" && tool.status !== "sunset" && tool.status !== "inactive" && tool.status !== "duplicate-of")
      .map((tool) => ({
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
