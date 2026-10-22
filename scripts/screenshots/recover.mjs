#!/usr/bin/env node
/**
 * Passe manuelle pour les fiches dont la page d'accueil est bloquée.
 * N'est pas appelée par le workflow mensuel.
 *
 *   xvfb-run -a node scripts/screenshots/recover.mjs
 *
 * Essaie Chrome fenêtré, puis une page officielle alternative, puis une
 * og:image officielle assez grande. Un captcha, une connexion, une 404 ou
 * une page d'erreur ne sont pas publiés.
 */

import fs from "fs"
import path from "path"
import {
  classify,
  readSignals,
  dismissCookies,
  hideCookieChrome,
  optimizeWebp,
  visualStdev,
  setImageField,
  loadTools,
  loadReport,
  writeReports,
  launchBrowser,
  contextOptions,
  OUT_DIR,
  ROOT,
} from "./capture.mjs"

const AUDIT_JSON = path.join(path.dirname(new URL(import.meta.url).pathname), "audit-before.json")

const PRESS = {
  clipdroprelight: "https://static.clipdrop.co/web/relight/og-twitter-image.webp",
  codepal: "https://codepal.ai/og-image.png",
  ideogram: "https://storage.googleapis.com/ideogram-static/website/images/ba16d402d8d0b906.jpeg",
  pictory: "https://pictory.ai/wp-content/uploads/2022/04/thumb-home.jpg",
  neurallove: "https://d2zga9r8admji.cloudfront.net/landings/video/og_images.jpg",
}

const JOBS = [
  { id: "gamma", urls: ["https://gamma.app/", "https://gamma.app/pricing", "https://gamma.app/templates", "https://help.gamma.app/"] },
  { id: "character-ai", urls: ["https://character.ai/", "https://character.ai/login"] },
  { id: "perplexity-comet", urls: ["https://www.perplexity.ai/comet"] },
  { id: "perplexity-ai", urls: ["https://www.perplexity.ai/"] },
  { id: "claude-3", urls: ["https://claude.ai/", "https://claude.com/"] },
  { id: "ideogram", urls: ["https://ideogram.ai/", "https://about.ideogram.ai/"] },
  { id: "neurallove", urls: ["https://neural.love/video", "https://neural.love/"] },
  { id: "clipdroprelight", urls: ["https://clipdrop.co/relight", "https://clipdrop.co/"] },
  { id: "codeassist", urls: ["https://www.codeassist.tech/"] },
  { id: "codepal", urls: ["https://codepal.ai/"] },
  { id: "pictory", urls: ["https://pictory.ai/"] },
  { id: "quillbot", urls: ["https://quillbot.com/"] },
  { id: "wellsaid", urls: ["https://www.wellsaid.io/", "https://wellsaid.io/ai-voice-pricing"] },
  { id: "zonos", urls: ["https://zonosai.com/"] },
  { id: "autoregex", urls: ["https://www.autoregex.xyz/"] },
  { id: "semrushwritingassistant", urls: ["https://www.semrush.com/swa/demo", "https://www.semrush.com/kb/814-seo-writing-assistant"] },
  { id: "adobe-marketo-engage", urls: ["https://business.adobe.com/products/marketo.html", "https://experienceleague.adobe.com/en/docs/marketo-engage"] },
  { id: "deepseek", urls: ["https://www.deepseek.com/"], allowNoJs: true, noJsFirst: true },
  { id: "chatcode", urls: ["https://chatcodeai.vercel.app/", "https://chatcodeai.vercel.app"] },
]

function clientError(signals) {
  const blob = `${signals.title}\n${signals.h1}\n${signals.text}`.toLowerCase()
  if (/application error|client-side exception|this page couldn’t load|this page couldn't load/.test(blob)) {
    return { category: "error", reason: "Exception côté client" }
  }
  return null
}

async function shoot(browser, url, { javaScriptEnabled, viewport }) {
  const context = await browser.newContext(contextOptions({ javaScriptEnabled, viewport }))
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined })
  })
  const page = await context.newPage()
  page.setDefaultTimeout(50000)
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 50000 })
    const status = response ? response.status() : 0
    const started = Date.now()
    while (Date.now() - started < 22000) {
      const title = await page.title().catch(() => "")
      if (!/just a moment|attention required|checking your browser/i.test(title)) break
      await page.waitForTimeout(1000)
    }
    await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {})
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {})
    const cookieDeadline = Date.now() + 4000
    while (Date.now() < cookieDeadline) {
      if (await dismissCookies(page).catch(() => false)) {
        await page.waitForTimeout(500)
        break
      }
      await page.waitForTimeout(400)
    }
    await hideCookieChrome(page)
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
    let signals = await readSignals(page, status)
    let problem = classify(signals) || clientError(signals)
    if (!problem && signals.textLength < 40) {
      await page.waitForTimeout(2500)
      signals = await readSignals(page, status)
      problem = classify(signals) || clientError(signals)
    }
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content").catch(() => null)
    const png = await page.screenshot({ type: "png", animations: "disabled", caret: "hide", timeout: 15000 })
    if (!problem) {
      const stdev = await visualStdev(png)
      if (signals.textLength < 40 && stdev < 10) problem = { category: "empty", reason: "Page vide" }
      else if (stdev < 3.5) problem = { category: "empty", reason: "Capture quasi uniforme" }
    }
    return { signals, problem, png, og }
  } finally {
    await context.close().catch(() => {})
  }
}

async function publishPng(tool, png, meta) {
  const webp = await optimizeWebp(png)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, `${tool.id}.webp`), webp)
  const image = `/screenshots/${tool.id}.webp`
  setImageField(tool.__file, image)
  return {
    id: tool.id,
    name: tool.name,
    url: tool.url,
    finalUrl: meta.finalUrl || "",
    outcome: "success",
    category: "ok",
    reason: "",
    image,
    bytes: webp.length,
    note: meta.note || "",
  }
}

async function publishPress(tool, imageUrl) {
  const response = await fetch(imageUrl, { redirect: "follow" })
  if (!response.ok) return null
  const type = response.headers.get("content-type") || ""
  if (!/image|octet-stream/.test(type) && !/\.(png|jpe?g|webp|gif)(\?|$)/i.test(imageUrl)) return null
  const input = Buffer.from(await response.arrayBuffer())
  if (input.length < 8000) return null
  const meta = await sharpMeta(input)
  if (!meta.width || meta.width < 640 || !meta.height || meta.height < 280) return null
  const png = await (await import("sharp")).default(input)
    .resize(1280, 800, { fit: "contain", background: "#f3f4f6" })
    .png()
    .toBuffer()
  const stdev = await visualStdev(png)
  if (stdev < 8) return null
  return publishPng(tool, png, {
    finalUrl: imageUrl,
    note: `Image officielle (${imageUrl}), pas une capture du navigateur.`,
  })
}

async function sharpMeta(input) {
  const sharp = (await import("sharp")).default
  return sharp(input).metadata()
}

async function recoverOne(browser, tool, job) {
  let last = { category: "error", reason: "aucune page exploitable", href: "" }
  const attempts = []
  const withJs = job.urls.map((url) => ({ url, javaScriptEnabled: true }))
  const withoutJs = job.allowNoJs ? job.urls.map((url) => ({ url, javaScriptEnabled: false })) : []
  attempts.push(...(job.noJsFirst ? [...withoutJs, ...withJs] : [...withJs, ...withoutJs]))
  for (const attempt of attempts) {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
    ]) {
      try {
        const shot = await shoot(browser, attempt.url, { javaScriptEnabled: attempt.javaScriptEnabled, viewport })
        if (!shot.problem) {
          const result = await publishPng(tool, shot.png, { finalUrl: shot.signals.href, note: "" })
          console.log(`  capture ${attempt.url} ${(result.bytes / 1024).toFixed(0)} Ko`)
          return result
        }
        last = { ...shot.problem, href: shot.signals.href }
        console.log(`  refus ${attempt.url} ${shot.problem.category}: ${shot.problem.reason}`)
        if (shot.og && !/just a moment|captcha|attention required/i.test(`${shot.signals.title} ${shot.og}`)) {
          const pressed = await publishPress(tool, new URL(shot.og, attempt.url).href).catch(() => null)
          if (pressed) {
            console.log(`  og:image ${shot.og}`)
            return pressed
          }
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message.split("\n")[0] : String(error)
        last = { category: "error", reason, href: attempt.url }
        console.log(`  erreur ${attempt.url} ${reason}`)
      }
      if (last.category === "captcha") break
    }
  }
  if (PRESS[tool.id]) {
    const pressed = await publishPress(tool, PRESS[tool.id]).catch((error) => {
      console.log(`  press ${error instanceof Error ? error.message.split("\n")[0] : error}`)
      return null
    })
    if (pressed) {
      console.log(`  press ${PRESS[tool.id]}`)
      return pressed
    }
  }
  const previous = (loadReport().results || []).find((item) => item.id === tool.id)
  if (previous && previous.outcome === "success") {
    return { ...previous, note: previous.note || "capture précédente conservée" }
  }
  return {
    id: tool.id,
    name: tool.name,
    url: tool.url,
    finalUrl: last.href || "",
    outcome: "kept",
    category: last.category,
    reason: last.reason,
    image: tool.image,
    note: "image actuelle conservée",
  }
}

async function main() {
  const tools = new Map(loadTools().map((tool) => [tool.id, tool]))
  const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, "utf8"))
  const previous = new Map((loadReport().results || []).map((item) => [item.id, item]))
  const browser = await launchBrowser(false)
  try {
    for (const job of JOBS) {
      const tool = tools.get(job.id)
      if (!tool) {
        console.warn(`id inconnu ${job.id}`)
        continue
      }
      if (tool.status === "sunset") {
        console.log(`${job.id} sunset, ignoré`)
        continue
      }
      console.log(job.id)
      const result = await recoverOne(browser, tool, job)
      previous.set(result.id, result)
      writeReports(audit, [...previous.values()])
      console.log(`→ ${result.outcome} ${result.note || result.reason || ""}`)
    }
  } finally {
    await browser.close().catch(() => {})
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
