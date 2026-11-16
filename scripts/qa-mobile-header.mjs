/**
 * Mobile header search QA — 390×844 and desktop spot-check.
 * Usage: npm run build && npm run start (port 3000) then node scripts/qa-mobile-header.mjs
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000"
const OUT = process.env.OUT_DIR || "/opt/cursor/artifacts/mobile-header-qa"

const ROUTES = ["/", "/catalogue", "/fr", "/tool/chatgpt"]

async function assertMobileSearch(page, route) {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 120_000 })
  const magnifier = page.getByRole("button", { name: /open search|ouvrir la recherche/i })
  await magnifier.click()
  const dialog = page.getByRole("dialog")
  await dialog.waitFor({ state: "visible" })
  const input = page.locator("#tool-search-mobile")
  await input.fill("notion ai")
  await page.getByRole("button", { name: /close search|fermer la recherche/i }).click()
  await dialog.waitFor({ state: "hidden" })
  const scrollBtn = page.getByRole("button", { name: /saved tools|mes outils enregistrés/i }).first()
  await scrollBtn.click()
  await page.getByRole("dialog").filter({ hasText: /mon scroll|my scroll/i }).waitFor({ state: "visible", timeout: 5000 })
  await page.keyboard.press("Escape")
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const results = []
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage()
      const file = `mobile-390${route.replace(/\//g, "_") || "_home"}.png`
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 120_000 })
      await page.screenshot({ path: path.join(OUT, file), fullPage: false })
      await assertMobileSearch(page, route)
      await page.screenshot({ path: path.join(OUT, `search-open${route.replace(/\//g, "_") || "_home"}.png`) })
      results.push({ route, mobile: "ok", screenshot: file })
      await page.close()
    }

    const desktop = await browser.newPage()
    await desktop.setViewportSize({ width: 1280, height: 800 })
    await desktop.goto(`${BASE}/catalogue`, { waitUntil: "networkidle", timeout: 120_000 })
    const desktopSearch = desktop.locator("#tool-search")
    await desktopSearch.waitFor({ state: "visible" })
    await desktop.screenshot({ path: path.join(OUT, "desktop-1280-catalogue.png") })
    await desktop.close()

    await writeFile(path.join(OUT, "results.json"), JSON.stringify({ ok: true, results }, null, 2))
    console.log("Mobile header QA passed. Screenshots:", OUT)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})