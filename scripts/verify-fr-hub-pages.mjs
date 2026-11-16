#!/usr/bin/env node
/**
 * Scan built HTML under .next for known English snippets on /fr/categories and /fr/collections.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const nextDir = path.join(root, ".next/server/app/fr")

const NEEDLES = [
  "Explore AI tools by category",
  "Practical paths through the dojo",
  "Recipes for getting useful work done",
  "Ship a useful app",
  "Voice & podcast",
  "Image & branding",
  "Recipes & stacks",
]

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const st = fs.statSync(abs)
    if (st.isDirectory()) walk(abs, acc)
    else if (name.endsWith(".html")) acc.push(abs)
  }
  return acc
}

const targets = walk(nextDir).filter(
  (p) => p.endsWith("categories.html") || p.endsWith("collections.html") || p.includes("/categories/") || p.includes("/collections/"),
)

const hits = []
for (const file of targets) {
  const html = fs.readFileSync(file, "utf8")
  for (const needle of NEEDLES) {
    if (html.includes(needle)) hits.push({ file: path.relative(root, file), needle })
  }
}

if (hits.length) {
  console.error(`verify-fr-hub-pages: ${hits.length} English snippet(s) on FR hub HTML`)
  for (const h of hits) console.error(`  ${h.file}: ${h.needle}`)
  process.exit(1)
}
console.log(`verify-fr-hub-pages: ok (${targets.length} HTML file(s) scanned)`)