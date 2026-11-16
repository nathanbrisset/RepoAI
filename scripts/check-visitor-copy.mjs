#!/usr/bin/env node
/**
 * Fail when catalogue copy leaks internal research / pricing notes into visitor-facing fields.
 *
 *   node scripts/check-visitor-copy.mjs [--json]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

export const VISITOR_COPY_BANNED = [
  { id: "notes-non-affichée", pattern: /notes?\s+non\s+affichée/i },
  { id: "pas-inventé", pattern: /pas\s+inventé/i },
  { id: "not-invented", pattern: /not\s+invented/i },
  { id: "hidden-notes", pattern: /hidden\s+notes?/i },
  { id: "non-displayed", pattern: /non[- ]displayed/i },
  { id: "roupies-inr", pattern: /roupies|rupees|INR/i },
  { id: "two-currencies", pattern: /two\s+currencies|deux\s+devises/i },
  { id: "legal-entity", pattern: /Legal\s+entity/i },
  { id: "distinct-from", pattern: /Distinct\s+from/i },
  { id: "mention-officielle", pattern: /Mention\s+officielle/i },
  { id: "entité-légale", pattern: /Entité\s+légale/i },
  { id: "non-converti", pattern: /non\s+converti/i },
  { id: "non-displayed-en", pattern: /\(non-displayed\)/i },
]

function collectStrings(value, out = []) {
  if (typeof value === "string") out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out))
  else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectStrings(v, out)
  }
  return out
}

function displayedFieldsForTool(tool, frOverlay) {
  const fields = [
    tool.summary,
    tool.description,
    tool.summary_fr,
    tool.description_fr,
    tool.pricing?.details,
    ...(tool.features || []),
    ...(tool.features_fr || []),
    ...(tool.howToUse || []).flatMap((s) => [s?.title, s?.description]),
    ...(tool.howToUse_fr || []).flatMap((s) => [s?.title, s?.description]),
  ]
  const overlay = frOverlay?.[tool.id]
  if (overlay) {
    fields.push(
      overlay.summary_fr,
      overlay.description_fr,
      overlay.pricingNote_fr,
      ...(overlay.features_fr || []),
      ...(overlay.howToUse_fr || []).flatMap((s) => [s?.title, s?.description]),
    )
  }
  return fields.filter((f) => typeof f === "string" && f.trim())
}

export function scanVisitorCopy({ rootDir = root } = {}) {
  const toolsPath = path.join(rootDir, "content/tools")
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const hits = []

  for (const file of fs.readdirSync(toolsPath).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsPath, file), "utf8"))
    const id = tool.id || file.replace(/\.json$/, "")
    for (const text of displayedFieldsForTool(tool, frOverlay)) {
      for (const rule of VISITOR_COPY_BANNED) {
        if (rule.pattern.test(text)) {
          hits.push({
            toolId: id,
            rule: rule.id,
            excerpt: text.slice(0, 160).replace(/\s+/g, " "),
          })
          break
        }
      }
    }
  }
  return hits
}

function main() {
  const asJson = process.argv.includes("--json")
  const hits = scanVisitorCopy()
  if (asJson) {
    console.log(JSON.stringify({ pass: hits.length === 0, count: hits.length, hits }, null, 2))
  } else if (hits.length) {
    for (const h of hits) {
      console.log(`${h.toolId}\t${h.rule}\t${h.excerpt}`)
    }
    console.error(`\nVisitor-copy check failed: ${hits.length} hit(s).`)
    process.exit(1)
  } else {
    console.log("Visitor-copy check passed (0 hits).")
  }
  return hits
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}