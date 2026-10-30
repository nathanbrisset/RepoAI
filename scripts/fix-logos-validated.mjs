#!/usr/bin/env node
/**
 * Fix logos that are HTML error pages masquerading as PNG.
 * Validates PNG/JPEG/WebP magic bytes before write.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const logoDir = path.join(root, "public/logos")
const toolsDir = path.join(root, "content/tools")

const TARGETS = {
  goose: [
    "https://raw.githubusercontent.com/block/goose/main/documentation/static/img/logo_codename_goose.png",
    "https://raw.githubusercontent.com/block/goose/main/documentation/static/img/logo_light.png",
    "https://raw.githubusercontent.com/block/goose/main/documentation/docs/assets/logo.png",
  ],
  codegen: [
    "https://www.google.com/s2/favicons?domain=codegen.com&sz=128",
    "https://logo.clearbit.com/codegen.com",
  ],
  whisper: [
    "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    "https://openai.com/favicon.ico",
  ],
  chatcode: [
    "https://chatcodeai.vercel.app/favicon.ico",
    "https://chatcode.co/apple-touch-icon.png",
    "https://www.google.com/s2/favicons?domain=chatcodeai.vercel.app&sz=128",
  ],
}

function isImageBuffer(buf) {
  if (!buf || buf.length < 12) return false
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true
  if (buf[0] === 0xff && buf[1] === 0xd8) return true
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return true
  const head = buf.slice(0, 64).toString("utf8").trimStart().toLowerCase()
  if (head.startsWith("<!doctype") || head.startsWith("<html")) return false
  return false
}

async function download(url) {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(25000),
    headers: { "user-agent": "Mozilla/5.0 (compatible; aitools-catalog/1.0)" },
  })
  const buf = Buffer.from(await res.arrayBuffer())
  return { ok: res.ok, buf, type: res.headers.get("content-type") || "" }
}

async function toPng(buf) {
  const sharp = (await import("sharp")).default
  return sharp(buf).resize(128, 128, { fit: "inside" }).png().toBuffer()
}

async function fixId(id, urls) {
  for (const url of urls) {
    try {
      const { buf } = await download(url)
      if (!isImageBuffer(buf)) continue
      let out = buf
      try {
        out = await toPng(buf)
      } catch {
        /* keep */
      }
      if (id === "goose") {
        try {
          const sharp = (await import("sharp")).default
          out = await sharp(out)
            .resize(128, 128, { fit: "inside", background: { r: 255, g: 255, b: 255 } })
            .png()
            .toBuffer()
        } catch {
          /* keep */
        }
      }
      if (!isImageBuffer(out)) continue
      fs.mkdirSync(logoDir, { recursive: true })
      fs.writeFileSync(path.join(logoDir, `${id}.png`), out)
      const toolPath = path.join(toolsDir, `${id}.json`)
      if (fs.existsSync(toolPath)) {
        const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
        tool.logo = `/logos/${id}.png`
        fs.writeFileSync(toolPath, `${JSON.stringify(tool, null, 2)}\n`)
      }
      return { id, ok: true, bytes: out.length, url }
    } catch (error) {
      /* try next */
    }
  }
  return { id, ok: false }
}

const results = []
for (const [id, urls] of Object.entries(TARGETS)) {
  results.push(await fixId(id, urls))
}
console.log(JSON.stringify(results, null, 2))
const failed = results.filter((r) => !r.ok).map((r) => r.id)
process.exit(failed.length ? 1 : 0)
