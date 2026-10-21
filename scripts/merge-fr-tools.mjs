import fs from "node:fs"
import path from "node:path"
import { translateTags } from "../lib/i18n/tags.ts"

const root = process.cwd()
const toolsDir = path.join(root, "content/tools")
const batchDir = path.join(root, "content/i18n/batches")
const outFile = path.join(root, "content/i18n/fr-tools.json")

const batches = fs
  .readdirSync(batchDir)
  .filter((name) => /^fr-\d+\.json$/.test(name))
  .sort()

const french = {}
for (const name of batches) {
  const batch = JSON.parse(fs.readFileSync(path.join(batchDir, name), "utf8"))
  for (const [id, value] of Object.entries(batch)) {
    if (!value?.summary_fr || !value?.description_fr) {
      throw new Error(`${name} is missing summary_fr or description_fr for ${id}`)
    }
    french[id] = {
      summary_fr: value.summary_fr.trim(),
      description_fr: value.description_fr.trim(),
    }
  }
}

const active = []
for (const file of fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active") continue
  active.push(tool)
  const copy = french[tool.id]
  if (!copy) continue
  const tags = translateTags(tool.tags)
  if (tags?.some((tag, index) => tag !== tool.tags[index])) {
    copy.tags_fr = tags
  }
}

const missing = active.filter((tool) => !french[tool.id]).map((tool) => tool.id)
const ordered = Object.fromEntries(Object.entries(french).sort(([a], [b]) => a.localeCompare(b)))
fs.writeFileSync(outFile, `${JSON.stringify(ordered, null, 2)}\n`)
console.log(`Wrote ${Object.keys(ordered).length} French fiches. Active tools still in English: ${missing.length}`)
if (missing.length) console.log(missing.join(", "))
