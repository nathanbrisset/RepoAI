"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, ExternalLink, Play, Search, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import type { DirectoryDoor, DirectoryRecord, ResolvedCollection } from "@/lib/directory/data"
import { CollectionCard } from "./collection-card"
import { Shuriken } from "./shuriken"
import { ToolCard } from "./tool-card"
import { useDirectory } from "./directory-provider"

function EpisodeCard({ compact = false }: { compact?: boolean }) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  if (compact) {
    return (
      <article className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 shadow-md ring-1 ring-border lg:hidden">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-foreground">
          <img src="/art/chat.webp" alt={t.episodeAlt} className="size-full object-cover" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-7 place-items-center rounded-full bg-accent text-accent-foreground shadow">
              <Play className="ml-0.5 size-3.5 fill-current" />
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.14em] text-accent">{t.episodeKicker}</p>
          <h2 className="mt-1 truncate font-display text-sm">{t.episodeTitle}</h2>
        </div>
        <LocaleLink href="/collections/kit-shorts-youtube" className="shrink-0 text-xs font-semibold text-primary">
          {t.episodeWatch}
        </LocaleLink>
      </article>
    )
  }

  return (
    <article className="hidden h-full max-h-[340px] w-full max-w-[460px] overflow-hidden rounded-[2rem] bg-card p-4 shadow-xl ring-1 ring-border lg:flex lg:gap-4">
      <div className="relative aspect-[9/16] h-full max-h-[300px] w-auto shrink-0 overflow-hidden rounded-2xl bg-foreground">
        <img src="/art/chat.webp" alt={t.episodeAlt} className="size-full object-cover" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg">
            <Play className="ml-1 size-6 fill-current" />
          </span>
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-accent">{t.episodeKicker}</p>
          <h2 className="mt-3 font-display text-xl leading-tight">{t.episodeTitle}</h2>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold">
          <LocaleLink href="/collections/kit-shorts-youtube" className="text-primary hover:underline">
            {t.episodeWatch} <ArrowRight className="inline size-4" />
          </LocaleLink>
          <LocaleLink href="/tool/chatgpt" className="text-primary hover:underline">
            {t.episodePrompt} <ExternalLink className="inline size-3.5" />
          </LocaleLink>
        </div>
      </div>
    </article>
  )
}

export function HomeDirectory({
  picks,
  collections,
  doors,
  categoryTotal,
  stack,
}: {
  picks: DirectoryRecord[]
  collections: ResolvedCollection[]
  doors: DirectoryDoor[]
  categoryTotal: number
  stack: DirectoryRecord[]
}) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const { total, records, openTool } = useDirectory()
  const [wordIndex, setWordIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<"search" | "ai">("search")
  const [throwing, setThrowing] = useState(false)
  const [throwId, setThrowId] = useState(0)

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

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle.length < 2) return []
    return records
      .filter((tool) => [tool.name, tool.description, tool.tags.join(" ")].join(" ").toLowerCase().includes(needle))
      .slice(0, mode === "ai" ? 4 : 5)
  }, [query, records, mode])

  function handleThrow() {
    if (throwing || records.length === 0) return
    setThrowing(true)
    setThrowId((value) => value + 1)
    window.setTimeout(() => {
      const pick = records[Math.floor(Math.random() * records.length)]
      setThrowing(false)
      if (pick) openTool(pick.id)
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

  return (
    <div className="overflow-x-hidden">
      <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)] lg:py-16">
        <div className="min-w-0">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-accent">{t.dojo}</p>
          <p className="mb-4 text-sm text-muted-foreground">{fill(t.dojoMeta, { count: total })}</p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-tight md:text-7xl">
            {t.heroLead}{" "}
            <span className="relative inline-block text-primary">
              <span key={t.words[wordIndex]} className="inline-block min-w-[7ch]">
                {t.words[wordIndex]}
              </span>
              <span aria-hidden="true" className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-accent/80 md:h-3" />
            </span>
          </h1>
          <form onSubmit={submitHero} className="relative mt-8 max-w-2xl">
            <div className="flex flex-col gap-2 rounded-[1.75rem] bg-card p-2 shadow-xl ring-2 ring-primary/20 focus-within:ring-primary sm:flex-row sm:items-center">
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
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button type="button" onClick={handleThrow} aria-busy={throwing} className="inline-flex items-center gap-3 rounded-full bg-accent py-2 pr-5 pl-2 font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:-translate-y-0.5">
              <span className="grid size-9 place-items-center rounded-full bg-accent-foreground/15">
                <Shuriken key={throwId} className={throwing ? "size-6 animate-throw" : "size-6"} />
              </span>
              {throwing ? t.throwing : t.throw}
            </button>
            <LocaleLink href="/catalogue" className="font-semibold text-primary">
              {t.browse} <ArrowRight className="inline size-4" />
            </LocaleLink>
          </div>
          <div className="mt-6">
            <EpisodeCard compact />
          </div>
        </div>
        <div className="hidden justify-center lg:flex">
          <EpisodeCard />
        </div>
      </section>

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
        <div className="rounded-[2rem] bg-foreground px-6 py-10 text-background md:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.shortsKicker}</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-display text-3xl md:text-5xl">{t.shortsTitle}</h2>
            <LocaleLink href="/collections/kit-shorts-youtube" className="inline-flex items-center rounded-full bg-accent px-5 py-3 font-bold text-accent-foreground">
              {t.watchSeries} <ArrowRight className="ml-1 size-4" />
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
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

      <section className="mx-auto max-w-[1400px] border-t border-border px-4 py-12 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.doorsKicker}</p>
        <h2 className="mt-1 font-display text-3xl">{t.doorsTitle}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {doors.map((door) => (
            <LocaleLink key={door.id} href={`/catalogue?category=${door.id}`} className="rounded-2xl bg-card p-3 font-semibold ring-1 ring-border transition hover:-translate-y-1">
              <img src={door.art} alt="" className="mb-3 h-24 w-full rounded-xl object-cover" />
              <span className="block">{door.label}</span>
              <span className="mt-1 block text-sm font-medium text-muted-foreground">{door.count}</span>
            </LocaleLink>
          ))}
        </div>
        <LocaleLink href="/categories" className="mt-5 inline-block font-semibold text-primary">
          {fill(t.allCategories, { count: categoryTotal })} <ArrowRight className="inline size-4" />
        </LocaleLink>
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
    </div>
  )
}
