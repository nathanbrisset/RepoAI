"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import { categoryArt } from "@/lib/directory/art"
import { wallTools } from "@/lib/directory/filter"
import { heroSlides } from "@/lib/i18n/messages"
import { localizeHref } from "@/lib/i18n/paths"
import { useLocale, useT } from "@/components/locale-provider"
import { Shuriken } from "./shuriken"
import { ToolLogo } from "./tool-logo"
import { useDirectory } from "./directory-context"

export function Hero() {
  const t = useT()
  const locale = useLocale()
  const { tools, query, category, sort, collectionId, setQuery, openTool } = useDirectory()
  const slides = useMemo(() => heroSlides(locale), [locale])
  const [wordIndex, setWordIndex] = useState(0)
  const [throwId, setThrowId] = useState(0)
  const [throwing, setThrowing] = useState(false)
  const [mode, setMode] = useState<"search" | "ai">("search")
  const [reduced, setReduced] = useState(false)
  const word = slides[wordIndex]?.word || slides[0]?.word || ""
  const artId = slides[wordIndex]?.id || slides[0]?.id

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reduced || slides.length < 2) return
    const id = window.setInterval(() => setWordIndex((index) => (index + 1) % slides.length), 2200)
    return () => window.clearInterval(id)
  }, [reduced, slides.length])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 1) return []
    return tools
      .filter((tool) => [tool.name, tool.tagline, ...tool.tags].some((value) => value.toLowerCase().includes(q)))
      .slice(0, 5)
  }, [query, tools])

  const aiMatches = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter((part) => part.length > 3)
    if (!words.length) return []
    return tools
      .filter((tool) => [tool.tagline, tool.description, ...tool.tags].some((value) => words.some((word) => value.toLowerCase().includes(word))))
      .slice(0, 4)
  }, [query, tools])

  function throwShuriken() {
    if (throwing) return
    const visible = wallTools(tools, { query, category, sort, collectionId, locale })
    const pool = visible.length ? visible : tools
    if (!pool.length) return
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (reduced) {
      openTool(pick.id)
      return
    }
    setThrowing(true)
    setThrowId((n) => n + 1)
    window.setTimeout(() => {
      setThrowing(false)
      openTool(pick.id)
    }, 750)
  }

  const shown = mode === "search" ? suggestions : aiMatches

  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-8 pb-6 md:px-6 md:pt-14 md:pb-10">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <p className="text-sm font-medium text-muted-foreground">{t("home.eyebrow", { count: tools.length })}</p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
            {t("home.heroLine1")} {t("home.heroLine2")}{" "}
            <span className="relative inline-block text-primary">
              <span key={word} className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-500">
                {word}
              </span>
              <span aria-hidden="true" className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-accent/80 md:h-3" />
            </span>
          </h1>

          <div className="relative w-full max-w-3xl">
            <form
              className="flex items-center gap-2 rounded-[1.75rem] bg-card p-2 shadow-xl ring-2 ring-primary/20 focus-within:ring-primary"
              onSubmit={(event) => {
                event.preventDefault()
                if (mode === "ai" && query.trim()) {
                  window.location.assign(localizeHref(locale, `/recommendation?query=${encodeURIComponent(query.trim())}`))
                  return
                }
                if (suggestions[0]) openTool(suggestions[0].id)
              }}
            >
              {mode === "ai" ? (
                <Sparkles className="ml-3 size-5 shrink-0 text-accent" aria-hidden="true" />
              ) : (
                <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("")
                }}
                placeholder={mode === "ai" ? t("directory.aiPlaceholder", { word }) : t("home.searchPlaceholder")}
                className="h-12 min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-muted-foreground"
                aria-label={mode === "ai" ? t("directory.aiLabel") : t("directory.searchLabel")}
              />
              <div className="flex rounded-full bg-muted p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("search")}
                  className={`rounded-full px-3 py-2 ${mode === "search" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                  aria-pressed={mode === "search"}
                >
                  {t("home.searchAction")}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("ai")}
                  className={`rounded-full px-3 py-2 ${mode === "ai" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
                  aria-pressed={mode === "ai"}
                >
                  {t("home.matchAction")}
                </button>
              </div>
            </form>
            {query && shown.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-3xl bg-card p-2 shadow-2xl ring-1 ring-border">
                {shown.map((tool) => (
                  <button
                    type="button"
                    key={tool.id}
                    onClick={() => openTool(tool.id)}
                    className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-muted"
                  >
                    <ToolLogo tool={tool} className="size-10 rounded-xl" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{tool.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {mode === "ai" ? t("directory.fitsBecause", { tagline: tool.tagline }) : tool.tagline}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={throwShuriken}
            aria-busy={throwing}
            className="group flex items-center gap-3 rounded-full bg-accent py-1.5 pr-5 pl-2 text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:bg-accent/90"
          >
            <span className="grid size-9 place-items-center rounded-full bg-accent-foreground/15">
              <Shuriken
                key={throwId}
                className={throwing ? "size-6 animate-throw" : "size-6 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:rotate-90"}
              />
            </span>
            <span className="flex flex-col items-start text-left">
              <span className="font-display text-base leading-tight">{t("home.shuriken")}</span>
              <span className="text-sm text-accent-foreground/80">{throwing ? t("directory.aiming") : t("home.shurikenHint")}</span>
            </span>
          </button>
        </div>

        <div className="hidden min-w-0 items-center justify-center md:flex">
          <img
            src={categoryArt(artId)}
            alt={t("directory.heroArt", { word })}
            width={520}
            height={400}
            className="h-auto max-h-[360px] w-full max-w-[440px] object-contain"
          />
        </div>
      </div>
    </section>
  )
}
