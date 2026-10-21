import { NextResponse } from "next/server"
import { allTools, listedTools } from "@/lib/catalog"
import { captchaSecret, verifyChallenge } from "@/lib/match-captcha"
import { clientIp, consumeNonce, rateHeaders, rateLimit, rateSubject, searchLimit } from "@/lib/match-guard"
import {
  catalogMatch,
  detectLanguage,
  parseModelJson,
  promptProblem,
  relatedCards,
  shortlist,
  toMatchTool,
  validateModelPayload,
  type MatchPayload,
  type MatchTool,
} from "@/lib/match-copy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const OPENAI_MODEL = "gpt-4.1-nano"

const activeTools: MatchTool[] = listedTools
  .map((tool) => toMatchTool(tool))
  .filter((tool): tool is MatchTool => tool !== null)

const allNames = allTools.map((tool) => tool.name)

function errorResponse(code: string, status: number, extra?: Record<string, string>) {
  return NextResponse.json({ code }, { status, headers: { "Cache-Control": "no-store", ...extra } })
}

function catalogLines(tools: MatchTool[]) {
  return tools
    .map((tool) => {
      const summary = tool.summary.replace(/\s+/g, " ").slice(0, 180)
      return `- id: ${tool.id} | name: ${tool.name} | categories: ${tool.categories.join(", ")} | summary: ${summary}`
    })
    .join("\n")
}

async function askOpenAI(prompt: string, candidates: MatchTool[]): Promise<Omit<MatchPayload, "related"> | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || candidates.length === 0) return null
  const lang = detectLanguage(prompt)
  const system = [
    "You recommend AI tools from a public directory.",
    'Reply with JSON only: {"intro": string, "picks": [{"id": string, "name": string, "reason": string}]}.',
    "Use only the tools in the user message. Copy each id and name exactly.",
    "Choose at most 3 tools that fit. If none fit, return an empty picks array.",
    "Write the intro and every reason in the same language as the user request.",
    "Each reason is at most 25 words and names only that one tool.",
    "The intro is at most 40 words and does not name tools outside the picks.",
    "Do not include links, domain names, prices, ratings, or visit counts.",
  ].join(" ")
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.2,
        seed: 42,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `User request:\n"""${prompt}"""\n\nActive tools, best matches first:\n${catalogLines(candidates)}`,
          },
        ],
      }),
    })
    if (!response.ok) {
      let code = String(response.status)
      try {
        const body = await response.json()
        if (typeof body?.error?.code === "string") code = body.error.code
      } catch {
        code = String(response.status)
      }
      console.error("OpenAI match request failed", code)
      return null
    }
    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== "string") return null
    return validateModelPayload(parseModelJson(content), candidates, allNames, lang)
  } catch (error) {
    console.error("OpenAI match request failed", error instanceof Error ? error.name : "error")
    return null
  }
}

function withRelated(match: Omit<MatchPayload, "related">, query: string): MatchPayload {
  return { ...match, related: relatedCards(activeTools, match.recommendations, query, allNames) }
}

export async function POST(req: Request) {
  let body: {
    prompt?: unknown
    captchaToken?: unknown
    captchaAnswer?: unknown
    company?: unknown
  }
  try {
    body = await req.json()
  } catch {
    return errorResponse("invalid", 400)
  }

  const sample = typeof body.prompt === "string" ? body.prompt : ""
  const problem = promptProblem(body.prompt)
  if (problem) return errorResponse(problem, 400)

  const ip = clientIp(req.headers)
  const search = searchLimit()
  const limited = await rateLimit(ip, "search", search.limit, search.windowSec)
  const headers = rateHeaders(limited)
  headers["X-RateLimit-Subject"] = rateSubject(ip)
  if (!limited.ok) return errorResponse(limited.status === 503 ? "unavailable" : "rate_limited", limited.status, headers)

  const prompt = sample.trim()
  if (typeof body.company === "string" && body.company.trim()) return errorResponse("captcha", 403, headers)

  const secret = captchaSecret()
  if (!secret) return errorResponse("unavailable", 503, headers)
  const captcha = verifyChallenge(
    secret,
    typeof body.captchaToken === "string" ? body.captchaToken : "",
    typeof body.captchaAnswer === "string" ? body.captchaAnswer : ""
  )
  if (!captcha.ok) return errorResponse("captcha", 403, headers)
  const fresh = await consumeNonce(captcha.nonce, captcha.ttlSec)
  if (fresh === "unavailable") return errorResponse("unavailable", 503, headers)
  if (fresh !== "fresh") return errorResponse("captcha", 403, headers)

  const candidates = shortlist(activeTools, prompt)
  const fromModel = await askOpenAI(prompt, candidates)
  const match = fromModel || catalogMatch(activeTools, prompt, allNames)
  if (!match || match.recommendations.length === 0) {
    return errorResponse("no_match", 422, headers)
  }
  return NextResponse.json(withRelated(match, prompt), { headers })
}
