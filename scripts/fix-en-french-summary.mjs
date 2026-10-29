#!/usr/bin/env node
/** Fix EN summary/description/features still in French (post lot2 import). */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { lineIsFiller } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const lot2EnMap = JSON.parse(fs.readFileSync(path.join(root, "data/lot2-use-case-en.json"), "utf8"))

async function translate(text, sl, tl) {
  const chunk = (text || "").trim().slice(0, 1800)
  if (!chunk) return ""
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(String(res.status))
      const raw = await res.text()
      if (raw.trimStart().startsWith("<")) throw new Error("html")
      const data = JSON.parse(raw)
      return data[0].map((p) => p[0]).join("").trim()
    } catch {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
    }
  }
  return chunk
}

function looksFrenchEn(text) {
  const t = text || ""
  if (/[àâäéèêëïîôùûüç]/i.test(t)) return true
  if (/\b(avec|pour|des|les|une|no-code|sans)\b/i.test(t) && !/\b(the|and|for|with|your)\b/i.test(t)) return true
  return false
}

let fixed = 0
for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const p = path.join(toolsDir, file)
  const tool = JSON.parse(fs.readFileSync(p, "utf8"))
  if (tool.status !== "active") continue
  const frKey = (tool.summary_fr || "").replace(/\.$/, "").trim()
  let useCaseEn = lot2EnMap[frKey]
  if (!useCaseEn && frKey) useCaseEn = await translate(frKey, "fr", "en")
  if (!useCaseEn) continue

  let changed = false
  if (looksFrenchEn(tool.summary)) {
    tool.summary = `${tool.name}: ${useCaseEn.replace(/\.$/, "")}.`
    changed = true
  }
  if (looksFrenchEn(tool.description)) {
    tool.description = `${tool.name} helps teams with ${useCaseEn.charAt(0).toLowerCase()}${useCaseEn.slice(1).replace(/\.$/, "")}.`
    changed = true
  }
  if ((tool.features || []).some(looksFrenchEn)) {
    const enFeat = []
    for (const line of tool.features) {
      if (looksFrenchEn(line)) enFeat.push(await translate(line, "fr", "en"))
      else if (!lineIsFiller(line)) enFeat.push(line)
      await new Promise((r) => setTimeout(r, 100))
    }
    if (enFeat.length) {
      tool.features = enFeat
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(p, `${JSON.stringify(tool, null, 2)}\n`)
    fixed++
  }
}
console.log(JSON.stringify({ enFrenchFixed: fixed }, null, 2))
