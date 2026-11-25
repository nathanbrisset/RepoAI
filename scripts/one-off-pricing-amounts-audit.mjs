#!/usr/bin/env node
/**
 * One-off: export pricing amount audit lists to /opt/cursor/artifacts/
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = "/opt/cursor/artifacts"

const AMOUNT_RE = /(?:^|[^\d])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|EUR\b|\$|USD\b)/iu
const TEMPLATE_RE =
  /^Détails tarifaires sur .+ : consulte la page officielle\.?$/

function listedActive(tool) {
  if (tool.status !== "active") return false
  if (
    tool.status === "duplicate-of" ||
    tool.status === "sunset" ||
    tool.status === "renamed" ||
    tool.status === "inactive"
  ) {
    return false
  }
  return true
}

function noteHasAmount(text) {
  return AMOUNT_RE.test(text || "")
}

function amountFields(note, details) {
  const inNote = noteHasAmount(note)
  const inDetails = noteHasAmount(details)
  if (inNote && inDetails) return "both"
  if (inNote) return "note"
  if (inDetails) return "details"
  return null
}

function collapseWs(s) {
  return (s || "").trim().replace(/\s+/g, " ")
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      )
    }
  }
  return dp[m][n]
}

function similarity(a, b) {
  if (!a || !b) return 0
  const dist = levenshtein(a, b)
  return 1 - dist / Math.max(a.length, b.length)
}

function isVerbatimOrVerySimilar(enNote, frNote) {
  const en = collapseWs(enNote)
  const fr = collapseWs(frNote)
  if (!en || !fr) return false
  if (en === fr) return true
  if (en.toLowerCase() === fr.toLowerCase()) return true
  if (en.length >= 24 && similarity(en, fr) >= 0.92) return true
  if (en.length < 24 && en === fr) return true
  return false
}

const frOverlay = JSON.parse(
  fs.readFileSync(path.join(root, "content/i18n/fr-tools.json"), "utf8"),
)
const toolsDir = path.join(root, "content/tools")

const notesWithAmounts = []
const templateWithEnAmount = []
const verbatimCopyIds = []

for (const file of fs
  .readdirSync(toolsDir)
  .filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (!listedActive(tool)) continue

  const enNote = tool.pricing?.note ?? ""
  const enDetails = tool.pricing?.details ?? ""
  const overlay = frOverlay[tool.id]
  const pricingNoteFr = overlay?.pricingNote_fr ?? tool.pricing?.note_fr ?? ""

  const fields = amountFields(enNote, enDetails)
  if (fields) {
    notesWithAmounts.push({
      id: tool.id,
      enNote: typeof enNote === "string" ? enNote : "",
      enDetails: typeof enDetails === "string" ? enDetails : "",
      amountIn: fields,
      pricingNote_fr_preview: String(pricingNoteFr).slice(0, 120),
    })
  }

  if (TEMPLATE_RE.test(collapseWs(pricingNoteFr)) && fields) {
    templateWithEnAmount.push({
      id: tool.id,
      enNote: typeof enNote === "string" ? enNote : "",
      enDetails: typeof enDetails === "string" ? enDetails : "",
      amountIn: fields,
      pricingNote_fr: pricingNoteFr,
    })
  }

  if (
    typeof enNote === "string" &&
    enNote.trim() &&
    isVerbatimOrVerySimilar(enNote, pricingNoteFr)
  ) {
    verbatimCopyIds.push(tool.id)
  }
}

notesWithAmounts.sort((a, b) => a.id.localeCompare(b.id))
templateWithEnAmount.sort((a, b) => a.id.localeCompare(b.id))
verbatimCopyIds.sort((a, b) => a.localeCompare(b))

fs.mkdirSync(outDir, { recursive: true })

const pathNotes = path.join(outDir, "notes-with-amounts.json")
const pathTemplate = path.join(outDir, "template-with-en-amount.json")
const pathVerbatim = path.join(outDir, "verbatim-fr-equals-en-note-ids.json")

fs.writeFileSync(pathNotes, JSON.stringify(notesWithAmounts, null, 2) + "\n")
fs.writeFileSync(pathTemplate, JSON.stringify(templateWithEnAmount, null, 2) + "\n")
fs.writeFileSync(
  pathVerbatim,
  JSON.stringify(
    { count: verbatimCopyIds.length, ids: verbatimCopyIds },
    null,
    2,
  ) + "\n",
)

console.log(
  JSON.stringify(
    {
      notesWithAmounts: { path: pathNotes, count: notesWithAmounts.length },
      templateWithEnAmount: {
        path: pathTemplate,
        count: templateWithEnAmount.length,
      },
      verbatimFrEqualsEnNote: {
        path: pathVerbatim,
        count: verbatimCopyIds.length,
        ids: verbatimCopyIds,
      },
    },
    null,
    2,
  ),
)