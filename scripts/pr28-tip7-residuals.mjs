#!/usr/bin/env node
/**
 * PR28 tip7 — FR pricing notes, howToUse_fr backfill, AskCodi FR strict.
 *
 *   node scripts/pr28-tip7-residuals.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const dryRun = process.argv.includes("--dry-run")

const PRICING_NOTE_FR = {
  "Paid plans; see the official site for current pricing.":
    "Offres payantes ; consultez le site officiel pour les tarifs actuels.",
  "Free tier available; see the official site for limits.":
    "Formule gratuite disponible ; consultez le site officiel pour les limites.",
  "Price label carried over from the previous catalog and not rechecked.":
    "Libellé tarifaire repris de l'ancien catalogue et non revérifié.",
}

const SKIP_STATUS = new Set(["sunset", "duplicate-of", "renamed", "inactive"])

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function loadTools() {
  return fs
    .readdirSync(toolsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8")))
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "le site officiel"
  }
}

function pickSummaryFr(tool, frEntry) {
  return (
    frEntry?.summary_fr ||
    tool.summary_fr ||
    tool.shortDescription_fr ||
    tool.summary ||
    tool.name
  )
    .replace(/\.$/, "")
    .trim()
}

function buildHowToUseFr(tool, frEntry) {
  const name = tool.name
  const url = tool.url
  const hook = pickSummaryFr(tool, frEntry)
  const hookSentence =
    hook.length > 140 ? `${hook.slice(0, 137).trim()}…` : hook
  const host = hostOf(url)
  return [
    {
      title: `Ouvre ${name}`,
      description: `Rends-toi sur ${host} pour créer un compte ou essayer l'outil si un accès sans inscription est proposé.`,
      links: [{ label: name, url }],
    },
    {
      title: "Configure ton espace",
      description:
        "Complète l'onboarding, les préférences ou la première intégration demandée par le produit.",
    },
    {
      title: "Lance un premier usage",
      description: hookSentence
        ? `Commence par ${hookSentence.charAt(0).toLowerCase()}${hookSentence.slice(1)}.`
        : `Utilise le flux principal de ${name} avec l'exemple ou le modèle proposé.`,
    },
    {
      title: "Contrôle le résultat",
      description:
        "Exporte, partage ou connecte ton environnement existant avant d'étendre l'usage en équipe.",
    },
  ]
}

function pricingNoteFrForTool(tool) {
  const note = (tool.pricing?.note || "").trim()
  if (PRICING_NOTE_FR[note]) return PRICING_NOTE_FR[note]
  if (/^See (official )?pricing at https?:\/\//i.test(note)) {
    const host = hostOf(note.replace(/^See (official )?pricing at /i, ""))
    return `Tarifs sur ${host} ; consulte la page officielle pour les offres en vigueur.`
  }
  if (/^See https?:\/\//i.test(note)) {
    const host = hostOf(note.replace(/^See /i, "").replace(/ for current plans\.?$/i, ""))
    return `Consulte ${host} pour les formules et limites actuelles.`
  }
  if (/^Checked on .*open[- ]source/i.test(note)) {
    return "Projet open source ; hébergement et tarifs dépendent de ton déploiement ou du fournisseur cloud."
  }
  if (note && /[a-z]/i.test(note) && !/[àâäéèêëïîôùûüç]/i.test(note) && note.length > 20) {
    return `Détails tarifaires sur ${hostOf(tool.url)} ; vérifie la page officielle avant un usage en production.`
  }
  return undefined
}

const ASKCodi_FR = {
  summary_fr:
    "Une agence d'IA qui fonctionne d'elle-même. Donnez un objectif à AskCodi : le périmètre revient par écrit, le travail arrive pour votre validation, et le compte reste ouvert après le lancement.",
  description_fr:
    "Une agence d'IA qui fonctionne d'elle-même. Donnez un objectif à AskCodi : le périmètre revient par écrit, le travail arrive pour votre validation, et le compte reste ouvert après le lancement. Suggestions de code : fournit des extraits à partir de la saisie. Réponses aux questions : répond aux requêtes liées au code. Prise en charge de plusieurs langages : gère divers langages de programmation. Intégration aux IDE : compatible avec des éditeurs populaires.",
  features_fr: [
    "Suggestions de code : fournit des extraits de code basés sur la saisie.",
    "Réponses aux questions : répond aux requêtes liées au codage.",
    "Prise en charge de plusieurs langages : gère différents langages de programmation.",
    "Intégration IDE : compatible avec les éditeurs de code populaires.",
  ],
  tags_fr: ["suggestions de code", "questions de codage"],
  pricingNote_fr: "Libellé tarifaire repris de l'ancien catalogue et non revérifié.",
  howToUse_fr: [
    {
      title: "Installe l'extension AskCodi",
      description: "Ajoute AskCodi à ton IDE ou navigateur depuis la boutique d'extensions.",
      links: [{ label: "AskCodi", url: "https://www.askcodi.com/" }],
    },
    {
      title: "Saisis une question ou une tâche",
      description: "Décris ton besoin de code ou pose une question technique précise.",
    },
    {
      title: "Reçois des suggestions",
      description: "Parcours les extraits ou réponses proposés et insère ce qui convient.",
    },
    {
      title: "Adapte et intègre",
      description: "Modifie le code suggéré puis valide-le dans ton dépôt ou ton projet.",
    },
  ],
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
const stats = { pricing: 0, howTo: 0, askcodi: 0, wiredImage: 0 }

for (const tool of loadTools()) {
  if (SKIP_STATUS.has(tool.status)) continue
  if (!fr[tool.id]) fr[tool.id] = {}
  const entry = fr[tool.id]

  const noteFr = pricingNoteFrForTool(tool)
  if (noteFr && entry.pricingNote_fr !== noteFr) {
    entry.pricingNote_fr = noteFr
    stats.pricing++
  }

  if (!entry.howToUse_fr?.length) {
    entry.howToUse_fr = buildHowToUseFr(tool, entry)
    stats.howTo++
  }

  if (tool.id === "askcodi") {
    Object.assign(entry, ASKCodi_FR)
    stats.askcodi = 1
  }
}

const shotDir = path.join(root, "public/screenshots")
const wireIds = [
  "chatgpt-atlas",
  "doubao",
  "freshdesk-freddy",
  "jenni-ai",
  "kaiber",
  "lavender",
  "liner",
  "opera-aria",
  "ramp",
  "sora",
  "spotter",
  "wan",
  "zerogpt",
]

for (const id of wireIds) {
  const file = path.join(toolsDir, `${id}.json`)
  if (!fs.existsSync(file)) continue
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  const webp = path.join(shotDir, `${id}.webp`)
  const target = `/screenshots/${id}.webp`
  if (fs.existsSync(webp) && tool.image !== target) {
    tool.image = target
    if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
    stats.wiredImage++
  }
}

writeJson(frPath, fr)

console.log(JSON.stringify({ dryRun, ...stats }, null, 2))
