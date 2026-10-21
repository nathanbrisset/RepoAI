"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MAX_QUERY_LENGTH,
  messageForCode,
  presentCards,
  visualSrc,
  type MatchCard,
  type MatchPayload,
} from "@/lib/match-copy"

const EXAMPLES = [
  "Write a friendly newsletter for my customers",
  "Rédiger une newsletter conviviale pour mes clients",
  "Create a short training video with an AI avatar",
  "Generate social images for a product launch",
  "Help me review a Python pull request",
]

const STASH_KEY = "aitools-match-v1"

type Challenge = { token: string; question: string }

function stashMatch(query: string, payload: MatchPayload) {
  try {
    sessionStorage.setItem(STASH_KEY, JSON.stringify({ query, payload }))
  } catch {
    /* private mode */
  }
}

function takeMatch(query: string): MatchPayload | null {
  try {
    const raw = sessionStorage.getItem(STASH_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STASH_KEY)
    const parsed = JSON.parse(raw) as { query?: string; payload?: MatchPayload }
    if (parsed.query !== query || !parsed.payload) return null
    return parsed.payload
  } catch {
    return null
  }
}

function MatchCardView({ card }: { card: MatchCard }) {
  const src = visualSrc(card)
  return (
    <article className="flex h-full flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
          {src ? (
            <img src={src} alt="" className="h-12 w-12 object-contain" />
          ) : (
            <span className="text-lg font-bold text-purple-700">{card.name.slice(0, 1)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-xl font-bold leading-tight text-gray-900">{card.name}</h3>
          {card.price && <p className="mt-1 text-sm font-medium text-purple-700">{card.price}</p>}
          {card.priceUnchecked && <p className="text-xs text-gray-500">Price not rechecked</p>}
        </div>
      </div>
      {card.reason && <p className="mt-4 text-base leading-relaxed text-gray-700">{card.reason}</p>}
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white hover:bg-purple-700 sm:w-auto"
      >
        Voir l&apos;outil
      </a>
    </article>
  )
}

function MatchExperience({ mode, urlQuery }: { mode: "home" | "results"; urlQuery: string }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState(urlQuery)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [company, setCompany] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [captchaError, setCaptchaError] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [intro, setIntro] = useState("")
  const [recommendations, setRecommendations] = useState<MatchCard[]>([])
  const [related, setRelated] = useState<MatchCard[]>([])
  const [submittedQuery, setSubmittedQuery] = useState("")
  const searchedQuery = useRef<string | null>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const captchaRef = useRef<HTMLInputElement>(null)

  async function loadChallenge() {
    setCaptchaAnswer("")
    try {
      const response = await fetch("/api/recommend/challenge/")
      const data = await response.json().catch(() => null)
      if (!response.ok || typeof data?.token !== "string" || typeof data?.question !== "string") {
        setChallenge(null)
        setCaptchaError(messageForCode(data?.code || "unavailable", promptRef.current?.value || ""))
        return
      }
      setChallenge({ token: data.token, question: data.question })
      setCaptchaError("")
    } catch {
      setChallenge(null)
      setCaptchaError(messageForCode("unavailable", promptRef.current?.value || ""))
    }
  }

  useEffect(() => {
    void loadChallenge()
  }, [])

  useEffect(() => {
    if (mode !== "results") return
    setPrompt(urlQuery)
    if (!urlQuery) return
    if (searchedQuery.current === urlQuery) return
    const stashed = takeMatch(urlQuery)
    if (!stashed) return
    const cards = presentCards(stashed.recommendations)
    if (cards.length === 0) return
    const extra = presentCards(stashed.related).filter((card) => !cards.some((item) => item.id === card.id))
    searchedQuery.current = urlQuery
    setSubmittedQuery(urlQuery)
    setIntro(typeof stashed.intro === "string" ? stashed.intro : "")
    setRecommendations(cards)
    setRelated(extra)
    setError("")
  }, [mode, urlQuery])

  async function runSearch(query: string) {
    if (!challenge) {
      setCaptchaError(messageForCode("unavailable", query))
      return
    }
    setLoading(true)
    setError("")
    setFieldError("")
    setRecommendations([])
    setRelated([])
    setIntro("")
    searchedQuery.current = query
    let navigating = false
    try {
      const response = await fetch("/api/recommend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          captchaToken: challenge.token,
          captchaAnswer,
          company,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || data?.code) {
        setError(messageForCode(data?.code, query))
        setSubmittedQuery(query)
        return
      }
      const cards = presentCards(data?.recommendations)
      if (cards.length === 0) {
        setError(messageForCode("no_match", query))
        setSubmittedQuery(query)
        return
      }
      const payload: MatchPayload = {
        intro: typeof data.intro === "string" ? data.intro : "",
        recommendations: cards,
        related: presentCards(data?.related).filter((card) => !cards.some((item) => item.id === card.id)),
        source: data?.source === "catalog" ? "catalog" : "openai",
        lang: data?.lang === "fr" || data?.lang === "es" || data?.lang === "de" || data?.lang === "pt" || data?.lang === "it" ? data.lang : "en",
      }
      if (mode === "home") {
        navigating = true
        stashMatch(query, payload)
        router.push(`/recommendation?query=${encodeURIComponent(query)}`)
        return
      }
      setIntro(payload.intro)
      setRecommendations(payload.recommendations)
      setRelated(payload.related)
      setSubmittedQuery(query)
      setError("")
    } catch {
      setError(messageForCode("unavailable", query))
      setSubmittedQuery(query)
    } finally {
      setLoading(false)
      if (!navigating) void loadChallenge()
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const query = prompt.trim()
    if (query.length < 3) {
      setFieldError(messageForCode("empty", query))
      setError("")
      promptRef.current?.focus()
      return
    }
    if (query.length > MAX_QUERY_LENGTH) {
      setFieldError(messageForCode("too_long", query))
      promptRef.current?.focus()
      return
    }
    if (!captchaAnswer.trim()) {
      setCaptchaError(messageForCode("captcha", query))
      captchaRef.current?.focus()
      return
    }
    setFieldError("")
    setCaptchaError("")
    if (mode === "results" && query !== urlQuery) {
      router.replace(`/recommendation?query=${encodeURIComponent(query)}`, { scroll: false })
    }
    void runSearch(query)
  }

  const top = recommendations[0]
  const others = recommendations.slice(1)
  const showResults = !loading && !error && recommendations.length > 0

  return (
    <div>
      <section className="mb-10 rounded-xl bg-white shadow-lg">
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 md:grid-cols-2">
          <div className="order-1 flex flex-col justify-center md:order-2">
            {mode === "results" ? (
              <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
                <Sparkles className="h-7 w-7 shrink-0 text-yellow-400" />
                Find your AI MATCH!
              </h1>
            ) : (
              <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold">
                <Sparkles className="h-7 w-7 shrink-0 text-yellow-400" />
                Find your AI MATCH!
              </h2>
            )}
            <p className="mb-6 text-lg text-gray-600">Whatever you need, there&apos;s an AI for it!</p>
            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap gap-2" aria-label="Example requests">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-left text-sm text-purple-800 hover:bg-purple-100"
                    onClick={() => {
                      setPrompt(example)
                      setFieldError("")
                      captchaRef.current?.focus()
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="ai-match-query" className="sr-only">
                  Describe what you are trying to accomplish
                </label>
                <Textarea
                  ref={promptRef}
                  id="ai-match-query"
                  name="query"
                  value={prompt}
                  maxLength={MAX_QUERY_LENGTH}
                  placeholder="Describe what you're trying to accomplish..."
                  className={`min-h-[120px] resize-none md:min-h-[150px] ${fieldError ? "border-pink-500 bg-pink-50 focus-visible:ring-purple-500" : ""}`}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "ai-match-field-error" : undefined}
                  onChange={(event) => {
                    setPrompt(event.target.value)
                    if (fieldError) setFieldError("")
                  }}
                  disabled={loading}
                />
                {fieldError && (
                  <p id="ai-match-field-error" role="alert" className="mt-2 text-sm font-medium text-purple-800">
                    {fieldError}
                  </p>
                )}
              </div>
              <div className="sr-only">
                <label htmlFor="ai-match-company">Leave blank</label>
                <input
                  id="ai-match-company"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ai-match-check" className="mb-1 block text-sm font-medium text-purple-900">
                  {challenge ? `Quick check: what is ${challenge.question}?` : "Quick check"}
                </label>
                <Input
                  ref={captchaRef}
                  id="ai-match-check"
                  name="check"
                  inputMode="numeric"
                  autoComplete="off"
                  value={captchaAnswer}
                  onChange={(event) => {
                    setCaptchaAnswer(event.target.value)
                    if (captchaError) setCaptchaError("")
                  }}
                  disabled={loading || !challenge}
                  aria-invalid={Boolean(captchaError)}
                  className={captchaError ? "border-pink-500 bg-pink-50 focus-visible:ring-purple-500" : ""}
                />
                {captchaError && (
                  <p role="alert" className="mt-2 text-sm font-medium text-purple-800">
                    {captchaError}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? "Finding your match..." : "Find my A-Match"}
              </Button>
            </form>
            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-pink-300 bg-pink-50 px-4 py-3 text-purple-900">
                <p>{error}</p>
                <Button
                  type="button"
                  className="mt-3 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    if (!captchaAnswer.trim()) {
                      setCaptchaError(messageForCode("captcha", submittedQuery || prompt))
                      captchaRef.current?.focus()
                      return
                    }
                    void runSearch((submittedQuery || prompt).trim())
                  }}
                >
                  Réessayer
                </Button>
              </div>
            )}
          </div>
          <div className="order-2 h-28 overflow-hidden rounded-lg sm:h-36 md:order-1 md:h-[400px]">
            <img src="/ai-match-hero.jpg" alt="" className="h-full w-full object-cover object-top" />
          </div>
        </div>
      </section>

      {showResults && (
        <section className="mb-12 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-100 via-white to-blue-100 p-4 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Your search</h2>
            <div className="rounded-lg border border-gray-100 bg-white px-6 py-4 text-lg text-gray-700 shadow-sm">
              {submittedQuery}
            </div>
          </div>
          {intro && (
            <div className="mb-8 rounded-lg border border-purple-200 bg-purple-50 px-6 py-4">
              <p className="text-lg leading-relaxed text-gray-800">{intro}</p>
            </div>
          )}
          {top && (
            <div className="mb-10">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-purple-700">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Our Top Pick
              </h3>
              <MatchCardView card={top} />
            </div>
          )}
          {others.length > 0 && (
            <div className="mb-10">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Other Great Options</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {others.map((card) => (
                  <MatchCardView key={card.id} card={card} />
                ))}
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">More in this Category</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((card) => (
                  <MatchCardView key={card.id} card={card} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export function HomeMatch() {
  return <MatchExperience mode="home" urlQuery="" />
}

export function ResultsMatch() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || searchParams.get("q") || ""
  return <MatchExperience mode="results" urlQuery={query} />
}
