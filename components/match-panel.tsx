"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Pencil } from "lucide-react"
import { Shuriken } from "@/components/directory/shuriken"
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

function MatchCardView({ card, rank, featured = false }: { card: MatchCard; rank: number; featured?: boolean }) {
  const src = visualSrc(card)
  return (
    <article
      className={`flex flex-col rounded-2xl p-4 ring-1 sm:p-5 ${featured ? "bg-foreground text-background ring-foreground" : "bg-card text-card-foreground ring-border"}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${featured ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}
        >
          {rank}
        </span>
        <div className="flex min-w-0 flex-1 gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl text-lg font-bold ring-1 ${featured ? "bg-background text-foreground ring-background/30" : "bg-foreground text-background ring-border"}`}
          >
            {src ? <img src={src} alt="" className="size-7 object-contain" /> : card.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl leading-tight">{card.name}</h3>
            {card.price ? (
              <p className={`mt-1 text-xs font-semibold ${featured ? "text-accent" : "text-muted-foreground"}`}>{card.price}</p>
            ) : null}
          </div>
        </div>
      </div>
      {card.reason ? (
        <section className={`mt-4 rounded-xl p-3 ${featured ? "bg-background/10" : "bg-secondary/90"}`}>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Why this match</h4>
          <p className="mt-1.5 text-sm leading-relaxed">{card.reason}</p>
        </section>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
        <a href={`/tool/${card.id}`} className={featured ? "text-accent hover:underline" : "text-primary hover:underline"}>
          Catalogue fiche
        </a>
        <a href={card.url} target="_blank" rel="noopener noreferrer" className={featured ? "text-accent hover:underline" : "text-primary hover:underline"}>
          Official site
        </a>
      </div>
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
  const [setupError, setSetupError] = useState("")
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
        setCaptchaError("")
        setSetupError(messageForCode(data?.code || "unavailable", promptRef.current?.value || ""))
        return
      }
      setChallenge({ token: data.token, question: data.question })
      setCaptchaError("")
      setSetupError("")
    } catch {
      setChallenge(null)
      setCaptchaError("")
      setSetupError(messageForCode("unavailable", promptRef.current?.value || ""))
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
      setSetupError(messageForCode("unavailable", query))
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
    if (!challenge) {
      setSetupError(messageForCode("unavailable", query))
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

  const showResults = !loading && !error && recommendations.length > 0

  return (
    <div>
      <section className="mb-10 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-8">
        <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <Shuriken className="size-3.5 text-primary" />
              AI Match
            </p>
            {mode === "results" ? (
              <h1 className="mb-2 font-display text-3xl leading-tight">Your AI Match results</h1>
            ) : (
              <h2 className="mb-2 font-display text-3xl leading-tight">Find your AI match</h2>
            )}
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">Describe what you want to do — we shortlist tools from the AItools.ninja catalogue.</p>
            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap gap-2" aria-label="Example requests">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-left text-sm text-foreground hover:bg-secondary"
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
                  className={`min-h-[120px] resize-none md:min-h-[150px] ${fieldError ? "border-pink-500 bg-pink-50 focus-visible:ring-primary" : ""}`}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "ai-match-field-error" : undefined}
                  onChange={(event) => {
                    setPrompt(event.target.value)
                    if (fieldError) setFieldError("")
                  }}
                  disabled={loading}
                />
                {fieldError && (
                  <p id="ai-match-field-error" role="alert" className="mt-2 text-sm font-medium text-foreground">
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
              {setupError ? (
                <div role="alert" className="rounded-lg border border-pink-300 bg-pink-50 px-4 py-3 text-foreground">
                  <p>{setupError}</p>
                  <Button type="button" className="mt-3 bg-primary hover:bg-primary/90" onClick={() => void loadChallenge()}>
                    Réessayer
                  </Button>
                </div>
              ) : (
                <div>
                  <label htmlFor="ai-match-check" className="mb-1 block text-sm font-medium text-foreground">
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
                    className={captchaError ? "border-pink-500 bg-pink-50 focus-visible:ring-primary" : ""}
                  />
                  {captchaError && (
                    <p role="alert" className="mt-2 text-sm font-medium text-foreground">
                      {captchaError}
                    </p>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Finding your match..." : "Find my A-Match"}
              </Button>
            </form>
            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-pink-300 bg-pink-50 px-4 py-3 text-foreground">
                <p>{error}</p>
                <Button
                  type="button"
                  className="mt-3 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    if (!challenge) {
                      void loadChallenge()
                      return
                    }
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
      </section>

      {showResults && (
        <section className="mb-12 space-y-6">
          <div className="rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Your query</p>
            <p className="mt-2 text-base leading-relaxed">{submittedQuery}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setPrompt(submittedQuery)
                promptRef.current?.focus()
              }}
            >
              <Pencil className="mr-1.5 size-3.5" />
              Edit query
            </Button>
          </div>
          {intro ? <p className="text-sm leading-relaxed text-muted-foreground">{intro}</p> : null}
          <h3 className="font-display text-xl">Ranked picks</h3>
          <ol className="flex flex-col gap-5">
            {recommendations.map((card, index) => (
              <li key={card.id}>
                <MatchCardView card={card} rank={index + 1} featured={index === 0} />
              </li>
            ))}
          </ol>
          {related.length > 0 && (
            <div>
              <h3 className="mb-4 font-display text-lg">Related tools</h3>
              <ol className="flex flex-col gap-5">
                {related.map((card, index) => (
                  <li key={card.id}>
                    <MatchCardView card={card} rank={index + 1} />
                  </li>
                ))}
              </ol>
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
