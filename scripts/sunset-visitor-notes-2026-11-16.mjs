/**
 * Rewrite sunset statusNote / statusNote_fr for visitor copy (no internal QA jargon).
 * Idempotent: only writes when values differ.
 *
 * Usage: node scripts/sunset-visitor-notes-2026-11-16.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const dryRun = process.argv.includes("--dry-run")

/** @type {Record<string, { statusNote: string, statusNote_fr?: string, successorId?: string, clearSuccessor?: boolean }>} */
const PATCHES = {
  lovo: {
    statusNote: "LOVO shut down in 2026.",
    statusNote_fr: "LOVO a cessé son activité en 2026.",
    successorId: "elevenlabs",
  },
  "smart-copy": {
    statusNote: "Smart Copy, Unbounce's AI writing tool, has been discontinued.",
    statusNote_fr: "Smart Copy, l'outil de rédaction IA d'Unbounce, n'est plus proposé.",
  },
  agent: {
    statusNote: "The Agent.ai marketplace has shut down.",
    statusNote_fr: "La place de marché Agent.ai a fermé.",
  },
  "clara-copilot": {
    statusNote: "Clara Copilot is no longer available.",
    statusNote_fr: "Clara Copilot n'est plus disponible.",
  },
  codeium: {
    statusNote: "Codeium is now Devin Desktop (Windsurf).",
    statusNote_fr: "Codeium est devenu Devin Desktop (Windsurf).",
  },
  codesquire: {
    statusNote: "CodeSquire has shut down.",
    statusNote_fr: "CodeSquire a fermé.",
  },
  codiga: {
    statusNote: "Codiga was acquired by Datadog in 2023; the standalone product is no longer offered.",
    statusNote_fr: "Codiga a été racheté par Datadog en 2023 ; le produit autonome n'est plus proposé.",
  },
  "conversion-ai": {
    statusNote: "Conversion.ai is no longer offered as a standalone Jasper product.",
    statusNote_fr: "Conversion.ai n'est plus proposé comme produit Jasper autonome.",
  },
  dalle: {
    statusNote: "DALL·E is outdated; OpenAI now offers image generation through ChatGPT and its current APIs.",
    statusNote_fr: "DALL·E est dépassé ; OpenAI propose désormais la génération d'images via ChatGPT et ses API actuelles.",
  },
  dalle_3: {
    statusNote: "DALL·E 3 is outdated; OpenAI now offers image generation through ChatGPT and its current APIs.",
    statusNote_fr: "DALL·E 3 est dépassé ; OpenAI propose désormais la génération d'images via ChatGPT et ses API actuelles.",
  },
  "datarobot-code": {
    statusNote: "DataRobot Code is covered by the main DataRobot platform.",
    statusNote_fr: "DataRobot Code est couvert par la plateforme DataRobot principale.",
  },
  designify: {
    statusNote: "Designify is now part of Canva's AI photo editing tools.",
    statusNote_fr: "Designify fait partie des outils de retouche photo IA de Canva.",
  },
  gennybylovo: {
    statusNote: "Genny by LOVO is no longer available; LOVO shut down in 2026.",
    statusNote_fr: "Genny by LOVO n'est plus disponible ; LOVO a cessé son activité en 2026.",
    successorId: "elevenlabs",
  },
  hourone: {
    statusNote: "Hour One's standalone platform was discontinued after Wix acquired the company in 2025.",
    statusNote_fr: "La plateforme autonome Hour One a été arrêtée après le rachat par Wix en 2025.",
  },
  ink: {
    statusNote: "INK for All has shut down.",
    statusNote_fr: "INK for All a fermé.",
  },
  "ink-for-all": {
    statusNote: "INK for All has shut down.",
    statusNote_fr: "INK for All a fermé.",
  },
  khoj: {
    statusNote: "Khoj Cloud shut down on April 15, 2026.",
    statusNote_fr: "Khoj Cloud a fermé le 15 avril 2026.",
  },
  magisto: {
    statusNote: "Magisto was folded into Vimeo's video editor.",
    statusNote_fr: "Magisto a été intégré à l'éditeur vidéo Vimeo.",
  },
  monkeylearn: {
    statusNote: "MonkeyLearn was acquired by Medallia; the standalone product is no longer offered.",
    statusNote_fr: "MonkeyLearn a été racheté par Medallia ; le produit autonome n'est plus proposé.",
  },
  otter: {
    statusNote: "Consolidated under Otter.ai.",
    statusNote_fr: "Regroupé sous Otter.ai.",
  },
  papercup: {
    statusNote: "Papercup's standalone dubbing tool closed after RWS acquired its technology in June 2025.",
    statusNote_fr: "L'outil de doublage autonome Papercup a fermé après le rachat de sa technologie par RWS en juin 2025.",
  },
  pearai: {
    statusNote: "PearAI has shut down.",
    statusNote_fr: "PearAI a cessé son activité.",
  },
  peech: {
    statusNote: "Peech has shut down.",
    statusNote_fr: "Peech a fermé.",
  },
  perplexity_labs: {
    statusNote: "Perplexity Labs is now part of Perplexity.",
    statusNote_fr: "Perplexity Labs fait désormais partie de Perplexity.",
  },
  phind: {
    statusNote: "Phind search shut down in January 2026.",
    statusNote_fr: "La recherche Phind a fermé en janvier 2026.",
  },
  playht: {
    statusNote: "PlayHT closed at the end of 2025 following Meta's acquisition.",
    statusNote_fr: "PlayHT a fermé fin 2025 après son rachat par Meta.",
  },
  "sweep-ai": {
    statusNote: "Sweep shut down in April 2026.",
    statusNote_fr: "Sweep a fermé en avril 2026.",
  },
  unscreen: {
    statusNote: "Unscreen is now offered through Canva's video background remover.",
    statusNote_fr: "Unscreen est proposé via l'outil de suppression de fond vidéo de Canva.",
  },
  voicemyai: {
    statusNote: "VoiceMyAI has shut down.",
    statusNote_fr: "VoiceMyAI a fermé.",
  },
  yusp: {
    statusNote: "Yusp was acquired by Taboola.",
    statusNote_fr: "Yusp a été racheté par Taboola.",
  },
}

const changed = []

for (const [id, patch] of Object.entries(PATCHES)) {
  const file = path.join(toolsDir, `${id}.json`)
  if (!fs.existsSync(file)) {
    console.warn(`skip missing ${id}`)
    continue
  }
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  if (tool.status !== "sunset") {
    console.warn(`skip ${id}: not sunset`)
    continue
  }
  let touched = false
  if (tool.statusNote !== patch.statusNote) {
    tool.statusNote = patch.statusNote
    touched = true
  }
  if (patch.statusNote_fr && tool.statusNote_fr !== patch.statusNote_fr) {
    tool.statusNote_fr = patch.statusNote_fr
    touched = true
  }
  if (patch.successorId && tool.successorId !== patch.successorId) {
    tool.successorId = patch.successorId
    touched = true
  }
  if (touched) {
    changed.push(id)
    if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
  }
}

console.log(JSON.stringify({ dryRun, changed, count: changed.length }, null, 2))