#!/usr/bin/env node
/**
 * PR28 tip8 — FR served copy quality: tags_fr, vouvoiement how-to/pricing, content fixes.
 *
 *   node scripts/pr28-tip8-fr-quality.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const tagsPath = path.join(root, "lib/i18n/tags.ts")
const fixesPath = path.join(root, "data/pr28-tip8-content-fixes.json")
const dryRun = process.argv.includes("--dry-run")

const SKIP_STATUS = new Set(["sunset", "duplicate-of", "renamed", "inactive"])
const fixes = JSON.parse(fs.readFileSync(fixesPath, "utf8"))

const TAGS_FR = Object.fromEntries(
  [...fs.readFileSync(tagsPath, "utf8").matchAll(/^\s+([A-Za-z0-9_-]+|"[^"]+"):\s+"([^"]*)",/gm)].map((m) => {
    const key = m[1].startsWith('"') ? JSON.parse(m[1]) : m[1]
    return [key, m[2]]
  }),
)

const EXTRA_TAG_FR = {
  coaching: "coaching",
  support: "support",
  finance: "finance",
  automation: "automatisation",
  subscription: "abonnement",
  "multi-model": "multi-modèles",
  creators: "créateurs",
  "music-video": "clip musical",
  youtube: "YouTube",
  analytics: "analytique",
  phone: "téléphone",
  cards: "cartes",
  expense: "dépenses",
  outbound: "prospection",
  montage: "montage",
}

const BAD_FEATURE =
  /Bureau frais|lavande\.ai|dobao\.com|recherche et la recherche|décrit les capacités, limites et inscription|inclut des fonctionnalités|est un produit d'IA pour|est un produit IA dans|IA pour la recherche et la recherche/i

function isBadFeatureLine(line) {
  return !line || BAD_FEATURE.test(line)
}

function sanitizeDescriptionFr(text) {
  if (!text) return text
  let out = text
  out = out.replace(/\blavande\.ai\b/gi, "lavender.ai")
  out = out.replace(/\bdobao\.com\b/gi, "doubao.com")
  out = out.replace(/est un produit IA dans [^,]+, hébergé sur [^.]+\./gi, "")
  out = out.replace(/— IA pour .+ sur [^.]+\./g, "")
  out = out.replace(/\s+/g, " ").trim()
  return out || text
}

function isBoilerplateSummary(text) {
  return !text || /est un produit IA dans|— IA pour|is an AI product for/i.test(text)
}

function pickFeaturesFr(tool, entry) {
  const lists = [tool.features_fr, entry.features_fr, tool.features]
  for (const list of lists) {
    if (!Array.isArray(list) || !list.length) continue
    const cleaned = list.map((l) => String(l).trim()).filter((l) => l && !isBadFeatureLine(l))
    if (cleaned.length >= 2) return cleaned.slice(0, 6)
  }
  let summary = (entry.summary_fr || tool.summary_fr || tool.summary || tool.name).replace(/\.$/, "").trim()
  summary = sanitizeDescriptionFr(summary)
  if (isBoilerplateSummary(summary)) {
    summary = (tool.summary || `${tool.name} on ${hostOf(tool.url)}.`).replace(/\.$/, "").trim()
  }
  const host = hostOf(tool.url)
  return [
    summary.endsWith(".") ? summary : `${summary}.`,
    `Consultez ${host} pour les capacités, limites et tarifs actuels.`,
  ]
}

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function translateTag(tag) {
  return TAGS_FR[tag] || EXTRA_TAG_FR[tag] || tag
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

function firstUseDescription(name, summaryFr) {
  const hook = summaryFr.replace(/\.$/, "").trim()
  if (!hook) {
    return `Utilisez le flux principal de ${name} avec l'exemple ou le modèle proposé.`
  }
  const firstWord = hook.split(/\s+/)[0] || ""
  const looksLikeAcronym = /^[A-Z0-9]{2,}$/.test(firstWord) || /^[A-Z]{2,}[a-z]?/.test(firstWord)
  if (looksLikeAcronym || hook.length < 48) {
    return `Configurez votre premier scénario avec ${name} : ${hook}.`
  }
  if (/^[a-zàâäéèêëïîôùûüç]/.test(hook)) {
    return `Commencez par ${hook}.`
  }
  return `Commencez par : ${hook.charAt(0).toLowerCase()}${hook.slice(1)}.`
}

function buildHowToUseFr(tool, frEntry) {
  const name = tool.name
  const url = tool.url
  const summaryFr = pickSummaryFr(tool, frEntry)
  const host = hostOf(url)
  return [
    {
      title: `Ouvrez ${name}`,
      description: `Rendez-vous sur ${host} pour créer un compte ou essayer l'outil si un accès sans inscription est proposé.`,
      links: [{ label: name, url }],
    },
    {
      title: "Configurez votre espace",
      description:
        "Complétez l'onboarding, les préférences ou la première intégration demandée par le produit.",
    },
    {
      title: "Lancez un premier usage",
      description: firstUseDescription(name, summaryFr),
    },
    {
      title: "Contrôlez le résultat",
      description:
        "Exportez, partagez ou connectez votre environnement existant avant d'étendre l'usage en équipe.",
    },
  ]
}

function vousify(text) {
  if (!text || typeof text !== "string") return text
  return text
    .replace(/\bconsulte\b/gi, "consultez")
    .replace(/\bvérifie\b/gi, "vérifiez")
    .replace(/\bRends-toi\b/g, "Rendez-vous")
    .replace(/\bComplète\b/g, "Complétez")
    .replace(/\bExporte\b/g, "Exportez")
    .replace(/\bPartage\b/g, "Partagez")
    .replace(/\bConnecte\b/g, "Connectez")
    .replace(/\bUtilise\b/g, "Utilisez")
    .replace(/\bCommence\b/g, "Commencez")
    .replace(/\bConfigure\b/g, "Configurez")
    .replace(/\bContrôle\b/g, "Contrôlez")
    .replace(/\bAjoute\b/g, "Ajoutez")
    .replace(/\bDécris\b/g, "Décrivez")
    .replace(/\bParcours\b/g, "Parcourez")
    .replace(/\bModifie\b/g, "Modifiez")
    .replace(/\bInscris-toi\b/g, "Inscrivez-vous")
    .replace(/\bCrée un compte\b/g, "Créez un compte")
    .replace(/\btu veux\b/gi, "vous avez besoin")
    .replace(/\bton\b/g, "votre")
    .replace(/\btes\b/g, "vos")
}

function pricingNoteFrForTool(tool) {
  const note = (tool.pricing?.note || "").trim()
  const map = {
    "Paid plans; see the official site for current pricing.":
      "Offres payantes ; consultez le site officiel pour les tarifs actuels.",
    "Free tier available; see the official site for limits.":
      "Formule gratuite disponible ; consultez le site officiel pour les limites.",
    "Price label carried over from the previous catalog and not rechecked.":
      "Libellé tarifaire repris de l'ancien catalogue et non revérifié.",
  }
  if (map[note]) return map[note]
  if (/^See (official )?pricing at https?:\/\//i.test(note)) {
    const host = hostOf(note.replace(/^See (official )?pricing at /i, ""))
    return `Tarifs sur ${host} ; consultez la page officielle pour les offres en vigueur.`
  }
  if (/^See https?:\/\//i.test(note)) {
    const host = hostOf(note.replace(/^See /i, "").replace(/ for current plans\.?$/i, ""))
    return `Consultez ${host} pour les formules et limites actuelles.`
  }
  if (note && /[a-z]/i.test(note) && !/[àâäéèêëïîôùûüç]/i.test(note) && note.length > 20) {
    return `Détails tarifaires sur ${hostOf(tool.url)} ; consultez la page officielle avant un usage en production.`
  }
  return undefined
}

function syncOverlay(fr, tool) {
  const entry = fr[tool.id] || {}
  if (tool.summary_fr) entry.summary_fr = tool.summary_fr
  if (tool.description_fr) entry.description_fr = tool.description_fr
  if (tool.features_fr?.length) entry.features_fr = tool.features_fr
  if (tool.tags_fr?.length) entry.tags_fr = tool.tags_fr
  fr[tool.id] = entry
}

function applyFixesToTool(tool, patch) {
  if (!patch) return 0
  let n = 0
  for (const key of [
    "summary",
    "description",
    "summary_fr",
    "description_fr",
    "features",
    "features_fr",
    "tags",
    "tags_fr",
  ]) {
    if (patch[key] !== undefined) {
      tool[key] = patch[key]
      n++
    }
  }
  return n
}

function featuresNeedFix(featuresFr) {
  if (!featuresFr?.length) return true
  return featuresFr.some((line) => isBadFeatureLine(line))
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
const stats = {
  toolPatches: 0,
  tagsFr: 0,
  howTo: 0,
  pricing: 0,
  featuresScrub: 0,
  descScrub: 0,
}

for (const [id, patch] of Object.entries(fixes)) {
  const file = path.join(toolsDir, `${id}.json`)
  if (!fs.existsSync(file)) continue
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  stats.toolPatches += applyFixesToTool(tool, patch)
  syncOverlay(fr, tool)
  if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
}

for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (SKIP_STATUS.has(tool.status)) continue
  if (!fr[tool.id]) fr[tool.id] = {}
  const entry = fr[tool.id]

  if (entry.summary_fr) {
    const cleaned = sanitizeDescriptionFr(entry.summary_fr)
    if (cleaned !== entry.summary_fr) {
      entry.summary_fr = cleaned
      stats.descScrub++
    }
    if (isBoilerplateSummary(entry.summary_fr) && tool.summary && !isBoilerplateSummary(tool.summary)) {
      entry.summary_fr = tool.summary.replace(/\.$/, "") + "."
      stats.descScrub++
    }
  }
  if (entry.description_fr) {
    const cleaned = sanitizeDescriptionFr(entry.description_fr)
    if (cleaned !== entry.description_fr) {
      entry.description_fr = cleaned
      stats.descScrub++
    }
  }
  if (tool.description_fr) {
    const cleaned = sanitizeDescriptionFr(tool.description_fr)
    if (cleaned !== tool.description_fr) {
      tool.description_fr = cleaned
      if (!dryRun) fs.writeFileSync(path.join(toolsDir, file), `${JSON.stringify(tool, null, 2)}\n`)
      stats.descScrub++
    }
  }

  const tags = tool.tags || []
  const explicit = entry.tags_fr || tool.tags_fr
  const tagsFr =
    explicit?.length === tags.length
      ? explicit.map((t) => translateTag(String(t)))
      : tags.map((t) => translateTag(t))
  if (tags.length && JSON.stringify(entry.tags_fr) !== JSON.stringify(tagsFr)) {
    entry.tags_fr = tagsFr
    stats.tagsFr++
  }

  if (featuresNeedFix(entry.features_fr) && tool.features_fr?.length && !featuresNeedFix(tool.features_fr)) {
    entry.features_fr = tool.features_fr
    stats.featuresScrub++
  }

  const nextFeatures = pickFeaturesFr(tool, entry)
  if (JSON.stringify(entry.features_fr) !== JSON.stringify(nextFeatures)) {
    entry.features_fr = nextFeatures
    stats.featuresScrub++
  }

  entry.howToUse_fr = buildHowToUseFr(tool, entry).map((step) => ({
    ...step,
    title: vousify(step.title),
    description: vousify(step.description),
  }))
  stats.howTo++

  const noteFr = pricingNoteFrForTool(tool)
  if (noteFr) {
    entry.pricingNote_fr = vousify(noteFr)
    stats.pricing++
  } else if (entry.pricingNote_fr) {
    entry.pricingNote_fr = vousify(entry.pricingNote_fr)
  }
}

writeJson(frPath, fr)
console.log(JSON.stringify({ dryRun, ...stats }, null, 2))
