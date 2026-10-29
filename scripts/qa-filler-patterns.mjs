/** Filler detection aligned with QA retest #2 (pr28-retest2-gaps-filler.csv notes). */
export const FILLER_PATTERNS = [
  /propose le flux principal décrit sur le site officiel/i,
  /Tarifs et limites sur le site officiel/i,
  /Centre d'aide et onboarding pour le premier projet/i,
  /Consulte le site officiel pour les tarifs et limites/i,
  /Vérifie la page tarifs avant un déploiement en production/i,
  /Application web et compte utilisateur sur le site officiel/i,
  /Comptes équipe, rôles ou espaces de travail/i,
  /Workflows et limites détaillés sur le site de/i,
  /Intégrations selon l'offre — voir la documentation/i,
  /Intégrations et exports .+ selon l'offre affichée sur/i,
  /.+\.ai décrit les capacités, limites et inscription de/i,
  /\bcouvre .+ et .+ sur [a-z0-9.-]+\./i,
  /apporte des capacités IA pour/i,
  /delivers AI-assisted capabilities/i,
  /Collaboration, roles or workspaces when offered by the vendor/i,
  /Exports, API or integrations for your existing stack/i,
  /Exports, webhooks, or integrations for downstream tools/i,
  /Help center and onboarding to configure the first project/i,
  /Check the pricing page before production use/i,
  /ships the main workflow advertised on its official site/i,
  /Web app and account features on/i,
  /Visit .+ for plans, limits and regional availability/i,
  /See .+ for pricing and limits\.?$/i,
  /for official pricing and feature details/i,
  /is an AI product for (video creation|marketing|writing)/i,
  /is an AI product in the .* space with official hosting at/i,
  /The main .+ workflow\.?$/i,
  /supports ai and sales on/i,
  /supports .+ and .+ on [a-z0-9.-]+\.(ai|com|io|app)/i,
  /documents current .+ capabilities, limits, and signup/i,
  /integrations and exports depend on the plan shown on/i,
  /capabilities described on [a-z0-9.-]+\.(ai|com|io|app)/i,
  /AI audio processing: .+ supports automated audio analysis/i,
  /Build or deploy agents connected to your data\.?$/i,
  /Appels d'outils vers APIs SaaS et systèmes internes\.?$/i,
  /^Feature:\s/i,
  / — (no|catalog|ai): capabilities described on /i,
]

export function lineIsFiller(line) {
  const t = (line || "").trim()
  if (!t) return true
  return FILLER_PATTERNS.some((re) => re.test(t))
}

export function textHasFiller(text) {
  return FILLER_PATTERNS.some((re) => re.test(text || ""))
}

export function stripFillerSentences(text) {
  if (!text) return text
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s && !lineIsFiller(s))
  return parts.join(" ").trim()
}
