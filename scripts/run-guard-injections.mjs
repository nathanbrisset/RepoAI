#!/usr/bin/env node
/**
 * Inject known-bad copy into a temp checkout of content/, run real guard scanners.
 * Writes data/imports/guard-injections-results.txt (baseline ref vs current tree).
 */
import fs from "fs"
import os from "os"
import path from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "url"
import { scanFrPricingQuality } from "./check-fr-pricing-quality.mjs"
import { scanPricingAmountSanity } from "./check-pricing-amount-sanity.mjs"
import { scanFrEnPriceParity } from "./check-fr-en-price-parity.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outPath = path.join(root, "data/imports/guard-injections-results.txt")

const BASELINE_REF = process.env.GUARD_INJECTION_BASELINE || "55a110f2"
const TIP_REF = process.env.GUARD_INJECTION_TIP || "HEAD"

const INJECTIONS = [
  {
    guard: 54,
    slug: "__injection_qa54__",
    mutate: ({ tools, fr }) => {
      const id = "__injection_qa54__"
      tools[`${id}.json`] = JSON.stringify({ id, status: "active", pricing: {} }, null, 2)
      fr[id] = { pricingNote_fr: "Team plan billed monthly with annual commitment" }
    },
    caught: (rootDir) =>
      scanFrPricingQuality({ rootDir }).some((r) => r.id === "__injection_qa54__"),
  },
  {
    guard: 58,
    slug: "__injection_qa58_zero__",
    mutate: ({ tools }) => {
      const id = "__injection_qa58_zero__"
      tools[`${id}.json`] = JSON.stringify(
        {
          id,
          status: "active",
          summary: "Pro costs 0 € per month for teams.",
          pricing: { note: "Pro costs 0 €" },
        },
        null,
        2,
      )
    },
    caught: (rootDir) =>
      scanPricingAmountSanity({ rootDir }).some(
        (h) => h.id === "__injection_qa58_zero__" && h.rule.includes("zero"),
      ),
  },
  {
    guard: 58,
    slug: "__injection_qa58_glued__",
    mutate: ({ tools }) => {
      const id = "__injection_qa58_glued__"
      tools[`${id}.json`] = JSON.stringify(
        { id, status: "active", description: "Starter costsper month and Team isper seat." },
        null,
        2,
      )
    },
    caught: (rootDir) =>
      scanPricingAmountSanity({ rootDir }).some((h) => h.id === "__injection_qa58_glued__"),
  },
  {
    guard: 58,
    slug: "__injection_qa58_high__",
    mutate: ({ tools }) => {
      const id = "__injection_qa58_high__"
      tools[`${id}.json`] = JSON.stringify(
        {
          id,
          status: "active",
          summary: "Enterprise listing 9 999 €/month after trial.",
          description: "0 € for 7 days, then 9 999 € billed monthly.",
        },
        null,
        2,
      )
    },
    caught: (rootDir) =>
      scanPricingAmountSanity({ rootDir }).some(
        (h) => h.id === "__injection_qa58_high__" && h.rule === "high-eur",
      ),
  },
  {
    guard: 58,
    slug: "__injection_qa58_malformed__",
    mutate: ({ tools }) => {
      const id = "__injection_qa58_malformed__"
      tools[`${id}.json`] = JSON.stringify(
        {
          id,
          status: "active",
          pricing: { details: "API at 0.007.23 € per credit." },
        },
        null,
        2,
      )
    },
    caught: (rootDir) =>
      scanPricingAmountSanity({ rootDir }).some(
        (h) => h.id === "__injection_qa58_malformed__" && h.rule === "malformed-amount",
      ),
  },
  {
    guard: 52,
    slug: "__injection_qa52_details__",
    mutate: ({ tools, fr }) => {
      const id = "__injection_qa52_details__"
      tools[`${id}.json`] = JSON.stringify(
        {
          id,
          status: "active",
          pricing: {
            note: "Starter 18.01 €/month and Professional 45.15 €/month.",
            details: "Starter 18 €/month and Professional 44 €/month.",
          },
        },
        null,
        2,
      )
      fr[id] = {
        pricingNote_fr: "Starter 18,01 €/mois et Professional 45,15 €/mois.",
      }
    },
    caught: (rootDir) =>
      scanFrEnPriceParity({ rootDir }).some(
        (m) => m.id === "__injection_qa52_details__" && m.field.includes("details"),
      ),
  },
]

function materializeContent(ref, dest) {
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(dest, { recursive: true })
  execSync(`git archive ${ref} content | tar -x -C "${dest}"`, { cwd: root, stdio: "pipe" })
}

function loadWorkspace(contentDir) {
  const toolsDir = path.join(contentDir, "tools")
  const tools = {}
  for (const name of fs.readdirSync(toolsDir)) {
    if (!name.endsWith(".json")) continue
    tools[name] = fs.readFileSync(path.join(toolsDir, name), "utf8")
  }
  const frPath = path.join(contentDir, "i18n/fr-tools.json")
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  return { toolsDir, tools, frPath, fr }
}

function saveWorkspace({ toolsDir, tools, frPath, fr }) {
  for (const [name, body] of Object.entries(tools)) {
    fs.writeFileSync(path.join(toolsDir, name), body.endsWith("\n") ? body : `${body}\n`)
  }
  fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
}

function runInjectedSuite(label, ref) {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "guard-inject-"))
  const contentDir = path.join(tmpRoot, "content")
  materializeContent(ref, tmpRoot)
  const ws = loadWorkspace(contentDir)
  for (const inj of INJECTIONS) {
    inj.mutate(ws)
  }
  saveWorkspace(ws)
  const results = INJECTIONS.map((inj) => ({
    guard: inj.guard,
  slug: inj.slug,
    caught: inj.caught(tmpRoot),
  }))
  fs.rmSync(tmpRoot, { recursive: true, force: true })
  return { label, ref, results }
}

function main() {
  const check = process.argv.includes("--check")
  const lines = []
  function runWorkingTreeSuite() {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "guard-inject-"))
    fs.cpSync(path.join(root, "content"), path.join(tmpRoot, "content"), { recursive: true })
    const ws = loadWorkspace(path.join(tmpRoot, "content"))
    for (const inj of INJECTIONS) inj.mutate(ws)
    saveWorkspace(ws)
    const results = INJECTIONS.map((inj) => ({
      guard: inj.guard,
      slug: inj.slug,
      caught: inj.caught(tmpRoot),
    }))
    fs.rmSync(tmpRoot, { recursive: true, force: true })
    return { label: "tip", ref: "working-tree", results }
  }

  const suites = [runInjectedSuite("baseline", BASELINE_REF), runWorkingTreeSuite()]
  for (const suite of suites) {
    lines.push(`=== ${suite.label} (${suite.ref}) ===`)
    for (const r of suite.results) {
      lines.push(`guard ${r.guard}\t${r.slug}\t${r.caught ? "CAUGHT" : "MISSED"}`)
    }
    lines.push("")
  }
  const body = `${lines.join("\n")}\n`
  fs.writeFileSync(outPath, body)
  console.log(body)
  const missed = suites.flatMap((s) => s.results.filter((r) => !r.caught))
  if (check && missed.length) {
    console.error(`Guard injections: ${missed.length} missed`)
    process.exit(1)
  }
  if (!check) console.log("Guard injections recorded (use --check to fail on misses).")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}