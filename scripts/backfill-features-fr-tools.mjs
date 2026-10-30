#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

async function translateEnToFr(text) {
  const chunk = (text || "").trim().slice(0, 2000)
  if (!chunk) return ""
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(chunk)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  const data = await res.json()
  return data[0].map((part) => part[0]).join("").trim()
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
let done = 0
for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active") continue
  const features = tool.features_fr?.length ? tool.features_fr : tool.features
  if (!features?.length) continue
  if (fr[tool.id]?.features_fr?.length) continue
  fr[tool.id] = fr[tool.id] || { summary_fr: fr[tool.id]?.summary_fr || tool.summary_fr || tool.summary, description_fr: fr[tool.id]?.description_fr || tool.description_fr || tool.description }
  const out = []
  for (const line of features.slice(0, 4)) {
    out.push(await translateEnToFr(line))
    await new Promise((r) => setTimeout(r, 100))
  }
  fr[tool.id].features_fr = out
  done++
  if (done % 25 === 0) process.stderr.write(`features_fr ${done}\n`)
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(JSON.stringify({ features_fr_added: done }, null, 2))
