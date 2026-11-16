/**
 * Build-time guard: sitemap URLs must not match redirect sources (Next + Vercel).
 *
 *   npx tsx lib/routing/check-sitemap-redirects.ts
 */
import assert from "node:assert/strict"
import sitemap from "../../app/sitemap"
import { allTools, listedTools } from "../catalog"
import { allRedirectSourcePathnames } from "./redirect-sources"
import { SITE_URL } from "../i18n/config"

const NON_LISTED_STATUSES = new Set(["sunset", "duplicate-of", "renamed", "inactive"])
const TOOL_SOURCE = /^\/(?:fr\/)?tool\/([^/]+)$/

function pathnameFromSitemapUrl(url: string): string {
  const parsed = new URL(url, SITE_URL)
  return parsed.pathname
}

function sitemapPathnames(): string[] {
  return sitemap().map((entry) => pathnameFromSitemapUrl(entry.url))
}

function normalizePath(path: string): string {
  if (path === "/") return path
  return path.replace(/\/$/, "")
}

function toolPathsInSitemap(pathnames: string[]): Set<string> {
  const ids = new Set<string>()
  for (const path of pathnames.map(normalizePath)) {
    const match = path.match(TOOL_SOURCE)
    if (match) ids.add(match[1])
  }
  return ids
}

async function main() {
  const sources = new Set((await allRedirectSourcePathnames()).map(normalizePath))
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

  const overlap = [...new Set(pathnames.map(normalizePath))].filter((path) => sources.has(path))
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

  const toolSitemapEntries = pathnames.filter((p) => TOOL_SOURCE.test(normalizePath(p))).length
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