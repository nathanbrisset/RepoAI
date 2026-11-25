import assert from "node:assert/strict"
import { describe, it } from "node:test"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { uncleanReasons } from "./pricing-note-guard"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

describe("pricing-note-guard runtime", () => {
  it("flags English phrasing in FR notes", () => {
    const samples = [
      "Free trial for 7 days, then 9 € billed annually.",
      "Pro plan billed annually, free credits included.",
      "Starter plan: 5 €/mo, cancel anytime.",
      "Team 15 €/user/month, minimum 3 seats.",
      "Free forever, no credit card required.",
      "Monthly or yearly billing available for all plans.",
      "Pay as you go: 0,02 € per request.",
    ]
    for (const text of samples) {
      assert.ok(
        uncleanReasons(text, "fr").includes("wrong_language"),
        `expected wrong_language: ${text}`,
      )
    }
  })

  it("allows French notes with tier names beside amounts", () => {
    const samples = [
      "Essai gratuit de 7 jours, puis 9 € facturés annuellement.",
      "Forfait Pro à 9 € par mois, crédits gratuits inclus.",
      "Formule Free à 0 € pour toujours.",
    ]
    for (const text of samples) {
      assert.equal(
        uncleanReasons(text, "fr").includes("wrong_language"),
        false,
        `unexpected wrong_language: ${text}`,
      )
    }
  })

  it("renders all CSV FR pricing notes (no wrong_language)", async () => {
    const { contenuCsvRows, contenuFrNoteBySlug } = await import(
      "../scripts/lib/contenu-pricing-csv.mjs"
    )
    const notesBySlug = contenuFrNoteBySlug()
    const rows = contenuCsvRows().filter((row) => row.slug?.trim())
    assert.equal(rows.length, 153, "CSV row count")
    const offenders: string[] = []
    for (const row of rows) {
      const slug = row.slug.trim()
      const note = notesBySlug.get(slug)?.trim() || row.pricing_note_fr_corrigee?.trim() || ""
      if (!note) continue
      if (uncleanReasons(note, "fr").includes("wrong_language")) {
        offenders.push(slug)
      }
    }
    assert.equal(offenders.length, 0, offenders.join(", "))
  })

  it("active runtime FR pricing notes have no wrong_language", () => {
    const toolsDir = path.join(root, "content", "tools")
    const frPath = path.join(root, "content", "i18n", "fr-tools.json")
    const frOverlay = JSON.parse(fs.readFileSync(frPath, "utf8")) as Record<
      string,
      { pricingNote_fr?: string }
    >
    const offenders: string[] = []
    let count = 0
    for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
      const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
      const id = tool.id ?? path.basename(file, ".json")
      if (tool.status !== "active") continue
      const candidates = [
        tool.pricing?.note_fr,
        frOverlay[id]?.pricingNote_fr,
      ].filter((v) => typeof v === "string" && v.trim())
      for (const note of candidates) {
        count++
        if (uncleanReasons(note, "fr").includes("wrong_language")) offenders.push(`${id}`)
        break
      }
    }
    assert.ok(count >= 1100, `expected many active FR notes, got ${count}`)
    assert.equal(offenders.length, 0, offenders.join(", "))
  })
})