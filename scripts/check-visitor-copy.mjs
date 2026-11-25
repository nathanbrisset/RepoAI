#!/usr/bin/env node
/**
 * Fail when catalogue copy leaks internal research / pricing notes into visitor-facing fields.
 *
 *   node scripts/check-visitor-copy.mjs [--json]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
/** Word end for rules touching accented terminations (regex `u` flag). */
const WB = String.raw`(?![\p{L}])`
const allowlistPath = path.join(root, "data/visitor-copy-allowlist.json")
const legalCopyPath = path.join(root, "lib/i18n/legal.ts")

/** @type {{ id: string, pattern: RegExp, scope?: 'internal' | 'currency' | 'distinct-domain' }[]} */
export const VISITOR_COPY_RULES = [
  { id: "notes-non-affichée", pattern: /notes?\s+non\s+affichée|\(non affichées\)/i, scope: "internal" },
  { id: "pas-inventé", pattern: /pas\s+inventé/i, scope: "internal" },
  { id: "not-invented", pattern: /not\s+invented/i, scope: "internal" },
  { id: "no-invented-monthly", pattern: /no\s+invented\s+monthly\s+list/i, scope: "internal" },
  { id: "pas-liste-mensuelle-inventée", pattern: /pas\s+de\s+liste\s+mensuelle\s+inventée/i, scope: "internal" },
  { id: "hidden-notes", pattern: /hidden\s+notes?/i, scope: "internal" },
  { id: "non-displayed", pattern: /non[- ]displayed|\(non-displayed\)/i, scope: "internal" },
  { id: "roupies-inr", pattern: /roupies|\brupee(s)?\b|\bINR\b|₹/i, scope: "currency" },
  { id: "two-currencies", pattern: /two\s+currencies|deux\s+devises/i, scope: "internal" },
  { id: "legal-entity", pattern: /\bLegal\s+entity\b/i, scope: "internal" },
  { id: "mention-officielle", pattern: /Mention\s+officielle|Official\s+mention/i, scope: "internal" },
  { id: "entité-légale", pattern: /Entité\s+légale/i, scope: "internal" },
  { id: "non-converti", pattern: /non\s+converti|not\s+converted\s+here/i, scope: "internal" },
  { id: "donc-non-affiché", pattern: /donc\s+non\s+affiché/i, scope: "internal" },
  { id: "in-same-lot", pattern: /\bin\s+this\s+same\s+lot\b|\bin\s+lot\s+v\d*/i, scope: "internal" },
  { id: "todo-tbd", pattern: /\bTODO\b|\bTBD\b/, scope: "internal" },
  {
    id: "distinct-domain",
    pattern: /(?:^|[.!?]\s+)(?:Distinct|distinct)(?:e)?\s+(?:from|de)\s+[^.!?]*\([a-z0-9][a-z0-9.-]*\)/i,
    scope: "distinct-domain",
  },
  { id: "pages-checked", pattern: /pages?\s+(?:web\s+)?checked|sur\s+les\s+pages\s+vérifiées|pages vérifiées/i, scope: "internal" },
  { id: "pricing-left-blank", pattern: /pricing\s+is\s+left\s+blank/i, scope: "internal" },
  { id: "not-verified-pricing", pattern: /was\s+not\s+verified\s+(?:on|during)\s+this\s+check/i, scope: "internal" },
  { id: "notes-officielles", pattern: /conservé\s+uniquement\s+dans\s+les\s+notes\s+officielles|recorded\s+in\s+the\s+official\s+\(non-displayed\)\s+notes/i, scope: "internal" },
  { id: "carried-over-pricing", pattern: /carried over from the previous catalog|not rechecked/i, scope: "internal" },
  { id: "repris-ancien-catalogue", pattern: /repris de l['’]ancien catalogue|non revérifié/i, scope: "internal" },
  { id: "removed-because-date", pattern: /removed because it is not a credible date|It was removed because/i, scope: "internal" },
  {
    id: "during-this-check",
    pattern:
      /during (?:this|the) (?:check|review)|lors de (?:ce|cette) (?:contrôle|vérification|check|review)/iu,
    scope: "internal",
  },
  { id: "during-check-review", pattern: /during the check\/review/iu, scope: "internal" },
  { id: "lors-de-ce-controle", pattern: /lors de ce contr[oô]le/iu, scope: "internal" },
  { id: "lors-de-la-verification", pattern: /lors de la vérification/iu, scope: "internal" },
  { id: "no-price-was-recorded", pattern: /\bno price was recorded\b/i, scope: "internal" },
  { id: "did-not-render", pattern: /\bdid not render\b/i, scope: "internal" },
  { id: "headless-chrome", pattern: /headless chrome/i, scope: "internal" },
  { id: "curl-cli", pattern: /\bcurl\s+[-\s]/i, scope: "internal" },
  { id: "box-cannot", pattern: /box cannot/i, scope: "internal" },
  { id: "verify-whether", pattern: /verify whether/i, scope: "internal" },
  {
    id: "was-not-listed",
    pattern: /was not listed on the pricing|n['’]étaient pas indiqués sur les pages/i,
    scope: "internal",
  },
  { id: "was-not-stated", pattern: /was not stated|was not found|was not verified/i, scope: "internal" },
  { id: "verified-on-official", pattern: /verified on official/i, scope: "internal" },
  { id: "verified-on", pattern: /\bverified\s+on\b/iu, scope: "internal" },
  { id: "verified-via", pattern: /\bverified\s+via\b/iu, scope: "internal" },
  { id: "verifie-sur", pattern: new RegExp(String.raw`\bvérifié${WB}\s+sur`, "iu"), scope: "internal" },
  { id: "verifie-via", pattern: new RegExp(String.raw`\bvérifié${WB}\s+via`, "iu"), scope: "internal" },
  {
    id: "verifie-word-fr",
    pattern: new RegExp(
      String.raw`(?:prix|tarif|montant|chiffres?|mensuels?).{0,48}\bvérifiés?${WB}|chiffres?\s+vérifiés?${WB}`,
      "iu",
    ),
    scope: "internal",
  },
  {
    id: "extraits-chiffres",
    pattern: new RegExp(
      String.raw`chiffres?\s+extraits|figures?\s+extracted|extraits?${WB}\s+(?:de\s+)?chiffres|extraits?${WB}\s+(?:de\s+la\s+)?(?:page|liste)\s+tarif`,
      "iu",
    ),
    scope: "internal",
  },
  {
    id: "verified-figures-pricing",
    pattern: /(?:équivalents?\s+)?mensuels?\s+vérifiés?|verified\s+figures?/i,
    scope: "internal",
  },
  { id: "official-notes-visitor", pattern: /notes?\s+officielles|"official notes"/i, scope: "internal" },
  { id: "devise-origine", pattern: /devise d['’]origine/i, scope: "internal" },
  { id: "pas-repris-fr", pattern: /pas repris(?:es)?|ne sont pas reprises/i, scope: "internal" },
  { id: "listed-here-en", pattern: /\blisted here\b/i, scope: "internal" },
  { id: "non-liste-fr", pattern: /n['’]est pas listé|non listé/i, scope: "internal" },
  { id: "prices-not-listed-en", pattern: /(?:prices?|plans?)\s+are\s+not\s+listed\b/i, scope: "internal" },
  {
    id: "labelled-as-en",
    pattern: /\blabelled as\b|Labelled Premium|the lot label is(?!\s+so)/i,
    scope: "internal",
  },
  { id: "labellise-fr", pattern: new RegExp(String.raw`\blabellisé${WB}`, "iu"), scope: "internal" },
  { id: "labellisee-fr", pattern: new RegExp(String.raw`\blabellisée${WB}`, "iu"), scope: "internal" },
  {
    id: "arrondis-pricing",
    pattern: /(?:prix|tarif|montant|€|EUR).{0,48}arrondis?|arrondis?.{0,48}(?:€|EUR|prix|tarif)/i,
    scope: "internal",
  },
  {
    id: "isole-pricing-fr",
    pattern: new RegExp(
      String.raw`(?:prix|tarif|montant|plan|offre).{0,80}\bisolé${WB}|n['’]a\s+pas\s+été\s+isolé|clearly isolated`,
      "iu",
    ),
    scope: "internal",
  },
  { id: "converted-from-usd", pattern: /converted from USD/i, scope: "internal" },
  {
    id: "not-recorded-here",
    pattern: /not recorded here|were not recorded|invented\s+(?:Starter|plan|tier)/i,
    scope: "internal",
  },
  { id: "ancien-catalogue-en", pattern: /previous catalog/i, scope: "internal" },
  { id: "in-lot-meta", pattern: /\bin lot\b/i, scope: "internal" },
  { id: "pas-affiche-meta", pattern: /donc non affiché|n['’]est pas affiché/i, scope: "internal" },
  {
    id: "were-isolated-en",
    pattern: /\bwere\s+isolated\b|\bwas\s+not\s+isolated\b|\bwere\s+not\s+isolated\b/i,
    scope: "internal",
  },
  {
    id: "so-the-lot-label-is",
    pattern: /\bso the lot label is\b/i,
    scope: "internal",
  },
  { id: "during-this-review", pattern: /during this review/iu, scope: "internal" },
  { id: "during-the-check", pattern: /during the check(?![\w-])/iu, scope: "internal" },
  { id: "checked-on-date", pattern: /\bChecked on\s+\d/iu, scope: "internal" },
  { id: "returned-404-on", pattern: /returned\s+404\s+on\b/iu, scope: "internal" },
  { id: "were-not-copied", pattern: /\bwere not copied\b|\bwas not copied\b/iu, scope: "internal" },
  {
    id: "internal-label",
    pattern: /\binternal\s+notes?\b|\b(?:lot|QA)\s+label\b|\bso the lot label is\b/iu,
    scope: "internal",
  },
  { id: "review-description", pattern: /\breview description\b/iu, scope: "internal" },
  { id: "returns-404", pattern: /\breturns\s+404\b|\breturned\s+404\b/iu, scope: "internal" },
  { id: "a-renvoye-404", pattern: /\ba\s+renvoyé\s+404\b/iu, scope: "internal" },
  { id: "non-verifiee-fr", pattern: /non\s+vérifiée/iu, scope: "internal" },
  { id: "pages-officielles-verifiees", pattern: /pages\s+officielles\s+vérifiées/iu, scope: "internal" },
  { id: "fetched-on", pattern: /\bfetched on\s+\d/i, scope: "internal" },
  {
    id: "controles-automatises",
    pattern: /lors des contrôles automatisés|lors de cet examen|métadonnées du site/i,
    scope: "internal",
  },
  { id: "pas-ete-extrait", pattern: /n['’]a\s+pas\s+été\s+extrait/iu, scope: "internal" },
  {
    id: "plan-details-manual-verification",
    pattern: /plan details need manual verification/i,
    scope: "internal",
  },
  {
    id: "loaded-normally-manual",
    pattern: /loaded normally.*(?:manual verification|plan details)/i,
    scope: "internal",
  },
  { id: "au-moment-de-la-verification", pattern: /au moment de la vérification/iu, scope: "internal" },
  { id: "sur-la-page-verifiee", pattern: /sur la page vérifiée/iu, scope: "internal" },
  { id: "in-this-pass", pattern: /\bin this pass\b/iu, scope: "internal" },
  { id: "could-not-be-read", pattern: /\bcould not be read\b/iu, scope: "internal" },
  { id: "not-readable-en", pattern: /\bnot readable\b/iu, scope: "internal" },
  { id: "pas-lisible-fr", pattern: /pas lisibles?|n['’]étaient pas lisibles/iu, scope: "internal" },
  { id: "not-copied-en", pattern: /\bnot copied\b/iu, scope: "internal" },
  { id: "were-not-readable", pattern: /\bwere not readable\b/iu, scope: "internal" },
  { id: "labelle-fr-word", pattern: /\b[Ll]abellé(e)?\s+Premium\b/iu, scope: "internal" },
  {
    id: "converted-from-official",
    pattern: /\bconverted from the official\b|\bconvertis depuis la liste officielle/i,
    scope: "internal",
  },
  {
    id: "mechanical-premium-plan",
    pattern: /,\s*Premium plan\b|\(\s*Premium plan\s*\)/i,
    scope: "internal",
  },
  {
    id: "offre-premium-emdash-fr",
    pattern: /—\s*offre Premium\b|,\s*—\s*offre Premium/i,
    scope: "internal",
  },
  {
    id: "not-listed-publicly-on",
    pattern:
      /\b(?:is|are|was|were)\s+not\s+listed\s+publicly\s+on\b|\bn['’]est pas listé publiquement sur\b|\bne sont pas listés publiquement\b/i,
    scope: "internal",
  },
  {
    id: "are-not-listed-en",
    pattern:
      /\bis\s+not\s+listed\s+here\b|\band\s+is\s+not\s+listed\b(?!\s+publicly)|\bnone\s+is\s+listed\b|\bwere\s+isolated\s+and\s+are\s+not\s+listed\b|\b(?:totals|rates|yearly|overage|per-action|per-call|extra)[^.!?]{0,100}\bare\s+not\s+listed\b(?!\s+publicly)|\bwas\s+not\s+published[^.!?]{0,120}\b(?:is|are)\s+not\s+listed\b(?!\s+publicly)/i,
    scope: "internal",
  },
  {
    id: "isole-editorial-fr",
    pattern:
      /(?:n['’]|n)['’]?a\s+pas\s+été\s+isolé|(?:n['’]|n)['’]?ont\s+pas\s+été\s+isolé|pas\s+été\s+isolé(?:e)?\s+comme|n['’]?a\s+pas\s+été\s+isolée|montant[^.]{0,80}isolé/i,
    scope: "internal",
  },
  {
    id: "ne-sont-pas-listes-fr",
    pattern: /(?:n['’]|n)['’]?est\s+pas\s+listé|ne\s+sont\s+pas\s+listés?|n['’]?est\s+pas\s+listée/i,
    scope: "internal",
  },
  { id: "d-ou-le-libelle-fr", pattern: /d['’]où le libellé/i, scope: "internal" },
  { id: "arrondirait-fr", pattern: /arrondirai(?:ent)?/i, scope: "internal" },
  { id: "hence-the-label-en", pattern: /\bhence the\b.{0,48}\blabel\b/i, scope: "internal" },
  { id: "would-round-en", pattern: /\bwould round\b/i, scope: "internal" },
]

const PRICING_NOTE_FIELDS = new Set([
  "pricing.note",
  "pricing.note_fr",
  "overlay.pricingNote_fr",
])

/** @deprecated use VISITOR_COPY_RULES */
export const VISITOR_COPY_BANNED = VISITOR_COPY_RULES

function loadAllowlist() {
  if (!fs.existsSync(allowlistPath)) return []
  const data = JSON.parse(fs.readFileSync(allowlistPath, "utf8"))
  return Array.isArray(data.allow) ? data.allow : []
}

function isAllowed(allowlist, toolId, field, ruleId) {
  return allowlist.some(
    (row) =>
      row.toolId === toolId &&
      row.field === field &&
      (row.pattern === ruleId || row.ruleId === ruleId),
  )
}

function rulesForField(field) {
  const internalOnly = PRICING_NOTE_FIELDS.has(field)
  return VISITOR_COPY_RULES.filter((rule) => {
    if (rule.scope === "currency") return !internalOnly
    return true
  })
}

function fieldEntries(tool, frOverlay) {
  const id = tool.id
  const overlay = frOverlay?.[id]
  const entries = []
  const push = (field, text) => {
    if (typeof text === "string" && text.trim()) entries.push({ field, text })
  }

  push("summary", tool.summary)
  push("description", tool.description)
  push("summary_fr", tool.summary_fr)
  push("description_fr", tool.description_fr)
  push("pricing.details", tool.pricing?.details)
  push("pricing.note", tool.pricing?.note)
  push("pricing.note_fr", tool.pricing?.note_fr)
  push("statusNote", tool.statusNote)
  push("dateAddedNote", tool.dateAddedNote)

  for (const [i, f] of (tool.features || []).entries()) push(`features[${i}]`, f)
  for (const [i, f] of (tool.features_fr || []).entries()) push(`features_fr[${i}]`, f)
  for (const [i, s] of (tool.howToUse || []).entries()) {
    push(`howToUse[${i}].title`, s?.title)
    push(`howToUse[${i}].description`, s?.description)
  }
  for (const [i, s] of (tool.howToUse_fr || []).entries()) {
    push(`howToUse_fr[${i}].title`, s?.title)
    push(`howToUse_fr[${i}].description`, s?.description)
  }

  if (overlay) {
    push("overlay.summary_fr", overlay.summary_fr)
    push("overlay.description_fr", overlay.description_fr)
    push("overlay.pricingNote_fr", overlay.pricingNote_fr)
    for (const [i, f] of (overlay.features_fr || []).entries()) push(`overlay.features_fr[${i}]`, f)
    for (const [i, s] of (overlay.howToUse_fr || []).entries()) {
      push(`overlay.howToUse_fr[${i}].title`, s?.title)
      push(`overlay.howToUse_fr[${i}].description`, s?.description)
    }
  }
  return entries
}

export function scanVisitorCopy({ rootDir = root } = {}) {
  const toolsPath = path.join(rootDir, "content/tools")
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const allowlist = loadAllowlist()
  const hits = []

  for (const file of fs.readdirSync(toolsPath).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsPath, file), "utf8"))
    const toolId = tool.id || file.replace(/\.json$/, "")
    for (const { field, text } of fieldEntries(tool, frOverlay)) {
      for (const rule of rulesForField(field)) {
        if (!rule.pattern.test(text)) continue
        if (isAllowed(allowlist, toolId, field, rule.id)) continue
        hits.push({
          toolId,
          field,
          rule: rule.id,
          excerpt: text.slice(0, 160).replace(/\s+/g, " "),
        })
        break
      }
    }
  }
  return hits
}

/** Self-tests for new rule patterns (--test-rules). */
export function runVisitorCopyRuleFixtures() {
  const fixtures = [
    { rule: "so-the-lot-label-is", pass: ["paid after trial"], fail: ["so the lot label is Premium"] },
    { rule: "converted-from-official", pass: ["Checkout is via Stripe."], fail: ["Amounts are converted from the official list"] },
    {
      rule: "not-listed-publicly-on",
      pass: ["Prices are not listed publicly."],
      fail: ["Team pricing is not listed publicly on the pricing page"],
    },
    { rule: "mechanical-premium-plan", pass: ["No permanent free tier."], fail: ["no lasting free plan, Premium plan."] },
    {
      rule: "offre-premium-emdash-fr",
      pass: ["Pas de formule gratuite permanente."],
      fail: ["Pas d’offre gratuite durable, — offre Premium."],
    },
    { rule: "during-check-review", pass: ["During setup, connect your repo."], fail: ["Limits during the check/review were not published"] },
    { rule: "lors-de-ce-controle", pass: ["Lors de la prise en main, connecte ton repo."], fail: ["Le prix n’était pas visible lors de ce contrôle"] },
    { rule: "lors-de-la-verification", pass: ["Lors de la prise en main, connecte ton repo."], fail: ["Le prix n’était pas visible lors de la vérification"] },
    { rule: "verifie-word-fr", pass: ["Service vérifié par l’éditeur."], fail: ["Les montants mensuels vérifiés sur la page tarifs"] },
    { rule: "during-this-review", pass: ["During setup, save your project."], fail: ["Pricing during this review was incomplete"] },
    { rule: "were-not-copied", pass: ["Plans vary by region."], fail: ["USD rates were not copied here"] },
    { rule: "returned-404-on", pass: ["The page may be unavailable."], fail: ["The pricing page returned 404 on 21 October 2026"] },
    { rule: "labellise-fr", pass: ["Offre Premium disponible."], fail: ["Plan labellisé Premium sur le site"] },
    { rule: "no-price-was-recorded", pass: ["No public pricing page."], fail: ["no price was recorded for the enterprise tier"] },
    { rule: "did-not-render", pass: ["The widget may stay blank until you sign in."], fail: ["the pricing table did not render in headless mode"] },
    { rule: "extraits-chiffres", pass: ["Extraits vidéo HD sans limite."], fail: ["Chiffres extraits de la page tarifs"] },
    { rule: "verified-on", pass: ["Available on iOS and Android."], fail: ["Amounts verified on the pricing page"] },
    { rule: "devise-origine", pass: ["Facturation en euros sur le site français."], fail: ["Affiché en devise d’origine USD"] },
    { rule: "isole-pricing-fr", pass: ["Sandbox isolé pour tester l’API."], fail: ["Le montant payant n’a pas été isolé sur la page"] },
    { rule: "converted-from-usd", pass: ["Checkout in euros."], fail: ["Price converted from USD at checkout"] },
    { rule: "ancien-catalogue-en", pass: ["Updated November 2026."], fail: ["Label from the previous catalog"] },
    { rule: "returns-404", pass: ["Route not found in the app."], fail: ["The pricing path returns 404"] },
    { rule: "review-description", pass: ["See the product page for details."], fail: ["product positioning changed, review description"] },
    { rule: "fetched-on", pass: ["Homepage lists a free trial."], fail: ["homepage, fetched on 22 October 2026"] },
    { rule: "non-verifiee-fr", pass: ["Tarif selon la région."], fail: ["la tarification est donc laissée non vérifiée"] },
    { rule: "controles-automatises", pass: ["Contrôles automatisés de conformité."], fail: ["lors des contrôles automatisés lors de cet examen"] },
    { rule: "internal-label", pass: ["internal tools for scheduling"], fail: ["internal notes label Premium"] },
    { rule: "labellisee-fr", pass: ["Étiquette personnalisée."], fail: ["offre labellisée Premium"] },
    { rule: "a-renvoye-404", pass: ["Lien obsolète."], fail: ["papercup.com a renvoyé 404 le 21 octobre"] },
    { rule: "pages-officielles-verifiees", pass: ["Consulte le site officiel."], fail: ["pages officielles vérifiées"] },
    { rule: "pas-ete-extrait", pass: ["Extraits audio HD."], fail: ["le montant n'a pas été extrait"] },
    {
      rule: "plan-details-manual-verification",
      pass: ["Paid plans on the pricing page."],
      fail: ["plan details need manual verification"],
    },
    {
      rule: "au-moment-de-la-verification",
      pass: ["Plus et Pro étaient annoncés comme à venir."],
      fail: ["au moment de la vérification"],
    },
    {
      rule: "sur-la-page-verifiee",
      pass: ["sur la page tarifs officielle"],
      fail: ["sur la page vérifiée"],
    },
    {
      rule: "in-this-pass",
      pass: ["See the official product page for details."],
      fail: ["could not be read in this pass"],
    },
    {
      rule: "not-readable-en",
      pass: ["Prices are not listed on the homepage."],
      fail: ["public list prices were not readable"],
    },
    {
      rule: "not-copied-en",
      pass: ["Examples on the pricing page, not plan prices."],
      fail: ["not copied as list prices"],
    },
    {
      rule: "labelle-fr-word",
      pass: ["formule Premium disponible."],
      fail: ["Labellé Premium : essai"],
    },
  ]
  const rulesById = Object.fromEntries(VISITOR_COPY_RULES.map((r) => [r.id, r]))
  const errors = []
  for (const { rule, pass, fail } of fixtures) {
    const pat = rulesById[rule]?.pattern
    if (!pat) {
      errors.push(`missing rule ${rule}`)
      continue
    }
    for (const text of pass) {
      if (pat.test(text)) errors.push(`${rule} false positive: ${text}`)
    }
    for (const text of fail) {
      if (!pat.test(text)) errors.push(`${rule} missed: ${text}`)
    }
  }
  return errors
}

export function scanLegalPageFlag() {
  if (!fs.existsSync(legalCopyPath)) return null
  const text = fs.readFileSync(legalCopyPath, "utf8")
  const flags = []
  if (/\bLegal\s+entity\b/i.test(text)) flags.push("legal-entity")
  if (/\bTBD\b/.test(text)) flags.push("todo-tbd")
  return flags.length ? { path: "lib/i18n/legal.ts", flags, note: "Legal copy not scanned for build failure" } : null
}

function main() {
  if (process.argv.includes("--test-rules")) {
    const errors = runVisitorCopyRuleFixtures()
    if (errors.length) {
      console.error(`Rule fixture failures (${errors.length}):\n${errors.join("\n")}`)
      process.exit(1)
    }
    console.log("Visitor-copy rule fixtures OK")
    return
  }
  const asJson = process.argv.includes("--json")
  const rootIdx = process.argv.indexOf("--root")
  const rootDir = rootIdx >= 0 ? path.resolve(process.argv[rootIdx + 1]) : root
  const hits = scanVisitorCopy({ rootDir })
  const legalFlag = scanLegalPageFlag()
  const pass = hits.length === 0
  if (asJson) {
    console.log(JSON.stringify({ pass, count: hits.length, hits, legalFlag, allowlist: allowlistPath }, null, 2))
    if (!pass) process.exit(1)
    return hits
  }
  if (hits.length) {
    for (const h of hits) {
      console.log(`${h.toolId}\t${h.field}\t${h.rule}\t${h.excerpt}`)
    }
    console.error(`\nVisitor-copy check failed: ${hits.length} hit(s).`)
    process.exit(1)
  }
  console.log("Visitor-copy check passed (0 hits).")
  if (legalFlag) {
    console.log(`Note (not failing build): ${JSON.stringify(legalFlag)}`)
  }
  return hits
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}