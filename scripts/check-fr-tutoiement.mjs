#!/usr/bin/env node
/**
 * Fail if vouvoiement pronouns remain in served FR copy (lib i18n + content tools/overlays).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const VOus = /\b(vous|votre|vos)\b/i
const dirs = [
  path.join(root, "lib/i18n"),
  path.join(root, "content/i18n/fr-tools.json"),
  path.join(root, "content/tools"),
  path.join(root, "content/automations/fr-copy.json"),
]

const hits = []
function scanFile(file) {
  const text = fs.readFileSync(file, "utf8")
  if (!VOus.test(text)) return
  const lines = text.split("\n")
  lines.forEach((line, i) => {
    if (VOus.test(line)) hits.push(`${file}:${i + 1}:${line.trim().slice(0, 120)}`)
  })
}

for (const target of dirs) {
  if (!fs.existsSync(target)) continue
  if (fs.statSync(target).isFile()) scanFile(target)
  else {
    for (const f of fs.readdirSync(target)) {
      if (f.endsWith(".ts") || f.endsWith(".json")) scanFile(path.join(target, f))
    }
  }
}

if (hits.length) {
  console.error("FR tutoiement check failed — vouvoiement still present:\n" + hits.slice(0, 40).join("\n"))
  if (hits.length > 40) console.error(`… and ${hits.length - 40} more`)
  process.exit(1)
}
console.log("FR tutoiement check OK")
