#!/usr/bin/env node
/**
 * After rebuild-fr-tools-consolidation.mjs: pinned visitor merge from git, B3 parity, note fill.
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

execSync(`node scripts/merge-fr-tools-from-git.mjs`, { cwd: root, stdio: "inherit" })

const cur = JSON.parse(fs.readFileSync(frPath, "utf8"))

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
if (cur.agent) delete cur.agent.pricingNote_fr

const msDesigner = cur["microsoft-designer"] || (cur["microsoft-designer"] = {})
Object.assign(msDesigner, {
  description_fr:
    "Microsoft Designer est une application de conception graphique qui crée des publications pour les réseaux sociaux, des invitations, des cartes postales numériques et d'autres visuels. Tu pars d'une idée en langage simple et l'application génère des images et des mises en page que tu peux modifier ensuite. Consulte le site officiel pour les formules et les limites actuelles.",
})
if (Array.isArray(msDesigner.features_fr) && msDesigner.features_fr[3]) {
  msDesigner.features_fr[3] =
    "Consulte le site officiel pour les formules actuelles et les limites d'usage."
}
Object.assign(cur.kimi || (cur.kimi = {}), {
  description_fr:
    "Kimi est l'assistant IA de Moonshot AI, fondé sur son modèle Kimi K3. Au-delà du chat, il propose des fonctions d'agent pour les documents, les feuilles de calcul et les diapositives, la recherche approfondie, le déploiement de sites web et l'exécution multi-agents « Swarm », avec un mode Goal. Les formules payantes commencent par Plus à 14 € par mois en facturation annuelle (17 € au mois) jusqu'à Ultra ; consulte la page tarifs pour l'offre gratuite éventuelle.",
})
Object.assign(cur.kawung || (cur.kawung = {}), {
  pricingNote_fr:
    "Officiellement gratuit, avec des plafonds quotidiens et hebdomadaires publiés (par exemple 5 recherches rapides et 5 recherches approfondies par jour). Aucune offre payante publique n'est listée aujourd'hui.",
})
if (cur.agent) {
  cur.agent.howToUse_fr = [
    {
      title: "Inscris-toi sur Agent.ai",
      description: "Ce produit n'est plus disponible ; vois l'avis ci-dessus.",
    },
    {
      title: "Complète l'onboarding",
      description: "Suis la visite guidée ou connecte la première intégration demandée par le produit.",
    },
    {
      title: "Lance une première tâche",
      description: "Exécute le flux principal avec un modèle ou un exemple fourni.",
    },
    {
      title: "Vérifie les résultats",
      description: "Exporte, partage ou connecte ton outillage avant d'élargir l'usage.",
    },
  ]
}
if (cur.lovo?.howToUse_fr?.[0]) {
  cur.lovo.howToUse_fr[0].description = "Ce produit n'est plus disponible ; vois l'avis ci-dessus."
  delete cur.lovo.howToUse_fr[0].links
}
cur.buffer = {
  ...(cur.buffer || {}),
  description_fr:
    "Buffer planifie, programme et publie des posts sur les réseaux, avec bibliothèque d'idées, statistiques, engagement communautaire, collaboration et page link-in-bio. L'offre gratuite relie jusqu'à trois canaux. Essentials coûte 4,52 € par mois et par canal, avec essai gratuit de 14 jours.",
}
cur["browser-use"] = {
  ...(cur["browser-use"] || {}),
  description_fr:
    "Browser Use fournit une infrastructure pour des agents qui pilotent des sites. Les agents hébergés exécutent des tâches dans un navigateur ; les navigateurs cloud peuvent être pilotés par ton propre agent. Tarification à l'usage : navigateurs cloud à 0,054 € par heure, proxies résidentiels à 4,52 € par Go, et 0,90 € de crédit gratuit à l'inscription.",
}
if (cur["perplexity-comet"]) {
  delete cur["perplexity-comet"].pricingNote_fr
  Object.assign(cur["perplexity-comet"], {
    description_fr:
      "Comet est le navigateur Perplexity avec un assistant IA intégré. Il est téléchargeable gratuitement depuis octobre 2025 ; des formules payantes en option peuvent s'appliquer — consulte la page produit officielle pour les offres en vigueur.",
  })
}
Object.assign(cur["you-com"] || (cur["you-com"] = {}), {
  description_fr:
    "You.com se concentre désormais sur des API qui donnent aux applications IA l'accès au Web : recherche, extraction de contenu et réponses ancrées. L'API de recherche renvoie aussi des données en direct (bourses, crypto, météo). Le site annonce 4,52 € pour 1 000 appels de recherche. Documentation, benchmarks et contact commercial pour les gros volumes.",
  pricingNote_fr: "4,52 € pour 1 000 appels de recherche.",
})

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
    entry.pricingNote_fr = `Détails tarifaires sur ${host} : consulte la page officielle.`
  }
}

fs.writeFileSync(frPath, `${JSON.stringify(cur, null, 2)}\n`)
execSync(`node scripts/sync-pricing-note-fr-from-en.mjs`, { cwd: root, stdio: "inherit" })
const overrides = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/pricing-note-fr-overrides.json"), "utf8"),
)
const afterSync = JSON.parse(fs.readFileSync(frPath, "utf8"))
for (const [id, text] of Object.entries(overrides)) {
  afterSync[id] ??= {}
  afterSync[id].pricingNote_fr = text
}
fs.writeFileSync(frPath, `${JSON.stringify(afterSync, null, 2)}\n`)