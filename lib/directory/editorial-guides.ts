import type { Locale } from "@/lib/i18n/config"

export type EditorialGuideDef = {
  slug: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  problem: Record<Locale, string>
  stackIntro: Record<Locale, string>
  stackToolIds: string[]
  stackSteps: { id: string; role: Record<Locale, string> }[]
  collectionSlug: string
  recommendationQuery: Record<Locale, string>
}

export const EDITORIAL_GUIDE_DEFS: EditorialGuideDef[] = [
  {
    slug: "gagner-1h-shorts",
    title: {
      en: "Win back an hour on every short",
      fr: "Gagne une heure sur chaque short",
    },
    description: {
      en: "Cut the editing spiral: one stack to script, voice and publish Shorts faster.",
      fr: "Sors de la spirale de montage : un stack pour scénariser, voicer et publier tes Shorts plus vite.",
    },
    problem: {
      en: "You know what the short should say, but you lose an hour jumping between apps — re-recording voice, fixing jump cuts, hunting B-roll. The idea is fine; the pipeline is not.",
      fr: "Tu sais ce que le short doit dire, mais tu perds une heure à sauter d'une app à l'autre — re-voix, jump cuts, B-roll introuvable. L'idée tient ; le pipeline, non.",
    },
    stackIntro: {
      en: "This path keeps you in three tools end to end: rough cut, clean audio, text-based polish.",
      fr: "Ce parcours te garde dans trois outils de bout en bout : montage rapide, audio propre, retouches en mode texte.",
    },
    stackToolIds: ["capcut", "elevenlabs", "descript"],
    stackSteps: [
      {
        id: "capcut",
        role: {
          en: "Assembly and pacing on mobile or desktop — hooks and captions first.",
          fr: "Montage et rythme sur mobile ou desktop — accroches et sous-titres d'abord.",
        },
      },
      {
        id: "elevenlabs",
        role: {
          en: "Voice-over when you do not want to re-record yourself.",
          fr: "Voix off quand tu ne veux pas te ré-enregistrer.",
        },
      },
      {
        id: "descript",
        role: {
          en: "Edit by deleting words; export when the short feels tight.",
          fr: "Monte en supprimant des mots ; exporte quand le short est serré.",
        },
      },
    ],
    collectionSlug: "kit-shorts-youtube",
    recommendationQuery: {
      en: "short form video editing and voice over workflow",
      fr: "montage vidéo short et workflow voix off",
    },
  },
  {
    slug: "automatiser-suivi-sans-code",
    title: {
      en: "Automate follow-up without code",
      fr: "Automatise le suivi sans code",
    },
    description: {
      en: "Connect form, CRM and inbox so new leads get a next step without copy-paste.",
      fr: "Relie formulaire, CRM et boîte mail pour que chaque lead ait une prochaine étape sans copier-coller.",
    },
    problem: {
      en: "Leads land in a form or inbox, then sit there while you manually tag, assign and send the same follow-up. You do not need a dev team — you need a reliable trigger → action chain.",
      fr: "Les leads arrivent dans un formulaire ou une boîte mail, puis restent là pendant que tu tags, assignes et renvoies le même suivi à la main. Tu n'as pas besoin d'une équipe dev — tu as besoin d'une chaîne déclencheur → action fiable.",
    },
    stackIntro: {
      en: "Pick one iPaaS, wire two or three apps, and ship a flow you can see in a log.",
      fr: "Choisis une iPaaS, branche deux ou trois apps, et publie un flux que tu peux suivre dans les logs.",
    },
    stackToolIds: ["n8n", "zapier", "make"],
    stackSteps: [
      {
        id: "n8n",
        role: {
          en: "Self-host or cloud; strong when you want open workflows and control.",
          fr: "Self-host ou cloud ; solide quand tu veux des workflows ouverts et du contrôle.",
        },
      },
      {
        id: "zapier",
        role: {
          en: "Fastest start when your stack is mostly SaaS and you want templates.",
          fr: "Démarrage le plus rapide quand ta stack est surtout du SaaS et que tu veux des modèles.",
        },
      },
      {
        id: "make",
        role: {
          en: "Visual scenarios when branches and routers are the hard part.",
          fr: "Scénarios visuels quand les branches et routeurs sont le vrai sujet.",
        },
      },
    ],
    collectionSlug: "automatisations-agents",
    recommendationQuery: {
      en: "no code automation CRM follow up",
      fr: "automatisation sans code suivi CRM",
    },
  },
  {
    slug: "brief-draft-1h",
    title: {
      en: "Research brief in about an hour",
      fr: "Un brief de recherche en environ une heure",
    },
    description: {
      en: "From a fuzzy question to a one-page brief you can share — with sources you can defend.",
      fr: "D'une question floue à un brief d'une page que tu peux partager — avec des sources défendables.",
    },
    problem: {
      en: "You need a clear brief by end of day, but search tabs multiply and nothing reads like one story. The goal is not more links — it is one outline with evidence.",
      fr: "Tu as besoin d'un brief clair pour ce soir, mais les onglets se multiplient et rien ne se lit comme une seule histoire. Le but n'est pas plus de liens — c'est un plan avec des preuves.",
    },
    stackIntro: {
      en: "Search wide, extract claims from papers, then synthesize in a notebook you can query.",
      fr: "Cherche large, extrais les claims des papers, puis synthétise dans un notebook que tu peux interroger.",
    },
    stackToolIds: ["perplexity-ai", "elicit", "notebooklm"],
    stackSteps: [
      {
        id: "perplexity-ai",
        role: {
          en: "Orient on the question and collect cited angles in minutes.",
          fr: "Oriente-toi sur la question et collecte des angles cités en quelques minutes.",
        },
      },
      {
        id: "elicit",
        role: {
          en: "Pull structured answers from research papers on your topic.",
          fr: "Extrais des réponses structurées des papers sur ton sujet.",
        },
      },
      {
        id: "notebooklm",
        role: {
          en: "Upload sources and draft the brief as a grounded summary.",
          fr: "Importe tes sources et rédige le brief comme synthèse ancrée.",
        },
      },
    ],
    collectionSlug: "research-writing",
    recommendationQuery: {
      en: "research brief writing AI tools",
      fr: "outils IA brief recherche rédaction",
    },
  },
]

export function editorialGuideSlugs() {
  return EDITORIAL_GUIDE_DEFS.map((guide) => guide.slug)
}

export function editorialGuideBySlug(slug: string) {
  return EDITORIAL_GUIDE_DEFS.find((guide) => guide.slug === slug)
}

export type ResolvedEditorialGuide = {
  slug: string
  title: string
  description: string
  problem: string
  stackIntro: string
  stackSteps: { id: string; name: string; logo: string; role: string }[]
  collectionSlug: string
  collectionTitle: string
  recommendationHref: string
  collectionHref: string
}

export function resolveEditorialGuide(
  def: EditorialGuideDef,
  locale: Locale,
  toolsById: Map<string, { name: string; logo: string }>,
  collectionTitle: string,
): ResolvedEditorialGuide | null {
  const stackSteps = def.stackSteps
    .filter((step) => toolsById.has(step.id))
    .map((step) => {
      const tool = toolsById.get(step.id)!
      return {
        id: step.id,
        name: tool.name,
        logo: tool.logo,
        role: step.role[locale],
      }
    })
  if (stackSteps.length === 0) return null
  const query = encodeURIComponent(def.recommendationQuery[locale])
  return {
    slug: def.slug,
    title: def.title[locale],
    description: def.description[locale],
    problem: def.problem[locale],
    stackIntro: def.stackIntro[locale],
    stackSteps,
    collectionSlug: def.collectionSlug,
    collectionTitle,
    recommendationHref: `/recommendation?query=${query}`,
    collectionHref: `/collections/${def.collectionSlug}`,
  }
}
