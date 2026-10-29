#!/usr/bin/env node
/**
 * One-off builder for data/import-2026-10-27/audit-pack-tools.json
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outPath = path.join(root, "data/import-2026-10-27/audit-pack-tools.json")

/** @typedef {{ id: string, name: string, url: string, category: string, tags: string[], pricingModel: string, pricingLabel: string, pricingNote?: string, pricingVerified: boolean, pricingSourceUrl?: string, summary: string, summary_fr: string, body: string, body_fr: string, features: string[], features_fr: string[], howToUse: object[], howToUse_fr: object[] }} ToolSpec */

/** @type {ToolSpec[]} */
const SPECS = []

function add(spec) {
  SPECS.push(spec)
}

function feat(lines) {
  return lines.map((t) => (t.startsWith("Feature:") ? t : `Feature: ${t}`))
}

function desc(body, featureLines) {
  return `${body}\n\n${feat(featureLines).join(" ")}`
}

function steps(en, fr) {
  return { howToUse: en, howToUse_fr: fr }
}

function link(label, url) {
  return { label, url }
}

// ——— P1 (Sora omitted — active sunset fiche) ———
add({
  id: "microsoft-copilot",
  name: "Microsoft Copilot",
  url: "https://copilot.microsoft.com/",
  category: "LLM & Chatbots",
  tags: ["chatbot", "microsoft", "web-search", "consumer"],
  pricingModel: "freemium",
  pricingLabel: "Freemium",
  pricingNote: "Free tier on copilot.microsoft.com; Copilot Pro and Microsoft 365 Copilot are separate paid offers.",
  pricingVerified: true,
  pricingSourceUrl: "https://www.microsoft.com/store/b/copilotpro",
  summary:
    "Consumer Copilot chat at copilot.microsoft.com for web search, image creation, and everyday questions—not the same product page as Microsoft 365 Copilot for work.",
  summary_fr:
    "Copilot grand public sur copilot.microsoft.com pour la recherche, les images et le quotidien—distinct de Microsoft 365 Copilot pour le travail.",
  body: "Microsoft Copilot on the web is the free-to-try assistant at copilot.microsoft.com. It answers questions, generates images, and helps with writing using Microsoft's latest models. Microsoft 365 Copilot is the paid work assistant embedded in Word, Excel, and Teams; this fiche covers the consumer web experience only.",
  body_fr:
    "Copilot sur le web est l'assistant accessible sur copilot.microsoft.com. Il répond à tes questions, génère des images et t'aide à écrire avec les modèles Microsoft récents. Microsoft 365 Copilot est l'offre payante intégrée à Word, Excel et Teams ; cette fiche couvre uniquement l'expérience web grand public.",
  features: [
    "Web-grounded answers with citations from Bing search.",
    "Image generation and editing in the Copilot chat.",
    "Voice and file upload on supported browsers.",
    "Sign-in with a personal Microsoft account for history sync.",
  ],
  features_fr: [
    "Réponses ancrées sur le web avec citations Bing.",
    "Génération et retouche d'images dans le chat.",
    "Voix et envoi de fichiers sur les navigateurs pris en charge.",
    "Connexion avec un compte Microsoft personnel pour l'historique.",
  ],
  ...steps(
    [
      { title: "Open the consumer Copilot site", description: "Go to copilot.microsoft.com in a browser—not the Microsoft 365 marketing hub.", links: [link("Microsoft Copilot", "https://copilot.microsoft.com/")] },
      { title: "Sign in or continue as guest", description: "Use a Microsoft account to save chats or try features without signing in where allowed." },
      { title: "Choose a mode", description: "Pick chat, image creation, or deep research when offered, then refine with follow-up prompts." },
      { title: "Compare with work Copilot", description: "For Office-embedded Copilot inside your tenant, use the Microsoft 365 Copilot fiche instead." },
    ],
    [
      { title: "Ouvre Copilot grand public", description: "Va sur copilot.microsoft.com dans un navigateur—pas la page marketing Microsoft 365.", links: [link("Microsoft Copilot", "https://copilot.microsoft.com/")] },
      { title: "Connecte-toi ou continue invité", description: "Utilise un compte Microsoft pour sauver les chats ou essaie sans compte si c'est proposé." },
      { title: "Choisis un mode", description: "Passe au chat, à la création d'images ou à la recherche approfondie, puis affine avec des relances." },
      { title: "Distingue le Copilot pro", description: "Pour Copilot dans Office via ton entreprise, consulte la fiche Microsoft 365 Copilot." },
    ]
  ),
})

add({
  id: "qwen",
  name: "Qwen",
  url: "https://qwen.ai/",
  category: "LLM & Chatbots",
  tags: ["llm", "alibaba", "open-models", "multimodal"],
  pricingModel: "freemium",
  pricingLabel: "Freemium",
  pricingNote: "Free chat on qwen.ai; API and cloud pricing via Alibaba Cloud Model Studio.",
  pricingVerified: true,
  pricingSourceUrl: "https://qwen.ai/pricing",
  summary: "Alibaba's Qwen family of open and hosted models with a public chat app and developer APIs.",
  summary_fr: "La famille Qwen d'Alibaba : modèles ouverts et hébergés, chat public et API développeurs.",
  body: "Qwen is Alibaba Cloud's line of large language and multimodal models. The qwen.ai site offers a consumer chat experience, while developers deploy the same models through APIs and open weights on Hugging Face.",
  body_fr:
    "Qwen est la gamme de grands modèles langage et multimodaux d'Alibaba Cloud. Le site qwen.ai propose un chat grand public ; les développeurs déploient les mêmes modèles via API et poids ouverts sur Hugging Face.",
  features: ["Multimodal Qwen models for text, vision, and code.", "Open-weight releases for self-hosting.", "Qwen Chat web app with file and image input.", "Model Studio API for production workloads."],
  features_fr: ["Modèles Qwen multimodaux texte, vision et code.", "Poids ouverts pour l'auto-hébergement.", "Application web Qwen Chat avec fichiers et images.", "API Model Studio pour la production."],
  ...steps(
    [
      { title: "Try Qwen Chat", description: "Open qwen.ai and start a conversation or upload an image for vision tasks.", links: [link("Qwen", "https://qwen.ai/")] },
      { title: "Pick a model tier", description: "Select the model size or capability shown in the UI for harder reasoning or faster replies." },
      { title: "Integrate via API", description: "Create credentials in Alibaba Cloud Model Studio if you need programmatic access." },
    ],
    [
      { title: "Essaie Qwen Chat", description: "Ouvre qwen.ai et démarre une conversation ou envoie une image.", links: [link("Qwen", "https://qwen.ai/")] },
      { title: "Choisis un modèle", description: "Sélectionne le modèle proposé selon vitesse ou raisonnement." },
      { title: "Branche l'API", description: "Crée des identifiants dans Model Studio si tu veux appeler Qwen en code." },
    ]
  ),
})

add({
  id: "google-flow",
  name: "Google Flow",
  url: "https://flow.google.com/",
  category: "Video",
  tags: ["video-generation", "google", "veo", "creative"],
  pricingModel: "freemium",
  pricingLabel: "Freemium",
  pricingNote: "Included in Google AI Pro/Ultra subscriptions where Flow is available.",
  pricingVerified: false,
  pricingSourceUrl: "https://one.google.com/about/google-ai-plans/",
  summary: "Google's AI filmmaking workspace for generating and editing video clips with Veo and related models.",
  summary_fr: "L'espace de création vidéo IA de Google pour générer et monter des clips avec Veo et modèles associés.",
  body: "Google Flow is Google's creative video workspace built on generative models such as Veo. It lets creators storyboard scenes, generate shots, and refine clips in a guided flow tied to Google accounts.",
  body_fr:
    "Google Flow est l'espace vidéo créatif de Google basé sur des modèles génératifs comme Veo. Tu peux storyboarder, générer des plans et affiner des clips avec un compte Google.",
  features: ["Scene-based video generation with Veo models.", "Integrated editing and extension of clips.", "Works with Google AI subscription tiers.", "Export for social or further editing."],
  features_fr: ["Génération vidéo par scènes avec Veo.", "Montage et extension de clips intégrés.", "Lié aux abonnements Google AI.", "Export pour les réseaux ou un montage externe."],
  ...steps(
    [
      { title: "Open Flow", description: "Sign in with a Google account that has Flow access and start a new project.", links: [link("Google Flow", "https://flow.google.com/")] },
      { title: "Outline your story", description: "Describe scenes or upload references Flow accepts, then generate initial clips." },
      { title: "Iterate shots", description: "Regenerate, extend, or adjust prompts per scene until the sequence fits." },
      { title: "Export", description: "Download or send finished clips to your editor or publishing workflow." },
    ],
    [
      { title: "Ouvre Flow", description: "Connecte-toi avec un compte Google éligible et crée un projet.", links: [link("Google Flow", "https://flow.google.com/")] },
      { title: "Décris ton histoire", description: "Rédige les scènes ou ajoute des références, puis génère les premiers clips." },
      { title: "Affine les plans", description: "Regénère ou prolonge chaque scène jusqu'à obtenir la séquence voulue." },
      { title: "Exporte", description: "Télécharge les clips finis pour les publier ou les monter ailleurs." },
    ]
  ),
})

add({
  id: "nano-banana",
  name: "Nano Banana (Gemini image)",
  url: "https://gemini.google.com/",
  category: "Image Generation & Editing",
  tags: ["image-generation", "gemini", "google", "editing"],
  pricingModel: "freemium",
  pricingLabel: "Freemium",
  pricingNote: "Image features roll out inside Gemini apps and Google AI plans.",
  pricingVerified: false,
  summary: "Google's Gemini native image generation and editing capability, widely referred to as Nano Banana in model releases.",
  summary_fr: "Génération et retouche d'images natives dans Gemini, souvent surnommée Nano Banana dans les annonces Google.",
  body: "Nano Banana is the community nickname for Google's Gemini image model tuned for fast generation and conversational editing. It ships inside the Gemini app and related Google surfaces rather than as a separate download.",
  body_fr:
    "Nano Banana est le surnom de la brique image Gemini de Google, rapide et editable en conversation. Elle est disponible dans l'app Gemini et les surfaces Google associées.",
  features: ["Text-to-image with character consistency options.", "In-chat edits such as background swap or style change.", "Integration with Gemini subscriptions.", "Safety filters on generated imagery."],
  features_fr: ["Texte vers image avec cohérence de personnages.", "Retouches en chat : fond, style, détails.", "Inclus dans les offres Gemini.", "Filtres de sécurité sur les visuels."],
  ...steps(
    [
      { title: "Open Gemini", description: "Use gemini.google.com or the mobile Gemini app with an eligible account.", links: [link("Gemini", "https://gemini.google.com/")] },
      { title: "Switch to image mode", description: "Ask for an image or pick the image tool when the UI exposes it." },
      { title: "Refine in conversation", description: "Follow up with edit instructions instead of regenerating from scratch." },
    ],
    [
      { title: "Ouvre Gemini", description: "Utilise gemini.google.com ou l'app mobile avec un compte éligible.", links: [link("Gemini", "https://gemini.google.com/")] },
      { title: "Passe en mode image", description: "Demande une image ou choisis l'outil dédié quand il apparaît." },
      { title: "Retouche en dialogue", description: "Enchaîne des instructions de modification plutôt que de tout regénérer." },
    ]
  ),
})

add({
  id: "windsurf",
  name: "Windsurf",
  url: "https://windsurf.com/",
  category: "Coding & Dev Tools",
  tags: ["ide", "ai-coding", "codeium", "agents"],
  pricingModel: "freemium",
  pricingLabel: "Freemium",
  pricingNote: "Windsurf IDE plans are listed on the Codeium/Windsurf site; domain may redirect during brand transitions.",
  pricingVerified: false,
  pricingSourceUrl: "https://codeium.com/pricing",
  summary: "AI-native IDE from the Codeium team with cascade agents, deep codebase context, and multi-file edits.",
  summary_fr: "IDE orienté IA de l'équipe Codeium avec agents cascade, contexte codebase et edits multi-fichiers.",
  body: "Windsurf is an AI-first code editor built by Codeium. It combines chat, autonomous agents, and inline completions with repository-wide context for faster feature work.",
  body_fr:
    "Windsurf est un éditeur de code pensé pour l'IA, développé par Codeium. Chat, agents autonomes et complétions inline s'appuient sur le contexte du dépôt.",
  features: ["Cascade agent for multi-step coding tasks.", "Deep context across files and terminals.", "Inline completions and refactors.", "Support for popular languages and Git workflows."],
  features_fr: ["Agent Cascade pour tâches multi-étapes.", "Contexte profond fichiers et terminal.", "Complétions et refactors inline.", "Langages courants et flux Git."],
  ...steps(
    [
      { title: "Download Windsurf", description: "Install the desktop editor from the official Windsurf or Codeium download page.", links: [link("Windsurf", "https://windsurf.com/")] },
      { title: "Open your repository", description: "Clone or open a folder so the agent can index the codebase." },
      { title: "Run a Cascade task", description: "Describe a feature or bugfix and review the agent's plan before applying patches." },
      { title: "Commit from the IDE", description: "Use built-in Git tools to stage and push accepted changes." },
    ],
    [
      { title: "Installe Windsurf", description: "Télécharge l'éditeur depuis la page officielle Windsurf ou Codeium.", links: [link("Windsurf", "https://windsurf.com/")] },
      { title: "Ouvre ton dépôt", description: "Clone ou ouvre un dossier pour que l'agent indexe le code." },
      { title: "Lance une tâche Cascade", description: "Décris une feature ou un bug et valide le plan avant d'appliquer les patches." },
      { title: "Commit depuis l'IDE", description: "Utilise Git intégré pour valider et pousser les changements acceptés." },
    ]
  ),
})

const CATEGORY_FEATURES = {
  "LLM & Chatbots": {
    en: ["Multi-turn chat with model selection where available.", "File, image, or voice input on supported plans.", "Share or export conversations for teammates.", "API or enterprise controls on higher tiers."],
    fr: ["Chat multi-tours avec choix de modèle quand disponible.", "Fichiers, images ou voix sur les offres compatibles.", "Partage ou export des conversations.", "API ou gouvernance entreprise sur les offres avancées."],
  },
  "AI Agents": {
    en: ["Build or deploy agents connected to your data.", "Tool calling to SaaS APIs and internal systems.", "Monitoring, logs, or human handoff where offered.", "Templates to start from common automations."],
    fr: ["Création ou déploiement d'agents branchés sur tes données.", "Appels d'outils vers APIs SaaS et systèmes internes.", "Suivi, journaux ou reprise humaine si proposé.", "Modèles pour automatiser des cas courants."],
  },
  "AI Detection": {
    en: ["Scan text or documents for likely AI authorship.", "Batch or API access for CMS and LMS workflows.", "Reports with scores and highlighted passages.", "Settings for sensitivity and language."],
    fr: ["Analyse de textes ou documents pour détecter une rédaction IA.", "Lots ou API pour CMS et LMS.", "Rapports avec scores et passages signalés.", "Réglages de sensibilité et de langue."],
  },
}

function defaultFeatures(category, name) {
  const preset = CATEGORY_FEATURES[category]
  if (preset) return { features: preset.en, features_fr: preset.fr }
  return {
    features: [
      `${name} ships the main workflow advertised on its official site.`,
      "Team accounts, roles, or workspaces where the product supports them.",
      "Exports, webhooks, or integrations for downstream tools.",
      "Help center and onboarding to configure the first project.",
    ],
    features_fr: [
      `${name} propose le flux principal décrit sur le site officiel.`,
      "Comptes équipe, rôles ou espaces de travail si disponibles.",
      "Exports, webhooks ou intégrations vers tes autres outils.",
      "Centre d'aide et onboarding pour le premier projet.",
    ],
  }
}

function makeFromCompact(c) {
  const { features, features_fr } = defaultFeatures(c.category, c.name)
  const body = `${c.summary} Check the pricing page before production use.`
  const body_fr = `${c.summary_fr} Vérifie la page tarifs avant un déploiement en production.`
  return {
    ...c,
    body,
    body_fr,
    features,
    features_fr,
    ...steps(
      [
        { title: `Sign up on ${c.name}`, description: `Create an account at the official URL if you need saved work or billing.`, links: [link(c.name, c.url)] },
        { title: "Complete onboarding", description: "Follow the product tour or connect the first integration it asks for." },
        { title: "Run a first task", description: "Execute the main workflow—generation, scan, or deploy—using a template or sample input." },
        { title: "Review outputs", description: "Export, share, or connect to your stack before scaling usage." },
      ],
      [
        { title: `Inscris-toi sur ${c.name}`, description: "Crée un compte sur l'URL officielle si tu veux sauver ton travail ou payer.", links: [link(c.name, c.url)] },
        { title: "Termine l'onboarding", description: "Suis la visite guidée ou connecte la première intégration demandée." },
        { title: "Lance une première tâche", description: "Exécute le flux principal avec un modèle ou un exemple." },
        { title: "Vérifie les résultats", description: "Exporte, partage ou branche ton stack avant d'augmenter l'usage." },
      ]
    ),
  }
}

// Continue with remaining tools via compact registry + expander for complementary set
const COMPACT = [
  ["replit", "Replit", "https://replit.com/", "No-code & App Builders", ["replit", "ide", "agents", "deploy"], "freemium", "Freemium", "Free tier plus Core from $20/mo on replit.com/pricing", true, "https://replit.com/pricing", "Cloud IDE to build, test, and deploy apps with Replit Agent and collaborative workspaces.", "IDE cloud pour créer, tester et déployer avec Replit Agent et des espaces collaboratifs."],
  ["chatgpt-atlas", "ChatGPT Atlas", "https://chatgpt.com/atlas", "LLM & Chatbots", ["browser", "openai", "chatgpt", "research"], "freemium", "Freemium", "Requires ChatGPT subscription where Atlas is rolled out.", false, "https://chatgpt.com/pricing", "OpenAI's AI-first browser experience that embeds ChatGPT for search, tabs, and page-aware assistance.", "Navigateur IA d'OpenAI intégrant ChatGPT pour la recherche et l'aide contextuelle sur les pages."],
  ["openclaw", "OpenClaw", "https://openclaw.ai/", "AI Agents", ["personal-agent", "open-source", "local", "automation"], "open-source", "Open source", "Open-source agent stack; hosted services may add paid tiers.", true, "https://openclaw.ai/", "Personal AI agent platform for running assistants that connect to your tools and messaging channels.", "Plateforme d'agent personnel pour relier tes outils et messageries."],
  ["hugging-face", "Hugging Face", "https://huggingface.co/", "Coding & Dev Tools", ["models", "datasets", "spaces", "inference"], "freemium", "Freemium", "Free community tier; Pro and Enterprise for teams and inference.", true, "https://huggingface.co/pricing", "Hub for open ML models, datasets, Spaces demos, and inference endpoints used across the AI ecosystem.", "Hub de modèles open source, jeux de données, Spaces et inférence pour l'écosystème IA."],
  ["freepik-ai", "Freepik AI", "https://www.freepik.com/ai/image-generator", "Image Generation & Editing", ["stock", "image-gen", "design", "templates"], "freemium", "Freemium", "Credits-based AI tools on Freepik; Magnific merger may affect branding.", false, "https://www.freepik.com/pricing", "AI image generation and editing inside Freepik's stock and design platform for marketers and creators.", "Génération et retouche IA dans la plateforme stock et design Freepik."],
  ["adobe-express", "Adobe Express", "https://www.adobe.com/express/", "Design & UI", ["templates", "social", "generative", "adobe"], "freemium", "Freemium", "Free plan with premium templates and generative credits on paid tiers.", true, "https://www.adobe.com/express/pricing", "Quick design app with generative AI for posts, video clips, and brand kits from Adobe.", "Application de design rapide avec IA générative pour posts, vidéos courtes et kits de marque."],
  ["turboscribe", "TurboScribe", "https://turboscribe.ai/", "Voice & Speech", ["transcription", "audio", "translation", "meetings"], "freemium", "Freemium", "Unlimited transcription tiers advertised on turboscribe.ai.", false, "https://turboscribe.ai/", "Fast AI transcription for long audio and video files with translation and speaker-friendly exports.", "Transcription IA rapide pour fichiers audio/vidéo longs, avec traduction et exports."],
  ["gptzero", "GPTZero", "https://gptzero.me/", "AI Detection", ["ai-detection", "education", "writing", "plagiarism"], "freemium", "Freemium", "Free scans with paid educator and API plans.", true, "https://gptzero.me/pricing", "AI content detection for educators and publishers with document and API scanning.", "Détection de contenu IA pour l'éducation et l'édition, avec scans de documents et API."],
  ["snyk", "Snyk", "https://snyk.io/", "Security", ["devsecops", "sast", "sca", "container"], "freemium", "Freemium", "Free tier for open source; Team and Enterprise for private repos.", true, "https://snyk.io/plans/", "Developer security platform covering code, dependencies, containers, and IaC with AI-assisted fixes.", "Plateforme de sécurité développeur : code, dépendances, conteneurs et IaC avec correctifs assistés par IA."],
]

for (const row of COMPACT) {
  const [id, name, url, category, tags, pricingModel, pricingLabel, pricingNote, pricingVerified, pricingSourceUrl, summary, summary_fr] = row
  add(makeFromCompact({ id, name, url, category, tags, pricingModel, pricingLabel, pricingNote, pricingVerified, pricingSourceUrl, summary, summary_fr }))
}

// P2 + FR + complementary bulk definitions
const BULK = [
  ["lmarena", "LMArena", "https://lmarena.ai/", "LLM & Chatbots", ["benchmark", "chat", "models", "community"], "free", "Free"],
  ["microsoft-copilot-studio", "Microsoft Copilot Studio", "https://www.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-studio", "AI Agents", ["microsoft", "agents", "power-platform", "enterprise"], "enterprise", "Enterprise"],
  ["flowise", "Flowise", "https://flowiseai.com/", "AI Agents", ["low-code", "agents", "langchain", "open-source"], "open-source", "Open source"],
  ["open-interpreter", "Open Interpreter", "https://openinterpreter.com/", "AI Agents", ["local", "code-execution", "agents", "open-source"], "open-source", "Open source"],
  ["qodo", "Qodo", "https://www.qodo.ai/", "Coding & Dev Tools", ["code-review", "testing", "agents", "ide"], "freemium", "Freemium"],
  ["jetbrains-ai", "JetBrains AI", "https://www.jetbrains.com/ai/", "Coding & Dev Tools", ["ide", "junie", "jetbrains", "assistant"], "freemium", "Freemium"],
  ["emergent", "Emergent", "https://emergent.sh/", "Coding & Dev Tools", ["full-stack", "agents", "deploy", "vibe-coding"], "usage-based", "Usage-based"],
  ["wix-ai", "Wix AI", "https://www.wix.com/ai", "No-code & App Builders", ["website", "wix", "design", "generative"], "freemium", "Freemium"],
  ["hostinger-horizons", "Hostinger Horizons", "https://www.hostinger.com/horizons", "No-code & App Builders", ["websites", "hostinger", "ai-builder", "hosting"], "freemium", "Freemium"],
  ["magnific", "Magnific AI", "https://magnific.ai/", "Image Generation & Editing", ["upscale", "enhance", "creative", "generative"], "freemium", "Freemium"],
  ["civitai", "Civitai", "https://civitai.com/", "Image Generation & Editing", ["stable-diffusion", "models", "community", "lora"], "freemium", "Freemium"],
  ["vizard", "Vizard", "https://vizard.ai/", "Video", ["clips", "social", "repurpose", "subtitles"], "freemium", "Freemium"],
  ["klap", "Klap", "https://klap.app/", "Video", ["shorts", "tiktok", "youtube", "ai-edit"], "freemium", "Freemium"],
  ["rask-ai", "Rask AI", "https://www.rask.ai/", "Video", ["dubbing", "translation", "localization", "voice"], "freemium", "Freemium"],
  ["producer-ai", "Producer.ai", "https://www.producer.ai/", "Music & Audio", ["music-generation", "stems", "creator", "audio"], "freemium", "Freemium"],
  ["lovart", "Lovart", "https://www.lovart.ai/", "Design & UI", ["generative", "design", "canvas", "creative"], "freemium", "Freemium"],
  ["miro-ai", "Miro AI", "https://miro.com/ai/", "Design & UI", ["whiteboard", "diagrams", "collaboration", "workshops"], "freemium", "Freemium"],
  ["plaud", "Plaud", "https://www.plaud.ai/", "Meetings & Notes", ["recorder", "transcription", "wearable", "notes"], "paid", "Premium"],
  ["fyxer-ai", "Fyxer AI", "https://www.fyxer.com/", "Productivity & Workspace", ["email", "scheduling", "executive-assistant", "inbox"], "freemium", "Freemium"],
  ["atlassian-rovo", "Atlassian Rovo", "https://www.atlassian.com/software/rovo", "Productivity & Workspace", ["jira", "confluence", "search", "agents"], "enterprise", "Enterprise"],
  ["liner", "Liner", "https://getliner.com/", "Search & Research", ["highlight", "pdf", "research", "browser"], "freemium", "Freemium"],
  ["scispace", "SciSpace", "https://scispace.com/", "Search & Research", ["papers", "literature-review", "citations", "academic"], "freemium", "Freemium"],
  ["quadratic", "Quadratic", "https://www.quadratichq.com/", "Data & Analytics", ["spreadsheet", "sql", "python", "collaboration"], "freemium", "Freemium"],
  ["shortcut", "Shortcut", "https://www.shortcut.ai/", "Data & Analytics", ["excel", "formulas", "analysis", "copilot"], "freemium", "Freemium"],
  ["hubspot-breeze", "HubSpot Breeze", "https://www.hubspot.com/products/artificial-intelligence", "Marketing & SEO", ["crm", "marketing", "content", "agents"], "freemium", "Freemium"],
  ["ahrefs", "Ahrefs", "https://ahrefs.com/", "Marketing & SEO", ["seo", "keywords", "content", "audit"], "paid", "Premium"],
  ["peec-ai", "Peec AI", "https://peec.ai/", "Marketing & SEO", ["geo", "ai-search", "brand", "analytics"], "freemium", "Freemium"],
  ["lavender", "Lavender", "https://www.lavender.ai/", "Sales & CRM", ["email", "sales", "coaching", "outreach"], "freemium", "Freemium"],
  ["zendesk-ai", "Zendesk AI", "https://www.zendesk.com/service/ai/", "Customer Support", ["helpdesk", "bots", "agents", "support"], "enterprise", "Enterprise"],
  ["ada", "Ada", "https://www.ada.cx/", "Customer Support", ["chatbot", "automation", "cx", "enterprise"], "enterprise", "Enterprise"],
  ["gorgias", "Gorgias", "https://www.gorgias.com/", "Customer Support", ["ecommerce", "helpdesk", "shopify", "ai"], "paid", "Premium"],
  ["studyfetch", "StudyFetch", "https://www.studyfetch.com/", "Education & Learning", ["flashcards", "tutor", "students", "notes"], "freemium", "Freemium"],
  ["praktika", "Praktika", "https://praktika.ai/", "Education & Learning", ["language", "tutor", "speaking", "mobile"], "freemium", "Freemium"],
  ["suki", "Suki", "https://www.suki.ai/", "Health & Medical", ["clinical", "documentation", "voice", "ehr"], "enterprise", "Enterprise"],
  ["lexis-plus-ai", "Lexis+ AI", "https://www.lexisnexis.com/en-us/products/lexis-plus-ai.page", "Legal", ["legal-research", "drafting", "lexisnexis", "enterprise"], "enterprise", "Enterprise"],
  ["originality-ai", "Originality.ai", "https://originality.ai/", "AI Detection", ["detection", "plagiarism", "content", "publishers"], "usage-based", "Usage-based"],
  ["zerogpt", "ZeroGPT", "https://www.zerogpt.com/", "AI Detection", ["detection", "free-scan", "text", "education"], "freemium", "Freemium"],
  ["antidote", "Antidote", "https://www.antidote.info/", "Writing & Content", ["french", "grammar", "corrector", "writing"], "paid", "Premium"],
  ["languagetool", "LanguageTool", "https://languagetool.org/", "Writing & Content", ["grammar", "multilingual", "browser", "writing"], "freemium", "Freemium"],
  ["reverso", "Reverso", "https://www.reverso.net/", "Writing & Content", ["translation", "context", "french", "writing"], "freemium", "Freemium"],
  ["noota", "Noota", "https://www.noota.io/", "Meetings & Notes", ["transcription", "french", "meetings", "crm"], "freemium", "Freemium"],
  ["leexi", "Leexi", "https://www.leexi.ai/", "Meetings & Notes", ["transcription", "french", "sales", "insights"], "freemium", "Freemium"],
  ["gladia", "Gladia", "https://www.gladia.io/", "Voice & Speech", ["api", "transcription", "speech-to-text", "real-time"], "usage-based", "Usage-based"],
  ["argil", "Argil", "https://www.argil.ai/", "Video", ["avatars", "ugc", "french", "social"], "freemium", "Freemium"],
  ["waalaxy", "Waalaxy", "https://www.waalaxy.com/", "Sales & CRM", ["linkedin", "prospecting", "automation", "french"], "freemium", "Freemium"],
  ["la-growth-machine", "La Growth Machine", "https://lagrowthmachine.com/", "Sales & CRM", ["outbound", "multichannel", "linkedin", "french"], "paid", "Premium"],
  ["crisp", "Crisp", "https://crisp.chat/", "Customer Support", ["chat", "inbox", "french", "ai"], "freemium", "Freemium"],
  ["doctrine", "Doctrine", "https://www.doctrine.fr/", "Legal", ["legal-research", "french", "case-law", "ai"], "enterprise", "Enterprise"],
]

for (const [id, name, url, category, tags, pricingModel, pricingLabel] of BULK) {
  add(
    makeFromCompact({
      id,
      name,
      url,
      category,
      tags,
      pricingModel,
      pricingLabel,
      pricingNote: `See ${url} for current plans.`,
      pricingVerified: false,
      pricingSourceUrl: url,
      summary: `${name} is an AI product in the ${category} space with official hosting at ${new URL(url).hostname}.`,
      summary_fr: `${name} est un produit IA dans ${category}, hébergé sur ${new URL(url).hostname}.`,
    })
  )
}

const COMPLEMENTARY = [
  ["doubao", "Doubao", "https://www.doubao.com/", "LLM & Chatbots", ["bytedance", "chat", "china", "multimodal"], "freemium", "Freemium"],
  ["brave-leo", "Brave Leo", "https://brave.com/leo/", "LLM & Chatbots", ["browser", "privacy", "chat", "search"], "freemium", "Freemium"],
  ["opera-aria", "Opera Aria", "https://www.opera.com/aria", "LLM & Chatbots", ["browser", "chat", "sidebar", "search"], "free", "Free"],
  ["autogpt", "AutoGPT", "https://agpt.co/", "AI Agents", ["autonomous", "open-source", "agents", "workflow"], "open-source", "Open source"],
  ["relay-app", "Relay.app", "https://www.relay.app/", "AI Agents", ["automation", "workflows", "integrations", "ai"], "freemium", "Freemium"],
  ["gemini-enterprise", "Gemini Enterprise", "https://cloud.google.com/gemini-enterprise", "LLM & Chatbots", ["google", "enterprise", "workspace", "gemini"], "enterprise", "Enterprise"],
  ["dust", "Dust", "https://dust.tt/", "AI Agents", ["agents", "knowledge", "enterprise", "assistants"], "enterprise", "Enterprise"],
  ["stack-ai", "Stack AI", "https://www.stack-ai.com/", "AI Agents", ["enterprise", "workflow", "rag", "builders"], "enterprise", "Enterprise"],
  ["mintlify", "Mintlify", "https://mintlify.com/", "Coding & Dev Tools", ["docs", "developer", "ai-writer", "api"], "freemium", "Freemium"],
  ["opencode", "OpenCode", "https://opencode.ai/", "Coding & Dev Tools", ["terminal", "open-source", "coding-agent", "cli"], "open-source", "Open source"],
  ["goose", "Goose", "https://block.github.io/goose/", "Coding & Dev Tools", ["local", "agents", "open-source", "automation"], "open-source", "Open source"],
  ["kombai", "Kombai", "https://kombai.com/", "Coding & Dev Tools", ["frontend", "figma", "react", "codegen"], "freemium", "Freemium"],
  ["airtable-ai", "Airtable AI", "https://www.airtable.com/platform/ai", "No-code & App Builders", ["database", "automation", "apps", "fields"], "freemium", "Freemium"],
  ["jotform-ai", "Jotform AI", "https://www.jotform.com/ai/", "No-code & App Builders", ["forms", "agents", "workflows", "surveys"], "freemium", "Freemium"],
  ["10web", "10Web", "https://10web.io/", "No-code & App Builders", ["wordpress", "website", "hosting", "builder"], "freemium", "Freemium"],
  ["typebot", "Typebot", "https://typebot.io/", "No-code & App Builders", ["chatbot", "open-source", "flows", "whatsapp"], "freemium", "Freemium"],
  ["hyperwrite", "HyperWrite", "https://www.hyperwriteai.com/", "Writing & Content", ["writing", "browser", "assistant", "marketing"], "freemium", "Freemium"],
  ["jenni-ai", "Jenni AI", "https://jenni.ai/", "Writing & Content", ["academic", "writing", "citations", "editor"], "freemium", "Freemium"],
  ["paperpal", "Paperpal", "https://paperpal.com/", "Writing & Content", ["academic", "manuscript", "grammar", "research"], "freemium", "Freemium"],
  ["novelcrafter", "NovelCrafter", "https://www.novelcrafter.com/", "Writing & Content", ["fiction", "novel", "story", "writing"], "paid", "Premium"],
  ["adobe-photoshop-ai", "Adobe Photoshop AI", "https://www.adobe.com/products/photoshop.html", "Image Generation & Editing", ["photoshop", "generative-fill", "adobe", "editing"], "paid", "Premium"],
  ["upscayl", "Upscayl", "https://upscayl.org/", "Image Generation & Editing", ["upscale", "local", "open-source", "images"], "open-source", "Open source"],
  ["claid-ai", "Claid.ai", "https://claid.ai/", "Image Generation & Editing", ["ecommerce", "product-photos", "enhance", "api"], "usage-based", "Usage-based"],
  ["bria", "Bria", "https://bria.ai/", "Image Generation & Editing", ["commercial", "stock", "generative", "api"], "enterprise", "Enterprise"],
  ["openart", "OpenArt", "https://openart.ai/", "Image Generation & Editing", ["stable-diffusion", "community", "models", "prompts"], "freemium", "Freemium"],
  ["adobe-premiere-pro-ai", "Adobe Premiere Pro AI", "https://www.adobe.com/products/premiere.html", "Video", ["premiere", "generative", "video-edit", "adobe"], "paid", "Premium"],
  ["davinci-resolve-ai", "DaVinci Resolve AI", "https://www.blackmagicdesign.com/products/davinciresolve", "Video", ["color", "edit", "fairlight", "magic-mask"], "freemium", "Freemium"],
  ["wondershare-filmora", "Wondershare Filmora", "https://filmora.wondershare.com/", "Video", ["video-edit", "templates", "ai-tools", "creator"], "freemium", "Freemium"],
  ["genmo", "Genmo", "https://www.genmo.ai/", "Video", ["video-gen", "creative", "community", "models"], "freemium", "Freemium"],
  ["wan", "Wan", "https://wan.video/", "Video", ["alibaba", "video-gen", "open", "models"], "freemium", "Freemium"],
  ["topview", "Topview", "https://www.topview.ai/", "Video", ["ecommerce", "ads", "avatars", "video"], "freemium", "Freemium"],
  ["lovo", "LOVO", "https://lovo.ai/", "Voice & Speech", ["voice-cloning", "tts", "video", "marketing"], "freemium", "Freemium"],
  ["respeecher", "Respeecher", "https://www.respeecher.com/", "Voice & Speech", ["voice-cloning", "film", "ethical", "studio"], "enterprise", "Enterprise"],
  ["podcastle", "Podcastle", "https://podcastle.ai/", "Voice & Speech", ["podcast", "recording", "ai-edit", "audio"], "freemium", "Freemium"],
  ["boomy", "Boomy", "https://boomy.com/", "Music & Audio", ["music-gen", "distribution", "creator", "tracks"], "freemium", "Freemium"],
  ["loudly", "Loudly", "https://www.loudly.com/", "Music & Audio", ["royalty-free", "music-gen", "creator", "api"], "freemium", "Freemium"],
  ["meshy", "Meshy", "https://www.meshy.ai/", "Design & UI", ["3d", "text-to-3d", "assets", "game"], "freemium", "Freemium"],
  ["tripo-ai", "Tripo AI", "https://www.tripo3d.ai/", "Design & UI", ["3d", "generation", "models", "api"], "freemium", "Freemium"],
  ["motiff", "Motiff", "https://motiff.com/", "Design & UI", ["figma", "ui-design", "ai-layout", "collaboration"], "freemium", "Freemium"],
  ["sembly-ai", "Sembly AI", "https://www.sembly.ai/", "Meetings & Notes", ["meetings", "transcription", "insights", "teams"], "freemium", "Freemium"],
  ["meetgeek", "MeetGeek", "https://meetgeek.ai/", "Meetings & Notes", ["meetings", "summary", "zoom", "teams"], "freemium", "Freemium"],
  ["avoma", "Avoma", "https://www.avoma.com/", "Meetings & Notes", ["revenue", "meetings", "coaching", "crm"], "paid", "Premium"],
  ["zoom-ai-companion", "Zoom AI Companion", "https://www.zoom.com/en/products/ai-assistant/", "Meetings & Notes", ["zoom", "meetings", "summary", "chat"], "freemium", "Freemium"],
  ["taskade", "Taskade", "https://www.taskade.com/", "Productivity & Workspace", ["tasks", "agents", "docs", "collaboration"], "freemium", "Freemium"],
  ["asana-ai", "Asana AI", "https://asana.com/product/ai", "Productivity & Workspace", ["project-management", "goals", "reporting", "teams"], "freemium", "Freemium"],
  ["monday-ai", "monday AI", "https://monday.com/w/ai", "Productivity & Workspace", ["work-os", "automations", "crm", "projects"], "freemium", "Freemium"],
  ["spark-mail", "Spark Mail", "https://sparkmailapp.com/", "Productivity & Workspace", ["email", "inbox", "assistant", "teams"], "freemium", "Freemium"],
  ["google-ai-mode", "Google AI Mode", "https://www.google.com/", "Search & Research", ["search", "google", "ai-overviews", "answers"], "free", "Free"],
  ["wolfram-alpha", "Wolfram|Alpha", "https://www.wolframalpha.com/", "Search & Research", ["computation", "math", "facts", "engine"], "freemium", "Freemium"],
  ["scholarcy", "Scholarcy", "https://www.scholarcy.com/", "Search & Research", ["papers", "summaries", "flashcards", "research"], "freemium", "Freemium"],
  ["looker", "Looker", "https://cloud.google.com/looker", "Data & Analytics", ["bi", "google-cloud", "dashboards", "semantic"], "enterprise", "Enterprise"],
  ["obviously-ai", "Obviously AI", "https://www.obviously.ai/", "Data & Analytics", ["no-code", "ml", "predictions", "analytics"], "freemium", "Freemium"],
  ["hootsuite", "Hootsuite", "https://www.hootsuite.com/", "Marketing & SEO", ["social", "scheduling", "analytics", "ai"], "paid", "Premium"],
  ["pencil", "Pencil", "https://trypencil.com/", "Marketing & SEO", ["ads", "creative", "generative", "performance"], "freemium", "Freemium"],
  ["blaze", "Blaze", "https://www.blaze.ai/", "Marketing & SEO", ["content", "social", "calendar", "small-business"], "freemium", "Freemium"],
  ["klaviyo-ai", "Klaviyo AI", "https://www.klaviyo.com/", "Marketing & SEO", ["email", "sms", "ecommerce", "personalization"], "freemium", "Freemium"],
  ["brevo", "Brevo", "https://www.brevo.com/", "Marketing & SEO", ["email", "crm", "sms", "automation"], "freemium", "Freemium"],
  ["outreach", "Outreach", "https://www.outreach.io/", "Sales & CRM", ["sales-engagement", "sequences", "forecast", "enterprise"], "enterprise", "Enterprise"],
  ["clari", "Clari", "https://www.clari.com/", "Sales & CRM", ["revenue", "forecast", "pipeline", "enterprise"], "enterprise", "Enterprise"],
  ["lusha", "Lusha", "https://www.lusha.com/", "Sales & CRM", ["prospecting", "contacts", "enrichment", "b2b"], "freemium", "Freemium"],
  ["freshdesk-freddy", "Freshdesk Freddy", "https://www.freshworks.com/freshdesk/omni/freddy-ai/", "Customer Support", ["helpdesk", "bots", "freshworks", "support"], "freemium", "Freemium"],
  ["kustomer", "Kustomer", "https://www.kustomer.com/", "Customer Support", ["crm", "omnichannel", "ai", "support"], "enterprise", "Enterprise"],
  ["forethought", "Forethought", "https://forethought.ai/", "Customer Support", ["deflection", "agents", "support", "enterprise"], "enterprise", "Enterprise"],
  ["seekout", "SeekOut", "https://www.seekout.com/", "HR & Recruiting", ["talent", "search", "diversity", "recruiting"], "enterprise", "Enterprise"],
  ["hireez", "hireEZ", "https://hireez.com/", "HR & Recruiting", ["outbound", "recruiting", "sourcing", "automation"], "enterprise", "Enterprise"],
  ["lattice", "Lattice", "https://lattice.com/", "HR & Recruiting", ["performance", "hr", "goals", "people"], "paid", "Premium"],
  ["wayground", "Wayground", "https://wayground.com/", "Education & Learning", ["quiz", "classroom", "formative", "teachers"], "freemium", "Freemium"],
  ["gizmo", "Gizmo", "https://gizmo.ai/", "Education & Learning", ["flashcards", "study", "mobile", "quiz"], "freemium", "Freemium"],
  ["mindgrasp", "Mindgrasp", "https://mindgrasp.ai/", "Education & Learning", ["notes", "summaries", "study", "video"], "freemium", "Freemium"],
  ["glass-health", "Glass Health", "https://glass.health/", "Health & Medical", ["clinical", "decision-support", "documentation", "providers"], "freemium", "Freemium"],
  ["clio", "Clio", "https://www.clio.com/", "Legal", ["practice-management", "legal", "billing", "ai"], "paid", "Premium"],
  ["ironclad", "Ironclad", "https://ironcladapp.com/", "Legal", ["clm", "contracts", "workflow", "enterprise"], "enterprise", "Enterprise"],
  ["pennylane", "Pennylane", "https://www.pennylane.com/", "Finance & Accounting", ["accounting", "french", "finance", "automation"], "paid", "Premium"],
  ["vic-ai", "Vic.ai", "https://www.vic.ai/", "Finance & Accounting", ["ap", "accounting", "automation", "enterprise"], "enterprise", "Enterprise"],
  ["darktrace", "Darktrace", "https://www.darktrace.com/", "Security", ["cyber", "anomaly", "enterprise", "network"], "enterprise", "Enterprise"],
  ["microsoft-security-copilot", "Microsoft Security Copilot", "https://www.microsoft.com/en-us/security/business/ai-machine-learning/microsoft-security-copilot", "Security", ["soc", "microsoft", "defender", "copilot"], "enterprise", "Enterprise"],
  ["crowdstrike-charlotte-ai", "CrowdStrike Charlotte AI", "https://www.crowdstrike.com/platform/charlotte-ai/", "Security", ["soc", "crowdstrike", "threat", "copilot"], "enterprise", "Enterprise"],
  ["copyleaks", "Copyleaks", "https://copyleaks.com/", "AI Detection", ["plagiarism", "ai-detection", "enterprise", "education"], "freemium", "Freemium"],
  ["winston-ai", "Winston AI", "https://gowinston.ai/", "AI Detection", ["detection", "content", "publishers", "api"], "freemium", "Freemium"],
]

for (const row of COMPLEMENTARY) {
  const [id, name, url, category, tags, pricingModel, pricingLabel] = row
  add(
    makeFromCompact({
      id,
      name,
      url,
      category,
      tags,
      pricingModel,
      pricingLabel,
      pricingNote: `See official pricing at ${url}.`,
      pricingVerified: false,
      pricingSourceUrl: url,
      summary: `${name} delivers AI-assisted capabilities for ${category.toLowerCase()} teams via ${new URL(url).hostname}.`,
      summary_fr: `${name} apporte des capacités IA pour ${category.toLowerCase()} sur ${new URL(url).hostname}.`,
    })
  )
}

function toExport(spec) {
  return {
    id: spec.id,
    name: spec.name,
    url: spec.url,
    category: spec.category,
    tags: spec.tags,
    pricingModel: spec.pricingModel,
    pricingLabel: spec.pricingLabel,
    ...(spec.pricingNote ? { pricingNote: spec.pricingNote } : {}),
    pricingVerified: spec.pricingVerified,
    ...(spec.pricingSourceUrl ? { pricingSourceUrl: spec.pricingSourceUrl } : {}),
    summary: spec.summary,
    description: desc(spec.body, spec.features),
    features: spec.features,
    howToUse: spec.howToUse,
    summary_fr: spec.summary_fr,
    description_fr: desc(spec.body_fr, spec.features_fr),
    features_fr: spec.features_fr,
    howToUse_fr: spec.howToUse_fr,
  }
}

const ids = new Set()
for (const s of SPECS) {
  if (ids.has(s.id)) throw new Error(`Duplicate id ${s.id}`)
  ids.add(s.id)
}

const out = SPECS.map(toExport)
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n")
console.log(out.length)
