#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

/** @type {{ pattern: RegExp, replace: string }[]} */
const GLOBAL_STRIPS = [
  {
    pattern:
      /The pricing page did not render(?: readable prices)? during this check, so no price was recorded\.?\s*/gi,
    replace: "See the vendor site for current plan pricing. ",
  },
  {
    pattern:
      /A pricing page exists but its content did not render during this check, so no plan or price was recorded\.?\s*/gi,
    replace: "Sign in on the vendor site to view plan options. ",
  },
  {
    pattern: /No pricing page could be read during this check\.?\s*/gi,
    replace: "Check the vendor site for subscription options. ",
  },
  {
    pattern: /paid plan prices did not load during this check\.?\s*/gi,
    replace: "Paid plans are listed on the Kittl site. ",
  },
  {
    pattern:
      /No public prices were shown on the pricing page during this check\.?\s*/gi,
    replace: "Contact Hume AI or see hume.ai for enterprise pricing. ",
  },
  {
    pattern:
      /the site was advertising an introductory paid offer during this check, and regular subscription prices were not recorded\.?\s*/gi,
    replace: "Introductory offers may apply; see dreamina.capcut.com for current plans. ",
  },
  {
    pattern: /, and during this check the site offered 50% off the first month\.?\s*/gi,
    replace: "; promotional discounts may apply on the pricing page. ",
  },
  {
    pattern: /Its site offered 50% off the first month during this check\.?\s*/gi,
    replace: "Promotional discounts may appear on the pricing page. ",
  },
  {
    pattern: /During this check the pricing page did not render, so no price was recorded\.?\s*/gi,
    replace: "",
  },
  {
    pattern:
      /, but its content did not render during this check, so no price was recorded\.?\s*/gi,
    replace: ". ",
  },
  {
    pattern:
      /La page de tarification ne s'est pas chargée lors de cette vérification, aucun prix n'a donc été enregistré\.?\s*/gi,
    replace: "Consulte le site officiel pour les tarifs à jour. ",
  },
  {
    pattern:
      /La page de tarification ne s'est pas affichée lors de cette vérification, aucun prix n'a donc été enregistré\.?\s*/gi,
    replace: "Consulte le site officiel pour les tarifs à jour. ",
  },
  {
    pattern:
      /Une page de tarification existe mais son contenu n'a pas été rendu lors de cette vérification, donc aucun forfait ni prix n'a été enregistré\.?\s*/gi,
    replace: "Connecte-toi sur le site pour voir les forfaits. ",
  },
  {
    pattern:
      /lors de cette vérification[^.!?]*[.!?]\s*/gi,
    replace: "",
  },
  {
    pattern:
      /lors de ce contrôle[^.!?]*[.!?]\s*/gi,
    replace: "",
  },
  {
    pattern:
      /La page de tarification n'a pas rendu les prix lisibles lors de cette vérification, donc aucun prix n'a été enregistré\.?\s*/gi,
    replace: "Les tarifs sont sur groq.com/pricing. ",
  },
  {
    pattern:
      /Aucun prix public n'a été affiché sur la page de tarification lors de cette vérification\.?\s*/gi,
    replace: "Les tarifs entreprise sont sur hume.ai. ",
  },
  {
    pattern:
      /les prix des forfaits payants ne se sont pas chargés lors de cette vérification\.?\s*/gi,
    replace: "Les forfaits payants sont sur kittl.com. ",
  },
  {
    pattern:
      /les prix des abonnements n'étaient pas indiqués sur les pages Web vérifiées\.?\s*/gi,
    replace: "Les tarifs d’abonnement sont sur speak.com. ",
  },
]

function walkStrings(value, fn) {
  if (typeof value === "string") return fn(value)
  if (Array.isArray(value)) return value.map((v) => walkStrings(v, fn))
  if (value && typeof value === "object") {
    for (const k of Object.keys(value)) value[k] = walkStrings(value[k], fn)
  }
  return value
}

function stripAll(text) {
  let out = text
  for (const { pattern, replace } of GLOBAL_STRIPS) {
    out = out.replace(pattern, replace)
  }
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim()
}

const toolPatches = {
  shortwave: {
    description:
      "Shortwave is an email client built for Gmail with an AI agent that organises the inbox, drafts replies, searches history and schedules meetings from prompts. It runs on the web, iOS, Android, Mac and Windows. Plans include a 14-day free trial: Business costs $30 per seat per month, Premier $45 and Max $120.",
  },
  copysmith: {
    howToUse2:
      "Use Talk to us on the page if you need a conversation. See copysmith.ai for product and plan details.",
  },
  myedit: {
    pricingNote:
      "Official site is myedit.online (AI editor for image, video and audio). Free tier with daily credits; paid plans from about 5 USD/month on annual billing.",
  },
  pycaret: {
    pricingNote:
      "Open-source AutoML library for Python; install from PyPI and see the GitHub repository for documentation (no commercial list price).",
  },
}

for (const file of fs.readdirSync(path.join(root, "content/tools"))) {
  if (!file.endsWith(".json")) continue
  const fp = path.join(root, "content/tools", file)
  const tool = JSON.parse(fs.readFileSync(fp, "utf8"))
  walkStrings(tool, stripAll)
  const p = toolPatches[tool.id]
  if (p?.description) tool.description = p.description
  if (p?.howToUse2 && tool.howToUse?.[2]) tool.howToUse[2].description = p.howToUse2
  if (p?.pricingNote) tool.pricing.note = p.pricingNote
  fs.writeFileSync(fp, `${JSON.stringify(tool, null, 2)}\n`)
}

const frPath = path.join(root, "content/i18n/fr-tools.json")
const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
for (const overlay of Object.values(fr)) walkStrings(overlay, stripAll)

const arcadsFr =
  "Arcads génère des publicités vidéo et images style UGC pour les équipes marketing, avec acteurs IA et modèles vidéo tiers (par ex. Seedance). Le site propose démos et inscription. Les tarifs sont détaillés dans le centre d’aide ; une offre limitée peut donner sept jours de générations illimitées aux abonnés."
if (fr.arcads) {
  fr.arcads.description_fr = arcadsFr
  if (fr.arcads.features_fr?.[3])
    fr.arcads.features_fr[3] =
      "Tarifs et essai sont décrits dans le centre d’aide Arcads plutôt que sur une grille publique."
}

const speakFr =
  "Speak t’apprend les langues par la conversation orale avec un tuteur IA, sur un programme d’experts personnalisé par l’IA. Tu reçois un retour sur chaque réponse et tu peux répéter les dialogues à volonté ; le coréen et le japonais font partie des langues proposées. Essai gratuit de sept jours ; les tarifs d’abonnement sont sur speak.com."
if (fr.speak) {
  fr.speak.description_fr = speakFr
  if (fr.speak.features_fr?.[3])
    fr.speak.features_fr[3] = "Essai gratuit de sept jours ; consulte speak.com pour les tarifs d’abonnement."
}

if (fr["z-ai-glm"]?.description_fr) {
  fr["z-ai-glm"].description_fr = fr["z-ai-glm"].description_fr.replace(
    /sur les pages[^.!?]*vérifiées[^.!?]*[.!?]\s*/i,
    "sur le site officiel z.ai. ",
  )
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log("patch-visitor-copy-residual done")