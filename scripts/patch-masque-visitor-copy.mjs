#!/usr/bin/env node
/** Hand-written masqué visitor copy (no amounts). */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const PATCH = {
  codepal: {
    tool: {
      description:
        "CodePal presents itself as an AI app builder, with a CodePal Agent, in-app code edits and CodePal Cloud project hosting. Usage runs on credits. The free Starter plan includes daily credits, project limits and limited Agent use; Standard and Pro are paid tiers with monthly credits, rollover and private projects; Enterprise is custom.",
      "howToUse[2].description":
        "Host the project on CodePal Cloud, publish a live URL and sync with GitHub. Usage runs on credits; paid Standard and Pro tiers add monthly credits, rollover and private projects. Enterprise is custom.",
    },
    overlay: {
      description_fr:
        "CodePal se présente comme un outil de création d'applications par IA, avec un CodePal Agent, des modifications de code dans l'application et l'hébergement CodePal Cloud. L'usage repose sur des crédits. Le plan Starter gratuit inclut des crédits quotidiens, des limites de projets et un Agent limité ; Standard et Pro sont des forfaits payants avec crédits mensuels, report et projets privés ; Enterprise est sur mesure.",
      "howToUse_fr[1].title": "Crée un compte et règle les crédits",
      "howToUse_fr[2].title": "Héberge sur CodePal Cloud",
      "howToUse_fr[2].description":
        "Héberge le projet sur CodePal Cloud, publie une URL en ligne et synchronise avec GitHub. L'usage consomme des crédits ; les forfaits payants Standard et Pro ajoutent des crédits mensuels, le report et des projets privés. Enterprise est sur mesure.",
      "howToUse_fr[3].title": "Publie et synchronise avec GitHub",
    },
  },
  graphite: {
    tool: {
      description:
        "Graphite is a code review platform for teams on GitHub. It supports stacked pull requests through its CLI and web app, provides AI reviews, a merge queue and insights. Cursor Cloud Agents are integrated so users can create and ship changes from a pull request. A Hobby plan is free for personal repositories; Starter and Team are paid tiers billed annually.",
      "howToUse[3].description":
        "A Hobby plan is free for personal repositories. Starter and Team are paid tiers with annual billing options.",
    },
    overlay: {
      description_fr:
        "Graphite est une plateforme de révision de code pour les équipes sur GitHub. Elle prend en charge les pull requests empilées via sa CLI et son application web, fournit des revues IA, une file d'attente de fusion et des analyses. Les agents Cursor Cloud sont intégrés pour créer et livrer des changements depuis une pull request. Hobby est gratuit pour les dépôts personnels ; Starter et Team sont des forfaits payants avec facturation annuelle.",
      "howToUse_fr[1].title": "Empile tes pull requests",
      "howToUse_fr[2].title": "Livre depuis la PR avec Cursor Cloud",
      "howToUse_fr[2].description":
        "Les agents Cursor Cloud sont intégrés : tu peux créer et livrer des changements depuis une pull request sans quitter la PR.",
      "howToUse_fr[3].title": "Choisis Hobby, Starter ou Team",
      "howToUse_fr[3].description":
        "Hobby est gratuit pour les dépôts personnels. Starter et Team sont des forfaits payants avec facturation annuelle.",
    },
  },
  soundful: {
    tool: {
      description:
        "Soundful generates original music from preset styles using models trained with producers, and sells licences for creators and brands, including custom brand music. The Free plan allows unlimited track generations, free styles and a monthly MP3 download under a personal licence. Plus and higher tiers add downloads and broader licences.",
      "howToUse[2].description":
        "Download the MP3 your personal licence allows each month. Soundful sells licences for creators and brands, including custom brand music; Plus and higher tiers add downloads.",
      "features[3]":
        "The Plus plan and higher tiers are paid and billed annually, adding more downloads and licence options.",
    },
    overlay: {
      description_fr:
        "Soundful génère de la musique originale à partir de styles prédéfinis avec des modèles entraînés avec des producteurs, et vend des licences pour créateurs et marques, y compris de la musique de marque personnalisée. Le forfait Free permet des générations illimitées, des styles gratuits et un téléchargement MP3 mensuel en licence personnelle. Plus et les niveaux supérieurs ajoutent des téléchargements et des licences.",
      "features_fr[3]":
        "Le forfait Plus et les niveaux supérieurs sont payants, avec facturation annuelle, et ajoutent des téléchargements et des options de licence.",
      "howToUse_fr[1].title": "Choisis un style et génère une piste",
      "howToUse_fr[2].title": "Télécharge selon ta licence",
      "howToUse_fr[2].description":
        "Télécharge le MP3 autorisé par ta licence personnelle ce mois-ci. Soundful vend des licences pour créateurs et marques ; Plus et les niveaux supérieurs ajoutent des téléchargements.",
      "howToUse_fr[3].title": "Compare Free et Plus",
    },
    toolFeaturesFr: {
      "features_fr[3]":
        "Le forfait Plus et les niveaux supérieurs sont payants, avec facturation annuelle, et ajoutent des téléchargements et des options de licence.",
    },
  },
  hedra: {
    tool: {
      "features_fr[3]":
        "Un palier gratuit figure sur la page tarifs ; les forfaits payants ajoutent des crédits, une meilleure résolution et un usage commercial.",
    },
    overlay: {
      "howToUse_fr[1].title": "Importe ton clip ou ta photo",
      "howToUse_fr[2].title": "Affine ou déploie un modèle Hedra",
      "howToUse_fr[2].description":
        "Tu peux affiner un modèle pris en charge avec tes données et les recettes d'entraînement Hedra, puis le déployer sur la même stack, ou créer un bac à sable GPU isolé avec le SDK Hedra.",
      "howToUse_fr[3].title": "Exporte la vidéo générée",
    },
  },
  higgsfield: {
    tool: {
      description:
        "Higgsfield lets creators generate images, videos and voice from prompts or references, then edit, upscale and automate workflows with an AI agent on web and mobile. It aggregates many third-party models with cinematic presets. A free plan offers limited models with a watermark; paid plans start with Starter, with prices changing frequently.",
    },
    overlay: {
      description_fr:
        "Higgsfield permet aux créateurs de générer images, vidéos et voix à partir de prompts ou de références, puis de modifier, d'augmenter la résolution et d'automatiser des flux avec un agent IA sur le web et le mobile. Il regroupe de nombreux modèles tiers avec des préréglages cinématographiques. Une offre gratuite propose des modèles limités avec filigrane ; les forfaits payants commencent par Starter, et les prix évoluent souvent.",
      "howToUse_fr[1].title": "Choisis un preset cinématographique",
      "howToUse_fr[2].title": "Enchaîne image, vidéo et voix",
      "howToUse_fr[2].description":
        "Genjutsu sur la page est décrit comme un flux : une importation, puis de nouvelles versions, y compris le transfert de mouvement.",
      "howToUse_fr[3].title": "Passe au forfait Starter si besoin",
    },
  },
  "heidi-health": {
    overlay: {
      "howToUse_fr[1].title": "Branche ton flux de consultation",
      "howToUse_fr[2].title": "Laisse Heidi rédiger notes et lettres",
      "howToUse_fr[2].description":
        "Heidi Health écoute les consultations et rédige notes, lettres et documents ; les forfaits payants ajoutent des fonctions supplémentaires.",
      "howToUse_fr[3].title": "Relis avant d'envoyer au dossier",
    },
  },
}

function setByPath(obj, pathStr, value) {
  const parts = pathStr.replace(/\[(\d+)\]/g, ".$1").split(".")
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    cur = cur[/^\d+$/.test(p) ? Number(p) : p]
  }
  const last = parts[parts.length - 1]
  cur[/^\d+$/.test(last) ? Number(last) : last] = value
}

function main() {
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  for (const [slug, patch] of Object.entries(PATCH)) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, `${slug}.json`), "utf8"))
    fr[slug] ??= {}
    for (const [p, v] of Object.entries(patch.tool || {})) setByPath(tool, p, v)
    for (const [p, v] of Object.entries(patch.toolFeaturesFr || {})) setByPath(tool, p, v)
    for (const [p, v] of Object.entries(patch.overlay || {})) setByPath(fr[slug], p, v)
    fs.writeFileSync(path.join(toolsDir, `${slug}.json`), `${JSON.stringify(tool, null, 2)}\n`)
  }
  fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
  console.log("Masqué visitor copy patched:", Object.keys(PATCH).join(", "))
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}