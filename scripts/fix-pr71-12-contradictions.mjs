#!/usr/bin/env node
/**
 * Remove contradicting € amounts from visitor copy on 12 slugs (PR #71).
 * Does not touch pricing.note, pricing.details, or pricingNote_fr.
 *
 *   node scripts/fix-pr71-12-contradictions.mjs
 *   node scripts/fix-pr71-12-contradictions.mjs --report-only
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const reportPath = path.join(root, "data/imports/pr71-12-contradictions-diff.txt")

const SLUGS = [
  "chatbase",
  "trae",
  "ifttt",
  "greta-sh",
  "apollo-io",
  "akiflow",
  "gamma",
  "notta",
  "knowt",
  "superwhisper",
  "viggle",
  "retool",
]

/** slug → { tool: { path: value }, overlay: { path: value } } */
const PATCHES = {
  chatbase: {
    tool: {
      description:
        "Chatbase builds AI agents trained on a company's content that answer customer questions and take actions across chat, email and voice, with analytics and a helpdesk inbox. Paid plans include Hobby, Standard and Pro, each with a seven-day trial; no free plan was listed. The company states it serves more than 10,000 businesses.",
      "features[2]":
        "Paid tiers include Hobby, Standard and Pro, each with a seven-day trial; no free plan was listed.",
      "howToUse[0].description":
        "Go to Chatbase and start the seven-day trial on a paid tier.",
    },
    overlay: {
      description_fr:
        "Chatbase crée des agents IA formés sur le contenu d'une entreprise qui répondent aux questions des clients et prennent des mesures par chat, e-mail et voix, avec des analyses et une boîte de réception d'assistance. Des forfaits payants (Hobby, Standard, Pro) sont proposés, chacun avec un essai de sept jours ; aucun forfait gratuit n'était répertorié. L'entreprise déclare servir plus de 10 000 entreprises.",
      "features_fr[2]":
        "Des forfaits payants (Hobby, Standard, Pro) sont proposés, chacun avec un essai de sept jours ; aucun forfait gratuit n'était répertorié.",
    },
    toolFeaturesFr: {
      "features_fr[2]":
        "Des forfaits payants (Hobby, Standard, Pro) sont proposés, chacun avec un essai de sept jours ; aucun forfait gratuit n'était répertorié.",
    },
  },
  trae: {
    tool: {
      description:
        "Trae is a set of AI tools from ByteDance. TraeCode is a coding environment with an AI agent that writes and edits code, and TraeWork is a general work assistant available on desktop and the web. Lite, Pro and Pro+ paid tiers are listed on the plans page. A free version can be downloaded.",
      "features[3]": "The plans page lists Lite, Pro and Pro+ paid tiers.",
      "howToUse[3].description":
        "On the plans page, compare Lite, Pro and Pro+ tiers and choose the one that fits your usage.",
    },
    overlay: {
      description_fr:
        "Trae est un ensemble d'outils d'IA de ByteDance. TraeCode est un environnement de codage avec un agent IA qui écrit et modifie le code, et TraeWork est un assistant de travail général disponible sur ordinateur et sur le Web. Les forfaits Lite, Pro et Pro+ sont listés sur la page des tarifs. Une version gratuite peut être téléchargée.",
      "features_fr[3]": "La page des forfaits répertorie les forfaits Lite, Pro et Pro+.",
      "howToUse_fr[3].description":
        "Sur la page des forfaits, compare les offres Lite, Pro et Pro+ et choisis celle qui correspond à ton usage.",
    },
    toolFeaturesFr: {
      "features_fr[3]": "La page des forfaits répertorie les forfaits Lite, Pro et Pro+.",
    },
  },
  ifttt: {
    tool: {
      description:
        "IFTTT connects more than 1,000 services, including Google apps, webhooks, Discord, Slack and smart home devices, through applets that run an action when a trigger fires. It is aimed at individuals and small businesses rather than complex enterprise workflows. A free plan allows using published applets; paid tiers add multi-step and filter features.",
      "features[3]":
        "A free plan allows using published applets; paid tiers add multi-step and filter features.",
      "howToUse[3].description":
        "Upgrade to a paid tier when you need multi-step applets or filters. IFTTT is aimed at individuals and small businesses.",
    },
    overlay: {
      description_fr:
        "IFTTT connecte plus de 1 000 services, notamment les applications Google, les webhooks, Discord, Slack et les appareils domestiques intelligents, via des applets qui exécutent une action lorsqu'un déclencheur se déclenche. Il s'adresse aux particuliers et aux petites entreprises plutôt qu'aux flux de travail complexes des entreprises. Un forfait gratuit permet d'utiliser des applets publiées ; les forfaits payants ajoutent des fonctions multi-étapes et de filtrage.",
      "features_fr[3]":
        "Un forfait gratuit permet d'utiliser des applets publiées ; les forfaits payants ajoutent des fonctions multi-étapes et de filtrage.",
      "howToUse_fr[3].description":
        "Passe à un forfait payant lorsque tu as besoin d'applets multi-étapes ou de filtres.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "Un forfait gratuit permet d'utiliser des applets publiées ; les forfaits payants ajoutent des fonctions multi-étapes et de filtrage.",
    },
  },
  "greta-sh": {
    tool: {
      description:
        "Greta.sh builds a live website or full-stack app from a description, then its 'self-growing' mode researches what customers search for, publishes articles and pages aimed at Google and AI answer engines, and fixes SEO and speed issues. Free tier and paid plans (Starter, Pro, Business) are available.",
      description_fr:
        "Greta.sh crée un site ou une appli full stack à partir d'une description, puis son mode « self-growing » recherche ce que les clients cherchent, publie des pages pour Google et les moteurs de réponse IA, et corrige SEO et performance. Offre gratuite et formules payantes (Starter, Pro, Business).",
    },
    overlay: {
      description_fr:
        "Greta.sh crée un site ou une appli full stack à partir d'une description, puis son mode « self-growing » recherche ce que les clients cherchent, publie des pages pour Google et les moteurs de réponse IA, et corrige SEO et performance. Offre gratuite et formules payantes (Starter, Pro, Business).",
    },
  },
  "apollo-io": {
    tool: {
      description:
        "Apollo.io combines a database of about 240 million contacts and 30 million companies with prospecting, email sequences, deal management and AI agents that run in the background. It connects to other tools and offers a builder for custom go-to-market systems. Free and paid seat plans are available.",
      "features[3]":
        "The Free plan includes annual credits per seat; paid plans bill per seat on monthly or annual terms, with higher tiers for growing teams.",
      "howToUse[2].description":
        "Let the AI agents keep running in the background. Apollo connects to other tools, and Builder Studio is there for a custom go-to-market system. Free and paid seat plans are available.",
    },
    overlay: {
      description_fr:
        "Apollo.io combine une base de données d'environ 240 millions de contacts et 30 millions d'entreprises avec des agents de prospection, de séquences d'e-mails, de gestion des transactions et d'IA qui s'exécutent en arrière-plan. Il se connecte à d'autres outils et propose un générateur de systèmes de mise sur le marché personnalisés. Offre gratuite et forfaits payants par siège.",
      "features_fr[3]":
        "Le plan gratuit inclut des crédits annuels par siège ; les forfaits payants facturent par siège au mois ou à l'année, avec des niveaux supérieurs pour les équipes en croissance.",
      "howToUse_fr[2].description":
        "Laisse les agents IA tourner en arrière-plan. Apollo se connecte à d'autres outils et Builder Studio permet de monter un système go-to-market sur mesure. Offre gratuite et forfaits payants par siège.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "Le plan gratuit inclut des crédits annuels par siège ; les forfaits payants facturent par siège au mois ou à l'année, avec des niveaux supérieurs pour les équipes en croissance.",
    },
  },
  akiflow: {
    tool: {
      description:
        "Akiflow collects tasks from other apps into one inbox, lets users time-block them on their calendars, and uses an assistant to schedule meetings. A seven-day free trial is offered; Pro and higher paid plans are available.",
      "features[3]":
        "A seven-day free trial is offered; Pro and higher paid plans are available.",
      "howToUse[2].description":
        "Ask the assistant scheduling questions so it books slots. Upgrade to Pro or higher if you stay after the trial.",
    },
    overlay: {
      description_fr:
        "Akiflow collecte les tâches d'autres applications dans une seule boîte de réception, permet de les bloquer sur le calendrier et utilise un assistant pour planifier des réunions. Un essai gratuit de sept jours est proposé ; les forfaits Pro et supérieurs sont payants.",
      "features_fr[3]": "Un essai gratuit de sept jours est proposé ; les forfaits Pro et supérieurs sont payants.",
      "howToUse_fr[2].description":
        "Pose des questions de planification à l'assistant pour qu'il réserve des créneaux. Passe à Pro ou au-delà si tu continues après l'essai.",
    },
    toolFeaturesFr: {
      "features_fr[3]": "Un essai gratuit de sept jours est proposé ; les forfaits Pro et supérieurs sont payants.",
    },
  },
  gamma: {
    tool: {
      description:
        "Gamma generates presentations, documents, websites and social posts from a prompt, outline or imported file, with editable designs and online sharing. It is known for replacing slide design work with fluid web-native cards. Free tier and paid Plus and Pro plans are available.",
      "features[3]":
        "The Free plan includes starter credits and slide limits per prompt; Plus and Pro are paid tiers with higher quotas.",
    },
    overlay: {
      description_fr:
        "Gamma génère des présentations, des documents, des sites web et des publications pour les réseaux sociaux à partir d'une consigne, d'un plan ou d'un fichier importé, avec des mises en page modifiables et un partage en ligne. Il remplace le travail de mise en page de diapositives par des cartes web fluides. Offre gratuite et formules payantes Plus et Pro.",
      "features_fr[3]":
        "L'offre gratuite inclut des crédits de départ et des limites de diapositives par invite ; Plus et Pro sont des forfaits payants avec des quotas plus élevés.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "L'offre gratuite inclut des crédits de départ et des limites de diapositives par invite ; Plus et Pro sont des forfaits payants avec des quotas plus élevés.",
    },
  },
  notta: {
    tool: {
      description:
        "Notta records online meetings through a bot or on-device without a bot, transcribes uploaded audio, and turns speech into notes and summaries in several languages. A Free plan is available; Pro and Business are paid tiers.",
      "features[3]": "A Free plan is available; Pro and Business are paid tiers.",
      "howToUse[0].description":
        "Open Notta and start on the Free plan, or upgrade to Pro or Business when you need more capacity.",
    },
    overlay: {
      description_fr:
        "Notta enregistre les réunions en ligne via un robot ou sur un appareil sans robot, transcrit les fichiers audio importés et transforme la parole en notes et résumés dans plusieurs langues. Offre gratuite et forfaits payants Pro et Business.",
      "features_fr[3]": "Une offre gratuite est disponible ; Pro et Business sont des forfaits payants.",
      "howToUse_fr[0].description":
        "Ouvre Notta et commence avec l'offre gratuite, ou passe à Pro ou Business si tu as besoin de plus de capacité.",
    },
    toolFeaturesFr: {
      "features_fr[3]": "Une offre gratuite est disponible ; Pro et Business sont des forfaits payants.",
    },
  },
  knowt: {
    tool: {
      description:
        "Knowt offers AI study tools: flashcards with learn mode, lecture recording and summarisation into notes, and practice modes. Begin on Basic for free; Ultra and Max are paid tiers.",
      "features[3]":
        "The Basic plan is free with unlimited file creation; Ultra and Max are paid tiers.",
      "howToUse[3].description":
        "Begin on Basic, which costs nothing and allows unlimited file creation. Move to Ultra or Max when you need higher limits.",
    },
    overlay: {
      description_fr:
        "Knowt propose des outils d'étude en IA : cartes mémoire avec mode d'apprentissage, enregistrement de cours et résumés en notes, et modes d'entraînement. Commence sur Basic gratuitement ; Ultra et Max sont payants.",
      "features_fr[3]":
        "Le forfait Basic est gratuit avec une création de fichiers illimitée ; Ultra et Max sont des forfaits payants.",
      "howToUse_fr[3].description":
        "Commence sur Basic, sans frais et avec une création de fichiers illimitée. Passe à Ultra ou Max si tu as besoin de limites plus élevées.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "Le forfait Basic est gratuit avec une création de fichiers illimitée ; Ultra et Max sont des forfaits payants.",
    },
  },
  superwhisper: {
    tool: {
      description:
        "Superwhisper lets users dictate into any app with a keyboard shortcut and turns speech into formatted text locally or with cloud models. Pro features can be tried free for a limited word count; Pro and lifetime options are paid tiers.",
      "features[3]":
        "Pro features can be tried free for a limited word count; Pro and lifetime options are paid tiers.",
      "howToUse[2].description":
        "It works offline or with cloud models, supports more than 100 languages, and lets you bring your own API keys. Upgrade to Pro or a lifetime option when you need full access.",
    },
    overlay: {
      description_fr:
        "Superwhisper permet de dicter dans n'importe quelle application avec un raccourci clavier et transforme la parole en texte formaté en local ou via des modèles cloud. Les fonctions Pro peuvent être essayées gratuitement sur un volume limité ; Pro et l'option à vie sont payants.",
      "features_fr[3]":
        "Les fonctions Pro peuvent être essayées gratuitement sur un volume limité ; Pro et l'option à vie sont des forfaits payants.",
      "howToUse_fr[2].description":
        "Ça fonctionne hors ligne ou avec des modèles cloud, prend en charge plus de 100 langues et permet d'utiliser tes propres clés API. Passe à Pro ou à l'option à vie pour un accès complet.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "Les fonctions Pro peuvent être essayées gratuitement sur un volume limité ; Pro et l'option à vie sont des forfaits payants.",
    },
  },
  viggle: {
    tool: {
      description:
        "Viggle animates characters by transferring motion onto them in any scene. Products include Meme Maker for swapping characters into videos, PINOC for capturing motion and exporting rigged 3D animation in FBX or GLB, games and a developer API. The Free plan allows limited daily videos; paid Viggle plans and a pay-as-you-go API are available.",
      "features[3]":
        "The Free plan allows limited daily videos; paid Viggle plans and a pay-as-you-go API are available.",
      "howToUse[0].description":
        "Open Viggle. The Free plan allows limited daily videos; paid plans are listed on the pricing page.",
      "howToUse[3].description":
        "Remix games with your character, or call the developer API. API usage is pay-as-you-go.",
    },
    overlay: {
      description_fr:
        "Viggle anime les personnages en leur transférant du mouvement dans n'importe quelle scène. Les produits incluent Meme Maker, PINOC, des jeux et une API développeur. L'offre gratuite autorise un quota quotidien limité ; des forfaits payants et une API à l'usage sont disponibles.",
      "features_fr[3]":
        "L'offre gratuite autorise un quota quotidien limité ; les forfaits payants et l'API à l'usage sont disponibles.",
      "howToUse_fr[0].description":
        "Ouvre Viggle. L'offre gratuite autorise un quota quotidien limité ; les forfaits payants sont sur la page tarifs.",
      "howToUse_fr[3].description":
        "Remixe des jeux avec ton personnage ou appelle l'API développeur. L'API est facturée à l'usage.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "L'offre gratuite autorise un quota quotidien limité ; les forfaits payants et l'API à l'usage sont disponibles.",
    },
  },
  retool: {
    tool: {
      description:
        "Retool is used to build, deploy and manage internal software. Developers connect it to databases, APIs and LLMs, then assemble interfaces and workflows with components and code, and the company now also offers a harness for running and governing AI agents. Free tier and paid plans billed per builder, with separate pricing per internal user.",
      "features[3]":
        "Free tier and paid plans billed per builder, with separate pricing per internal user.",
      "howToUse[3].description":
        "Review builder pricing on the official pricing page. Free tier and paid plans bill per builder.",
    },
    overlay: {
      description_fr:
        "Retool sert à créer, déployer et gérer des logiciels internes. Les développeurs le connectent à des bases de données, des API et des LLM, puis assemblent interfaces et workflows avec des composants et du code ; l'éditeur propose aussi un harnais pour exécuter et gouverner des agents IA. Offre gratuite et formules payantes facturées par constructeur, avec une tarification distincte par utilisateur interne.",
      "features_fr[3]":
        "Offre gratuite et formules payantes facturées par constructeur, avec une tarification distincte par utilisateur interne.",
      "howToUse_fr[3].description":
        "Consulte les tarifs constructeur sur la page officielle. L'offre gratuite et les formules payantes facturent par constructeur.",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "Offre gratuite et formules payantes facturées par constructeur, avec une tarification distincte par utilisateur interne.",
    },
  },
}

function setByPath(obj, pathStr, value) {
  const parts = pathStr.replace(/\[(\d+)\]/g, ".$1").split(".")
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    const idx = /^\d+$/.test(p) ? Number(p) : p
    cur = cur[idx]
  }
  const last = parts[parts.length - 1]
  cur[/^\d+$/.test(last) ? Number(last) : last] = value
}

function getByPath(obj, pathStr) {
  const parts = pathStr.replace(/\[(\d+)\]/g, ".$1").split(".")
  let cur = obj
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[/^\d+$/.test(p) ? Number(p) : p]
  }
  return cur
}

function stable(obj) {
  return JSON.stringify(obj)
}

function main() {
  const reportOnly = process.argv.includes("--report-only")
  const lines = [`pr71-12-contradictions @ ${new Date().toISOString()}`, ""]
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

  for (const slug of SLUGS) {
    const patch = PATCHES[slug]
    if (!patch) continue
    const toolPath = path.join(toolsDir, `${slug}.json`)
    const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
    const beforeTool = stable(tool)
    fr[slug] ??= {}
    const beforeOverlay = stable(fr[slug])

    for (const [pathStr, value] of Object.entries(patch.tool || {})) {
      const prev = getByPath(tool, pathStr)
      if (prev !== value) lines.push(`${slug}\ttool.${pathStr}\t${JSON.stringify(prev)}\t→\t${JSON.stringify(value)}`)
      if (!reportOnly) setByPath(tool, pathStr, value)
    }
    for (const [pathStr, value] of Object.entries(patch.toolFeaturesFr || {})) {
      tool.features_fr ??= []
      const prev = getByPath(tool, pathStr)
      if (prev !== value) lines.push(`${slug}\ttool.${pathStr}\t${JSON.stringify(prev)}\t→\t${JSON.stringify(value)}`)
      if (!reportOnly) setByPath(tool, pathStr, value)
    }
    for (const [pathStr, value] of Object.entries(patch.overlay || {})) {
      const prev = getByPath(fr[slug], pathStr)
      if (prev !== value) lines.push(`${slug}\toverlay.${pathStr}\t${JSON.stringify(prev)}\t→\t${JSON.stringify(value)}`)
      if (!reportOnly) setByPath(fr[slug], pathStr, value)
    }

    if (!reportOnly) {
      if (stable(tool) !== beforeTool) {
        fs.writeFileSync(toolPath, `${JSON.stringify(tool, null, 2)}\n`)
      }
      if (stable(fr[slug]) !== beforeOverlay) {
        /* written below */
      }
    }
  }

  if (!reportOnly) fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
  fs.writeFileSync(reportPath, `${lines.join("\n")}\n`)
  console.log(`Wrote ${reportPath} (${lines.length - 2} change line(s))`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}