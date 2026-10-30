#!/usr/bin/env node
/**
 * Nat product decision (Oct 2026): tutoiement everywhere in FR served copy.
 * Reverses PR28 vouvoiement sweep on tools + fr-tools overlay.
 *
 *   node scripts/fr-tutoiement-sweep.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const automationsFr = path.join(root, "content/automations/fr-copy.json")
const dryRun = process.argv.includes("--dry-run")
const SKIP = new Set(["sunset", "duplicate-of", "renamed", "inactive"])

const TON_TONALITE = "\uE000TON_TONALITE\uE001"

function protectTonaliteTon(text) {
  return text
    .replace(/\ble ton\b/gi, `le ${TON_TONALITE}`)
    .replace(/\bdu ton\b/gi, `du ${TON_TONALITE}`)
    .replace(/\bau ton\b/gi, `au ${TON_TONALITE}`)
    .replace(/\bPersonnalisation du ton\b/gi, `Personnalisation du ${TON_TONALITE}`)
}

function restoreTonaliteTon(text) {
  return text.replaceAll(TON_TONALITE, "ton")
}

const PHRASE_REPLACEMENTS = [
  [/\bvotre plan\b/gi, "ton plan"],
  [/\bvotre région\b/gi, "ta région"],
  [/\bvous avez besoin\b/gi, "tu as besoin"],
  [/\bil vous faut\b/gi, "il te faut"],
  [/\bqu'il vous faut\b/gi, "qu'il te faut"],
  [/\bqui vous convient\b/gi, "qui te convient"],
  [/\bqui vous ressemble\b/gi, "qui te ressemble"],
  [/\bpour vous\b/gi, "pour toi"],
  [/\bNous vous aidons\b/g, "On t'aide"],
  [/\bNous vous écrirons\b/g, "On t'écrira"],
  [/\bRendez-vous visible\b/g, "Rends-toi visible"],
  [/\bRendez-vous sur\b/g, "Rends-toi sur"],
  [/\bInscrivez-vous\b/g, "Inscris-toi"],
  [/\bCréez un compte\b/g, "Crée un compte"],
  [/\bvos données personnelles\b/gi, "tes données personnelles"],
  [/\bvos données\b/gi, "tes données"],
  [/\bvos droits\b/gi, "tes droits"],
  [/\bvos informations\b/gi, "tes informations"],
  [/\bvotre vie privée\b/gi, "ta vie privée"],
  [/\bvotre navigation\b/gi, "ta navigation"],
  [/\bvotre proposition\b/gi, "ta proposition"],
  [/\bvotre recherche\b/gi, "ta recherche"],
  [/\bvotre nom\b/gi, "ton nom"],
  [/\bvotre e-mail\b/gi, "ton e-mail"],
  [/\bvotre lien\b/gi, "ton lien"],
  [/\bvotre espace\b/gi, "ton espace"],
  [/\bvotre machine\b/gi, "ta machine"],
  [/\bvotre façon\b/gi, "ta façon"],
  [/\bvotre équipe\b/gi, "ton équipe"],
  [/\bvotre voix\b/gi, "ta voix"],
  [/\bvotre projet\b/gi, "ton projet"],
  [/\bvotre message\b/gi, "ton message"],
  [/\bvotre consentement\b/gi, "ton consentement"],
  [/\bvotre cadre\b/gi, "ton cadre"],
  [/\bvotre pile\b/gi, "ta pile"],
  [/\bvotre demande\b/gi, "ta demande"],
  [/\bvotre premier scénario\b/gi, "ton premier scénario"],
  [/\bvotre environnement\b/gi, "ton environnement"],
  [/\bvotre outil\b/gi, "ton outil"],
  [/\bvos clients\b/gi, "tes clients"],
  [/\bvos élèves\b/gi, "tes élèves"],
  [/\bvos canaux\b/gi, "tes canaux"],
  [/\bvos décisions\b/gi, "tes décisions"],
  [/\bvos chiffres\b/gi, "tes chiffres"],
  [/\bvos outils\b/gi, "tes outils"],
  [/\bvos photos\b/gi, "tes photos"],
  [/\bvous visitez\b/gi, "tu visites"],
  [/\bvous utilisez\b/gi, "tu utilises"],
  [/\bvous acceptez\b/gi, "tu acceptes"],
  [/\bvous proposez\b/gi, "tu proposes"],
  [/\bvous avez\b/gi, "tu as"],
  [/\bvous pouvez\b/gi, "tu peux"],
  [/\bvous faites\b/gi, "tu fais"],
  [/\bvous êtes\b/gi, "tu es"],
  [/\bvous ne devez pas\b/gi, "tu ne dois pas"],
  [/\bvous ne pouvez pas\b/gi, "tu ne peux pas"],
  [/\bvous conservez\b/gi, "tu conserves"],
  [/\bvous soumettez\b/gi, "tu soumets"],
  [/\bvous nous autorisez\b/gi, "tu nous autorises"],
  [/\bvous reconnaît\b/gi, "te reconnaît"],
  [/\bvous prévenir\b/gi, "te prévenir"],
  [/\bVous informer\b/g, "T'informer"],
  [/\bVous opposer\b/g, "T'opposer"],
  [/\bque vous\b/gi, "que tu"],
  [/\bsi vous\b/gi, "si tu"],
  [/\blorsque vous\b/gi, "lorsque tu"],
  [/\bavant d'étendre l'usage en équipe\b/g, "avant d'étendre l'usage en équipe"],
]

const IMPERATIVE_PAIRS = [
  ["Inscrivez-vous", "Inscris-toi"],
  ["Rendez-vous", "Rends-toi"],
  ["Consultez", "Consulte"],
  ["consultez", "consulte"],
  ["Vérifiez", "Vérifie"],
  ["vérifiez", "vérifie"],
  ["Complétez", "Complète"],
  ["Exportez", "Exporte"],
  ["Partagez", "Partage"],
  ["Connectez", "Connecte"],
  ["Utilisez", "Utilise"],
  ["Commencez", "Commence"],
  ["Configurez", "Configure"],
  ["Contrôlez", "Contrôle"],
  ["Ajoutez", "Ajoute"],
  ["Décrivez", "Décris"],
  ["Parcourez", "Parcours"],
  ["Modifiez", "Modifie"],
  ["Ouvrez", "Ouvre"],
  ["Installez", "Installe"],
  ["Saisissez", "Saisis"],
  ["Recevez", "Reçois"],
  ["Adaptez", "Adapte"],
  ["Terminez", "Termine"],
  ["Lancez", "Lance"],
  ["Choisissez", "Choisis"],
  ["Cliquez", "Clique"],
  ["Explorez", "Explore"],
  ["Posez", "Pose"],
  ["Comparez", "Compare"],
  ["Trouvez", "Trouve"],
  ["trouvez", "trouve"],
  ["Créez", "Crée"],
  ["Concevez", "Conçois"],
  ["Donnez", "Donne"],
  ["Esquissez", "Esquisse"],
  ["Reliez", "Relie"],
  ["Construisez", "Construis"],
  ["Confiez", "Confie"],
  ["Transformez", "Transforme"],
  ["Rédigez", "Rédige"],
  ["Écrivez", "Écris"],
  ["Relisez", "Relis"],
  ["Faites", "Fais"],
  ["Interrogez", "Interroge"],
  ["Répondez", "Réponds"],
  ["Apprenez", "Apprends"],
  ["Étudiez", "Étudie"],
  ["Repérez", "Repère"],
  ["Protégez", "Protège"],
  ["Sortez", "Sors"],
  ["Restez", "Reste"],
  ["Passez", "Passe"],
  ["Suivez", "Suis"],
  ["Partagez", "Partage"],
  ["Relisez", "Relis"],
  ["Indiquez", "Indique"],
  ["Veuillez confirmer que vous n'êtes pas un robot", "Confirme que tu n'es pas un robot"],
  ["Veuillez accepter d'être recontacté", "Accepte d'être recontacté"],
  ["Réessayez", "Réessaie"],
]

export function tuifyText(text) {
  if (!text || typeof text !== "string") return text
  let s = protectTonaliteTon(text)
  for (const [from, to] of PHRASE_REPLACEMENTS) {
    s = s.replace(from, to)
  }
  for (const [from, to] of IMPERATIVE_PAIRS) {
    s = s.replaceAll(from, to)
  }
  s = s
    .replace(/\bvos\b/gi, "tes")
    .replace(/\bvotre\b/gi, "ton")
    .replace(/\bvous\b/gi, "tu")
  return restoreTonaliteTon(s)
}

function tuifySteps(steps) {
  if (!Array.isArray(steps)) return steps
  return steps.map((step) => ({
    ...step,
    title: tuifyText(step.title),
    description: tuifyText(step.description),
  }))
}

function tuifyFeatures(lines) {
  if (!Array.isArray(lines)) return lines
  return lines.map((line) => tuifyText(line))
}

function tuifyObjectStrings(obj) {
  if (typeof obj === "string") return tuifyText(obj)
  if (Array.isArray(obj)) return obj.map(tuifyObjectStrings)
  if (obj && typeof obj === "object") {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = tuifyObjectStrings(v)
    }
    return out
  }
  return obj
}

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

const FR_STRING_KEYS = [
  "summary_fr",
  "description_fr",
  "shortDescription_fr",
  "pricingNote_fr",
  "howToUse_fr",
  "features_fr",
]

function patchTool(tool) {
  let n = 0
  for (const key of FR_STRING_KEYS) {
    if (!(key in tool)) continue
    const before = JSON.stringify(tool[key])
    if (key === "howToUse_fr") tool[key] = tuifySteps(tool[key])
    else if (key === "features_fr") tool[key] = tuifyFeatures(tool[key])
    else tool[key] = tuifyText(tool[key])
    if (JSON.stringify(tool[key]) !== before) n++
  }
  return n
}

function patchFrEntry(entry) {
  let n = 0
  for (const key of FR_STRING_KEYS) {
    if (!(key in entry)) continue
    const before = JSON.stringify(entry[key])
    if (key === "howToUse_fr") entry[key] = tuifySteps(entry[key])
    else if (key === "features_fr") entry[key] = tuifyFeatures(entry[key])
    else entry[key] = tuifyText(entry[key])
    if (JSON.stringify(entry[key]) !== before) n++
  }
  return n
}

function runSweep() {
  const stats = { toolFiles: 0, toolFields: 0, frOverlay: 0, automations: 0, remainingVous: 0 }

  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  for (const id of Object.keys(fr)) {
    stats.frOverlay += patchFrEntry(fr[id])
  }
  writeJson(frPath, fr)

  for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
    const toolPath = path.join(toolsDir, file)
    const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
    if (SKIP.has(tool.status)) continue
    const n = patchTool(tool)
    if (n) {
      stats.toolFiles++
      stats.toolFields += n
      writeJson(toolPath, tool)
    }
  }

  if (fs.existsSync(automationsFr)) {
    const auto = JSON.parse(fs.readFileSync(automationsFr, "utf8"))
    const next = tuifyObjectStrings(auto)
    if (JSON.stringify(next) !== JSON.stringify(auto)) {
      stats.automations = 1
      writeJson(automationsFr, next)
    }
  }

  const scanPaths = [frPath, automationsFr]
  for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
    scanPaths.push(path.join(toolsDir, file))
  }
  for (const p of scanPaths) {
    if (!fs.existsSync(p)) continue
    const text = fs.readFileSync(p, "utf8")
    const m = text.match(/\b(vous|votre|vos)\b/gi)
    if (m) stats.remainingVous += m.length
  }

  return stats
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const stats = runSweep()
  console.log(JSON.stringify({ dryRun, ...stats, remainingVousInContent: stats.remainingVous }, null, 2))
}

