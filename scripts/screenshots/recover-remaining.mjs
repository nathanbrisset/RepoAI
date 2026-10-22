#!/usr/bin/env node
/**
 * Reprise manuelle des fiches actives sans capture publiable.
 * Chrome fenêtré, puis une page officielle du même site, puis l'og:image
 * déclarée par cette page. Un captcha, une connexion, une 404 ou une erreur
 * ne sont pas publiés.
 *
 *   xvfb-run -a node scripts/screenshots/recover-remaining.mjs
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
const REPORT = path.join(__dirname, "recover-remaining.json")
const MIN_BYTES = 15 * 1024

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36"

const JOBS = [
  { id: "attio", urls: ["https://attio.com/", "https://attio.com/pricing"] },
  { id: "brainly", urls: ["https://brainly.com/", "https://brainly.com/subjects"] },
  { id: "character-ai", urls: ["https://character.ai/", "https://blog.character.ai/"] },
  { id: "chatcode", urls: ["https://chatcodeai.vercel.app/"] },
  { id: "cocounsel", urls: ["https://www.thomsonreuters.com/en/cocounsel", "https://www.thomsonreuters.com/en-us/products/cocounsel"] },
  { id: "codepal", urls: ["https://codepal.ai/", "https://codepal.ai/pricing"], press: "https://codepal.ai/og-image.png" },
  { id: "crewai", urls: ["https://crewai.com/", "https://www.crewai.com/", "https://crewai.com/pricing"] },
  { id: "duolingo", urls: ["https://www.duolingo.com/", "https://www.duolingo.com/efficacy"], press: "https://www.duolingo.com/images/efficacy/efficacy_tab.png", skipOg: true },
  { id: "gamma", urls: ["https://gamma.app/", "https://gamma.app/pricing", "https://gamma.app/templates"] },
  { id: "google-stitch", urls: ["https://stitch.withgoogle.com/"] },
  { id: "novelai", urls: ["https://novelai.net/", "https://novelai.net/stories"] },
  { id: "perplexity-comet", urls: ["https://www.perplexity.ai/comet"] },
  { id: "poe", urls: ["https://poe.com/", "https://poe.com/explore"], press: "https://poe.com/ogImageExplore.png" },
  { id: "quizlet", urls: ["https://quizlet.com/", "https://quizlet.com/features"] },
  { id: "readwise-reader", urls: ["https://readwise.io/read", "https://readwise.io/"] },
  { id: "retell-ai", urls: ["https://www.retellai.com/", "https://www.retellai.com/pricing"] },
  { id: "spellbook", urls: ["https://spellbook.com/", "https://spellbook.com/pricing"] },
  { id: "tensor-art", urls: ["https://tensor.art/"] },
  { id: "webflow", urls: ["https://webflow.com/", "https://webflow.com/pricing"] },
  { id: "anything", urls: ["https://www.anything.com/", "https://www.anything.com/pricing"], replaceOnlyIfLarger: true },
  { id: "autoregex", urls: ["https://www.autoregex.xyz/"], replaceOnlyIfLarger: true },
  { id: "clipdroprelight", urls: ["https://clipdrop.co/relight", "https://clipdrop.co/"], press: "https://static.clipdrop.co/web/relight/og-twitter-image.webp", replaceOnlyIfLarger: true },
  { id: "deepseek", urls: ["https://www.deepseek.com/"], allowNoJs: true, noJsFirst: true, replaceOnlyIfLarger: true, skipOg: true },
  { id: "perplexity-ai", urls: ["https://www.perplexity.ai/"], replaceOnlyIfLarger: true },
  { id: "mem", urls: ["https://get.mem.ai/", "https://mem.ai/"] },
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

async function publish(tool, png, note, { replaceOnlyIfLarger }) {
  const webp = await toWebp(png)
  const dest = path.join(OUT_DIR, `${tool.id}.webp`)
  const previous = fs.existsSync(dest) ? fs.statSync(dest).size : 0
  if (replaceOnlyIfLarger && previous >= MIN_BYTES && webp.length <= previous) {
    return { published: false, bytes: webp.length, note: "capture existante déjà assez grande" }
  }
  if (replaceOnlyIfLarger && previous > 0 && webp.length < MIN_BYTES && webp.length <= previous) {
    return { published: false, bytes: webp.length, note: "nouvelle capture encore sous 15 Ko" }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(dest, webp)
  setImageField(tool.__file, `/screenshots/${tool.id}.webp`)
  return { published: true, bytes: webp.length, note }
}

async function publishPress(tool, imageUrl, replaceOnlyIfLarger) {
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
  return publish(tool, png, `image officielle ${imageUrl}`, { replaceOnlyIfLarger })
}

async function recoverOne(browser, job) {
  const tool = loadTool(job.id)
  const attempts = []
  const withJs = job.urls.map((url) => ({ url, javaScriptEnabled: true }))
  const withoutJs = job.allowNoJs ? job.urls.map((url) => ({ url, javaScriptEnabled: false })) : []
  attempts.push(...(job.noJsFirst ? [...withoutJs, ...withJs] : [...withJs, ...withoutJs]))
  let last = { category: "error", reason: "aucune page exploitable", url: job.urls[0] }
  let small = null
  for (const attempt of attempts) {
    try {
      const shot = await shoot(browser, attempt.url, {
        javaScriptEnabled: attempt.javaScriptEnabled,
        viewport: { width: 1440, height: 900 },
      })
      if (!shot.problem && shot.png) {
        const saved = await publish(tool, shot.png, `capture ${shot.signals.href}`, { replaceOnlyIfLarger: Boolean(job.replaceOnlyIfLarger) })
        console.log(`  page ${attempt.url} ${saved.bytes} o ${saved.published ? "publiée" : saved.note}`)
        if (saved.published && saved.bytes >= MIN_BYTES) {
          return { id: job.id, outcome: "success", bytes: saved.bytes, source: shot.signals.href, note: saved.note }
        }
        if (saved.published) small = { bytes: saved.bytes, source: shot.signals.href, note: saved.note }
      } else if (shot.problem) {
        last = { ...shot.problem, url: attempt.url }
        console.log(`  refus ${attempt.url} ${shot.problem.category}: ${shot.problem.reason}`)
      }
      const og = shot.og ? new URL(shot.og, attempt.url).href : ""
      if (!job.skipOg && og && !/captcha|just a moment/i.test(og)) {
        const pressed = await publishPress(tool, og, Boolean(job.replaceOnlyIfLarger)).catch(() => null)
        if (pressed?.published && pressed.bytes >= MIN_BYTES) {
          console.log(`  og:image ${og} ${pressed.bytes} o`)
          return { id: job.id, outcome: "success", bytes: pressed.bytes, source: og, note: pressed.note }
        }
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message.split("\n")[0] : String(error)
      last = { category: "error", reason, url: attempt.url }
      console.log(`  erreur ${attempt.url} ${reason}`)
    }
  }
  if (job.press) {
    const pressed = await publishPress(tool, job.press, Boolean(job.replaceOnlyIfLarger)).catch(() => null)
    if (pressed?.published && pressed.bytes >= MIN_BYTES) {
      console.log(`  press ${job.press} ${pressed.bytes} o`)
      return { id: job.id, outcome: "success", bytes: pressed.bytes, source: job.press, note: pressed.note }
    }
  }
  if (small) return { id: job.id, outcome: "small", ...small }
  return { id: job.id, outcome: "failed", category: last.category, reason: last.reason, url: last.url }
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
    channel: "chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled", "--window-size=1440,900"],
  })
  const results = []
  try {
    for (const job of JOBS) {
      console.log(job.id)
      const result = await recoverOne(browser, job)
      results.push(result)
      fs.writeFileSync(REPORT, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2))
      console.log(`→ ${result.outcome} ${result.note || result.reason || ""}`)
    }
  } finally {
    await browser.close().catch(() => {})
  }
  console.log(JSON.stringify({ ok: results.filter((item) => item.outcome === "success").length, small: results.filter((item) => item.outcome === "small").length, failed: results.filter((item) => item.outcome === "failed").length }))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
