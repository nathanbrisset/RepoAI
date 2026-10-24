"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Bookmark, Flame, GitCompareArrows, Plus, Search, Sparkles, Trophy, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { categoryCatalog } from "@/lib/category-meta"
import { categoryCopy } from "@/lib/i18n/messages"
import LocaleLink from "@/components/locale-link"
import LanguageSwitcher from "@/components/language-switcher"
import { useLocale, useT } from "@/components/locale-provider"
import { Shuriken } from "./shuriken"
import { useDirectory, type SortMode } from "./directory-context"

export function SiteHeader() {
  const t = useT()
  const locale = useLocale()
  const {
    tools,
    query,
    category,
    sort,
    onHome,
    saved,
    setQuery,
    setCategory,
    setSort,
    setSavedOpen,
    clearFilters,
  } = useDirectory()
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState("")

  const counts = useMemo(() => {
    const source = onHome && query.trim()
      ? tools.filter((tool) => matchesQuery(tool, query, locale))
      : tools
    const result: Record<string, number> = { all: source.length }
    for (const item of categoryCatalog) result[item.id] = 0
    for (const tool of source) {
      for (const id of tool.categories) {
        if (result[id] !== undefined) result[id] += 1
      }
    }
    return result
  }, [tools, query, onHome, locale])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      if (event.key === "/" && !typing) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const shownQuery = onHome ? query : draft

  function submitSearch(value: string) {
    if (onHome) setQuery(value)
    else setQuery(value.trim())
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-3 md:gap-4 md:px-6">
        <LocaleLink
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label={t("directory.homeLabel")}
          onClick={(event) => {
            if (!onHome) return
            event.preventDefault()
            clearFilters()
          }}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-foreground text-background motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:rotate-180">
            <Shuriken className="size-5" />
          </span>
          <span className="hidden font-display text-lg leading-none sm:inline">
            aitools<span className="text-accent">.</span>ninja
          </span>
        </LocaleLink>

        <form
          role="search"
          className="relative min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            submitSearch(shownQuery)
          }}
        >
          <label htmlFor="tool-search" className="sr-only">
            {t("directory.searchLabel")}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            id="tool-search"
            type="search"
            value={shownQuery}
            onChange={(event) => {
              const value = event.target.value
              if (onHome) setQuery(value)
              else setDraft(value)
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                if (onHome) setQuery("")
                else setDraft("")
              }
            }}
            placeholder={t("directory.searchPlaceholder")}
            className="h-12 w-full rounded-full bg-card pr-12 pl-12 text-base ring-1 ring-border transition outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
          />
          {shownQuery ? (
            <button
              type="button"
              onClick={() => {
                if (onHome) setQuery("")
                else setDraft("")
                inputRef.current?.focus()
              }}
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              aria-label={t("directory.clearSearch")}
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground md:block">
              /
            </kbd>
          )}
        </form>

        <LocaleLink
          href="/compare"
          className="flex h-12 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold ring-1 ring-border transition hover:bg-card lg:px-4"
        >
          <GitCompareArrows className="size-4 lg:hidden" aria-hidden="true" />
          <span className="sr-only lg:hidden">{t("directory.compare")}</span>
          <span className="hidden lg:inline">{t("directory.compare")}</span>
        </LocaleLink>

        <LocaleLink
          href="/submit"
          className="hidden h-12 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 ring-border transition hover:bg-card md:flex"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t("header.submit")}
        </LocaleLink>

        <LanguageSwitcher />

        <button
          type="button"
          onClick={() => setSavedOpen(true)}
          className="relative flex h-12 shrink-0 items-center gap-2 rounded-full bg-foreground px-3 text-sm font-semibold text-background transition hover:bg-primary md:px-5"
        >
          <Bookmark className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("directory.myScroll")}</span>
          <span className="sr-only sm:hidden">{t("directory.myScrollShort")}</span>
          <span
            className={cn(
              "grid min-w-6 place-items-center rounded-full px-1.5 text-xs leading-6",
              saved.length > 0 ? "bg-accent text-accent-foreground" : "bg-background/15 text-background",
            )}
          >
            {saved.length}
          </span>
        </button>
      </div>

      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 pb-3 md:px-6">
        <nav aria-label={t("header.categories")} className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          <CategoryChip
            label={t("header.everything")}
            count={counts.all || 0}
            active={onHome && category === "all"}
            onClick={() => setCategory("all")}
          />
          {categoryCatalog.map((item) => (
            <CategoryChip
              key={item.id}
              label={categoryCopy(locale, item.id)?.name || item.name}
              count={counts[item.id] || 0}
              active={onHome && category === item.id}
              onClick={() => setCategory(item.id)}
            />
          ))}
        </nav>

        <div role="radiogroup" aria-label={t("directory.sortLabel")} className="flex shrink-0 items-center gap-1 rounded-full bg-card p-1 ring-1 ring-border">
          <SortButton id="trending" label={t("directory.sortTrending")} hint={t("directory.sortTrendingHint")} icon={Flame} current={sort} onHome={onHome} onSort={setSort} />
          <SortButton id="new" label={t("directory.sortNew")} hint={t("directory.sortNewHint")} icon={Sparkles} current={sort} onHome={onHome} onSort={setSort} />
          <SortButton id="top" label={t("directory.sortTop")} hint={t("directory.sortTopHint")} icon={Trophy} current={sort} onHome={onHome} onSort={setSort} />
        </div>
      </div>
    </header>
  )
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition",
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground ring-1 ring-border hover:-translate-y-0.5 hover:ring-foreground/40",
      )}
    >
      {label}
      <span className={cn("text-xs tabular-nums", active ? "text-primary-foreground/70" : "text-muted-foreground")}>{count}</span>
    </button>
  )
}

function SortButton({
  id,
  label,
  hint,
  icon: Icon,
  current,
  onHome,
  onSort,
}: {
  id: SortMode
  label: string
  hint: string
  icon: typeof Flame
  current: SortMode
  onHome: boolean
  onSort: (mode: SortMode) => void
}) {
  const selected = onHome && current === id
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      title={hint}
      onClick={() => onSort(id)}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition md:px-3",
        selected ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  )
}

function matchesQuery(tool: { name: string; tagline: string; description: string; tags: string[]; categories: string[] }, query: string, locale: "en" | "fr") {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const fields = [
    tool.name,
    tool.tagline,
    tool.description,
    ...tool.tags,
    ...tool.categories,
    ...tool.categories.map((id) => categoryCopy(locale, id)?.name || ""),
  ]
  return fields.some((field) => field.toLowerCase().includes(q))
}
