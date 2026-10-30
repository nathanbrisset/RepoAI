#!/usr/bin/env node
/**
 * PR28 tip10 — Restore French "ton" (tone/tonalité) corrupted by vousify (ton → votre).
 */
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const frToolsPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

const ABSURD = /\b(le|du|au)\s+votre\b/gi

/** @returns {{ text: string, fixes: number }} */
export function restoreToneArtifacts(text) {
  if (!text || typeof text !== "string") return { text, fixes: 0 }
  let fixes = 0
  const subs = [
    [/Personnalisation du votre/gi, "Personnalisation du ton"],
    [/personnalisation du votre/gi, "personnalisation du ton"],
    [/basées sur le votre/gi, "basées sur le ton"],
    [/basée sur le votre/gi, "basée sur le ton"],
    [/analyse le votre/gi, "analyse le ton"],
    [/conservent le votre/gi, "conservent le ton"],
    [/adaptation du votre/gi, "adaptation du ton"],
    [/adapte au votre/gi, "adapte au ton"],
    [/sur le votre/gi, "sur le ton"],
    [/selon le votre/gi, "selon le ton"],
    [/le votre d['’]écriture/gi, "le ton d'écriture"],
    [/le votre de la marque/gi, "le ton de la marque"],
    [/le votre de l['’]/gi, "le ton de l'"],
    [/le votre du locuteur/gi, "le ton du locuteur"],
    [/du votre/gi, "du ton"],
    [/au votre/gi, "au ton"],
    [/le votre/gi, "le ton"],
  ]
  let out = text
  for (const [re, repl] of subs) {
    const m = out.match(re)
    if (m) {
      fixes += m.length
      out = out.replace(re, repl)
    }
  }
  return { text: out, fixes }
}

function countAbsurd(text) {
  if (!text || typeof text !== "string") return 0
  return [...text.matchAll(ABSURD)].length
}

function walkStrings(value, fn) {
  if (typeof value === "string") {
    fn(value, (next) => {
      throw new Error("use mutateObject")
    })
    return
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] === "string") {
        const { text, fixes } = restoreToneArtifacts(value[i])
        if (fixes) value[i] = text
      } else walkStrings(value[i], fn)
    }
    return
  }
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (typeof value[key] === "string") {
        const { text, fixes } = restoreToneArtifacts(value[key])
        if (fixes) value[key] = text
      } else walkStrings(value[key], fn)
    }
  }
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  const before = countAbsurd(raw)
  const data = JSON.parse(raw)
  let fileFixes = 0
  const patch = (obj) => {
    if (typeof obj === "string") return obj
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === "string") {
          const { text, fixes } = restoreToneArtifacts(item)
          fileFixes += fixes
          return text
        }
        if (item && typeof item === "object") return patch(item)
        return item
      })
    }
    if (obj && typeof obj === "object") {
      const next = { ...obj }
      for (const k of Object.keys(next)) {
        if (typeof next[k] === "string") {
          const { text, fixes } = restoreToneArtifacts(next[k])
          fileFixes += fixes
          next[k] = text
        } else if (next[k] && typeof next[k] === "object") {
          next[k] = patch(next[k])
        }
      }
      return next
    }
    return obj
  }
  const updated = patch(data)
  const out = `${JSON.stringify(updated, null, 2)}\n`
  const after = countAbsurd(out)
  if (fileFixes > 0) fs.writeFileSync(filePath, out)
  return { before, after, fileFixes }
}

function main() {
  let totalFixes = 0
  let beforeAll = 0
  let afterAll = 0
  const files = [frToolsPath]
  for (const f of fs.readdirSync(toolsDir)) {
    if (f.endsWith(".json")) files.push(path.join(toolsDir, f))
  }
  for (const file of files) {
    const { before, after, fileFixes } = processFile(file)
    beforeAll += before
    afterAll += after
    totalFixes += fileFixes
    if (fileFixes) console.log(`${path.relative(root, file)}: ${fileFixes} replacements`)
  }
  console.log(
    JSON.stringify(
      { absurdHitsBefore: beforeAll, absurdHitsAfter: afterAll, totalReplacements: totalFixes },
      null,
      2,
    ),
  )
  if (afterAll > 0) process.exit(1)
}

main()
