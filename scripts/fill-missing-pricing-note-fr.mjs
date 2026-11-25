#!/usr/bin/env node
/**
 * Add generic pricingNote_fr for active tools that have pricing.note but no FR note.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "le site officiel"
  }
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
let added = 0

for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active") continue
  if (tool.pricing?.uncertain === true) continue
  const note = tool.pricing?.note?.trim()
  if (!note) continue
  const inline = tool.pricing?.note_fr?.trim()
  const overlay = fr[tool.id]
  if (inline || overlay?.pricingNote_fr?.trim()) continue
  const host = hostFromUrl(tool.url || "")
  fr[tool.id] ??= {}
  fr[tool.id].pricingNote_fr = `Détails tarifaires sur ${host} ; consulte la page officielle avant un usage en production.`
  added++
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(JSON.stringify({ added }, null, 2))