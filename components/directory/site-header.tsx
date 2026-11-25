"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { Bookmark, Menu, Plus, Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { localizeHref, stripLocale } from "@/lib/i18n/paths"
import { fetchDirectorySearch } from "@/lib/directory/client-records"
import { listingQueryHref } from "@/lib/directory/listing-query-params"
import { useDebouncedUrlDraft } from "@/lib/directory/use-debounced-url-draft"
import type { DirectoryRecord } from "@/lib/directory/data"
import { CategoryChipsBar, type SortMode } from "./category-chips-bar"
import { useDirectory } from "./directory-provider"

export type { SortMode }

function writeLocaleCookie(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>, onEscape: () => void) {
  useEffect(() => {
    if (!active || !containerRef.current) return
    const root = containerRef.current
    const previous = document.activeElement as HTMLElement | null

    const focusables = () =>
      [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.hasAttribute("disabled"))

    const firstInput = root.querySelector<HTMLInputElement>('input[type="search"]')
    if (firstInput) firstInput.focus()
    else focusables()[0]?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onEscape()
        return
      }
      if (event.key !== "Tab") return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    root.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      root.removeEventListener("keydown", onKeyDown)
      previous?.focus()
    }
  }, [active, containerRef, onEscape])
}

type SearchSuggestionsProps = {
  suggestions: DirectoryRecord[]
  onPick: (id: string) => void
}

function SearchSuggestions({ suggestions, onPick }: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null
  return (
    <ul className="mt-2 overflow-hidden rounded-3xl bg-card p-2 text-left shadow-2xl ring-1 ring-border">
      {suggestions.map((tool) => (
        <li key={tool.id}>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onPick(tool.id)}
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
  )
}

function SiteHeaderInner() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()
  const { saved, setSavedOpen, openTool } = useDirectory()
  const inputRef = useRef<HTMLInputElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<DirectoryRecord[]>([])
  const bare = stripLocale(pathname)
  const onFilterable = bare === "/catalogue" || bare === "/tools"
  const base = bare === "/tools" ? "/tools" : "/catalogue"
  const category = onFilterable ? searchParams.get("category") || "" : ""
  const urlQ = onFilterable ? searchParams.get("q") || "" : ""
  const [sort, setSort] = useState<SortMode>("trending")

  const commitHeaderQuery = useCallback(
    (value: string) => {
      if (!onFilterable) return
      const href = listingQueryHref(base, searchParams, { q: value || null }, { resetPage: true })
      router.replace(localizeHref(locale, href), { scroll: false })
    },
    [onFilterable, base, searchParams, router, locale],
  )

  const { draft, setDraft } = useDebouncedUrlDraft(urlQ, commitHeaderQuery, 250)

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false)
    setFocused(false)
  }, [])

  useFocusTrap(mobileSearchOpen, mobilePanelRef, closeMobileSearch)

  useEffect(() => {
    const fromUrl = searchParams.get("sort")
    setSort((fromUrl as SortMode) || "trending")
  }, [searchParams])

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
        if (window.matchMedia("(min-width: 640px)").matches) {
          inputRef.current?.focus()
        } else {
          setMobileSearchOpen(true)
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function pushCatalogue(updates: Record<string, string | null>, path = base) {
    const params = new URLSearchParams(onFilterable && path === base ? searchParams.toString() : "")
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete("tool")
    const next = params.toString()
    router.replace(localizeHref(locale, next ? `${path}?${next}` : path), { scroll: false })
    setMenuOpen(false)
    closeMobileSearch()
  }

  function chooseLocale(next: Locale) {
    if (next === locale) return
    writeLocaleCookie(next)
    const href = localizeHref(next, bare)
    const current = searchParams.toString()
    window.location.assign(current ? `${href}?${current}` : href)
  }

  useEffect(() => {
    const needle = draft.trim()
    if (needle.length < 2) {
      setSuggestions([])
      return
    }
    const handle = window.setTimeout(() => {
      void fetchDirectorySearch(needle, 6).then(setSuggestions)
    }, 200)
    return () => window.clearTimeout(handle)
  }, [draft])

  function clearDraft() {
    setDraft("")
    if (onFilterable) pushCatalogue({ q: null })
  }

  function submitSearch() {
    pushCatalogue({ q: draft || null }, "/catalogue")
    setFocused(false)
    closeMobileSearch()
  }

  function pickSuggestion(id: string) {
    openTool(id)
    setFocused(false)
    closeMobileSearch()
  }

  return (
    <header className={cn("sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur", scrolled && "shadow-sm")}>
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-3 sm:gap-3 md:gap-4 md:px-6">
        <LocaleLink
          href="/"
          className="group flex shrink-0 items-center gap-2.5 sm:mr-2 sm:gap-3.5 md:mr-4 md:gap-4 lg:mr-6"
          aria-label={t.brand}
        >
          <img
            src="/brand/aitools-ninja-mark.png"
            alt=""
            width={56}
            height={56}
            decoding="async"
            className="h-10 w-10 shrink-0 object-contain motion-safe:group-hover:animate-logo-shuriken-spin sm:h-12 sm:w-12 md:h-14 md:w-14"
          />
          <span className="font-display text-sm font-bold leading-none tracking-tight text-foreground sm:text-lg md:text-xl">
            {t.brand}
          </span>
        </LocaleLink>

        <nav aria-label={t.primaryNav} className="hidden items-center gap-4 text-sm font-semibold lg:flex">
          <LocaleLink href="/catalogue" className="hover:text-primary">{t.navCatalogue}</LocaleLink>
          <LocaleLink href="/collections" className="hover:text-primary">{t.navCollections}</LocaleLink>
          <LocaleLink href="/automations" className="text-muted-foreground hover:text-primary">{t.navAutomations}</LocaleLink>
        </nav>

        <form
          role="search"
          className="relative hidden min-w-0 flex-1 sm:block"
          onSubmit={(event) => {
            event.preventDefault()
            submitSearch()
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
                clearDraft()
              }
            }}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-full bg-card pr-12 pl-12 text-base ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
          />
          {draft ? (
            <button
              type="button"
              onClick={clearDraft}
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              aria-label={t.clearSearch}
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground md:block">/</kbd>
          )}
          {focused && suggestions.length > 0 ? (
            <div className="absolute top-full right-0 left-0 z-30">
              <SearchSuggestions suggestions={suggestions} onPick={pickSuggestion} />
            </div>
          ) : null}
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:ml-0 sm:gap-2">
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-border hover:bg-card sm:hidden"
            onClick={() => setMobileSearchOpen(true)}
            aria-label={t.openSearch}
          >
            <Search className="size-5" aria-hidden="true" />
          </button>

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
            className="relative grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-border hover:bg-card sm:flex sm:h-12 sm:min-w-0 sm:items-center sm:gap-2 sm:bg-foreground sm:px-4 sm:text-sm sm:font-semibold sm:text-background sm:ring-0 hover:sm:bg-primary md:px-5"
            aria-label={t.savedTools}
          >
            <Bookmark className="size-4 sm:shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.scroll}</span>
            <span
              className={cn(
                "absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold leading-5 sm:static sm:min-w-6 sm:px-1.5 sm:text-xs sm:leading-6",
                saved.length > 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground sm:bg-background/15 sm:text-background",
              )}
            >
              {saved.length}
            </span>
          </button>
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-border hover:bg-card lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
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
            <button type="button" onClick={() => { setSavedOpen(true); setMenuOpen(false) }} className="text-left">
              {t.scroll} ({saved.length})
            </button>
          </nav>
        </div>
      ) : null}

      {mobileSearchOpen ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background sm:hidden" ref={mobilePanelRef} role="dialog" aria-modal="true" aria-label={t.searchLabel}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <form
              className="relative min-w-0 flex-1"
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
                submitSearch()
              }}
            >
              <label htmlFor="tool-search-mobile" className="sr-only">{t.searchLabel}</label>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="tool-search-mobile"
                type="search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-11 w-full rounded-full bg-card pr-11 pl-11 text-base ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
                autoComplete="off"
              />
              {draft ? (
                <button
                  type="button"
                  onClick={clearDraft}
                  className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground"
                  aria-label={t.clearSearch}
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </form>
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-border"
              onClick={closeMobileSearch}
              aria-label={t.closeSearchPanel}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <SearchSuggestions suggestions={suggestions} onPick={pickSuggestion} />
          </div>
        </div>
      ) : null}

      {onFilterable ? (
        <div className="mx-auto max-w-[1600px] px-4 pb-3 md:px-6">
          <CategoryChipsBar
            activeCategory={category}
            highlightActive
            onSelectCategory={(id) => pushCatalogue({ category: id })}
            showSort
            activeSort={sort}
            onSelectSort={(id) => pushCatalogue({ sort: id === "trending" ? null : id })}
          />
        </div>
      ) : null}
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