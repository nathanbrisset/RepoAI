/** Shared tutoiement normalization for FR catalogue copy (P1-6). */

export const HOWTO_STEP4_GABARIT_BAD =
  "Exporte, partagez ou connectez ton environnement existant avant d'étendre l'usage en équipe."

export const HOWTO_STEP4_GABARIT_GOOD =
  "Exporte, partage ou connecte ton environnement existant avant d'étendre l'usage en équipe."

const TON_TONALITE = "\uE000TON_TONALITE\uE001"

function protectTonaliteTon(text: string) {
  return text
    .replace(/\ble ton\b/gi, `le ${TON_TONALITE}`)
    .replace(/\bdu ton\b/gi, `du ${TON_TONALITE}`)
    .replace(/\bau ton\b/gi, `au ${TON_TONALITE}`)
    .replace(/\bPersonnalisation du ton\b/gi, `Personnalisation du ${TON_TONALITE}`)
}

function restoreTonaliteTon(text: string) {
  return text.replaceAll(TON_TONALITE, "ton")
}

const PHRASE_REPLACEMENTS: [RegExp, string][] = [
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
  [/\bnotre créateur\b/gi, "le créateur"],
  [/\bnotre plateforme\b/gi, "la plateforme"],
  [/\bnotre API\b/gi, "l'API"],
  [/\bnotre équipe\b/gi, "l'équipe éditrice"],
  [/\bavec notre\b/gi, "avec l'"],
  [/\bdéployez avec\b/gi, "déploie avec"],
]

const IMPERATIVE_PAIRS: [string, string][] = [
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
  ["Indiquez", "Indique"],
  ["Veuillez confirmer que vous n'êtes pas un robot", "Confirme que tu n'es pas un robot"],
  ["Veuillez accepter d'être recontacté", "Accepte d'être recontacté"],
  ["Réessayez", "Réessaie"],
  ["Déclenchez", "Déclenche"],
  ["déclenchez", "déclenche"],
  ["Synchronisez", "Synchronise"],
  ["synchronisez", "synchronise"],
  ["Surveillez", "Surveille"],
  ["surveillez", "surveille"],
  ["Ciblez", "Cible"],
  ["ciblez", "cible"],
  ["Capturez", "Capture"],
  ["capturez", "capture"],
  ["Générez", "Génère"],
  ["générez", "génère"],
  ["Utilisez", "Utilise"],
  ["Mesurez", "Mesure"],
  ["mesurez", "mesure"],
  ["Déployez", "Déploie"],
  ["déployez", "déploie"],
  ["Enregistrez", "Enregistre"],
  ["enregistrez", "enregistre"],
  ["Transcrivez", "Transcris"],
  ["transcrivez", "transcris"],
  ["Montez", "Monte"],
  ["montez", "monte"],
  ["Personnalisez", "Personnalise"],
  ["personnalisez", "personnalise"],
]

export function fixHowToGabaritStep4(text: string | undefined): string | undefined {
  if (!text) return text
  if (text.includes(HOWTO_STEP4_GABARIT_BAD)) {
    return text.replace(HOWTO_STEP4_GABARIT_BAD, HOWTO_STEP4_GABARIT_GOOD)
  }
  if (text.includes("partagez ou connectez ton environnement")) {
    return text.replace(/partagez/g, "partage").replace(/connectez/g, "connecte")
  }
  return text
}

const EZ_IMPERATIVE_EXCEPTIONS: Record<string, string> = {
  Essayez: "Essaie",
  essayez: "essaie",
  Réessayez: "Réessaie",
  réessayez: "réessaie",
  Rendez: "Rends",
}

/** Regular -er/-ez marketing imperatives at clause start → 2nd person singular. */
function tuifySentenceInitialEz(text: string) {
  return text.replace(
    /(^|[.!?;:]\s+|\s—\s)([A-ZÀ-ÖØ-Þ][\p{L}'-]+)ez\b/gu,
    (full, prefix: string, word: string) => {
      if (word === "Rendez" && text.slice(text.indexOf(full)).startsWith("Rendez-vous")) return full
      if (TUTOIEMENT_ALLOWLIST.some((re) => re.test(word))) return full
      const mapped = EZ_IMPERATIVE_EXCEPTIONS[word] ?? (word.endsWith("ez") ? word.slice(0, -1) : word)
      return `${prefix}${mapped}`
    },
  )
}

export function tuifyText(text: string | undefined | null): string | undefined | null {
  if (!text || typeof text !== "string") return text
  let s = protectTonaliteTon(fixHowToGabaritStep4(text) ?? text)
  for (const [from, to] of PHRASE_REPLACEMENTS) {
    s = s.replace(from, to)
  }
  for (const [from, to] of IMPERATIVE_PAIRS) {
    s = s.replaceAll(from, to)
  }
  s = tuifySentenceInitialEz(s)
  s = s
    .replace(/\bvos\b/gi, "tes")
    .replace(/\bvotre\b/gi, "ton")
    .replace(/\bvous\b/gi, "tu")
  return restoreTonaliteTon(s)
}

export type HowToStep = { title?: string; description?: string }

export function tuifyHowToSteps(steps: HowToStep[] | undefined): HowToStep[] | undefined {
  if (!Array.isArray(steps)) return steps
  return steps.map((step) => ({
    ...step,
    title: tuifyText(step.title) ?? step.title,
    description: tuifyText(step.description) ?? step.description,
  }))
}

export function tuifyFeatureLines(lines: string[] | undefined): string[] | undefined {
  if (!Array.isArray(lines)) return lines
  return lines.map((line) => tuifyText(line) ?? line)
}

/** Allowlisted fragments that look like vouvoiement but are not addressed to the visitor. */
export const TUTOIEMENT_ALLOWLIST: RegExp[] = [
  /\bRendez-vous\b/i,
  /\bmeetings\b/i,
  /\bGoogle Meet\b/i,
  /\bMicrosoft Teams\b/i,
  /\bCloudflare\b/i,
  /\bVercel\b/i,
]

const VOUIEZ_START = /(?:^|[.!?;:]\s+|\s—\s)([A-ZÀ-ÖØ-Þ][\p{L}'-]+)ez\b/gu
const VOUS_FORMS = /(?<!rendez-)\b(vous|votre|vos)\b/i

export function findTutoiementViolations(text: string): string[] {
  if (TUTOIEMENT_ALLOWLIST.some((re) => re.test(text))) return []
  const hits: string[] = []
  if (VOUS_FORMS.test(text)) {
    const m = text.match(VOUS_FORMS)
    if (m) hits.push(m[0])
  }
  for (const m of text.matchAll(VOUIEZ_START)) {
    const word = m[1]
    if (word === "Rendez") continue
    hits.push(`${word}ez`)
  }
  return hits
}