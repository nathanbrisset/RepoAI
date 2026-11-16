import fs from "node:fs"
import path from "node:path"
import taxonomy from "../content/taxonomy.json"
import { allTools } from "../lib/catalog"
import { resolvedCollections } from "../lib/directory/data"
import { editorialGuideSlugs } from "../lib/directory/editorial-guides"

const ROOT = path.join(import.meta.dirname, "..")
const EN_ROOT = path.join(ROOT, "app", "(en)")
const API_ROOT = path.join(ROOT, "app", "api")
const PAGES_API_ROOT = path.join(ROOT, "pages", "api")

const toolIds = allTools.map((tool) => tool.id).sort()

function posix(rel: string) {
  return rel.split(path.sep).join("/")
}

function listEnPages(dir = EN_ROOT, base = EN_ROOT): string[] {
  const out: string[] = []
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const stat = fs.statSync(abs)
    if (stat.isDirectory()) out.push(...listEnPages(abs, base))
    else if (name === "page.tsx") out.push(posix(path.relative(base, abs)))
  }
  return out
}

function enUrlPath(enPageRel: string): string {
  const dir = posix(path.dirname(enPageRel))
  return dir === "." ? "/" : `/${dir}`
}

function deriveExactEnPaths(): string[] {
  return listEnPages()
    .filter((rel) => !rel.includes("["))
    .map(enUrlPath)
    .sort()
}

function deriveExactFrPaths(exactEn: string[]): string[] {
  return exactEn
    .filter((p) => p !== "/match-results")
    .map((p) => (p === "/" ? "/fr" : `/fr${p}`))
    .sort()
}

function listPagesApiPaths(dir = PAGES_API_ROOT, base = PAGES_API_ROOT): string[] {
  const out: string[] = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const stat = fs.statSync(abs)
    if (stat.isDirectory()) {
      out.push(...listPagesApiPaths(abs, base))
    } else if (/\.(ts|js)$/.test(name) && name !== "index.ts") {
      const rel = posix(path.relative(base, abs))
      const route = rel.replace(/\.(ts|js)$/, "")
      out.push(`/api/${route}`)
    }
  }
  return out
}

function listApiPaths(dir = API_ROOT, base = API_ROOT): string[] {
  const out: string[] = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const stat = fs.statSync(abs)
    if (stat.isDirectory()) {
      out.push(...listApiPaths(abs, base))
    } else if (name === "route.ts" || name === "route.js") {
      const rel = posix(path.relative(base, path.dirname(abs)))
      out.push(rel ? `/api/${rel}` : "/api")
    }
  }
  return out.sort()
}

const exactEn = deriveExactEnPaths()
const exactFr = deriveExactFrPaths(exactEn)

const snap = {
  toolIds,
  categoryIds: taxonomy.categories.map((category) => category.id),
  guideSlugs: editorialGuideSlugs(),
  collectionSlugsEn: resolvedCollections("en").map((collection) => collection.slug),
  collectionSlugsFr: resolvedCollections("fr").map((collection) => collection.slug),
  exactEn,
  exactFr,
  apiPaths: [...new Set([...listApiPaths(), ...listPagesApiPaths()])].sort(),
}

const out = path.join(ROOT, "lib/routing/known-paths-snapshot.json")
fs.writeFileSync(out, `${JSON.stringify(snap)}\n`)
console.log(
  `Wrote ${out} (${snap.toolIds.length} tools, ${snap.exactEn.length} EN pages, ${snap.apiPaths.length} API routes)`,
)
