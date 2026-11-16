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
const allowlistPath = path.join(root, "data/visitor-copy-allowlist.json")
const legalCopyPath = path.join(root, "lib/i18n/legal.ts")

/** @type {{ id: string, pattern: RegExp, scope?: 'internal' | 'currency' | 'distinct-domain' }[]} */
export const VISITOR_COPY_RULES = [
  { id: "notes-non-affichée", pattern: /notes?\s+non\s+affichée|\(non affichées\)/i, scope: "internal" },
  { id: "pas-inventé", pattern: /pas\s+inventé/i, scope: "internal" },
  { id: "not-invented", pattern: /not\s+invented/i, scope: "internal" },
  { id: "no-invented-monthly", pattern: /no\s+invented\s+monthly\s+list/i, scope: "internal" },
  { id: "pas-liste-mensuelle-inventée", pattern: /pas\s+de\s+liste\s+mensuelle\s+inventée/i, scope: "internal" },
  { id: "hidden-notes", pattern: /hidden\s+notes?/i, scope: "internal" },
  { id: "non-displayed", pattern: /non[- ]displayed|\(non-displayed\)/i, scope: "internal" },
  { id: "roupies-inr", pattern: /roupies|\brupee(s)?\b|\bINR\b|₹/i, scope: "currency" },
  { id: "two-currencies", pattern: /two\s+currencies|deux\s+devises/i, scope: "internal" },
  { id: "legal-entity", pattern: /\bLegal\s+entity\b/i, scope: "internal" },
  { id: "mention-officielle", pattern: /Mention\s+officielle|Official\s+mention/i, scope: "internal" },
  { id: "entité-légale", pattern: /Entité\s+légale/i, scope: "internal" },
  { id: "non-converti", pattern: /non\s+converti|not\s+converted\s+here/i, scope: "internal" },
  { id: "donc-non-affiché", pattern: /donc\s+non\s+affiché/i, scope: "internal" },
  { id: "in-same-lot", pattern: /\bin\s+this\s+same\s+lot\b|\bin\s+lot\s+v\d*/i, scope: "internal" },
  { id: "todo-tbd", pattern: /\bTODO\b|\bTBD\b/, scope: "internal" },
  {
    id: "distinct-domain",
    pattern: /(?:^|[.!?]\s+)(?:Distinct|distinct)(?:e)?\s+(?:from|de)\s+[^.!?]*\([a-z0-9][a-z0-9.-]*\)/i,
    scope: "distinct-domain",
  },
  { id: "pages-checked", pattern: /pages?\s+(?:web\s+)?checked|sur\s+les\s+pages\s+vérifiées/i, scope: "internal" },
  { id: "pricing-left-blank", pattern: /pricing\s+is\s+left\s+blank/i, scope: "internal" },
  { id: "not-verified-pricing", pattern: /was\s+not\s+verified\s+(?:on|during)\s+this\s+check/i, scope: "internal" },
  { id: "notes-officielles", pattern: /conservé\s+uniquement\s+dans\s+les\s+notes\s+officielles|recorded\s+in\s+the\s+official\s+\(non-displayed\)\s+notes/i, scope: "internal" },
]

const PRICING_NOTE_FIELDS = new Set([
  "pricing.note",
  "pricing.note_fr",
  "overlay.pricingNote_fr",
])

/** @deprecated use VISITOR_COPY_RULES */
export const VISITOR_COPY_BANNED = VISITOR_COPY_RULES

function loadAllowlist() {
  if (!fs.existsSync(allowlistPath)) return []
  const data = JSON.parse(fs.readFileSync(allowlistPath, "utf8"))
  return Array.isArray(data.allow) ? data.allow : []
}

function isAllowed(allowlist, toolId, field, ruleId) {
  return allowlist.some(
    (row) =>
      row.toolId === toolId &&
      row.field === field &&
      (row.pattern === ruleId || row.ruleId === ruleId),
  )
}

function rulesForField(field) {
  const internalOnly = PRICING_NOTE_FIELDS.has(field)
  return VISITOR_COPY_RULES.filter((rule) => {
    if (rule.scope === "currency") return !internalOnly
    return true
  })
}

function fieldEntries(tool, frOverlay) {
  const id = tool.id
  const overlay = frOverlay?.[id]
  const entries = []
  const push = (field, text) => {
    if (typeof text === "string" && text.trim()) entries.push({ field, text })
  }

  push("summary", tool.summary)
  push("description", tool.description)
  push("summary_fr", tool.summary_fr)
  push("description_fr", tool.description_fr)
  push("pricing.details", tool.pricing?.details)
  push("pricing.note", tool.pricing?.note)
  push("pricing.note_fr", tool.pricing?.note_fr)
  push("statusNote", tool.statusNote)
  push("dateAddedNote", tool.dateAddedNote)

  for (const [i, f] of (tool.features || []).entries()) push(`features[${i}]`, f)
  for (const [i, f] of (tool.features_fr || []).entries()) push(`features_fr[${i}]`, f)
  for (const [i, s] of (tool.howToUse || []).entries()) {
    push(`howToUse[${i}].title`, s?.title)
    push(`howToUse[${i}].description`, s?.description)
  }
  for (const [i, s] of (tool.howToUse_fr || []).entries()) {
    push(`howToUse_fr[${i}].title`, s?.title)
    push(`howToUse_fr[${i}].description`, s?.description)
  }

  if (overlay) {
    push("overlay.summary_fr", overlay.summary_fr)
    push("overlay.description_fr", overlay.description_fr)
    push("overlay.pricingNote_fr", overlay.pricingNote_fr)
    for (const [i, f] of (overlay.features_fr || []).entries()) push(`overlay.features_fr[${i}]`, f)
    for (const [i, s] of (overlay.howToUse_fr || []).entries()) {
      push(`overlay.howToUse_fr[${i}].title`, s?.title)
      push(`overlay.howToUse_fr[${i}].description`, s?.description)
    }
  }
  return entries
}

export function scanVisitorCopy({ rootDir = root } = {}) {
  const toolsPath = path.join(rootDir, "content/tools")
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const allowlist = loadAllowlist()
  const hits = []

  for (const file of fs.readdirSync(toolsPath).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsPath, file), "utf8"))
    const toolId = tool.id || file.replace(/\.json$/, "")
    for (const { field, text } of fieldEntries(tool, frOverlay)) {
      for (const rule of rulesForField(field)) {
        if (!rule.pattern.test(text)) continue
        if (isAllowed(allowlist, toolId, field, rule.id)) continue
        hits.push({
          toolId,
          field,
          rule: rule.id,
          excerpt: text.slice(0, 160).replace(/\s+/g, " "),
        })
        break
      }
    }
  }
  return hits
}

export function scanLegalPageFlag() {
  if (!fs.existsSync(legalCopyPath)) return null
  const text = fs.readFileSync(legalCopyPath, "utf8")
  const flags = []
  if (/\bLegal\s+entity\b/i.test(text)) flags.push("legal-entity")
  if (/\bTBD\b/.test(text)) flags.push("todo-tbd")
  return flags.length ? { path: "lib/i18n/legal.ts", flags, note: "Legal copy not scanned for build failure" } : null
}

function main() {
  const asJson = process.argv.includes("--json")
  const hits = scanVisitorCopy()
  const legalFlag = scanLegalPageFlag()
  const pass = hits.length === 0
  if (asJson) {
    console.log(JSON.stringify({ pass, count: hits.length, hits, legalFlag, allowlist: allowlistPath }, null, 2))
    if (!pass) process.exit(1)
    return hits
  }
  if (hits.length) {
    for (const h of hits) {
      console.log(`${h.toolId}\t${h.field}\t${h.rule}\t${h.excerpt}`)
    }
    console.error(`\nVisitor-copy check failed: ${hits.length} hit(s).`)
    process.exit(1)
  }
  console.log("Visitor-copy check passed (0 hits).")
  if (legalFlag) {
    console.log(`Note (not failing build): ${JSON.stringify(legalFlag)}`)
  }
  return hits
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}