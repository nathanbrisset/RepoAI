/**
 * Build-time guard: sitemap tool URLs must not match next.config redirect sources,
 * and non-listed catalogue statuses must not appear in listings or the sitemap.
 *
 *   npx tsx scripts/check-sitemap-redirects.ts
 */
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { allTools, listedTools } from "../lib/catalog"
import { categoryCatalog } from "../lib/category-meta"
import { COLLECTION_DEFS } from "../lib/directory/collections"
import { editorialGuideSlugs } from "../lib/directory/editorial-guides"

const require = createRequire(import.meta.url)
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..")

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

const NON_LISTED_STATUSES = new Set(["sunset", "duplicate-of", "renamed", "inactive"])

const TOOL_SOURCE = /^\/(?:fr\/)?tool\/([^/:]+)$/

function normalizePath(path: string): string {
  if (path === "/") return path
  return path.replace(/\/$/, "")
}

async function redirectSources(): Promise<string[]> {
  const nextConfig = require(join(repoRoot, "next.config.js"))
  const redirects: { source: string; destination?: string; has?: unknown[] }[] =
    await nextConfig.redirects()
  return redirects
    .filter((rule) => !rule.has?.length)
    .map((rule) => normalizePath(rule.source))
}

/** Same path set as app/sitemap.ts (before en/fr expansion). */
function sitemapPathnames(): string[] {
  const paths = [
    ...STATIC_PATHS,
    ...categoryCatalog.map((category) => `/categories/${category.id}`),
    ...COLLECTION_DEFS.map((collection) => `/collections/${collection.slug}`),
    ...editorialGuideSlugs().map((slug) => `/guides/${slug}`),
    ...listedTools
      .filter((tool) => !NON_LISTED_STATUSES.has(tool.status ?? "active"))
      .map((tool) => `/tool/${tool.id}`),
  ]
  return paths.flatMap((path) => [path, `/fr${path === "/" ? "" : path}`].map(normalizePath))
}

function toolPathsInSitemap(pathnames: string[]): Set<string> {
  const ids = new Set<string>()
  for (const path of pathnames) {
    const match = path.match(TOOL_SOURCE)
    if (match) ids.add(match[1])
  }
  return ids
}

async function main() {
  const sources = new Set(await redirectSources())
  const pathnames = sitemapPathnames()
  const sitemapToolIds = toolPathsInSitemap(pathnames)

  const listedIds = new Set(listedTools.map((tool) => tool.id))
  const nonListedInListed = listedTools.filter((tool) =>
    NON_LISTED_STATUSES.has(tool.status ?? "active"),
  )
  assert.equal(
    nonListedInListed.length,
    0,
    `listedTools must not include non-listed statuses: ${nonListedInListed.map((t) => t.id).join(", ")}`,
  )

  for (const tool of allTools) {
    if (!NON_LISTED_STATUSES.has(tool.status ?? "active")) continue
    assert.equal(
      listedIds.has(tool.id),
      false,
      `${tool.id} (${tool.status}) must not be in listedTools / cards / counter`,
    )
  }

  const overlap = pathnames.filter((path) => sources.has(path))
  assert.equal(
    overlap.length,
    0,
    `sitemap paths must not match redirect sources: ${overlap.join(", ")}`,
  )

  const redirectedToolIds = [...sources]
    .map((src) => src.match(TOOL_SOURCE)?.[1])
    .filter((id): id is string => Boolean(id))

  const redirectListedOverlap = redirectedToolIds.filter((id) => listedIds.has(id))
  assert.equal(
    redirectListedOverlap.length,
    0,
    `redirect sources must not be listed tools: ${redirectListedOverlap.join(", ")}`,
  )

  const duplicateSpotCheck = ["windsurf", "producer-ai", "google-whisk"] as const
  for (const id of duplicateSpotCheck) {
    const tool = allTools.find((entry) => entry.id === id)
    assert.equal(tool?.status, "duplicate-of", `${id} must be duplicate-of`)
    assert.equal(listedIds.has(id), false, `${id} must not be listed`)
    assert.equal(sitemapToolIds.has(id), false, `${id} must not be in sitemap`)
  }

  const toolSitemapEntries = pathnames.filter((p) => TOOL_SOURCE.test(p)).length
  const staticAndOther = pathnames.length - toolSitemapEntries

  console.log("check-sitemap-redirects OK")
  console.log(
    JSON.stringify(
      {
        listedTools: listedTools.length,
        sitemapEntriesTotal: pathnames.length,
        sitemapToolPathEntries: toolSitemapEntries,
        sitemapNonToolEntries: staticAndOther,
        redirectToolSources: redirectedToolIds.length,
        duplicateSpotCheck: duplicateSpotCheck.map((id) => ({
          id,
          inSitemap: sitemapToolIds.has(id),
          inListed: listedIds.has(id),
        })),
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})