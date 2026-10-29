#!/usr/bin/env node
/**
 * Apply Nat audit catalogue pack (2026-10-27): new fiches, taxonomy, maintenance, FR batch.
 *
 *   node scripts/apply-audit-catalogue.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const packPath = path.join(root, "data/import-2026-10-27/audit-pack-tools.json")
const taxonomyPath = path.join(root, "content/taxonomy.json")
const frBatchPath = path.join(root, "content/i18n/batches/fr-audit-pack.json")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const VERIFIED = "2026-10-29"

const CATEGORY_SLUG = {
  "LLM & Chatbots": "llm-chatbots",
  "AI Agents": "ai-agents",
  "Automation & Workflows": "automation",
  "Coding & Dev Tools": "coding",
  "No-code & App Builders": "no-code",
  "Writing & Content": "writing",
  "Image Generation & Editing": "image",
  Video: "video",
  "Voice & Speech": "voice",
  "Music & Audio": "music",
  "Design & UI": "design",
  "Meetings & Notes": "meetings",
  "Productivity & Workspace": "productivity",
  "Search & Research": "search",
  "Data & Analytics": "data",
  "Marketing & SEO": "marketing",
  "Sales & CRM": "sales",
  "Customer Support": "support",
  "HR & Recruiting": "hr",
  "Education & Learning": "education",
  "Health & Medical": "health",
  Legal: "legal",
  "Finance & Accounting": "finance",
  Security: "security",
  "AI Detection": "ai-detection",
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function readTool(id) {
  const file = path.join(toolsDir, `${id}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, "utf8"))
}

function writeTool(tool) {
  writeJson(path.join(toolsDir, `${tool.id}.json`), tool)
}

function pricingFrom(row) {
  const pricing = {
    model: row.pricingModel,
    label: row.pricingLabel,
    verified: row.pricingVerified === true,
  }
  if (row.pricingNote) pricing.note = row.pricingNote
  if (row.pricingSourceUrl) pricing.sourceUrl = row.pricingSourceUrl
  return pricing
}

function cleanFr(text) {
  if (!text) return text
  return text.replace(/\bFeature:/g, "Fonctionnalité :")
}

function toolFromPack(row) {
  const categoryId = CATEGORY_SLUG[row.category]
  if (!categoryId) throw new Error(`Unknown category ${row.category} on ${row.id}`)
  const existing = readTool(row.id)
  const tool = {
    id: row.id,
    name: row.name,
    url: row.url,
    affiliateUrl: "",
    status: row.status === "inactive" ? "inactive" : "active",
    summary: row.summary.trim(),
    description: row.description.trim(),
    categories: [categoryId],
    tags: row.tags,
    pricing: pricingFrom(row),
    logo: existing?.logo || `/logos/${row.id}.png`,
    image: existing?.image || "",
    dateAdded: existing?.dateAdded || VERIFIED,
    lastVerified: VERIFIED,
    features: row.features,
    howToUse: row.howToUse,
  }
  if (row.sources?.length) tool.sources = row.sources
  if (row.statusNote) tool.statusNote = row.statusNote
  return tool
}

function ensureAiDetectionCategory() {
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, "utf8"))
  if (taxonomy.categories.some((c) => c.id === "ai-detection")) return
  taxonomy.categories.push({
    id: "ai-detection",
    code: "C25",
    name: "AI Detection",
    description:
      "I want to check if text was written by AI;I want to prove originality for school or publishing",
    about:
      "Subcategories: AI writing detectors;Plagiarism and originality checks. Audiences: students, teachers, writers, publishers.",
    subcategories: ["AI writing detectors", "Plagiarism and originality checks"],
    tags: ["ai-detection", "plagiarism", "originality", "education"],
  })
  writeJson(taxonomyPath, taxonomy)
}

function applyMaintenance() {
  const stats = { renamed: [], duplicate: [], inactive: [], updated: [] }

  const amazonQ = readTool("amazon-codewhisperer")
  if (amazonQ) {
    const next = {
      ...amazonQ,
      id: "amazon-q-developer",
      name: "Amazon Q Developer",
      url: "https://aws.amazon.com/q/developer/",
      status: "active",
      statusNote: "Formerly Amazon CodeWhisperer.",
      summary:
        "Amazon's AI coding assistant for the IDE and CLI: inline suggestions, chat, and security scans in your workflow.",
      lastVerified: VERIFIED,
    }
    writeTool(next)
    writeTool({
      ...amazonQ,
      status: "duplicate-of",
      successorId: "amazon-q-developer",
      statusNote: "Renamed to Amazon Q Developer in April 2024.",
      lastVerified: VERIFIED,
    })
    stats.duplicate.push("amazon-codewhisperer->amazon-q-developer")
  }

  const sf = readTool("salesforceeinstein")
  if (sf) {
    writeTool({
      ...sf,
      name: "Salesforce Agentforce",
      url: "https://www.salesforce.com/agentforce/",
      summary:
        "Salesforce's agent platform for CRM: autonomous agents, Einstein copilots, and AI embedded in Sales and Service Cloud.",
      statusNote: "Formerly marketed as Salesforce Einstein; Agentforce is the current agent brand.",
      lastVerified: VERIFIED,
    })
    stats.updated.push("salesforceeinstein")
  }

  const drift = readTool("drift")
  if (drift) {
    writeTool({
      ...drift,
      name: "Salesloft Drift",
      url: "https://www.salesloft.com/platform/drift/",
      summary: "Conversational marketing and sales chat from Salesloft, powered by Drift after the acquisition.",
      statusNote: "Drift was acquired by Salesloft.",
      lastVerified: VERIFIED,
    })
    stats.updated.push("drift")
  }

  const codiga = readTool("codiga")
  if (codiga) {
    writeTool({
      ...codiga,
      status: "sunset",
      statusNote: "Codiga was acquired by Datadog in 2023; the standalone Codiga product is no longer offered.",
      lastVerified: VERIFIED,
    })
    stats.inactive.push("codiga")
  }

  const deepcode = readTool("deepcode")
  const snyk = readTool("snyk")
  if (deepcode && snyk) {
    writeTool({
      ...deepcode,
      status: "duplicate-of",
      successorId: "snyk",
      statusNote: "DeepCode is now Snyk Code, covered on the Snyk fiche.",
      lastVerified: VERIFIED,
    })
    stats.duplicate.push("deepcode->snyk")
  }

  const watson = readTool("watson_studio")
  if (watson) {
    const watsonx = {
      ...watson,
      id: "watsonx-ai",
      name: "IBM watsonx.ai",
      url: "https://www.ibm.com/products/watsonx-ai",
      status: "active",
      statusNote: "Successor to IBM Watson Studio for building and deploying AI on IBM Cloud.",
      lastVerified: VERIFIED,
    }
    writeTool(watsonx)
    writeTool({
      ...watson,
      status: "duplicate-of",
      successorId: "watsonx-ai",
      statusNote: "Watson Studio is replaced by watsonx.ai.",
      lastVerified: VERIFIED,
    })
    stats.duplicate.push("watson_studio->watsonx-ai")
  }

  const jasperArt = readTool("jasper-art")
  const jasper = readTool("jasper")
  if (jasperArt && jasper) {
    writeTool({
      ...jasperArt,
      status: "duplicate-of",
      successorId: "jasper",
      statusNote: "Jasper Art features live inside the main Jasper platform.",
      lastVerified: VERIFIED,
    })
    stats.duplicate.push("jasper-art->jasper")
  }

  const claude3 = readTool("claude-3")
  if (claude3) {
    const claude = { ...claude3, id: "claude", name: "Claude", status: "active", lastVerified: VERIFIED }
    writeTool(claude)
    writeTool({
      ...claude3,
      status: "duplicate-of",
      successorId: "claude",
      statusNote: "Canonical fiche is /tool/claude.",
      lastVerified: VERIFIED,
    })
    stats.duplicate.push("claude-3->claude")
  }

  const geminiOld = readTool("gemini-1-5-pro")
  if (geminiOld) {
    const gemini = { ...geminiOld, id: "gemini", name: "Gemini", status: "active", lastVerified: VERIFIED }
    writeTool(gemini)
    writeTool({
      ...geminiOld,
      status: "duplicate-of",
      successorId: "gemini",
      statusNote: "Canonical fiche is /tool/gemini.",
      lastVerified: VERIFIED,
    })
    stats.duplicate.push("gemini-1-5-pro->gemini")
  }

  const dataScienceIds = [
    "apache_spark",
    "apache_nifi",
    "node-red",
    "weka",
    "orange3",
    "keras-tuner",
    "ml-net",
    "codet5",
    "yellowbrick",
    "pycaret",
    "kaggle_kernels",
    "sagemaker_neo",
  ]
  for (const id of dataScienceIds) {
    const tool = readTool(id)
    if (!tool) continue
    writeTool({
      ...tool,
      status: "inactive",
      statusNote: "Grouped in the Data science collection; hidden from main discovery.",
      lastVerified: VERIFIED,
    })
    stats.inactive.push(id)
  }

  const sora = readTool("sora")
  if (sora && sora.status === "sunset") {
    writeTool({
      ...sora,
      status: "active",
      url: "https://sora.com/",
      summary: "OpenAI's text-to-video app for creating and remixing short clips from prompts.",
      description:
        "Sora is OpenAI's video generation product at sora.com. Signed-in ChatGPT users can create, remix, and share short videos from text prompts. Availability and limits depend on your ChatGPT plan; check OpenAI's help center for your region.",
      statusNote: undefined,
      lastVerified: VERIFIED,
      pricing: {
        model: "freemium",
        label: "Freemium",
        verified: false,
        note: "Included with eligible ChatGPT plans; limits vary by tier and region.",
        sourceUrl: "https://help.openai.com/",
      },
    })
    stats.updated.push("sora")
  }

  return stats
}

function syncToolIds() {
  const ids = fs
    .readdirSync(toolsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))
    .sort()
  writeJson(toolIdsPath, ids)
  return ids.length
}

function main() {
  ensureAiDetectionCategory()
  const pack = JSON.parse(fs.readFileSync(packPath, "utf8"))
  const frBatch = {}
  let added = 0
  let updated = 0

  for (const row of pack) {
    const existed = fs.existsSync(path.join(toolsDir, `${row.id}.json`))
    const tool = toolFromPack(row)
    writeTool(tool)
    if (existed) updated++
    else added++

    frBatch[row.id] = {
      summary_fr: row.summary_fr.trim(),
      description_fr: cleanFr(row.description_fr.trim()),
      features_fr: row.features_fr.map(cleanFr),
      howToUse_fr: row.howToUse_fr.map((step) => ({
        ...step,
        description: cleanFr(step.description),
        title: step.title,
      })),
    }
    if (row.statusNote_fr) frBatch[row.id].statusNote_fr = row.statusNote_fr.trim()
  }

  writeJson(frBatchPath, frBatch)
  const maintenance = applyMaintenance()
  const toolCount = syncToolIds()

  console.log(
    JSON.stringify(
      {
        packApplied: pack.length,
        added,
        updated,
        toolFiles: toolCount,
        maintenance,
        frBatch: Object.keys(frBatch).length,
      },
      null,
      2,
    ),
  )
}

main()
