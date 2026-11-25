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
})