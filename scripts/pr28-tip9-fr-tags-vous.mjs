#!/usr/bin/env node
/**
 * PR28 tip9 — hyphen tag FR labels + vouvoiement sweep + bonus product copy.
 *
 *   node scripts/pr28-tip9-fr-tags-vous.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { translateTag, translateTags } from "../lib/i18n/tags.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const dryRun = process.argv.includes("--dry-run")
const SKIP = new Set(["sunset", "duplicate-of", "renamed", "inactive"])
const hy = /^[a-z0-9]+(-[a-z0-9]+)+$/

const TAG_NITS = {
  grammarly: ["grammaire", "relecture", "correction"],
}

const PRODUCT_PATCHES = {
  askcodi: {
    howToUse_fr: [
      {
        title: "Installez l'extension AskCodi",
        description: "Ajoutez AskCodi à votre IDE ou navigateur depuis la boutique d'extensions.",
        links: [{ label: "AskCodi", url: "https://www.askcodi.com/" }],
      },
      {
        title: "Saisissez une question ou une tâche",
        description: "Décrivez votre besoin de code ou posez une question technique précise.",
      },
      {
        title: "Recevez des suggestions",
        description: "Parcourez les extraits ou réponses proposés et insérez ce qui convient.",
      },
      {
        title: "Adaptez et intégrez",
        description: "Modifiez le code suggéré puis validez-le dans votre dépôt ou projet.",
      },
    ],
  },
  sora: {
    features_fr: [
      "Génération vidéo à partir de prompts textuels.",
      "Remix et extension de clips dans l'application Sora.",
      "Partage des exports selon l'éligibilité de votre plan ChatGPT.",
      "Disponibilité selon la région et le plan ; consultez l'aide OpenAI.",
    ],
    description_fr:
      "Sora est le produit de génération vidéo d'OpenAI sur sora.com. Les utilisateurs ChatGPT éligibles peuvent créer, remixer et partager de courtes vidéos à partir de prompts. La disponibilité et les limites dépendent de votre plan et de votre région ; consultez le centre d'aide OpenAI.",
    tags_fr: ["vidéo", "abandonné"],
  },
  doubao: {
    features_fr: [
      "Chat multimodal avec modèles Doubao (ByteDance) pour le texte et la création.",
      "Saisie texte, image ou voix selon les fonctionnalités disponibles sur doubao.com.",
      "Historique de conversations et projets dans l'interface Doubao.",
      "Quotas, langues et modèles selon la région ; consultez le site officiel.",
    ],
  },
  "chatgpt-atlas": {
    features_fr: [
      "Navigateur axé sur l'IA avec ChatGPT intégré pour la recherche et les onglets.",
      "Assistance contextuelle sur la page web que vous consultez.",
      "Synthèse et questions sur le contenu ouvert sans changer d'application.",
      "Nécessite un abonnement ChatGPT éligible là où Atlas est déployé.",
    ],
  },
  zerogpt: {
    tags_fr: ["détection", "gratuit", "texte", "éducation"],
  },
}

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function vousifyText(text) {
  if (!text || typeof text !== "string") return text
  return text
    .replace(/\bton plan\b/gi, "votre plan")
    .replace(/\bta région\b/gi, "votre région")
    .replace(/\bconsulte\b/gi, "consultez")
    .replace(/\bInscris-toi\b/g, "Inscrivez-vous")
    .replace(/\bCrée un compte\b/g, "Créez un compte")
    .replace(/\bInstalle l'/g, "Installez l'")
    .replace(/\bInstalle /g, "Installez ")
    .replace(/\bSaisis\b/g, "Saisissez")
    .replace(/\bReçois\b/g, "Recevez")
    .replace(/\bAdapte\b/g, "Adaptez")
    .replace(/\bAjoute\b/g, "Ajoutez")
    .replace(/\bDécris\b/g, "Décrivez")
    .replace(/\bParcours\b/g, "Parcourez")
    .replace(/\bModifie\b/g, "Modifiez")
    .replace(/\bOuvre\b/g, "Ouvrez")
    .replace(/\bConfigure\b/g, "Configurez")
    .replace(/\bContrôle\b/g, "Contrôlez")
    .replace(/\bTermine\b/g, "Terminez")
    .replace(/\bLance\b/g, "Lancez")
    .replace(/\bVérifie\b/g, "Vérifiez")
    .replace(/\bExporte\b/g, "Exportez")
    .replace(/\bPartage\b/g, "Partagez")
    .replace(/\bConnecte\b/g, "Connectez")
    .replace(/\bRends-toi\b/g, "Rendez-vous")
    .replace(/\bComplète\b/g, "Complétez")
    .replace(/\bUtilise\b/g, "Utilisez")
    .replace(/\bCommence\b/g, "Commencez")
    .replace(/\btu veux\b/gi, "vous avez besoin")
    .replace(/\bton\b/g, "votre")
    .replace(/\bta\b/g, "votre")
    .replace(/\btes\b/g, "vos")
    .replace(/\btoi\b/g, "vous")
}

function vousifySteps(steps) {
  if (!Array.isArray(steps)) return steps
  return steps.map((step) => ({
    ...step,
    title: vousifyText(step.title),
    description: vousifyText(step.description),
  }))
}

function vousifyFeatures(lines) {
  if (!Array.isArray(lines)) return lines
  return lines.map((line) => vousifyText(line))
}

function countHyphenLabels(tags) {
  return (tags || []).filter((t) => hy.test(String(t).trim())).length
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
const stats = { tagsFr: 0, toolJson: 0, vousHowTo: 0, vousFeatures: 0, hyphenBefore: 0, hyphenAfter: 0 }

for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const toolPath = path.join(toolsDir, file)
  const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
  if (SKIP.has(tool.status)) continue

  const patch = PRODUCT_PATCHES[tool.id]
  if (patch) {
    Object.assign(tool, patch)
    stats.toolJson++
  }
  if (TAG_NITS[tool.id]) {
    tool.tags_fr = TAG_NITS[tool.id]
  }

  if (tool.howToUse_fr) {
    tool.howToUse_fr = vousifySteps(tool.howToUse_fr)
    stats.vousHowTo++
  }
  if (tool.features_fr) {
    tool.features_fr = vousifyFeatures(tool.features_fr)
    stats.vousFeatures++
  }
  if (tool.description_fr) tool.description_fr = vousifyText(tool.description_fr)

  if (!dryRun) fs.writeFileSync(toolPath, `${JSON.stringify(tool, null, 2)}\n`)

  if (!fr[tool.id]) fr[tool.id] = {}
  const entry = fr[tool.id]

  if (patch) {
    if (patch.howToUse_fr) entry.howToUse_fr = patch.howToUse_fr
    if (patch.features_fr) entry.features_fr = patch.features_fr
    if (patch.description_fr) entry.description_fr = patch.description_fr
    if (patch.tags_fr) entry.tags_fr = patch.tags_fr
  }

  const tags = tool.tags || []
  const nextTagsFr = translateTags(tags, tool.tags_fr || entry.tags_fr)
  stats.hyphenBefore += countHyphenLabels(entry.tags_fr || tool.tags_fr || tags)
  stats.hyphenAfter += countHyphenLabels(nextTagsFr)
  if (JSON.stringify(entry.tags_fr) !== JSON.stringify(nextTagsFr)) {
    entry.tags_fr = nextTagsFr
    stats.tagsFr++
  }

  if (entry.howToUse_fr) {
    entry.howToUse_fr = vousifySteps(entry.howToUse_fr)
  } else if (tool.howToUse_fr) {
    entry.howToUse_fr = tool.howToUse_fr
  }
  if (entry.features_fr) entry.features_fr = vousifyFeatures(entry.features_fr)
  if (entry.description_fr) entry.description_fr = vousifyText(entry.description_fr)
}

writeJson(frPath, fr)

let tuTitles = 0
let hyphenPayload = 0
for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (SKIP.has(tool.status)) continue
  const entry = fr[tool.id] || {}
  const tags = translateTags(tool.tags, entry.tags_fr || tool.tags_fr)
  hyphenPayload += countHyphenLabels(tags)
  const steps = entry.howToUse_fr || tool.howToUse_fr || []
  for (const s of steps) {
    if (/\b(tu|ton|ta|tes|toi)\b/i.test(`${s.title} ${s.description}`)) tuTitles++
    if (/^(Installe|Saisis|Reçois|Adapte|Inscris|Crée|Termine|Lance|Vérifie)\b/.test(s.title || "")) tuTitles++
  }
}

console.log(JSON.stringify({ dryRun, ...stats, hyphenPayload, tuTitles }, null, 2))
