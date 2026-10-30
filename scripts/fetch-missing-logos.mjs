#!/usr/bin/env node
/**
 * Download missing /logos/{id}.png files from each tool's official site (favicon).
 *
 *   node scripts/fetch-missing-logos.mjs [--ids-file path] [--all-local-refs] [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const logoDir = path.join(root, "public", "logos")
const toolsDir = path.join(root, "content", "tools")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const allLocalRefs = args.includes("--all-local-refs")
const idsFileIdx = args.indexOf("--ids-file")
const idsFile = idsFileIdx >= 0 ? args[idsFileIdx + 1] : ""

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function localLogoPath(id, ext = "png") {
  return path.join(logoDir, `${id}.${ext}`)
}

function hasLocalLogo(id) {
  for (const ext of ["png", "webp", "jpg", "svg"]) {
    if (fs.existsSync(localLogoPath(id, ext))) return true
  }
  return false
}

function loadTools() {
  return fs
    .readdirSync(toolsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(toolsDir, name), "utf8")))
}

function idsNeedingFiles(tools) {
  if (idsFile && fs.existsSync(idsFile)) {
    return fs
      .readFileSync(idsFile, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => (line.startsWith("404 ") ? line.slice(4) : line))
  }
  if (allLocalRefs) {
    return tools
      .filter((tool) => {
        const logo = (tool.logo || "").trim()
        return logo.startsWith("/logos/") && !hasLocalLogo(tool.id)
      })
      .map((tool) => tool.id)
  }
  return []
}

async function downloadLogo(id, url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "Mozilla/5.0 (compatible; aitools-catalog/1.0)" },
  })
  const buf = Buffer.from(await response.arrayBuffer())
  if (!response.ok && buf.length < 80) return { ok: false, error: `HTTP ${response.status}` }
  const type = response.headers.get("content-type") || ""
  const head = buf.slice(0, 180).toString("utf8").trimStart().toLowerCase()
  let kind = ""
  if (head.startsWith("<svg") || head.startsWith("<?xml") || type.includes("svg")) kind = "svg"
  else if (buf[0] === 0x89 && buf[1] === 0x50) kind = "png"
  else if (buf[0] === 0xff && buf[1] === 0xd8) kind = "jpg"
  else if (buf.slice(0, 4).toString() === "RIFF") kind = "webp"
  else if (type.includes("png")) kind = "png"
  else if (type.includes("jpeg")) kind = "jpg"
  else if (/\.ico(\?|$)/i.test(url) || type.includes("icon")) kind = "ico"
  if (!kind || buf.length < 40) return { ok: false, error: `not an image (${type || "unknown"})` }

  let out = buf
  let ext = "png"
  if (kind !== "png" && kind !== "jpg" && kind !== "webp") {
    try {
      const sharp = (await import("sharp")).default
      out = await sharp(buf).resize(128, 128, { fit: "inside" }).png().toBuffer()
    } catch {
      return { ok: false, error: `could not convert ${kind}` }
    }
  } else if (kind === "jpg" || kind === "webp") {
    try {
      const sharp = (await import("sharp")).default
      out = await sharp(buf).resize(128, 128, { fit: "inside" }).png().toBuffer()
    } catch {
      ext = kind === "jpg" ? "jpg" : "webp"
      out = buf
    }
  }

  if (dryRun) return { ok: true, dry: true, bytes: out.length }
  fs.mkdirSync(logoDir, { recursive: true })
  fs.writeFileSync(localLogoPath(id, ext), out)
  return { ok: true, rel: `/logos/${id}.${ext}`, bytes: out.length }
}

async function fetchForTool(tool) {
  const host = hostOf(tool.url)
  if (!host) return { ok: false, error: "no url" }
  const attempts = [
    `https://logo.clearbit.com/${host}`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`,
    `https://${host}/favicon.ico`,
    `https://${host}/apple-touch-icon.png`,
    `https://${host}/favicon.png`,
  ]
  for (const url of attempts) {
    const result = await downloadLogo(tool.id, url).catch((error) => ({ ok: false, error: error.message }))
    if (result.ok) return { ...result, source: url }
  }
  return { ok: false, error: "all attempts failed" }
}

const tools = loadTools()
const byId = new Map(tools.map((tool) => [tool.id, tool]))
const ids = idsNeedingFiles(tools).filter((id) => byId.has(id) && !hasLocalLogo(id))

if (!ids.length) {
  console.log(JSON.stringify({ message: "nothing to fetch", count: 0 }, null, 2))
  process.exit(0)
}

const report = { requested: ids.length, ok: [], fail: [] }
const queue = ids.slice()

async function worker() {
  while (queue.length) {
    const id = queue.pop()
    const tool = byId.get(id)
    const result = await fetchForTool(tool)
    if (result.ok) {
      report.ok.push({ id, bytes: result.bytes, source: result.source })
      const logoPath = `/logos/${id}.png`
      if (!dryRun && (tool.logo || "").trim() !== logoPath) {
        tool.logo = logoPath
        fs.writeFileSync(path.join(toolsDir, `${id}.json`), JSON.stringify(tool, null, 2) + "\n")
      }
    } else {
      report.fail.push({ id, name: tool.name, error: result.error })
    }
  }
}

await Promise.all(Array.from({ length: 10 }, () => worker()))
console.log(JSON.stringify({ ...report, okCount: report.ok.length, failCount: report.fail.length }, null, 2))
