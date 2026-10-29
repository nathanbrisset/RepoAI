#!/usr/bin/env node
/** Translate features_fr from EN features for tools still serving English on FR tab. */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))

async function translate(text) {
  const chunk = (text || "").trim().slice(0, 1800)
  if (!chunk) return ""
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(chunk)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      const raw = await res.text()
      if (!res.ok || raw.trimStart().startsWith("<")) throw new Error("bad")
      const data = JSON.parse(raw)
      return data[0].map((p) => p[0]).join("").trim()
    } catch {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
    }
  }
  return chunk
}

function frenchChars(t) {
  return (t.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}
function englishScore(t) {
  return (t.match(/\b(the|and|for|with|your|from|workflow|teams|includes|focused)\b/gi) || []).length
}

function servedFeaturesFr(tool) {
  const o = frTools[tool.id] || {}
  return tool.features_fr?.length ? tool.features_fr : o.features_fr?.length ? o.features_fr : tool.features
}

let updated = 0
for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active") continue
  const feat = (servedFeaturesFr(tool) || []).join(" ")
  if (!(englishScore(feat) > 3 && frenchChars(feat) < 2)) continue
  const src = tool.features || []
  if (!src.length) continue
  const out = []
  for (const line of src.slice(0, 4)) {
    out.push(await translate(line))
    await new Promise((r) => setTimeout(r, 120))
  }
  tool.features_fr = out
  frTools[tool.id] = { ...(frTools[tool.id] || {}), features_fr: out }
  fs.writeFileSync(path.join(toolsDir, file), `${JSON.stringify(tool, null, 2)}\n`)
  updated++
  if (updated % 20 === 0) process.stderr.write(`fr features ${updated}\n`)
}

fs.writeFileSync(frPath, `${JSON.stringify(frTools, null, 2)}\n`)
console.log(JSON.stringify({ features_fr_translated: updated }, null, 2))
