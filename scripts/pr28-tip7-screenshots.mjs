#!/usr/bin/env node
/**
 * PR28 tip7 — recover homepage screenshots for 13 gap tools via alt URLs / og:image / press assets.
 *
 *   node scripts/pr28-tip7-screenshots.mjs
 */
import { chromium } from "playwright"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const TOOLS_DIR = path.join(ROOT, "content/tools")
const OUT_DIR = path.join(ROOT, "public/screenshots")
const MIN_BYTES = 15 * 1024
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36"

/** @type {Array<{ id: string, urls: string[], press?: string, skipOg?: boolean }>} */
const JOBS = [
  {
    id: "freshdesk-freddy",
    urls: [
      "https://www.freshworks.com/freshdesk/omni/freddy-ai/",
      "https://www.freshworks.com/freshdesk/",
    ],
    press: "https://dam.freshworks.com/m/43eb62587c3e3bbd/original/default-og.webp",
  },
  {
    id: "lavender",
    urls: ["https://www.lavender.ai/", "https://lavender.ai/"],
    press:
      "https://cdn.prod.website-files.com/658433a0cbce340e298ba330/6597e6c2db66b522a9ee1e2b_og-image.png",
  },
  {
    id: "opera-aria",
    urls: [
      "https://www.opera.com/features/aria/",
      "https://www.opera.com/features/opera-ai",
    ],
    press:
      "https://media-production-opera-website.operacdn.com/media/images/lp-video-streaming/og-image.jpg",
  },
  {
    id: "ramp",
    urls: ["https://ramp.com/", "https://ramp.com/product"],
    press: "https://next.ramp.com/assets/images/default-og-image.jpg",
  },
  {
    id: "jenni-ai",
    urls: ["https://jenni.ai/", "https://jenni.ai/pricing"],
    press: "https://framerusercontent.com/images/z4JrDRfRywzEnZ5jahSZEkA9dI.png",
  },
  {
    id: "wan",
    urls: ["https://wan.video/", "https://wanx.aliyun.com/"],
    press: "https://img.alicdn.com/imgextra/i1/O1CN01WlNesT1EWvfm8mzKw_!!6000000000360-2-tps-2400-1260.png",
  },
  {
    id: "chatgpt-atlas",
    urls: ["https://chatgpt.com/", "https://openai.com/chatgpt/download/"],
  },
  {
    id: "liner",
    urls: ["https://getliner.com/", "https://getliner.com/en"],
  },
  {
    id: "spotter",
    urls: ["https://www.spotter.com/studio", "https://www.spotter.com/"],
  },
  {
    id: "zerogpt",
    urls: ["https://www.zerogpt.com/", "https://www.zerogpt.com/#pricing"],
  },
  {
    id: "doubao",
    urls: ["https://www.doubao.com/chat/", "https://www.doubao.com/"],
  },
  {
    id: "kaiber",
    urls: ["https://www.kaiber.ai/", "https://kaiber.ai/"],
  },
  {
    id: "sora",
    urls: ["https://openai.com/sora/", "https://openai.com/index/sora-is-here/"],
    press: "https://openai.com/content/images/2024/12/sora-2-hero.jpg",
  },
]

function loadTool(id) {
  const file = path.join(TOOLS_DIR, `${id}.json`)
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  tool.__file = file
  return tool
}

function setImageField(file, image) {
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  tool.image = image
  fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
}

function classify(signals) {
  const blob = `${signals.title}\n${signals.h1}\n${signals.text}`.toLowerCase()
  const title = (signals.title || "").trim()
  if (
    signals.captchaFrame ||
    /verify you are human|just a moment|checking your browser|cloudflare ray id|datadome/.test(blob)
  ) {
    return { category: "captcha", reason: "Captcha ou interstitiel" }
  }
  if (signals.textLength < 12) return { category: "empty", reason: "Page vide" }
  const onAuth = /\/(login|signin|sign-in)(\/|$|\?)/i.test(signals.href || "")
  if (signals.password && onAuth) return { category: "login", reason: "Connexion" }
  if (/^sign in|^log in/i.test(title) && signals.textLength < 500) return { category: "login", reason: "Connexion" }
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
      captchaFrame: Boolean(
        document.querySelector(
          "iframe[src*='recaptcha'], iframe[src*='hcaptcha'], iframe[src*='challenges.cloudflare.com']",
        ),
      ),
    }
  })
  return { status, ...dom }
}

async function dismissCookies(page) {
  await page
    .evaluate(() => {
      const labels = ["accept all", "allow all", "accept cookies", "tout accepter", "i agree", "got it"]
      const nodes = [...document.querySelectorAll("button, [role='button']")]
      const match = nodes.find((el) =>
        labels.includes((el.innerText || "").replace(/\s+/g, " ").trim().toLowerCase()),
      )
      if (match) match.click()
    })
    .catch(() => {})
}

async function shoot(browser, url) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: USER_AGENT,
    locale: "en-US",
    ignoreHTTPSErrors: true,
  })
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined })
  })
  const page = await context.newPage()
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 50000 })
    const status = response ? response.status() : 0
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {})
    await dismissCookies(page)
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
    const signals = await readSignals(page, status)
    const problem = classify(signals)
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content").catch(() => null)
    const png = problem ? null : await page.screenshot({ type: "png", animations: "disabled" })
    return { signals, problem, png, og }
  } finally {
    await context.close().catch(() => {})
  }
}

async function toWebp(png) {
  let out = await sharp(png).webp({ quality: 86, effort: 5 }).toBuffer()
  if (out.length < MIN_BYTES) {
    const richer = await sharp(png).webp({ quality: 100, effort: 6 }).toBuffer()
    if (richer.length > out.length) out = richer
  }
  return out
}

async function publish(tool, png, note) {
  const webp = await toWebp(png)
  if (webp.length < MIN_BYTES) return { published: false, bytes: webp.length, note: "sous 15 Ko" }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, `${tool.id}.webp`), webp)
  setImageField(tool.__file, `/screenshots/${tool.id}.webp`)
  return { published: true, bytes: webp.length, note }
}

async function publishPress(tool, imageUrl) {
  const response = await fetch(imageUrl, { redirect: "follow", headers: { "user-agent": USER_AGENT } })
  if (!response.ok) return null
  const input = Buffer.from(await response.arrayBuffer())
  if (input.length < 4000) return null
  const meta = await sharp(input).metadata()
  if (!meta.width || meta.width < 400) return null
  const png = await sharp(input).resize(1280, 800, { fit: "cover" }).png().toBuffer()
  return publish(tool, png, `press ${imageUrl}`)
}

async function recoverOne(browser, job) {
  const tool = loadTool(job.id)
  for (const url of job.urls) {
    try {
      const shot = await shoot(browser, url)
      if (!shot.problem && shot.png) {
        const saved = await publish(tool, shot.png, url)
        if (saved.published) return { id: job.id, outcome: "capture", ...saved }
      }
      const og = shot.og ? new URL(shot.og, url).href : ""
      if (og) {
        const pressed = await publishPress(tool, og).catch(() => null)
        if (pressed?.published) return { id: job.id, outcome: "og", ...pressed }
      }
    } catch (error) {
      console.log(`  ${job.id} ${url} ${error.message}`)
    }
  }
  if (job.press) {
    const pressed = await publishPress(tool, job.press).catch(() => null)
    if (pressed?.published) return { id: job.id, outcome: "press", ...pressed }
  }
  return { id: job.id, outcome: "failed" }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  const results = []
  try {
    for (const job of JOBS) {
      console.log(job.id)
      results.push(await recoverOne(browser, job))
    }
  } finally {
    await browser.close()
  }
  console.log(JSON.stringify(results, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
