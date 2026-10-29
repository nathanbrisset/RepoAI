#!/usr/bin/env node
/** Repair fr-tools.json entries with English or filler in description_fr / features_fr. */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")
const auditPack = JSON.parse(
  fs.readFileSync(path.join(root, "content/i18n/batches/fr-audit-pack.json"), "utf8"),
)

const FILLER =
  /Collaboration, roles|Application web et compte|Exports, API|flux principal|Vérifie la page tarifs|delivers AI-assisted|Check the pricing|The main .+ workflow|Web app and account/i

function frenchChars(t) {
  return (t.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}
function englishScore(t) {
  return (t.match(/\b(the|and|for|with|your|from|workflow|supports|documents)\b/gi) || []).length
}

const tools = Object.fromEntries(
  fs
    .readdirSync(toolsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const t = JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8"))
      return [t.id, t]
    }),
)

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
let fixed = 0
let added = 0

for (const [id, tool] of Object.entries(tools)) {
  if (tool.status !== "active") continue
  const pack = auditPack[id]
  if (!fr[id] && pack?.summary_fr) {
    fr[id] = {
      summary_fr: pack.summary_fr,
      description_fr: pack.description_fr,
      ...(pack.features_fr ? { features_fr: pack.features_fr } : {}),
    }
    added++
  }
  const entry = fr[id]
  if (!entry) continue

  if (tool.summary_fr && (!entry.summary_fr || englishScore(entry.summary_fr) > frenchChars(entry.summary_fr))) {
    entry.summary_fr = tool.summary_fr
    fixed++
  }
  if (tool.description_fr && (!entry.description_fr || FILLER.test(entry.description_fr) || englishScore(entry.description_fr) > 4)) {
    entry.description_fr = tool.description_fr
    fixed++
  } else if (
    entry.description_fr &&
    (FILLER.test(entry.description_fr) || (englishScore(entry.description_fr) > 4 && frenchChars(entry.description_fr) < 3))
  ) {
    entry.description_fr = entry.summary_fr || tool.description_fr || entry.description_fr
    fixed++
  }

  if (tool.features_fr?.length) {
    const bad = (entry.features_fr || []).some((l) => englishScore(l) > 2 && frenchChars(l) < 1) || FILLER.test((entry.features_fr || []).join(" "))
    if (bad || !entry.features_fr?.length) {
      entry.features_fr = tool.features_fr
      fixed++
    }
  } else if (pack?.features_fr && FILLER.test((entry.features_fr || []).join(" "))) {
    entry.features_fr = pack.features_fr
    fixed++
  }
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(JSON.stringify({ fixed, added, total: Object.keys(fr).length }, null, 2))
