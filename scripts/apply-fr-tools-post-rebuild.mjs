#!/usr/bin/env node
/**
 * After rebuild-fr-tools-consolidation.mjs: visitor-safe overlays, B3 parity, note fill.
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

const pinnedSha = "3d83ba26"
const pinned = JSON.parse(
  execSync(`git show ${pinnedSha}:content/i18n/fr-tools.json`, {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  }),
)

const qaOverlayIds = new Set([
  "arcads",
  "dreamina",
  "genpage",
  "groq",
  "hume-ai",
  "kittl",
  "opera-ai",
  "profound",
  "reve",
  "smartlead",
  "speak",
  "tallbell",
  "turbolearn",
  "zernio",
  "continue-dev",
  "fal",
])

const cur = JSON.parse(fs.readFileSync(frPath, "utf8"))
for (const id of Object.keys(pinned)) {
  const qaish =
    qaOverlayIds.has(id) ||
    /lors de (ce|cette) (contrôle|vérification)|during this|were not copied|repris de l'ancien|vérifiés sur|n'était pas indiqué/i.test(
      JSON.stringify(pinned[id]),
    )
  if (!qaish) continue
  cur[id] = { ...(cur[id] || {}), ...pinned[id] }
}

Object.assign(cur.claude || {}, {
  description_fr:
    "Claude est l'assistant d'IA d'Anthropic pour l'écriture, l'analyse, la recherche et le code, avec Artifacts, les projets, les connecteurs et Claude in Chrome. Il est reconnu pour son raisonnement soigneux et les documents longs. Un plan gratuit est disponible sur le web, en application de bureau et sur mobile ; Pro coûte 15 €/mois en facturation annuelle (18 € au mois) et inclut Claude Code, tandis que Max commence à 90 €/mois.",
})
Object.assign(cur.gemini || {}, {
  description_fr:
    "Gemini est l'assistant et la famille de modèles IA de Google (dernière génération Gemini) pour le chat, la recherche approfondie, la création d'images et de vidéos et Gemini Live, intégré aux applications Google. L'application est gratuite avec un compte Google ; Google AI Plus coûte 4,99 €/mois, Pro 21,99 €/mois et Ultra à partir de 99,99 €/mois ; les développeurs accèdent aux modèles via Google AI Studio et l'API Gemini.",
})
Object.assign(cur.lindy || {}, {
  description_fr:
    "Lindy permet aux particuliers et aux équipes de créer des agents IA (« employés IA ») qui se connectent à leurs applications et aux connaissances de l'entreprise pour gérer les e-mails, la planification, les relances commerciales et d'autres tâches. Il se distingue par la création d'agents en no-code et par de nombreuses intégrations. Les nouveaux utilisateurs reçoivent 45 € de crédits gratuits, valables 7 jours, sans carte bancaire requise ; ensuite, le plan Team commence à 45,23 € par mois pour 5 000 crédits.",
})
cur.duolingo = {
  ...(cur.duolingo || {}),
  description_fr:
    "Duolingo est une application d'apprentissage des langues qui enseigne via des leçons courtes et ludiques sur mobile et sur le Web. Super Duolingo et Duolingo Max ajoutent des fonctionnalités d'IA et des conversations illimitées ; consulte duolingo.com pour les tarifs dans ton pays.",
  features_fr: [
    "Application d'apprentissage des langues gamifiée construite autour de courtes leçons.",
    "Duolingo est une application d'apprentissage des langues qui enseigne via des leçons courtes et ludiques sur mobile et sur le Web.",
    "Super Duolingo et Duolingo Max ajoutent de l'IA, des explications et des conversations illimitées.",
  ],
}
if (cur.myedit) delete cur.myedit.pricingNote_fr

const tools = {}
for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  tools[tool.id] = tool
}

const ancienRe = /ancien catalogue|non revérifié/i
for (const [id, entry] of Object.entries(cur)) {
  if (typeof entry?.pricingNote_fr === "string" && ancienRe.test(entry.pricingNote_fr)) {
    let host = "le site officiel"
    try {
      host = new URL(tools[id]?.url || "").hostname.replace(/^www\./, "")
    } catch {
      /* keep default */
    }
    entry.pricingNote_fr = `Détails tarifaires sur ${host} ; consulte la page officielle avant un usage en production.`
  }
}

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "le site officiel"
  }
}

let filled = 0
for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active" || tool.pricing?.uncertain === true) continue
  if (!tool.pricing?.note?.trim()) continue
  const entry = cur[tool.id]
  if (!entry) continue
  const hasFr = tool.pricing?.note_fr?.trim() || entry.pricingNote_fr?.trim()
  if (hasFr) continue
  entry.pricingNote_fr = `Détails tarifaires sur ${hostFromUrl(tool.url)} ; consulte la page officielle avant un usage en production.`
  filled++
}

fs.writeFileSync(frPath, `${JSON.stringify(cur, null, 2)}\n`)
console.log(JSON.stringify({ filled }, null, 2))