"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import { fetchDirectoryRecords, fetchDirectorySearch } from "@/lib/directory/client-records"
import type { DirectoryRecord, ResolvedCollection } from "@/lib/directory/data"
import { homeCountryCatalogueFilter } from "@/lib/home-country-section"
import { CategoryChipsBar } from "./category-chips-bar"
import { CollectionCard } from "./collection-card"
import { Shuriken } from "./shuriken"
import { ToolCard } from "./tool-card"
import { useDirectory } from "./directory-provider"
import { AiMatchSwipeModal } from "@/components/ai-match-swipe/ai-match-swipe-modal"

export function HomeDirectory({
  picks,
  collections,
  categoryTotal,
  stack,
  countryTools = [],
}: {
  picks: DirectoryRecord[]
  collections: ResolvedCollection[]
  categoryTotal: number
  stack: DirectoryRecord[]
  countryTools?: DirectoryRecord[]
}) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const { total, openTool } = useDirectory()
  const [wordIndex, setWordIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<"search" | "ai">("ai")
  const [throwing, setThrowing] = useState(false)
  const [throwId, setThrowId] = useState(0)
  const [swipeOpen, setSwipeOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<DirectoryRecord[]>([])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setWordIndex((index) => (index + 1) % t.words.length), 2500)
    return () => window.clearInterval(id)
  }, [reducedMotion, t.words.length])

  useEffect(() => {
    const needle = query.trim()
    if (needle.length < 2) {
      setSuggestions([])
      return
    }
    const handle = window.setTimeout(() => {
      void fetchDirectorySearch(needle, mode === "ai" ? 4 : 5).then(setSuggestions)
    }, 200)
    return () => window.clearTimeout(handle)
  }, [query, mode])

  function handleThrow() {
    if (throwing) return
    setThrowing(true)
    setThrowId((value) => value + 1)
    window.setTimeout(() => {
      void fetchDirectoryRecords("random=1").then((rows) => {
        setThrowing(false)
        const pick = rows[0]
        if (pick) openTool(pick.id)
      })
    }, 700)
  }

  function submitHero(event: React.FormEvent) {
    event.preventDefault()
    const value = query.trim()
    if (mode === "ai") {
      router.push(localizeHref(locale, value ? `/recommendation?query=${encodeURIComponent(value)}` : "/recommendation"))
      return
    }
    router.push(localizeHref(locale, value ? `/catalogue?q=${encodeURIComponent(value)}` : "/catalogue"))
  }

  const countryCatalogueHref = `/catalogue?hqCountry=${encodeURIComponent(homeCountryCatalogueFilter(locale))}`
  const countryCta = locale === "fr" ? t.homeCountryCtaFr : t.homeCountryCta

  return (
    <div className="overflow-x-hidden">
      <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 lg:py-16">
        <div className="min-w-0 w-full">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-accent">{t.dojo}</p>
          <p className="mb-4 text-sm text-muted-foreground">{fill(t.dojoMeta, { count: total })}</p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-tight md:text-7xl">
            <span className="block text-foreground">{t.heroLead}</span>
            <span className="relative mt-3 block text-primary md:mt-4">
              <span key={t.words[wordIndex]} className="inline-block min-w-[10ch]">
                {t.words[wordIndex]}
              </span>
              <span aria-hidden="true" className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-accent/80 md:h-3" />
            </span>
          </h1>
          <form onSubmit={submitHero} className="relative mt-8 w-full max-w-none">
            <div className={`flex flex-col gap-2 rounded-[1.75rem] bg-card p-2 shadow-xl ring-2 focus-within:ring-primary sm:flex-row sm:items-center ${mode === "ai" ? "ring-accent/50" : "ring-primary/20"}`}>
              {mode === "ai" ? <Sparkles className="ml-3 hidden size-5 shrink-0 text-accent sm:block" /> : <Search className="ml-3 hidden size-5 shrink-0 text-muted-foreground sm:block" />}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={mode === "ai" ? t.heroSearchAi : t.heroSearch}
                aria-label={mode === "ai" ? t.heroSearchAi : t.heroSearch}
                className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
              />
              <div className="flex rounded-full bg-muted p-1 text-xs font-semibold">
                <button type="button" onClick={() => setMode("search")} className={`rounded-full px-3 py-2 ${mode === "search" ? "bg-foreground text-background" : "text-muted-foreground"}`} aria-pressed={mode === "search"}>
                  {t.searchMode}
                </button>
                <button type="button" onClick={() => setMode("ai")} className={`rounded-full px-3 py-2 ${mode === "ai" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`} aria-pressed={mode === "ai"}>
                  {t.aiMatch}
                </button>
              </div>
            </div>
            {suggestions.length > 0 ? (
              <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-3xl bg-card p-2 shadow-2xl ring-1 ring-border">
                {suggestions.map((tool) => (
                  <button key={tool.id} type="button" onClick={() => openTool(tool.id)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-muted">
                    <span className="min-w-0">
                      <span className="block font-semibold">{tool.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{tool.description}</span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : null}
          </form>
          <div className="mt-6 flex flex-col gap-4 max-sm:pb-[var(--cookie-banner-h,0px)]">
            <button
              type="button"
              onClick={() => setSwipeOpen(true)}
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-3 rounded-full bg-accent px-8 py-3.5 text-base font-bold text-accent-foreground shadow-xl shadow-accent/30 ring-2 ring-primary hover:-translate-y-0.5 sm:w-auto md:min-h-[3.25rem] md:px-10 md:text-lg"
            >
              <Shuriken className="size-5 md:size-6" />
              {t.startSwipingCta}
            </button>
            <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={handleThrow} aria-busy={throwing} className="inline-flex min-h-11 items-center gap-3 rounded-full bg-muted py-2 pr-5 pl-2 font-semibold text-foreground ring-1 ring-border hover:-translate-y-0.5">
              <span className="grid size-9 place-items-center rounded-full bg-foreground/10">
                <Shuriken key={throwId} className={throwing ? "size-6 animate-throw" : "size-6"} />
              </span>
              {throwing ? t.throwing : t.throw}
            </button>
            <LocaleLink href="/catalogue" className="font-semibold text-primary">
              {t.browse} <ArrowRight className="inline size-4" />
            </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] border-t border-border px-4 py-4 md:px-6 md:pb-6">
        <CategoryChipsBar
          onSelectCategory={(id) => {
            router.push(localizeHref(locale, id ? `/catalogue?category=${encodeURIComponent(id)}` : "/catalogue"))
          }}
        />
        <LocaleLink href="/categories" className="mt-4 inline-block font-semibold text-primary">
          {fill(t.allCategories, { count: categoryTotal })} <ArrowRight className="inline size-4" />
        </LocaleLink>
      </section>

      {countryTools.length > 0 ? (
        <section className="mx-auto max-w-[1400px] border-t border-border px-4 py-12 md:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl">{t.homeCountryTitle}</h2>
            <LocaleLink href={countryCatalogueHref} className="font-semibold">
              {countryCta} <ArrowRight className="inline size-4" />
            </LocaleLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countryTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1400px] min-w-0 overflow-hidden border-t border-border px-4 py-12 md:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.collectionsKicker}</p>
            <h2 className="font-display text-3xl">{t.collectionsTitle}</h2>
          </div>
          <LocaleLink href="/collections" className="hidden shrink-0 font-semibold sm:inline">
            {t.allCollections} <ArrowRight className="inline size-4" />
          </LocaleLink>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {collections.slice(0, 4).map((collection, index) => (
            <CollectionCard key={collection.slug} slug={collection.slug} title={collection.title} blurb={collection.blurb} tools={collection.tools} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto my-4 max-w-[1400px] px-4 md:px-8">
        <div className="rounded-[2rem] bg-foreground px-6 py-8 text-background md:px-10 md:py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.shortsKicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{t.shortsTitle}</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-background/75 md:text-base">{t.episodeTitle}</p>
          <LocaleLink
            href="/collections/kit-shorts-youtube"
            className="mt-5 inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground md:text-base"
          >
            {t.watchSeries} <ArrowRight className="ml-1 size-4" />
          </LocaleLink>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] border-t border-border px-4 py-12 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.selectionKicker}</p>
            <h2 className="font-display text-3xl">{t.selectionTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.selectionNote}</p>
          </div>
          <LocaleLink href="/catalogue" className="font-semibold">
            {t.viewCatalogue} <ArrowRight className="inline size-4" />
          </LocaleLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto mb-16 max-w-[1400px] px-4 md:px-8">
        <div className="rounded-[2rem] border-2 border-primary bg-card p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.featuredKicker}</p>
          <h2 className="mt-2 font-display text-3xl">{t.featuredTitle}</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.featuredBody}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((tool) => (
              <LocaleLink key={tool.id} href={`/tool/${tool.id}`} className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                {tool.name}
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>
      <AiMatchSwipeModal open={swipeOpen} onOpenChange={setSwipeOpen} />
    </div>
  )
}
