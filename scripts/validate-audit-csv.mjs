#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const csvPath =
  process.argv[2] ||
  "/home/ubuntu/.cursor/projects/agent-repos-RepoAI/uploads/notes-internes-visibles_b742.csv"

const MOTIF_RULE = {
  "carried over": /carried over|not rechecked/i,
  "repris de l'ancien": /repris de l['’]ancien|non revérifié/i,
  "removed because": /removed because|credible date/i,
  "during this check": /during this check/i,
  "During this check": /during this check/i,
  "lors de cette vérification": /lors de cette vérification/i,
  "pages checked": /pages checked/i,
  "page checked": /page checked/i,
  "pages vérifiées": /pages vérifiées/i,
  "donc non affiché": /donc non affiché/i,
  "n'est pas affiché": /n['’]est pas affiché/i,
  "n’est pas affiché": /n['’]est pas affiché/i,
  HeadlessChrome: /headless chrome/i,
  "Headless Chrome": /headless chrome/i,
  "headless Chrome": /headless chrome/i,
  "was not found": /was not found/i,
  "was not listed": /was not listed on the pricing|n'étaient pas indiqués/i,
  "was not stated": /was not stated/i,
  "was not verified": /was not verified/i,
  "Box cannot": /box cannot/i,
  "curl -": /\bcurl\s+-/i,
  "in lot": /\bin lot\b/i,
  "verify whether": /verify whether/i,
  "not rechecked": /not rechecked/i,
  "left blank": /left blank/i,
  "verified on official": /verified on official/i,
  "₹": /₹|\bINR\b/i,
}

function parseCSVLine(line) {
  const out = []
  let cur = ""
  let i = 0
  while (i < line.length) {
    const c = line[i]
    if (c === '"') {
      i++
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          cur += '"'
          i += 2
        } else if (line[i] === '"') {
          i++
          break
        } else cur += line[i++]
      }
    } else if (c === ",") {
      out.push(cur)
      cur = ""
      i++
    } else cur += line[i++]
  }
  out.push(cur)
  return out
}

function loadTool(slug) {
  const fp = path.join(root, "content/tools", `${slug}.json`)
  if (!fs.existsSync(fp)) return null
  return JSON.parse(fs.readFileSync(fp, "utf8"))
}

const fr = JSON.parse(fs.readFileSync(path.join(root, "content/i18n/fr-tools.json"), "utf8"))

function fieldText(tool, champ, slug) {
  const overlay = fr[slug]
  if (champ === "pricingNote_fr") return overlay?.pricingNote_fr ?? ""
  if (champ === "longDescription") return tool?.description ?? ""
  if (champ === "description_fr") return tool?.description_fr ?? overlay?.description_fr ?? ""
  if (champ.startsWith("features[")) {
    const i = Number(champ.match(/\[(\d+)\]/)?.[1])
    return tool?.features?.[i] ?? ""
  }
  if (champ.startsWith("features_fr[")) {
    const i = Number(champ.match(/\[(\d+)\]/)?.[1])
    return tool?.features_fr?.[i] ?? overlay?.features_fr?.[i] ?? ""
  }
  if (champ.startsWith("howToUse[")) {
    const m = champ.match(/howToUse\[(\d+)\]\.description/)
    if (m) return tool?.howToUse?.[Number(m[1])]?.description ?? ""
  }
  if (champ.includes("pricing.note")) {
    const note = tool?.pricing?.note ?? ""
    const details = tool?.pricing?.details ?? ""
    return [note, details].filter(Boolean).join("\n")
  }
  if (champ.includes("pricing.details")) return tool?.pricing?.details ?? ""
  if (champ === "dateAddedNote") return tool?.dateAddedNote ?? ""
  if (champ === "statusNote") return tool?.statusNote ?? ""
  return tool?.[champ] ?? ""
}

const lines = fs.readFileSync(csvPath, "utf8").trim().split("\n").slice(1)
const unresolved = []

for (const line of lines) {
  const [slug, , , champ, , motif, extrait] = parseCSVLine(line)
  const tool = loadTool(slug)
  const text = fieldText(tool, champ, slug)
  const motifRe = MOTIF_RULE[motif]
  let bad = false
  if (!text?.trim()) {
    if (champ === "dateAddedNote" || champ.includes("pricing.note") || champ === "pricingNote_fr") {
      // deleted field counts as resolved for these motifs
    } else if (motifRe) bad = true
  } else if (motifRe?.test(text)) {
    bad = true
  }
  if (bad) unresolved.push({ slug, champ, motif, excerpt: (text || "").slice(0, 100) })
}

if (unresolved.length) {
  console.error(`Unresolved: ${unresolved.length}`)
  for (const u of unresolved) console.log(`${u.slug}\t${u.champ}\t${u.motif}\t${u.excerpt}`)
  process.exit(1)
}
console.log(`All ${lines.length} audit CSV rows resolved.`)