#!/usr/bin/env node
/**
 * Lot 3 screenshot recovery — alternate official URLs / og:image for blocked homepages.
 *   xvfb-run -a node scripts/screenshots/lot3-recover.mjs
 */
import { chromium } from "playwright"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../..")
const TOOLS_DIR = path.join(ROOT, "content/tools")
const OUT_DIR = path.join(ROOT, "public/screenshots")
const REPORT = path.join(__dirname, "lot3-recover.json")
const MIN_BYTES = 15 * 1024

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36"

const JOBS = [
  { id: "ernie-bot", urls: ["https://yiyan.baidu.com/", "https://ernie.baidu.com/"] },
  { id: "merciapp", urls: ["https://www.merciapp.com/en", "https://www.merciapp.com/"] },
  { id: "le-robert-correcteur", urls: ["https://www.lerobert.com/", "https://dictionnaire.lerobert.com/"] },
  { id: "invokeai", urls: ["https://www.invoke.com/", "https://www.invoke.com/product"] },
  { id: "clipdrop", urls: ["https://clipdrop.co/", "https://clipdrop.co/image-upscaler"], press: "https://static.clipdrop.co/web/relight/og-twitter-image.webp" },
  { id: "shutterstock-ai", urls: ["https://www.shutterstock.com/", "https://www.shutterstock.com/discover/ai-image-generator"] },
  { id: "dragon-speech", urls: ["https://www.nuance.com/dragon.html", "https://www.nuance.com/dragon/dragon-professional.html"] },
  { id: "coolors", urls: ["https://coolors.co/", "https://coolors.co/generate"] },
  { id: "homestyler", urls: ["https://www.homestyler.com/", "https://www.homestyler.com/floorplanner"] },
  { id: "csm-ai", urls: ["https://www.csm.ai/", "https://csm.ai/"] },
  { id: "skybox-ai", urls: ["https://www.blockadelabs.com/", "https://skybox.blockadelabs.com/"] },
  { id: "memrise", urls: ["https://www.memrise.com/about/", "https://www.memrise.com/courses/english/"] },
  { id: "turnitin-ai", urls: ["https://www.turnitin.com/", "https://www.turnitin.com/products/"] },
]

function loadTool(id) {
  const file = path.join(TOOLS_DIR, `${id}.json`)
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  tool.__file = file
  return tool
}

function setImageField(file, image) {
  const raw = fs.readFileSync(file, "utf8")
  const next = raw.replace(/"image"\s*:\s*"(?:\\.|[^"\\])*"/, `"image": ${JSON.stringify(image)}`)
  const parsed = JSON.parse(next)
  if (parsed.image !== image) throw new Error(`image non mise à jour dans ${file}`)
  fs.writeFileSync(file, next)
}

function classify(signals) {
  const blob = `${signals.title}\n${signals.h1}\n${signals.text}`.toLowerCase()
  const title = (signals.title || "").trim()
  if (
    signals.captchaFrame ||
    /verify you are human|verify you are not a robot|just a moment|checking your browser|attention required|cf-browser-verification|enable javascript and cookies|pardon our interruption|cloudflare ray id|datadome/.test(blob)
  ) {
    return { category: "captcha", reason: "Captcha ou interstitiel anti-bot" }
  }
  const is404 = (/\b404\b/.test(blob) && /not found|page not|doesn.t exist|couldn.t find/.test(blob)) || /page not found/.test(title.toLowerCase())
  if (signals.status >= 500) return { category: "error", reason: `HTTP ${signals.status}` }
  if (signals.status >= 400 && (is404 || signals.textLength < 280)) return { category: "error", reason: `HTTP ${signals.status}` }
  if (is404 && signals.textLength < 900) return { category: "error", reason: "Page 404" }
  if (/domain (is )?for sale|buy this domain|this domain is parked/.test(blob)) return { category: "error", reason: "Domaine en parking" }
  const onAuth = /\/(login|log-in|signin|sign-in|sign_in|session\/new|authenticate)(\/|$|\?|#)/i.test(signals.href || "")
  const titleAuth = /^(sign in|log in|login|connexion|se connecter)\b/i.test(title)
  if (signals.password && (onAuth || titleAuth || signals.textLength < 650)) return { category: "login", reason: "Page de connexion" }
  if ((onAuth || titleAuth) && signals.textLength < 450 && /sign in|log in|continue with|create account/.test(blob)) return { category: "login", reason: "Page de connexion" }
  if (signals.textLength < 12) return { category: "empty", reason: "Page vide" }
  const cookieHits = (blob.match(/cookie|consent|gdpr|accept all|we value your privacy/g) || []).length
  if (signals.textLength < 320 && cookieHits >= 2) return { category: "cookie", reason: "Mur de cookies" }
  return null
}

async function readSignals(page, status) {
  const dom = await page.evaluate(() => {
    const text = (document.body?.innerText || "").replace(/\s+/g, " ").trim()
    return {
      title: document.title || "",
      h1: document.querySelector("h1")?.innerText?.replace(/\s+/g, " ").trim() || "",
      text: text.slice(0, 1500),
      textLength: text.length,
      href: location.href,
      password: Boolean(document.querySelector("input[type='password']")),
      captchaFrame: Boolean(document.querySelector("iframe[src*='recaptcha'], iframe[src*='hcaptcha'], iframe[src*='challenges.cloudflare.com'], iframe[src*='turnstile'], .cf-turnstile, #challenge-form")),
    }
  })
  return { status, ...dom }
}

async function dismissCookies(page) {
  await page.evaluate(() => {
    const labels = ["accept all", "accept all cookies", "allow all", "allow all cookies", "accept cookies", "i agree", "got it", "tout accepter"]
    const nodes = [...document.querySelectorAll("button, [role='button']")]
    const match = nodes.find((el) => labels.includes((el.innerText || "").replace(/\s+/g, " ").trim().toLowerCase()))
    if (match) match.click()
  }).catch(() => {})
}

async function shoot(browser, url, { javaScriptEnabled, viewport }) {
  const context = await browser.newContext({
    viewport,
    userAgent: USER_AGENT,
    locale: "en-US",
    javaScriptEnabled,
    ignoreHTTPSErrors: true,
    serviceWorkers: "block",
  })
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined })
  })
  const page = await context.newPage()
  page.setDefaultTimeout(40000)
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 })
    const status = response ? response.status() : 0
    const started = Date.now()
    while (Date.now() - started < 12000) {
      const title = await page.title().catch(() => "")
      if (!/just a moment|attention required|checking your browser/i.test(title)) break
      await page.waitForTimeout(1000)
    }
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {})
    await dismissCookies(page)
    await page.waitForTimeout(400)
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
    let signals = await readSignals(page, status)
    let problem = classify(signals)
    if (!problem && signals.textLength < 40) {
      await page.waitForTimeout(2000)
      signals = await readSignals(page, status)
      problem = classify(signals)
    }
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content").catch(() => null)
    const png = problem ? null : await page.screenshot({ type: "png", animations: "disabled", caret: "hide", timeout: 15000 })
    return { signals, problem, png, og }
  } finally {
    await context.close().catch(() => {})
  }
}

async function toWebp(png) {
  let out = await sharp(png).webp({ quality: 86, effort: 5 }).toBuffer()
  if (out.length < MIN_BYTES) {
    const richer = await sharp(png).webp({ quality: 100, effort: 6, smartSubsample: false }).toBuffer()
    if (richer.length > out.length) out = richer
  }
  return out
}

async function publish(tool, png, note) {
  const webp = await toWebp(png)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, `${tool.id}.webp`), webp)
  setImageField(tool.__file, `/screenshots/${tool.id}.webp`)
  return { published: true, bytes: webp.length, note }
}

async function publishPress(tool, imageUrl) {
  const response = await fetch(imageUrl, { redirect: "follow", headers: { "user-agent": USER_AGENT } })
  if (!response.ok) return null
  const input = Buffer.from(await response.arrayBuffer())
  if (input.length < 8000) return null
  const meta = await sharp(input).metadata()
  if (!meta.width || meta.width < 640 || !meta.height || meta.height < 280) return null
  const png = await sharp(input).resize(1280, 800, { fit: "cover" }).png().toBuffer()
  const stats = await sharp(png).stats()
  const stdev = stats.channels.reduce((sum, channel) => sum + channel.stdev, 0) / stats.channels.length
  if (stdev < 8) return null
  return publish(tool, png, `image officielle ${imageUrl}`)
}

async function recoverOne(browser, job) {
  const tool = loadTool(job.id)
  let last = { category: "error", reason: "aucune page exploitable", url: job.urls[0] }
  for (const url of job.urls) {
    try {
      const shot = await shoot(browser, url, { javaScriptEnabled: true, viewport: { width: 1440, height: 900 } })
      if (!shot.problem && shot.png) {
        const saved = await publish(tool, shot.png, `capture ${shot.signals.href}`)
        if (saved.bytes >= MIN_BYTES) {
          return { id: job.id, outcome: "success", bytes: saved.bytes, source: shot.signals.href }
        }
      } else if (shot.problem) {
        last = { ...shot.problem, url }
        console.log(`  refus ${url} ${shot.problem.category}: ${shot.problem.reason}`)
      }
      const og = shot.og ? new URL(shot.og, url).href : ""
      if (og && !/captcha|just a moment/i.test(og)) {
        const pressed = await publishPress(tool, og).catch(() => null)
        if (pressed?.bytes >= MIN_BYTES) {
          return { id: job.id, outcome: "success", bytes: pressed.bytes, source: og }
        }
      }
    } catch (error) {
      last = { category: "error", reason: error instanceof Error ? error.message.split("\n")[0] : String(error), url }
    }
  }
  if (job.press) {
    const pressed = await publishPress(tool, job.press).catch(() => null)
    if (pressed?.bytes >= MIN_BYTES) {
      return { id: job.id, outcome: "success", bytes: pressed.bytes, source: job.press }
    }
  }
  return { id: job.id, outcome: "failed", category: last.category, reason: last.reason, url: last.url }
}

async function main() {
  let browser
  try {
    browser = await chromium.launch({
      headless: false,
      channel: "chrome",
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled", "--window-size=1440,900"],
    })
  } catch {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  }
  const results = []
  try {
    for (const job of JOBS) {
      console.log(job.id)
      const result = await recoverOne(browser, job)
      results.push(result)
      console.log(`→ ${result.outcome} ${result.reason || result.source || ""}`)
    }
  } finally {
    await browser.close().catch(() => {})
  }
  fs.writeFileSync(REPORT, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2))
  console.log(JSON.stringify({ ok: results.filter((r) => r.outcome === "success").length, failed: results.filter((r) => r.outcome === "failed").length }))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
