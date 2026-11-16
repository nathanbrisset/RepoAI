#!/usr/bin/env node
/**
 * Playwright smoke: catalogue filter keeps spaces while typing.
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/smoke-catalogue-query-typing.mjs
 */
import { chromium } from "playwright"

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000"

async function typeWithDelay(page, selector, text, delayMs) {
  await page.locator(selector).click()
  await page.locator(selector).fill("")
  await page.focus(selector)
  for (const char of text) {
    await page.keyboard.type(char, { delay: delayMs })
  }
}

async function waitForDebounce(page) {
  await page.waitForTimeout(400)
}

async function assertFilterValue(page, expected) {
  await page.waitForFunction(
    (wanted) => document.querySelector("#catalogue-filter")?.value === wanted,
    expected,
    { timeout: 8000 },
  )
  const value = await page.locator("#catalogue-filter").inputValue()
  if (value !== expected) {
    throw new Error(`Filter input expected "${expected}", got "${value}"`)
  }
}

async function assertHasResults(page) {
  const cards = page.locator("main a[href*='/tool/']")
  const count = await cards.count()
  if (count < 1) {
    throw new Error("Expected at least one tool card in results")
  }
}

async function runScenario(page, path, label, delayMs) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" })
  await typeWithDelay(page, "#catalogue-filter", "notion ai", delayMs)
  await waitForDebounce(page)
  await assertFilterValue(page, "notion ai")
  await assertHasResults(page)

  await typeWithDelay(page, "#catalogue-filter", "image generator", delayMs)
  await waitForDebounce(page)
  await assertFilterValue(page, "image generator")
  await assertHasResults(page)
  await page.waitForTimeout(350)

  console.log(`OK ${label} @ ${delayMs}ms/key`)
}

async function runBackForward(page, path) {
  await page.goto(`${BASE}${path}?q=notion%20ai`, { waitUntil: "networkidle" })
  await waitForDebounce(page)
  await assertFilterValue(page, "notion ai")
  await page.goBack()
  await page.goForward()
  await assertFilterValue(page, "notion ai")
  console.log(`OK deep link + back/forward on ${path}`)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const contexts = [
    { name: "mobile", viewport: { width: 390, height: 844 } },
    { name: "desktop", viewport: { width: 1280, height: 800 } },
  ]

  for (const { name, viewport } of contexts) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()

    for (const path of ["/catalogue", "/fr/catalogue", "/tools"]) {
      await runScenario(page, path, `${name} ${path} slow`, 120)
      await runScenario(page, path, `${name} ${path} fast`, 20)
      await runBackForward(page, path)
    }

    await context.close()
  }

  await browser.close()
  console.log("smoke-catalogue-query-typing: all checks passed")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})