import fs from "node:fs"
import path from "node:path"
import { allTools } from "../lib/catalog"
import { resolvedCollections } from "../lib/directory/data"
import { editorialGuideSlugs } from "../lib/directory/editorial-guides"
import taxonomy from "../content/taxonomy.json"
import snapshot from "../lib/routing/known-paths-snapshot.json"

const LISTED_TOOL_STATUSES = new Set(["renamed", "sunset", "inactive", "duplicate-of"])

function fail(message: string): never {
  console.error(`known-paths consistency check failed: ${message}`)
  process.exit(1)
}

const expectedToolIds = allTools.map((tool) => tool.id).sort()
const snapToolIds = [...snapshot.toolIds].sort()
if (expectedToolIds.length !== snapToolIds.length) {
  fail(`toolIds count ${snapToolIds.length} !== allTools ${expectedToolIds.length}`)
}
for (let i = 0; i < expectedToolIds.length; i++) {
  if (expectedToolIds[i] !== snapToolIds[i]) {
    fail(`toolIds mismatch at ${i}: snapshot=${snapToolIds[i]} allTools=${expectedToolIds[i]}`)
  }
}

const sitemapToolIds = allTools
  .filter((tool) => !LISTED_TOOL_STATUSES.has(tool.status ?? ""))
  .map((tool) => tool.id)
  .sort()

const inSitemapNotSnap = sitemapToolIds.filter((id) => !new Set(snapToolIds).has(id))
if (inSitemapNotSnap.length) {
  fail(`sitemap tools missing from snapshot: ${inSitemapNotSnap.slice(0, 5).join(", ")}${inSitemapNotSnap.length > 5 ? "…" : ""}`)
}

const expectedCategories = taxonomy.categories.map((c) => c.id).sort()
const snapCategories = [...snapshot.categoryIds].sort()
if (JSON.stringify(expectedCategories) !== JSON.stringify(snapCategories)) {
  fail("categoryIds differ from taxonomy.json")
}

const expectedGuides = editorialGuideSlugs().sort()
const snapGuides = [...snapshot.guideSlugs].sort()
if (JSON.stringify(expectedGuides) !== JSON.stringify(snapGuides)) {
  fail("guideSlugs differ from editorialGuideSlugs()")
}

const expectedCollectionsEn = resolvedCollections("en")
  .map((c) => c.slug)
  .sort()
const snapCollectionsEn = [...snapshot.collectionSlugsEn].sort()
if (JSON.stringify(expectedCollectionsEn) !== JSON.stringify(snapCollectionsEn)) {
  fail("collectionSlugsEn differ from resolvedCollections(en)")
}

const expectedCollectionsFr = resolvedCollections("fr")
  .map((c) => c.slug)
  .sort()
const snapCollectionsFr = [...snapshot.collectionSlugsFr].sort()
if (JSON.stringify(expectedCollectionsFr) !== JSON.stringify(snapCollectionsFr)) {
  fail("collectionSlugsFr differ from resolvedCollections(fr)")
}

const enPagesPath = path.join(import.meta.dirname, "..", "app", "(en)")
function listEnStaticPaths(): string[] {
  const out: string[] = []
  function walk(dir: string, base: string) {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name)
      if (fs.statSync(abs).isDirectory()) walk(abs, base)
      else if (name === "page.tsx") {
        const rel = path.relative(base, abs).split(path.sep).join("/")
        if (!rel.includes("[")) {
          const dirPart = path.dirname(rel)
          out.push(dirPart === "." ? "/" : `/${dirPart}`)
        }
      }
    }
  }
  walk(enPagesPath, enPagesPath)
  return out.sort()
}

const fromFs = listEnStaticPaths()
const fromSnap = [...snapshot.exactEn].sort()
if (JSON.stringify(fromFs) !== JSON.stringify(fromSnap)) {
  const onlyFs = fromFs.filter((p) => !fromSnap.includes(p))
  const onlySnap = fromSnap.filter((p) => !fromFs.includes(p))
  fail(`exactEn drift: only on disk=${onlyFs.join(", ") || "—"}; only in snapshot=${onlySnap.join(", ") || "—"}`)
}

console.log("known-paths consistency check OK")
