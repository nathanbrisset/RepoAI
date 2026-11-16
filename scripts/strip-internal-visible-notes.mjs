#!/usr/bin/env node
/**
 * One-off / repeatable strip of QA-audited internal catalogue notes (2026-11-16).
 * Run: node scripts/strip-internal-visible-notes.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const CARRIED_OVER =
  /^Price label carried over from the previous catalog and not rechecked\.?\s*$/i
const FR_PRICING_BOILERPLATE =
  /^Libellé tarifaire repris de l'ancien catalogue et non revérifié\.?\s*$/
const DATE_ADDED_META =
  /^The previous Added date was .+\. It was removed because it is not a credible date for this directory\.?\s*$/

/** @type {{ pattern: RegExp, replace?: string }[]} */
const SENTENCE_STRIPS = [
  { pattern: /\s*[;,]?\s*on the pages checked[^.!?]*[.!?]\s*/gi },
  { pattern: /\s*[;,]?\s*on the official pages checked[^.!?]*[.!?]\s*/gi },
  { pattern: /\s*[;,]?\s*pages checked on \d+[^.!?]*[.!?]\s*/gi },
  {
    pattern:
      /\s*\([^)]*donc non affiché[^)]*\)\s*|\s*[,;]?\s*montants?[^.!?]*donc non affiché[^.!?]*[.!?]\s*/gi,
  },
  {
    pattern:
      /\s*[,;]?\s*le montant n’est pas affiché en euros[^.!?]*[.!?]\s*/gi,
  },
  {
    pattern:
      /\s*[,;]?\s*totaux annuels[^.!?]*donc non affichés[^.!?]*[.!?]\s*/gi,
  },
  { pattern: /Codeium’s own price was not rechecked because the domain redirects to Devin\.?\s*/gi },
  {
    pattern:
      /No live pricing page\. The previous Premium label was not rechecked\.?\s*/gi,
  },
]

function stripSentences(text) {
  if (typeof text !== "string") return text
  let out = text
  for (const { pattern, replace = "" } of SENTENCE_STRIPS) {
    out = out.replace(pattern, replace)
  }
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim()
}

function deleteIfEmpty(obj, key) {
  const v = obj[key]
  if (v === undefined) return
  if (typeof v === "string" && !v.trim()) delete obj[key]
}

const stats = {
  pricingNoteCarriedDeleted: 0,
  dateAddedNoteDeleted: 0,
  pricingNoteStripped: 0,
  pricingNoteFrDeleted: 0,
  statusNoteRewritten: 0,
}

const statusNoteFixes = {
  "adobe-marketo-engage":
    "Marketo is part of Adobe Experience Cloud; marketo.com redirects to business.adobe.com.",
  adobe_firefly:
    "The Sensei generative-ai URL may not resolve; use firefly.adobe.com for Adobe Firefly.",
  tabnine: "tabnine.com redirects to Tricentis; see Tricentis Tabnine on the vendor site.",
  myedit:
    "The public site is myedit.online (image, video, and audio AI editor); paid plans from about 5 USD/month on annual billing.",
  codeium: "codeium.com redirects to devin.ai/desktop (Windsurf); see the Devin catalogue entry.",
  codesquire:
    "codesquire.ai did not load in our last check; visit the vendor URL or GitHub for current availability.",
  "freepik-ai-image-generator":
    "Use freepik.com for the AI image generator; some legacy URLs return errors.",
  gennybylovo:
    "Use lovescape.ai / Lovo for Genny voice tools if the listed domain does not load.",
  peech:
    "The listed official URL did not resolve in our last check; confirm availability on the vendor site.",
  perplexity_labs:
    "labs.perplexity.ai redirects to perplexity.ai; see the main Perplexity catalogue entry.",
  phind:
    "phind.com may return a deployment error; search features were sunset per vendor notices in 2026.",
  pycaret:
    "PyCaret is an open-source AutoML library; see the GitHub repository and docs for install and pricing (no commercial list price).",
}

const visitorRewrites = {
  arcads: {
    description:
      "Arcads génère des publicités vidéo et images style contenu utilisateur pour les équipes marketing, avec acteurs IA et modèles vidéo tiers (par ex. Seedance), classés par secteur. Le site propose démos et inscription. Les tarifs détaillés sont sur le centre d’aide ; une offre limitée peut donner sept jours de générations illimitées pour les abonnés.",
    description_en:
      "Arcads generates user-generated-content style video ads and images for marketing teams, using AI actors and third-party video models such as Seedance, with features organised by industry. The site offers demos and sign-up. Plan details are on the help center; subscribers may see limited-time unlimited-generation offers.",
    feature3_en: "Pricing and trials are described on Arcads’ help center rather than a public price list.",
    feature3_fr:
      "Tarifs et essai sont décrits dans le centre d’aide Arcads plutôt que sur une grille publique.",
    howTo3_en:
      "Edit, translate or extend the video, then create more ad variations for your team. Check the site for any subscriber unlimited-generation offer and fair-use terms.",
    howTo3_fr:
      "Modifie, traduis ou prolonge la vidéo, puis crée d’autres variantes pour ton équipe. Consulte le site pour d’éventuelles offres abonnés et conditions d’usage.",
  },
}

function applyArcads(tool) {
  const r = visitorRewrites.arcads
  tool.description = r.description_en
  if (tool.features?.[3]) tool.features[3] = r.feature3_en
  if (tool.howToUse?.[2]?.description) tool.howToUse[2].description = r.howTo3_en
  tool.description_fr = r.description
  if (!tool.features_fr) tool.features_fr = []
  if (tool.features_fr[3]) tool.features_fr[3] = r.feature3_fr
}

// Bulk tools JSON
for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const fp = path.join(toolsDir, file)
  const tool = JSON.parse(fs.readFileSync(fp, "utf8"))

  if (tool.pricing?.note && CARRIED_OVER.test(tool.pricing.note.trim())) {
    delete tool.pricing.note
    stats.pricingNoteCarriedDeleted++
  } else if (tool.pricing?.note) {
    const stripped = stripSentences(tool.pricing.note)
    if (stripped !== tool.pricing.note) {
      tool.pricing.note = stripped || undefined
      stats.pricingNoteStripped++
    }
    if (tool.pricing.note !== undefined && !String(tool.pricing.note).trim()) {
      delete tool.pricing.note
    }
  }
  if (tool.pricing?.details) {
    const stripped = stripSentences(tool.pricing.details)
    if (stripped !== tool.pricing.details) tool.pricing.details = stripped
    if (!tool.pricing.details?.trim()) delete tool.pricing.details
  }

  if (tool.dateAddedNote && DATE_ADDED_META.test(tool.dateAddedNote.trim())) {
    delete tool.dateAddedNote
    stats.dateAddedNoteDeleted++
  }

  if (tool.id && statusNoteFixes[tool.id]) {
    tool.statusNote = statusNoteFixes[tool.id]
    stats.statusNoteRewritten++
  }

  if (tool.id === "arcads") applyArcads(tool)

  fs.writeFileSync(fp, `${JSON.stringify(tool, null, 2)}\n`)
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
for (const [id, overlay] of Object.entries(fr)) {
  if (overlay.pricingNote_fr && FR_PRICING_BOILERPLATE.test(overlay.pricingNote_fr.trim())) {
    delete overlay.pricingNote_fr
    stats.pricingNoteFrDeleted++
  } else if (overlay.pricingNote_fr) {
    const stripped = stripSentences(overlay.pricingNote_fr)
    if (stripped !== overlay.pricingNote_fr) overlay.pricingNote_fr = stripped
    if (!overlay.pricingNote_fr?.trim()) delete overlay.pricingNote_fr
  }
}
fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)

console.log(JSON.stringify(stats, null, 2))