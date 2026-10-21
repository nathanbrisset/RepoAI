import type { MetadataRoute } from "next"
import { categories, mockTools } from "@/lib/data"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/categories", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/submit", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/recommendation", priority: 0.5, changeFrequency: "monthly" as const },
  ].map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/categories/${category.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const seen = new Set<string>()
  const toolPages: MetadataRoute.Sitemap = []
  for (const tool of mockTools) {
    if (!tool.id || seen.has(tool.id)) continue
    seen.add(tool.id)
    const added = new Date(tool.dateAdded)
    toolPages.push({
      url: absoluteUrl(`/tool/${tool.id}`),
      lastModified: Number.isNaN(added.getTime()) ? now : added,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  return [...staticPages, ...categoryPages, ...toolPages]
}
