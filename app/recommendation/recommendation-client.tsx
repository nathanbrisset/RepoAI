"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, Pencil } from "lucide-react"
import { useSearchParams } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { Shuriken } from "@/components/directory/shuriken"
import { MatchResultCard } from "@/components/match/match-result-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLocale, useT } from "@/components/locale-provider"
import { messageForCode } from "@/lib/match-copy"
import type { Tool } from "@/lib/types"

type MatchRow = { tool: Tool; explanation: string }

export default function RecommendationClient() {
  const t = useT()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("query") || ""
  const [prompt, setPrompt] = useState(urlQuery)
  const [activeQuery, setActiveQuery] = useState("")
  const [results, setResults] = useState<MatchRow[]>([])
  const [intro, setIntro] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(!urlQuery)
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const runMatch = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (trimmed.length < 3) {
        setError(messageForCode("empty", trimmed))
        return
      }
      setLoading(true)
      setError("")
      setResults([])
      setIntro("")
      setActiveQuery(trimmed)
      setEditing(false)
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: trimmed, locale }),
        })
        const data = await res.json()
        if (!res.ok || data?.code) {
          setError(messageForCode(data?.code, trimmed))
          return
        }
        if (Array.isArray(data?.recommendations) && data.recommendations.length > 0) {
          setResults(data.recommendations.filter((row: MatchRow) => row?.tool?.id))
          setIntro(typeof data.intro === "string" ? data.intro : "")
        } else {
          setError(t("home.noResults"))
        }
      } catch {
        setError(messageForCode("unavailable", trimmed))
      } finally {
        setLoading(false)
      }
    },
    [locale, t],
  )

  useEffect(() => {
    if (!urlQuery) return
    setPrompt(urlQuery)
    void runMatch(urlQuery)
  }, [urlQuery, runMatch])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    void runMatch(prompt)
  }

  function startEdit() {
    setEditing(true)
    setError("")
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus()
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  const hasResults = !loading && !error && results.length > 0
  const showRecap = Boolean(activeQuery) && !editing

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <LocaleLink href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t("recommendation.backHome")}
        </LocaleLink>

        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <Shuriken className="size-3.5 text-primary" />
            {t("recommendation.kicker")}
          </p>
          <h1 className="font-display text-3xl leading-tight md:text-4xl">{t("recommendation.pageTitle")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("recommendation.pageLead")}</p>
        </header>

        {showRecap && (
          <section className="mb-6 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t("recommendation.queryLabel")}</p>
                <p className="mt-2 text-base leading-relaxed text-foreground">{activeQuery}</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={startEdit}>
                <Pencil className="mr-1.5 size-3.5" aria-hidden="true" />
                {t("recommendation.editQuery")}
              </Button>
            </div>
            {loading && (
              <p className="mt-4 text-sm text-muted-foreground">{t("home.findingShort")}</p>
            )}
          </section>
        )}

        {(editing || !activeQuery) && (
          <section className="mb-8 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="match-query" className="text-sm font-semibold text-foreground">
                {t("recommendation.formLabel")}
              </label>
              <Textarea
                ref={textareaRef}
                id="match-query"
                name="query"
                required
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={t("home.placeholder")}
                className="min-h-[120px] resize-none"
                disabled={loading}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={loading || !prompt.trim()}>
                {loading ? t("home.findingShort") : t("recommendation.runMatch")}
              </Button>
            </form>
            {error && (
              <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground">
                {error}
              </p>
            )}
          </section>
        )}

        {!editing && error && !loading && (
          <p role="alert" className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        {hasResults && (
          <section className="space-y-6">
            {intro ? (
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{intro}</p>
            ) : null}
            <h2 className="font-display text-xl">{t("recommendation.resultsTitle")}</h2>
            <ol className="flex flex-col gap-5">
              {results.map((row, index) => (
                <li key={row.tool.id}>
                  <MatchResultCard rank={index + 1} tool={row.tool} reason={row.explanation} featured={index === 0} />
                </li>
              ))}
            </ol>
            <div className="pt-2">
              <Button type="button" variant="secondary" onClick={startEdit}>
                {t("recommendation.runAgain")}
              </Button>
            </div>
          </section>
        )}

        {!loading && !error && activeQuery && results.length === 0 && !editing && (
          <p className="text-center text-sm text-muted-foreground">{t("home.empty")}</p>
        )}
      </div>
    </div>
  )
}
