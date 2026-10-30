#!/usr/bin/env node
/**
 * Capture a 1280×800 WebP of each non-sunset catalog fiche's official site.
 *
 *   node scripts/screenshots/capture.mjs
 *   node scripts/screenshots/capture.mjs --ids zapier,notion-ai
 *   node scripts/screenshots/capture.mjs --missing
 *   node scripts/screenshots/capture.mjs --concurrency 4 --prune-orphans
 *
 * Successful shots are written to public/screenshots/<id>.webp and the fiche's
 * image field is updated. Captcha, login, empty, and error pages are not
 * published: a valid existing image is kept, otherwise a logo fallback is written.
 */

import { chromium } from "playwright"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import crypto from "crypto"
import os from "os"
import { spawn } from "child_process"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../..")
const TOOLS_DIR = path.join(ROOT, "content/tools")
const OUT_DIR = path.join(ROOT, "public/screenshots")
const REPORT_JSON = path.join(__dirname, "capture-report.json")
const REPORT_MD = path.join(__dirname, "REPORT.md")
const AUDIT_JSON = path.join(__dirname, "audit-before.json")

const VIEWPORT = { width: 1280, height: 800 }
const MAX_WEBP_BYTES = 140 * 1024
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36"

const COOKIE_SELECTORS = [
  "#onetrust-accept-btn-handler",
  "#accept-recommended-btn-handler",
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#CybotCookiebotDialogBodyButtonAccept",
  "#axeptio_btn_acceptAll",
  "button[data-testid='uc-accept-all-button']",
  ".osano-cm-accept-all",
  "#rcc-confirm-button",
  ".cc-allow",
  ".cc-dismiss",
  ".cky-btn-accept",
  "#didomi-notice-agree-button",
  "button[aria-label='Accept all' i]",
  "button[aria-label='Allow all' i]",
  "button[aria-label='Accept all cookies' i]",
  "button[aria-label='Allow all cookies' i]",
]

const COOKIE_BUTTON_NAME =
  /^(allow all( cookies)?|accept all( cookies)?|accept cookies|allow cookies|tout accepter|accepter tout|j['’]accepte|alle akzeptieren|aceptar todo|aceitar todos)$/i

const COOKIE_LABELS = new Set([
  "accept all",
  "accept all cookies",
  "allow all",
  "allow all cookies",
  "accept cookies",
  "allow cookies",
  "i agree",
  "i accept",
  "agree & continue",
  "got it",
  "tout accepter",
  "tout autoriser",
  "accepter tout",
  "accepter",
  "j'accepte",
  "j’accepte",
  "alle akzeptieren",
  "akzeptieren",
  "aceptar todo",
  "aceptar",
  "aceitar todos",
])

function parseArgs(argv) {
  const opts = { ids: null, missing: false, concurrency: 4, pruneOrphans: false, debugDir: "", retries: 1, timeout: 40000 }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--missing") opts.missing = true
    else if (arg === "--prune-orphans") opts.pruneOrphans = true
    else if (arg === "--ids") opts.ids = (argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean)
    else if (arg.startsWith("--ids=")) opts.ids = arg.slice(6).split(",").map((s) => s.trim()).filter(Boolean)
    else if (arg === "--concurrency") opts.concurrency = Math.max(1, Number(argv[++i]) || 4)
    else if (arg.startsWith("--concurrency=")) opts.concurrency = Math.max(1, Number(arg.slice(14)) || 4)
    else if (arg === "--retries") opts.retries = Math.max(0, Number(argv[++i]) || 0)
    else if (arg.startsWith("--retries=")) opts.retries = Math.max(0, Number(arg.slice(10)) || 0)
    else if (arg === "--timeout") opts.timeout = Math.max(5000, Number(argv[++i]) || 40000)
    else if (arg.startsWith("--timeout=")) opts.timeout = Math.max(5000, Number(arg.slice(10)) || 40000)
    else if (arg === "--debug-dir") opts.debugDir = argv[++i] || ""
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/screenshots/capture.mjs [--ids a,b] [--missing] [--concurrency 4] [--retries 1] [--timeout 40000] [--prune-orphans]`)
      process.exit(0)
    } else {
      console.error(`Argument inconnu : ${arg}`)
      process.exit(1)
    }
  }
  return opts
}

function captureLimits(opts) {
  const navigationTimeout = opts.timeout
  return {
    navigationTimeout,
    idleTimeout: 8000,
    contentWait: 8000,
    cookieWait: 4000,
    overallTimeout: navigationTimeout + 45000,
    retries: opts.retries,
  }
}

function loadTools() {
  return fs
    .readdirSync(TOOLS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const file = path.join(TOOLS_DIR, name)
      const tool = JSON.parse(fs.readFileSync(file, "utf8"))
      tool.__file = file
      return tool
    })
}

function publicFile(imagePath) {
  if (!imagePath || !imagePath.startsWith("/")) return null
  const abs = path.join(ROOT, "public", imagePath.replace(/^\//, ""))
  return abs
}

function auditTools(tools) {
  const listed = tools.filter((tool) => tool.status !== "sunset")
  const missingField = []
  const missingFile = []
  const byPath = new Map()
  const byHash = new Map()
  let bytes = 0
  for (const tool of listed) {
    const image = (tool.image || "").trim()
    if (!image) {
      missingField.push(tool.id)
      continue
    }
    const abs = publicFile(image)
    if (!abs || !fs.existsSync(abs)) {
      missingFile.push({ id: tool.id, image })
      continue
    }
    const buf = fs.readFileSync(abs)
    bytes += buf.length
    const hash = crypto.createHash("sha256").update(buf).digest("hex")
    if (!byPath.has(image)) byPath.set(image, [])
    byPath.get(image).push(tool.id)
    if (!byHash.has(hash)) byHash.set(hash, [])
    byHash.get(hash).push(tool.id)
  }
  const sharedPaths = [...byPath.entries()].filter(([, ids]) => ids.length > 1)
  const sharedHashes = [...byHash.entries()].filter(([, ids]) => new Set(ids).size > 1)
  return {
    capturedAt: new Date().toISOString(),
    totalFiles: tools.length,
    sunset: tools.filter((tool) => tool.status === "sunset").length,
    listed: listed.length,
    active: tools.filter((tool) => tool.status === "active").length,
    renamed: tools.filter((tool) => tool.status === "renamed").length,
    withFile: listed.length - missingField.length - missingFile.length,
    missingField,
    missingFile,
    sharedPaths: sharedPaths.map(([image, ids]) => ({ image, ids })),
    sharedHashes: sharedHashes.map(([hash, ids]) => ({ hash, ids })),
    referencedBytes: bytes,
  }
}

function selectTools(tools, opts) {
  let listed = tools.filter((tool) => tool.status !== "sunset")
  if (opts.ids) {
    const wanted = new Set(opts.ids)
    const known = new Set(tools.map((tool) => tool.id))
    for (const id of opts.ids) {
      if (!known.has(id)) console.warn(`id inconnu : ${id}`)
    }
    const sunsetIds = tools.filter((tool) => wanted.has(tool.id) && tool.status === "sunset").map((tool) => tool.id)
    if (sunsetIds.length) console.warn(`sunset ignorés : ${sunsetIds.join(", ")}`)
    listed = listed.filter((tool) => wanted.has(tool.id))
  }
  if (opts.missing) {
    listed = listed.filter((tool) => !fs.existsSync(path.join(OUT_DIR, `${tool.id}.webp`)))
  }
  return listed
}

function setImageField(file, image) {
  const raw = fs.readFileSync(file, "utf8")
  if (!/"image"\s*:/.test(raw)) throw new Error(`champ image absent dans ${file}`)
  const next = raw.replace(/"image"\s*:\s*"(?:\\.|[^"\\])*"/, `"image": ${JSON.stringify(image)}`)
  const parsed = JSON.parse(next)
  if (parsed.image !== image) throw new Error(`champ image non mis à jour dans ${file}`)
  fs.writeFileSync(file, next)
}

async function launchBrowser(headless = true) {
  const args = ["--no-sandbox", "--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled"]
  const options = { headless, args }
  if (headless === false) options.ignoreDefaultArgs = ["--enable-automation"]
  if (process.env.SCREENSHOTS_BROWSER === "chromium") {
    return chromium.launch(options)
  }
  try {
    return await chromium.launch({ ...options, channel: "chrome" })
  } catch {
    console.warn("Chrome système indisponible, repli sur le Chromium de Playwright.")
    return chromium.launch(options)
  }
}

function contextOptions(overrides = {}) {
  return {
    viewport: overrides.viewport || VIEWPORT,
    javaScriptEnabled: overrides.javaScriptEnabled !== false,
    deviceScaleFactor: 1,
    userAgent: USER_AGENT,
    locale: "en-US",
    timezoneId: "America/New_York",
    colorScheme: "light",
    isMobile: false,
    hasTouch: false,
    ignoreHTTPSErrors: true,
    serviceWorkers: "block",
    reducedMotion: "reduce",
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
      "Upgrade-Insecure-Requests": "1",
    },
  }
}

async function dismissCookies(page) {
  const clicked = await page.evaluate((selectors, labels) => {
    const visible = (el) => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      return rect.width > 2 && rect.height > 2 && style.visibility !== "hidden" && style.display !== "none"
    }
    for (const selector of selectors) {
      const el = document.querySelector(selector)
      if (el && visible(el)) {
        el.click()
        return true
      }
    }
    const norm = (value) => (value || "").replace(/\s+/g, " ").trim().toLowerCase()
    const allowed = new Set(labels)
    const nodes = [...document.querySelectorAll("button, [role='button'], input[type='button'], input[type='submit'], a")]
    const cookieish = (el) => {
      let node = el
      for (let depth = 0; depth < 6 && node; depth++) {
        const blob = `${node.id || ""} ${typeof node.className === "string" ? node.className : ""} ${node.getAttribute?.("aria-label") || ""}`
        if (/cookie|consent|gdpr|onetrust|cookiebot|didomi|axeptio|privacy-banner|cmp-/i.test(blob)) return true
        node = node.parentElement
      }
      return false
    }
    const match = nodes.find((el) => {
      if (!visible(el)) return false
      const text = norm(el.innerText || el.value || el.getAttribute("aria-label"))
      return text && text.length < 60 && allowed.has(text) && (cookieish(el) || /cookie|consent/.test(text))
    })
    if (!match) return false
    match.click()
    return true
  }, COOKIE_SELECTORS, [...COOKIE_LABELS]).catch(() => false)
  if (clicked) return true
  const named = page.getByRole("button", { name: COOKIE_BUTTON_NAME }).first()
  if (await named.isVisible({ timeout: 150 }).catch(() => false)) {
    await named.click({ timeout: 1000 }).catch(() => {})
    return true
  }
  return false
}

async function hideCookieChrome(page) {
  await page.evaluate(() => {
    const selectors = [
      "#onetrust-banner-sdk",
      "#onetrust-consent-sdk",
      "[id^='cookieBanner']",
      "#CybotCookiebotDialog",
      "#CybotCookiebotDialogBodyUnderlay",
      ".cookie-banner",
      ".cc-window",
      "[id*='cookie' i][style*='fixed']",
    ]
    for (const el of document.querySelectorAll(selectors.join(","))) {
      el.style.setProperty("display", "none", "important")
    }
    for (const el of document.querySelectorAll("div, section, aside, dialog")) {
      const style = getComputedStyle(el)
      if (style.position !== "fixed" && style.position !== "sticky") continue
      const blob = `${el.id || ""} ${typeof el.className === "string" ? el.className : ""} ${(el.innerText || "").slice(0, 180)}`
      if (/cookie|consent|gdpr|onetrust|cookiebot/i.test(blob)) {
        el.style.setProperty("display", "none", "important")
      }
    }
  }).catch(() => {})
}

async function readSignals(page, status) {
  const dom = await page.evaluate(() => {
    const text = (document.body?.innerText || "").replace(/\s+/g, " ").trim()
    return {
      title: document.title || "",
      h1: [...document.querySelectorAll("h1")].map((node) => node.innerText || "").join(" ").slice(0, 240),
      text: text.slice(0, 4000),
      textLength: text.length,
      href: location.href,
      password: Boolean(document.querySelector("input[type='password']")),
      captchaFrame: Boolean(
        document.querySelector(
          "iframe[src*='recaptcha'], iframe[src*='hcaptcha'], iframe[src*='challenges.cloudflare.com'], iframe[src*='turnstile'], .cf-turnstile, #challenge-form, #cf-challenge-running, #px-captcha, #turnstile-wrapper"
        )
      ),
    }
  })
  return { status, ...dom }
}

function classify(signals) {
  const blob = `${signals.title}\n${signals.h1}\n${signals.text}`.toLowerCase()
  const title = (signals.title || "").trim()
  if (
    signals.captchaFrame ||
    /verify you are human|verify you are not a robot|are you a robot|just a moment\.\.\.|checking your browser|attention required|cf-browser-verification|enable javascript and cookies to continue|pardon our interruption|please verify you are a human|cloudflare ray id|why have i been blocked|datadome|access denied.*ray id/.test(blob)
  ) {
    return { category: "captcha", reason: "Captcha ou interstitiel anti-bot" }
  }
  const is404 =
    (/\b404\b/.test(blob) && /not found|page not|doesn.t exist|couldn.t find|cannot be found/.test(blob)) ||
    /page not found/.test(title.toLowerCase()) ||
    /^404\b/.test((signals.h1 || "").trim())
  if (signals.status >= 500) return { category: "error", reason: `HTTP ${signals.status}` }
  if (signals.status >= 400 && (is404 || signals.textLength < 280)) {
    return { category: "error", reason: `HTTP ${signals.status}` }
  }
  if (is404 && signals.textLength < 900) return { category: "error", reason: "Page 404" }
  if (/privacy error|your connection is not private|err_/.test(blob)) {
    return { category: "error", reason: "Erreur de navigation" }
  }
  if (/domain (is )?for sale|buy this domain|this domain is parked|sedo domain parking/.test(blob)) {
    return { category: "error", reason: "Domaine en parking" }
  }
  const onAuth = /\/(login|log-in|signin|sign-in|sign_in|session\/new|authenticate)(\/|$|\?|#)/i.test(signals.href || "")
  const titleAuth = /^(sign in|log in|login|connexion|se connecter)\b/i.test(title)
  if (signals.password && (onAuth || titleAuth || signals.textLength < 650)) {
    return { category: "login", reason: "Page de connexion" }
  }
  if ((onAuth || titleAuth) && signals.textLength < 450 && /sign in|log in|continue with|create account|s'inscrire/.test(blob)) {
    return { category: "login", reason: "Page de connexion" }
  }
  if (signals.textLength < 12) return { category: "empty", reason: "Page vide" }
  return null
}

async function optimizeWebp(pngBuffer) {
  let quality = 74
  let out = await sharp(pngBuffer).webp({ quality, effort: 5, smartSubsample: true }).toBuffer()
  while (out.length > MAX_WEBP_BYTES && quality > 46) {
    quality -= 8
    out = await sharp(pngBuffer).webp({ quality, effort: 5, smartSubsample: true }).toBuffer()
  }
  return out
}

async function visualStdev(pngBuffer) {
  const stats = await sharp(pngBuffer).stats()
  const values = stats.channels.map((channel) => channel.stdev)
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function initials(name) {
  const parts = name.split(/[^A-Za-z0-9]+/).filter(Boolean)
  return (parts.slice(0, 2).map((part) => part[0]).join("") || "?").toUpperCase()
}

async function renderFallback(tool) {
  const width = VIEWPORT.width
  const height = VIEWPORT.height
  const logoAbs = publicFile((tool.logo || "").trim())
  let logoBuffer = null
  let logoMeta = null
  if (logoAbs && fs.existsSync(logoAbs)) {
    try {
      logoBuffer = await sharp(logoAbs)
        .resize(240, 160, { fit: "inside", withoutEnlargement: false })
        .png()
        .toBuffer()
      logoMeta = await sharp(logoBuffer).metadata()
    } catch {
      logoBuffer = null
    }
  }
  const fontSize = tool.name.length > 42 ? 26 : tool.name.length > 28 ? 32 : 40
  const plate = logoBuffer
    ? `<rect x="490" y="210" width="300" height="230" rx="28" fill="#ffffff" stroke="#e5e7eb"/>`
    : `<circle cx="640" cy="330" r="72" fill="#111827"/>
       <text x="640" y="346" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${escapeXml(initials(tool.name))}</text>`
  const svg = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    ${plate}
    <text x="640" y="${logoBuffer ? 500 : 470}" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="${fontSize}" font-weight="700" fill="#111827">${escapeXml(tool.name)}</text>
  </svg>`)
  const composites = []
  if (logoBuffer && logoMeta?.width && logoMeta?.height) {
    composites.push({
      input: logoBuffer,
      left: Math.round(640 - logoMeta.width / 2),
      top: Math.round(325 - logoMeta.height / 2),
    })
  }
  const png = await sharp(svg).png().composite(composites).toBuffer()
  return sharp(png).webp({ quality: 80, effort: 5 }).toBuffer()
}

function tesseractBin() {
  for (const candidate of ["/usr/bin/tesseract", "/usr/local/bin/tesseract"]) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

function existingTextIsBroken(text) {
  const low = text.toLowerCase().replace(/\s+/g, " ")
  if (/\b404\b/.test(low) && /not found|page not|doesn.t exist|couldn.t find/.test(low)) return "capture existante : page 404"
  if (/page not found/.test(low) && low.length < 1200) return "capture existante : page 404"
  if (/verify you are human|just a moment|checking your browser|attention required/.test(low)) return "capture existante : captcha"
  if (low.length < 500 && /password/.test(low) && /sign in|log in|login/.test(low)) return "capture existante : page de connexion"
  if (/domain (is )?for sale|buy this domain|this domain is parked/.test(low)) return "capture existante : parking"
  return null
}

async function ocrFile(absPath) {
  const bin = tesseractBin()
  if (!bin) return null
  const tmp = path.join(os.tmpdir(), `shot-ocr-${process.pid}-${Date.now()}.png`)
  await sharp(absPath).resize({ width: 1000, withoutEnlargement: true }).png().toFile(tmp)
  const text = await new Promise((resolve) => {
    const proc = spawn(bin, [tmp, "stdout", "--psm", "6", "-l", "eng"], { stdio: ["ignore", "pipe", "ignore"] })
    let out = ""
    const timer = setTimeout(() => {
      proc.kill()
      resolve(out)
    }, 6000)
    proc.stdout.on("data", (chunk) => {
      out += chunk.toString()
    })
    proc.on("close", () => {
      clearTimeout(timer)
      resolve(out)
    })
    proc.on("error", () => {
      clearTimeout(timer)
      resolve("")
    })
  })
  fs.rmSync(tmp, { force: true })
  return text
}

async function existingImageProblem(tool) {
  const abs = publicFile((tool.image || "").trim())
  if (!abs || !fs.existsSync(abs)) return "image absente"
  const stat = fs.statSync(abs)
  if (stat.size < 8000) return "fichier image trop petit"
  try {
    const meta = await sharp(abs).metadata()
    if (!meta.width || meta.width < 320 || !meta.height || meta.height < 180) return "image illisible"
    const stats = await sharp(abs).stats()
    const stdev = stats.channels.reduce((sum, channel) => sum + channel.stdev, 0) / stats.channels.length
    if (stdev < 4) return "image quasi vide"
  } catch {
    return "image illisible"
  }
  const text = await ocrFile(abs)
  if (text == null) return null
  return existingTextIsBroken(text)
}

async function capturePage(page, tool, limits) {
  const response = await page.goto(tool.url, { waitUntil: "domcontentloaded", timeout: limits.navigationTimeout })
  const status = response ? response.status() : 0
  await page.waitForLoadState("load", { timeout: 20000 }).catch(() => {})
  await page.waitForLoadState("networkidle", { timeout: limits.idleTimeout }).catch(() => {})
  await page.evaluate(async (budget) => {
    const deadline = new Promise((resolve) => setTimeout(resolve, budget))
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const images = Promise.all(
      [...document.images].slice(0, 20).map(
        (img) =>
          img.complete
            ? null
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true })
                img.addEventListener("error", resolve, { once: true })
              })
      )
    )
    await Promise.race([Promise.all([fonts, images]), deadline])
  }, 6000).catch(() => {})
  const started = Date.now()
  let length = 0
  while (Date.now() - started < limits.contentWait) {
    length = await page.evaluate(() => (document.body?.innerText || "").trim().length).catch(() => 0)
    if (length > 120) break
    await page.waitForTimeout(500)
  }
  const cookieDeadline = Date.now() + limits.cookieWait
  let dismissed = false
  while (Date.now() < cookieDeadline) {
    if (await dismissCookies(page).catch(() => false)) {
      dismissed = true
      break
    }
    await page.waitForTimeout(400)
  }
  if (dismissed) await page.waitForTimeout(600)
  await hideCookieChrome(page)
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
  await page.waitForTimeout(400)
  let signals = await readSignals(page, status)
  let problem = classify(signals)
  if (!problem && signals.textLength < 40) {
    await page.waitForTimeout(1200)
    signals = await readSignals(page, status)
    problem = classify(signals)
  }
  const png = await page.screenshot({ type: "png", animations: "disabled", caret: "hide", timeout: 15000 })
  if (!problem) {
    const stdev = await visualStdev(png)
    if (signals.textLength < 40 && stdev < 10) problem = { category: "empty", reason: "Page vide" }
    else if (stdev < 3.5) problem = { category: "empty", reason: "Capture quasi uniforme" }
  }
  return { signals, problem, png }
}

async function settleFailure(tool, problem, png, debugDir) {
  if (debugDir && png) {
    fs.mkdirSync(debugDir, { recursive: true })
    fs.writeFileSync(path.join(debugDir, `${tool.id}.png`), png)
  }
  const broken = await existingImageProblem(tool)
  if (!broken) {
    return {
      outcome: "kept",
      category: problem.category,
      reason: problem.reason,
      image: tool.image,
      note: "image actuelle conservée",
    }
  }
  // Do not publish logo-on-grey fallbacks as homepage screenshots.
  return {
    outcome: "skipped",
    category: problem.category,
    reason: problem.reason,
    image: tool.image,
    note: "capture ratée — pas de repli logo publié",
  }
}

async function captureOnce(browser, tool, limits) {
  const context = await browser.newContext(contextOptions())
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined })
  })
  const page = await context.newPage()
  page.setDefaultTimeout(limits.navigationTimeout)
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("délai dépassé")), limits.overallTimeout)
  })
  try {
    return await Promise.race([capturePage(page, tool, limits), timeout])
  } finally {
    clearTimeout(timer)
    await context.close().catch(() => {})
  }
}

function publishSuccess(tool, result) {
  return optimizeWebp(result.png).then((webp) => {
    fs.writeFileSync(path.join(OUT_DIR, `${tool.id}.webp`), webp)
    const image = `/screenshots/${tool.id}.webp`
    setImageField(tool.__file, image)
    return {
      id: tool.id,
      name: tool.name,
      url: tool.url,
      finalUrl: result.signals.href,
      outcome: "success",
      category: "ok",
      reason: "",
      image,
      bytes: webp.length,
      note: "",
    }
  })
}

async function captureTool(browser, tool, debugDir, limits) {
  let last = { signals: { href: "" }, problem: { category: "error", reason: "échec inconnu" }, png: null }
  const attempts = limits.retries + 1
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await captureOnce(browser, tool, limits)
      if (!result.problem) return publishSuccess(tool, result)
      last = result
      if (/404|Page 404/.test(result.problem.reason || "")) break
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : String(error)
      last = { signals: { href: "" }, problem: { category: "error", reason: message }, png: null }
    }
    if (attempt < attempts) {
      console.log(`  nouvel essai ${attempt}/${limits.retries} pour ${tool.id} (${last.problem.category})`)
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
    }
  }
  return { id: tool.id, name: tool.name, url: tool.url, finalUrl: last.signals?.href || "", ...(await settleFailure(tool, last.problem, last.png, debugDir)) }
}

function loadReport() {
  if (!fs.existsSync(REPORT_JSON)) return { results: [] }
  try {
    return JSON.parse(fs.readFileSync(REPORT_JSON, "utf8"))
  } catch {
    return { results: [] }
  }
}

function dirBytes(dir) {
  if (!fs.existsSync(dir)) return 0
  let total = 0
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const stat = fs.statSync(abs)
    if (stat.isFile()) total += stat.size
  }
  return total
}

function formatMiB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} Mio`
}

function writeReports(audit, results) {
  const sorted = [...results].sort((a, b) => a.id.localeCompare(b.id))
  const success = sorted.filter((item) => item.outcome === "success")
  const failed = sorted.filter((item) => item.outcome === "kept" || item.outcome === "fallback")
  const byCategory = {}
  for (const item of failed) byCategory[item.category] = (byCategory[item.category] || 0) + 1
  const payload = {
    generatedAt: new Date().toISOString(),
    audit,
    counts: {
      processed: sorted.length,
      success: success.length,
      failed: failed.length,
      kept: sorted.filter((item) => item.outcome === "kept").length,
      fallback: sorted.filter((item) => item.outcome === "fallback").length,
      byCategory,
    },
    screenshotsBytes: dirBytes(OUT_DIR),
    legacyBytes: dirBytes(path.join(ROOT, "public/tool-screenshots")),
    results: sorted,
  }
  fs.writeFileSync(REPORT_JSON, JSON.stringify(payload, null, 2))

  const failureRows = failed
    .map((item) => `| ${item.id} | ${item.name.replace(/\|/g, "/")} | ${item.category} | ${item.reason.replace(/\|/g, "/")} | ${item.outcome === "kept" ? "image actuelle" : "repli logo"} |`)
    .join("\n")
  const shared = audit.sharedPaths.length || audit.sharedHashes.length
    ? audit.sharedPaths.map((entry) => `- ${entry.image} : ${entry.ids.join(", ")}`).join("\n")
    : "Aucune. Chaque fichier présent a un chemin et un hash SHA-256 qui lui sont propres."
  const md = `# Captures d'écran du catalogue

Généré le ${payload.generatedAt.slice(0, 10)}. Les fiches sunset sont exclues. Les captures ratées ne sont pas publiées.

## Audit des images avant remplacement

| Constat | Nombre |
| --- | ---: |
| Fiches hors sunset | ${audit.listed} |
| Actives | ${audit.active} |
| Renommées (conservées dans le catalogue) | ${audit.renamed} |
| Image locale présente | ${audit.withFile} |
| Champ image vide | ${audit.missingField.length} |
| Fichier image manquant (404 local) | ${audit.missingFile.length} |
| Images partagées entre plusieurs fiches | ${audit.sharedPaths.length + audit.sharedHashes.length} |
| Poids des images alors référencées | ${formatMiB(audit.referencedBytes)} |

${shared}

Fiches sans image : ${audit.missingField.length ? audit.missingField.join(", ") : "aucune"}.

Les fichiers manquants : ${audit.missingFile.length ? audit.missingFile.map((item) => `${item.id} (${item.image})`).join(", ") : "aucun"}.

Les PNG historiques dans \`public/tool-screenshots\` sont des captures plein cadre, souvent 1920×1080, sans format commun. L'audit visuel (OCR) des pages 404, captchas et murs de connexion déjà stockés est repris dans la section suivante quand une nouvelle capture échoue : une image actuelle qui est elle-même une 404, un captcha, une connexion ou une page vide n'est pas conservée.

## Résultat de la passe

| Issue | Nombre |
| --- | ---: |
| Captures réussies | ${success.length} |
| Captures ratées | ${failed.length} |
| Image actuelle conservée | ${payload.counts.kept} |
| Visuel de repli (logo) | ${payload.counts.fallback} |
| Poids de public/screenshots | ${formatMiB(payload.screenshotsBytes)} |
| Poids restant de public/tool-screenshots | ${formatMiB(payload.legacyBytes)} |

Ratées par type : ${Object.entries(byCategory).map(([key, value]) => `${key} ${value}`).join(", ") || "aucune"}.

${success.some((item) => item.note) ? `## Images publiées avec une note\n\n| id | note |\n| --- | --- |\n${success.filter((item) => item.note).map((item) => `| ${item.id} | ${item.note.replace(/\|/g, "/")} |`).join("\n")}\n` : ""}
## Captures ratées

| id | nom | type | détail | décision |
| --- | --- | --- | --- | --- |
${failureRows || "| — | — | — | — | — |"}
`
  fs.writeFileSync(REPORT_MD, md)
  return payload.counts
}

function pruneOrphans() {
  const referenced = new Set()
  for (const tool of loadTools()) {
    for (const key of ["image", "logo"]) {
      const value = (tool[key] || "").trim()
      if (value.startsWith("/tool-screenshots/")) referenced.add(path.basename(value))
    }
  }
  const dir = path.join(ROOT, "public/tool-screenshots")
  if (!fs.existsSync(dir)) return 0
  let removed = 0
  for (const name of fs.readdirSync(dir)) {
    if (referenced.has(name)) continue
    fs.rmSync(path.join(dir, name))
    removed += 1
  }
  return removed
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const tools = loadTools()
  if (!fs.existsSync(AUDIT_JSON)) {
    fs.writeFileSync(AUDIT_JSON, JSON.stringify(auditTools(tools), null, 2))
  }
  const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, "utf8"))
  const selected = selectTools(tools, opts)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log(`Fiches à traiter : ${selected.length}`)
  if (!selected.length) {
    writeReports(audit, loadReport().results || [])
    return
  }

  const limits = captureLimits(opts)
  console.log(`Timeout navigation ${limits.navigationTimeout} ms, essais ${limits.retries + 1}, plafond ${limits.overallTimeout} ms`)
  const previous = new Map((loadReport().results || []).map((item) => [item.id, item]))
  let browser = await launchBrowser()
  let relaunch = null
  const ensureBrowser = async () => {
    if (browser.isConnected()) return browser
    if (!relaunch) {
      relaunch = (async () => {
        await browser.close().catch(() => {})
        browser = await launchBrowser()
        relaunch = null
        return browser
      })()
    }
    return relaunch
  }
  let index = 0
  const queue = [...selected]
  const worker = async () => {
    while (queue.length) {
      const tool = queue.shift()
      if (!tool) break
      const position = ++index
      let result
      try {
        await ensureBrowser()
        result = await captureTool(browser, tool, opts.debugDir, limits)
      } catch (error) {
        console.warn(`relance après ${tool.id}: ${error instanceof Error ? error.message.split("\n")[0] : error}`)
        await browser.close().catch(() => {})
        browser = await launchBrowser()
        try {
          result = await captureTool(browser, tool, opts.debugDir, limits)
        } catch (error2) {
          const reason = error2 instanceof Error ? error2.message.split("\n")[0] : String(error2)
          result = { id: tool.id, name: tool.name, url: tool.url, finalUrl: "", ...(await settleFailure(tool, { category: "error", reason }, null, opts.debugDir)) }
        }
      }
      previous.set(result.id, result)
      const label = result.outcome === "success" ? `ok ${(result.bytes / 1024).toFixed(0)} Ko` : `${result.outcome} ${result.category}`
      console.log(`[${position}/${selected.length}] ${result.id} ${label}`)
      if (position % 5 === 0 || position === selected.length) {
        writeReports(audit, [...previous.values()])
      }
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(opts.concurrency, selected.length) }, () => worker()))
  } finally {
    await browser.close().catch(() => {})
  }
  if (opts.pruneOrphans) {
    const removed = pruneOrphans()
    console.log(`PNG orphelins supprimés : ${removed}`)
  }
  const counts = writeReports(audit, [...previous.values()])
  console.log(JSON.stringify(counts))
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

export {
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
  VIEWPORT,
  USER_AGENT,
}

if (isDirectRun) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
