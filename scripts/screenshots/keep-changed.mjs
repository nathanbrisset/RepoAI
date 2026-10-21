#!/usr/bin/env node
/**
 * After capture.mjs, drop failed shots and successes that still look like the
 * committed image. The failure report stays. Intended for the monthly workflow.
 *
 *   node scripts/screenshots/keep-changed.mjs
 *   node scripts/screenshots/keep-changed.mjs --dry-run
 */

import fs from "fs"
import path from "path"
import { execFileSync } from "child_process"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../..")
const REPORT_JSON = path.join(__dirname, "capture-report.json")
const REPORT_MD = path.join(__dirname, "REPORT.md")
const SUMMARY_JSON = path.join(__dirname, "publish-summary.json")
const COMPARE_WIDTH = 64
const COMPARE_HEIGHT = 40
/** Mean absolute error on 0–255. Below this, the new shot is treated as unchanged. */
const CHANGE_THRESHOLD = 8

const dryRun = process.argv.includes("--dry-run")

function gitShow(repoPath) {
  try {
    return execFileSync("git", ["show", `HEAD:${repoPath}`], {
      cwd: ROOT,
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
}

function gitCheckout(repoPath) {
  execFileSync("git", ["checkout", "HEAD", "--", repoPath], { cwd: ROOT, stdio: "ignore" })
}

function isTracked(repoPath) {
  return gitShow(repoPath) !== null
}

async function meanAbsoluteError(left, right) {
  const size = { width: COMPARE_WIDTH, height: COMPARE_HEIGHT, fit: "fill" }
  const [a, b] = await Promise.all([
    sharp(left).resize(size).removeAlpha().raw().toBuffer(),
    sharp(right).resize(size).removeAlpha().raw().toBuffer(),
  ])
  if (a.length !== b.length || a.length === 0) return Number.POSITIVE_INFINITY
  let total = 0
  for (let i = 0; i < a.length; i++) total += Math.abs(a[i] - b[i])
  return total / a.length
}

function headImagePath(id) {
  const raw = gitShow(`content/tools/${id}.json`)
  if (!raw) return ""
  try {
    return (JSON.parse(raw.toString()).image || "").trim()
  } catch {
    return ""
  }
}

function publicRepoPath(imagePath) {
  if (!imagePath || !imagePath.startsWith("/")) return ""
  return path.posix.join("public", imagePath.replace(/^\//, ""))
}

function revertPublishedShot(id) {
  const jsonRel = `content/tools/${id}.json`
  const webpRel = `public/screenshots/${id}.webp`
  const headImage = headImagePath(id)
  if (!dryRun && isTracked(jsonRel)) gitCheckout(jsonRel)
  if (headImage === `/screenshots/${id}.webp` || isTracked(webpRel)) {
    if (!dryRun && isTracked(webpRel)) gitCheckout(webpRel)
    return
  }
  const abs = path.join(ROOT, webpRel)
  if (!dryRun && fs.existsSync(abs)) fs.rmSync(abs)
}

async function main() {
  if (!fs.existsSync(REPORT_JSON)) {
    console.error(`Rapport introuvable : ${REPORT_JSON}`)
    process.exit(1)
  }
  const report = JSON.parse(fs.readFileSync(REPORT_JSON, "utf8"))
  const published = []
  const unchanged = []
  const discarded = []

  for (const item of report.results || []) {
    if (item.outcome !== "success") {
      revertPublishedShot(item.id)
      discarded.push(item.id)
      item.publish = "no"
      continue
    }
    const webpRel = `public/screenshots/${item.id}.webp`
    const webpAbs = path.join(ROOT, webpRel)
    const previous = gitShow(publicRepoPath(headImagePath(item.id)))
    let mae = null
    if (previous && fs.existsSync(webpAbs)) {
      try {
        mae = await meanAbsoluteError(fs.readFileSync(webpAbs), previous)
      } catch {
        mae = null
      }
    }
    if (mae !== null && mae < CHANGE_THRESHOLD) {
      revertPublishedShot(item.id)
      unchanged.push({ id: item.id, mae: Number(mae.toFixed(2)) })
      item.publish = "unchanged"
      continue
    }
    published.push({ id: item.id, mae: mae === null ? null : Number(mae.toFixed(2)) })
    item.publish = "yes"
  }

  report.counts = {
    ...report.counts,
    published: published.length,
    unchanged: unchanged.length,
    discarded: discarded.length,
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    threshold: CHANGE_THRESHOLD,
    published: published.map((item) => item.id),
    unchanged: unchanged.map((item) => item.id),
    discarded,
  }
  if (!dryRun) {
    fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2))
    fs.writeFileSync(SUMMARY_JSON, JSON.stringify(summary, null, 2))
    appendSelection(published, unchanged)
  }
  console.log(JSON.stringify({ published: published.length, unchanged: unchanged.length, discarded: discarded.length }))
  if (published.length) console.log(`republiees: ${published.map((item) => item.id).join(", ")}`)
}

function appendSelection(published, unchanged) {
  if (!fs.existsSync(REPORT_MD)) return
  const block = [
    "",
    "## Sélection pour la PR",
    "",
    "Seules les captures réussies et visuellement différentes de l'image déjà versionnée sont conservées. Le seuil est un écart absolu moyen de " +
      CHANGE_THRESHOLD +
      " sur une réduction 64×40.",
    "",
    `- Republiées : ${published.length}`,
    `- Réussies mais inchangées : ${unchanged.length}`,
    "",
    published.length
      ? published.map((item) => `- \`${item.id}\` (écart ${item.mae ?? "n/a"})`).join("\n")
      : "Aucune capture republiée.",
    "",
  ].join("\n")
  const raw = fs.readFileSync(REPORT_MD, "utf8")
  const start = "<!-- keep-changed:start -->"
  const end = "<!-- keep-changed:end -->"
  const wrapped = `${start}\n${block}\n${end}\n`
  const next = raw.includes(start)
    ? raw.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`), wrapped)
    : `${raw.trimEnd()}\n\n${wrapped}`
  fs.writeFileSync(REPORT_MD, next)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
