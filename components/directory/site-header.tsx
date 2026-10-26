"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Bookmark, Flame, Menu, Plus, Search, Sparkles, Trophy, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { localizeHref, stripLocale } from "@/lib/i18n/paths"
import { useDirectory } from "./directory-provider"

export type SortMode = "trending" | "new" | "top"

const sortOptions: { id: SortMode; icon: typeof Flame }[] = [
  { id: "trending", icon: Flame },
  { id: "new", icon: Sparkles },
  { id: "top", icon: Trophy },
]

function writeLocaleCookie(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
}

function SiteHeaderInner() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()
  const { chips, total, saved, setSavedOpen, records, openTool } = useDirectory()
  const inputRef = useRef<HTMLInputElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const bare = stripLocale(pathname)
  const onFilterable = bare === "/catalogue" || bare === "/tools"
  const base = bare === "/tools" ? "/tools" : "/catalogue"
  const category = onFilterable ? searchParams.get("category") || "" : ""
  const sort = (searchParams.get("sort") as SortMode) || "trending"
  const query = onFilterable ? searchParams.get("q") || "" : ""
  const [draft, setDraft] = useState(query)

  useEffect(() => {
    setDraft(query)
  }, [query])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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

  useEffect(() => {
    if (!onFilterable || draft === query) return
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (draft) params.set("q", draft)
      else params.delete("q")
      const next = params.toString()
      router.replace(localizeHref(locale, next ? `${base}?${next}` : base), { scroll: false })
    }, 200)
    return () => window.clearTimeout(handle)
  }, [draft, onFilterable, query, base, locale, router, searchParams])

  function pushCatalogue(updates: Record<string, string | null>, path = base) {
    const params = new URLSearchParams(onFilterable && path === base ? searchParams.toString() : "")
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete("tool")
    const next = params.toString()
    router.push(localizeHref(locale, next ? `${path}?${next}` : path))
    setMenuOpen(false)
  }

  function chooseLocale(next: Locale) {
    if (next === locale) return
    writeLocaleCookie(next)
    const href = localizeHref(next, bare)
    const current = searchParams.toString()
    window.location.assign(current ? `${href}?${current}` : href)
  }

  const suggestions = useMemo(() => {
    const needle = draft.trim().toLowerCase()
    if (needle.length < 2) return []
    return records
      .filter((tool) =>
        [tool.name, tool.description, tool.categories.join(" "), tool.tags.join(" ")].join(" ").toLowerCase().includes(needle),
      )
      .slice(0, 6)
  }, [draft, records])

  const sortLabel = { trending: t.sortTrending, new: t.sortNew, top: t.sortTop }

  return (
    <header className={cn("sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur", scrolled && "shadow-sm")}>
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 md:gap-4 md:px-6">
        <LocaleLink href="/" className="flex shrink-0 items-center" aria-label="AItools.ninja">
          <img
            src="/brand/aitools-ninja-logo.png"
            alt="AItools.ninja"
            width={212}
            height={73}
            decoding="async"
            className="h-8 w-auto sm:h-9"
          />
        </LocaleLink>

        <nav aria-label={t.primaryNav} className="hidden items-center gap-4 text-sm font-semibold lg:flex">
          <LocaleLink href="/catalogue" className="hover:text-primary">{t.navCatalogue}</LocaleLink>
          <LocaleLink href="/collections" className="hover:text-primary">{t.navCollections}</LocaleLink>
          <LocaleLink href="/automations" className="text-muted-foreground hover:text-primary">{t.navAutomations}</LocaleLink>
        </nav>

        <form
          role="search"
          className="relative min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            pushCatalogue({ q: draft || null }, "/catalogue")
            setFocused(false)
          }}
        >
          <label htmlFor="tool-search" className="sr-only">{t.searchLabel}</label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            id="tool-search"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setDraft("")
                if (onFilterable) pushCatalogue({ q: null })
              }
            }}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-full bg-card pr-12 pl-12 text-base ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
          />
          {draft ? (
            <button
              type="button"
              onClick={() => {
                setDraft("")
                if (onFilterable) pushCatalogue({ q: null })
              }}
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              aria-label={t.clearSearch}
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground md:block">/</kbd>
          )}
          {focused && suggestions.length > 0 ? (
            <ul className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-3xl bg-card p-2 text-left shadow-2xl ring-1 ring-border">
              {suggestions.map((tool) => (
                <li key={tool.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      openTool(tool.id)
                      setFocused(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold">{tool.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{tool.description}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </form>

        <LocaleLink href="/compare" className="hidden h-12 shrink-0 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-border hover:bg-card lg:flex">
          {t.compare}
        </LocaleLink>
        <div className="hidden items-center gap-1 text-xs font-bold md:flex">
          <button type="button" onClick={() => chooseLocale("fr")} className={locale === "fr" ? "text-primary" : "text-muted-foreground"} aria-pressed={locale === "fr"}>FR</button>
          <span className="text-muted-foreground">|</span>
          <button type="button" onClick={() => chooseLocale("en")} className={locale === "en" ? "text-primary" : "text-muted-foreground"} aria-pressed={locale === "en"}>EN</button>
        </div>
        <LocaleLink href="/submit" className="hidden h-12 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 ring-border hover:bg-card md:flex">
          <Plus className="size-4" aria-hidden="true" />
          {t.submit}
        </LocaleLink>
        <button
          type="button"
          onClick={() => setSavedOpen(true)}
          className="relative flex h-12 shrink-0 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-semibold text-background hover:bg-primary md:px-5"
        >
          <Bookmark className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.scroll}</span>
          <span className="sr-only sm:hidden">{t.savedTools}</span>
          <span className={cn("grid min-w-6 place-items-center rounded-full px-1.5 text-xs leading-6", saved.length > 0 ? "bg-accent text-accent-foreground" : "bg-background/15 text-background")}>
            {saved.length}
          </span>
        </button>
        <button type="button" className="grid size-10 place-items-center rounded-full ring-1 ring-border lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? t.closeMenu : t.openMenu}>
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border px-4 py-4 lg:hidden">
          <div className="mb-3 flex items-center gap-3 text-sm font-bold">
            <button type="button" onClick={() => chooseLocale("fr")} className={locale === "fr" ? "text-primary" : "text-muted-foreground"}>FR</button>
            <span>|</span>
            <button type="button" onClick={() => chooseLocale("en")} className={locale === "en" ? "text-primary" : "text-muted-foreground"}>EN</button>
          </div>
          <nav className="flex flex-col gap-3 text-base font-semibold" aria-label={t.primaryNav}>
            <LocaleLink href="/catalogue" onClick={() => setMenuOpen(false)}>{t.navCatalogue}</LocaleLink>
            <LocaleLink href="/collections" onClick={() => setMenuOpen(false)}>{t.navCollections}</LocaleLink>
            <LocaleLink href="/automations" onClick={() => setMenuOpen(false)}>{t.navAutomations}</LocaleLink>
            <LocaleLink href="/compare" onClick={() => setMenuOpen(false)}>{t.compare}</LocaleLink>
            <LocaleLink href="/submit" onClick={() => setMenuOpen(false)}>{t.submit}</LocaleLink>
          </nav>
        </div>
      ) : null}

      {bare === "/automations" ? null : (
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 pb-3 md:px-6">
        <nav aria-label={t.categoriesLabel} className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          <button
            type="button"
            onClick={() => pushCatalogue({ category: null })}
            aria-pressed={onFilterable && !category}
            className={cn(
              "flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium",
              onFilterable && !category ? "bg-primary text-primary-foreground" : "bg-card text-foreground ring-1 ring-border hover:-translate-y-0.5",
            )}
          >
            {t.everything}
            <span className={cn("text-xs tabular-nums", onFilterable && !category ? "text-primary-foreground/70" : "text-muted-foreground")}>{total}</span>
          </button>
          {chips.map((chip) => {
            const active = chip.id === category
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => pushCatalogue({ category: chip.id })}
                aria-pressed={active}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium",
                  active ? "bg-primary text-primary-foreground" : "bg-card text-foreground ring-1 ring-border hover:-translate-y-0.5",
                )}
              >
                {chip.label}
                <span className={cn("text-xs tabular-nums", active ? "text-primary-foreground/70" : "text-muted-foreground")}>{chip.count}</span>
              </button>
            )
          })}
        </nav>
        <div role="radiogroup" aria-label={t.sortLabel} className="hidden shrink-0 items-center gap-1 rounded-full bg-card p-1 ring-1 ring-border lg:flex">
          {sortOptions.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={onFilterable && sort === id}
              onClick={() => pushCatalogue({ sort: id === "trending" ? null : id })}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-full px-3 text-sm font-medium",
                onFilterable && sort === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {sortLabel[id]}
            </button>
          ))}
        </div>
      </div>
      )}
    </header>
  )
}

export function SiteHeader() {
  return (
    <Suspense fallback={<div className="h-[108px] border-b border-border bg-background" />}>
      <SiteHeaderInner />
    </Suspense>
  )
}
