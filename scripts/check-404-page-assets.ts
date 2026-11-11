import fs from "node:fs"
import path from "node:path"

const ROOT = path.join(import.meta.dirname, "..")
const NEXT = path.join(ROOT, ".next")

const HTML_CANDIDATES = [
  path.join(NEXT, "server/app/(en)/404-page.html"),
  path.join(NEXT, "server/app/(fr)/fr/404-page.html"),
  path.join(NEXT, "server/app/404-page.html"),
]

function findHtmlFiles(): string[] {
  const found: string[] = []
  for (const candidate of HTML_CANDIDATES) {
    if (fs.existsSync(candidate)) found.push(candidate)
  }
  if (found.length >= 2) return found

  const serverApp = path.join(NEXT, "server/app")
  if (!fs.existsSync(serverApp)) return found

  function walk(dir: string) {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name)
      const stat = fs.statSync(abs)
      if (stat.isDirectory()) walk(abs)
      else if (name.endsWith(".html") && abs.includes("404-page")) found.push(abs)
    }
  }
  walk(serverApp)
  return [...new Set(found)]
}

function assetRefs(html: string): string[] {
  const refs = new Set<string>()
  const re = /\/_next\/static\/[^"'\s<>\\]+/g
  for (const match of html.matchAll(re)) refs.add(match[0])
  return [...refs]
}

function resolveAsset(ref: string): string | null {
  const rel = ref.replace(/^\/_next\//, "")
  const direct = path.join(NEXT, rel)
  if (fs.existsSync(direct)) return direct
  return null
}

if (!fs.existsSync(NEXT)) {
  console.error("check-404-page-assets: .next missing — run next build first")
  process.exit(1)
}

const htmlFiles = findHtmlFiles()
if (htmlFiles.length === 0) {
  console.error("check-404-page-assets: no prerendered 404-page HTML found under .next/server/app")
  process.exit(1)
}

const missing: string[] = []
for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8")
  for (const ref of assetRefs(html)) {
    if (!resolveAsset(ref)) missing.push(`${ref} (from ${path.relative(ROOT, htmlFile)})`)
  }
}

if (missing.length) {
  console.error("check-404-page-assets: missing static assets referenced by 404 pages:")
  for (const line of missing) console.error(`  ${line}`)
  process.exit(1)
}

console.log(`check-404-page-assets OK (${htmlFiles.length} HTML file(s), assets verified)`)
