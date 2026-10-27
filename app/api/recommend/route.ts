import { NextRequest, NextResponse } from "next/server"
import { listedTools, getToolById } from "@/lib/catalog"
import { localizeTool } from "@/lib/i18n/localize-tool"
import type { Locale } from "@/lib/i18n/config"
import { captchaSecret, verifyChallenge } from "@/lib/match-captcha"
import { clientIp, consumeNonce, rateLimit, rateSubject, searchLimit } from "@/lib/match-guard"
import {
  catalogMatch,
  detectLanguage,
  parseModelJson,
  promptProblem,
  rankTools,
  relatedCards,
  shortlist,
  toMatchTool,
  validateModelPayload,
  type MatchLang,
  type MatchPayload,
} from "@/lib/match-copy"

/** Cheap/fast OpenAI model for matcher (override via OPENAI_MATCH_MODEL). */
const OPENAI_MATCH_MODEL = process.env.OPENAI_MATCH_MODEL || "gpt-4o-mini"

const NO_STORE = { "Cache-Control": "no-store" }

function activeTools(locale: Locale) {
  const tools = listedTools.map((tool) => toMatchTool(localizeTool(tool, locale))).filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
  const names = tools.map((tool) => tool.name)
  return { tools, names }
}

function withRelated(payload: Omit<MatchPayload, "related">, tools: ReturnType<typeof activeTools>["tools"], query: string, names: string[]): MatchPayload {
  return {
    ...payload,
    related: relatedCards(tools, payload.recommendations, query, names),
  }
}

function legacyRecommendations(payload: MatchPayload) {
  return payload.recommendations
    .map((card) => {
      const tool = getToolById(card.id)
      return tool ? { tool, explanation: card.reason } : null
    })
    .filter(Boolean)
}

function jsonOk(payload: MatchPayload, legacy: boolean) {
  if (legacy) {
    return NextResponse.json(
      {
        intro: payload.intro,
        recommendations: legacyRecommendations(payload),
        source: payload.source,
        lang: payload.lang,
      },
      { headers: NO_STORE },
    )
  }
  return NextResponse.json(payload, { headers: NO_STORE })
}

function jsonCode(code: string, status: number) {
  return NextResponse.json({ code }, { status, headers: NO_STORE })
}

async function openAiMatch(
  prompt: string,
  candidates: ReturnType<typeof activeTools>["tools"],
  allNames: string[],
  lang: MatchLang,
): Promise<Omit<MatchPayload, "related"> | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const toolLines = candidates
    .map((tool) => `- id: ${tool.id} | name: ${tool.name} | categories: ${tool.categories.join(", ")} | tags: ${tool.tags.join(", ")} | ${tool.summary}`)
    .join("\n")

  const system = `You recommend AI tools from the list below. Reply with JSON only, no markdown.
Schema: {"intro":"string (max 50 words)","picks":[{"id":"tool-id from list","name":"exact name from list","reason":"max 25 words"}]}
Pick exactly 3 tools when possible. Use only ids from the list. Do not invent tools or facts.
Language for intro and reasons: ${lang === "fr" ? "French" : "English"}.

Tools:
${toolLines}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: OPENAI_MATCH_MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!response.ok) {
      const detail = await response.text()
      let modelHint = ""
      try {
        const parsed = JSON.parse(detail) as { error?: { code?: string; message?: string } }
        const code = parsed?.error?.code
        if (code === "model_not_found" || response.status === 403) {
          modelHint = ` (model=${OPENAI_MATCH_MODEL}${code ? `, code=${code}` : ""})`
        }
      } catch {
        /* non-JSON body */
      }
      console.error(
        `OpenAI match error${modelHint}: HTTP ${response.status}`,
        detail.slice(0, 500),
      )
      return null
    }
    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== "string") return null
    return validateModelPayload(parseModelJson(content), candidates, allNames, lang)
  } catch (error) {
    clearTimeout(timeoutId)
    console.error("OpenAI match request failed", error instanceof Error ? error.message : error)
    return null
  }
}

export async function POST(req: NextRequest) {
  const search = searchLimit()
  const limited = await rateLimit(rateSubject(clientIp(req.headers)), "search", search.limit, search.windowSec)
  if (!limited.ok) {
    return NextResponse.json(
      { code: limited.status === 429 ? "rate_limited" : "unavailable" },
      { status: limited.status, headers: { ...NO_STORE, "Retry-After": String(limited.retryAfter) } },
    )
  }

  try {
    const body = await req.json()
    const legacy = !body?.captchaToken
    const prompt = typeof body?.prompt === "string" ? body.prompt : ""
    const locale: Locale = body?.locale === "fr" ? "fr" : "en"

    if (typeof body?.company === "string" && body.company.trim().length > 0) {
      return jsonCode("invalid", 400)
    }

    const problem = promptProblem(prompt)
    if (problem) {
      return jsonCode(problem, 400)
    }

    if (!legacy) {
      const secret = captchaSecret()
      if (!secret) return jsonCode("unavailable", 503)
      const verified = verifyChallenge(secret, String(body.captchaToken || ""), String(body.captchaAnswer || ""))
      if (!verified.ok) return jsonCode("captcha", 400)
      const nonceStatus = await consumeNonce(verified.nonce, verified.ttlSec)
      if (nonceStatus === "unavailable") return jsonCode("unavailable", 503)
      if (nonceStatus === "replay") return jsonCode("captcha", 400)
    }

    const { tools, names } = activeTools(locale)
    const lang = detectLanguage(prompt)

    const catalog = catalogMatch(tools, prompt, names)
    const catalogStrong =
      catalog &&
      catalog.recommendations.length >= 2 &&
      rankTools(tools, prompt).some((row) => row.score >= 4)
    if (catalogStrong) {
      return jsonOk(withRelated(catalog, tools, prompt, names), legacy)
    }

    const candidates = shortlist(tools, prompt)
    const model = await openAiMatch(prompt, candidates.length > 0 ? candidates : tools.slice(0, 16), names, lang)
    if (model) {
      return jsonOk(withRelated(model, tools, prompt, names), legacy)
    }

    if (catalog && catalog.recommendations.length > 0) {
      return jsonOk(withRelated(catalog, tools, prompt, names), legacy)
    }

    return jsonCode("no_match", 404)
  } catch (error) {
    console.error("Error in /api/recommend", error)
    return jsonCode("unavailable", 503)
  }
}
