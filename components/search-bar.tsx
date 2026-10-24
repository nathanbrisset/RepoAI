"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { advancedSearch } from "@/lib/recommendation-engine"
import { categoryCopy } from "@/lib/i18n/messages"
import type { CatalogSearchRecord } from "@/lib/i18n/search-records"
import { localizeHref } from "@/lib/i18n/paths"
import type { Tool } from "@/lib/types"
import { useLocale, useT } from "./locale-provider"

interface SearchBarProps {
  className?: string
  records: CatalogSearchRecord[]
  variant?: "header" | "hero"
}

export default function SearchBar({ className, records, variant = "header" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Array<{ tool: Tool; match: unknown; score: number }>>([])
  const [mode, setMode] = useState<"search" | "match">("search")
  const router = useRouter()
  const locale = useLocale()
  const t = useT()
  const hero = variant === "hero"

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (hero && mode === "match") {
      setResults([])
      return
    }
    if (value.trim()) {
      setResults(advancedSearch(records as Tool[], value))
    } else {
      setResults([])
    }
  }

  const handleSelect = (toolId: string) => {
    setSearchQuery("")
    setResults([])
    router.push(localizeHref(locale, `/tool/${toolId}`))
  }

  const runSearch = () => {
    const value = searchQuery.trim()
    if (!value) return
    const next = value === searchQuery.trim() ? results : advancedSearch(records as Tool[], value)
    if (next[0]) handleSelect(next[0].tool.id)
  }

  const runMatch = () => {
    const value = searchQuery.trim()
    if (!value) return
    const href = localizeHref(locale, "/recommendation")
    window.location.assign(`${href}?query=${encodeURIComponent(value)}`)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (hero && mode === "match") runMatch()
    else runSearch()
  }

  const showResults = (!hero || mode === "search") && searchQuery.trim().length >= 2

  return (
    <div className={cn("relative w-full", hero ? "max-w-3xl" : "max-w-2xl", className)}>
      <form onSubmit={onSubmit}>
        <div
          className={cn(
            "flex items-center bg-card",
            hero
              ? "flex-wrap gap-2 rounded-[1.75rem] border border-border py-2 pl-4 pr-2 shadow-soft focus-within:ring-2 focus-within:ring-link sm:flex-nowrap sm:rounded-full"
              : "rounded-full border border-border shadow-soft focus-within:ring-2 focus-within:ring-link"
          )}
        >
          <div className={cn("flex min-w-0 items-center", hero ? "w-full flex-1 gap-2 sm:w-auto" : "w-full")}>
            <Search className={cn("shrink-0 text-muted-foreground", hero ? "h-5 w-5" : "ml-3 h-4 w-4")} />
            <input
              type="search"
              name="query"
              value={searchQuery}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={hero ? (mode === "match" ? t("home.placeholder") : t("home.searchPlaceholder")) : t("search.placeholder")}
              aria-label={hero ? (mode === "match" ? t("home.matchAction") : t("home.searchAction")) : t("search.placeholder")}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
                hero ? "h-12 text-base" : "h-11 px-2 text-sm"
              )}
            />
          </div>
          {hero ? (
            <div className="flex w-full shrink-0 items-center gap-1 sm:w-auto">
              <button
                type="button"
                aria-pressed={mode === "search"}
                onClick={() => {
                  if (mode !== "search") {
                    setMode("search")
                    if (searchQuery.trim()) setResults(advancedSearch(records as Tool[], searchQuery))
                    return
                  }
                  runSearch()
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  mode === "search" ? "bg-navy text-navy-foreground" : "text-foreground hover:bg-secondary"
                )}
              >
                {t("home.searchAction")}
              </button>
              <button
                type="button"
                aria-pressed={mode === "match"}
                onClick={() => {
                  if (mode !== "match") {
                    setMode("match")
                    setResults([])
                    return
                  }
                  runMatch()
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  mode === "match" ? "bg-navy text-navy-foreground" : "text-foreground hover:bg-secondary"
                )}
              >
                {t("home.matchAction")}
              </button>
            </div>
          ) : null}
        </div>
      </form>

      {showResults && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((result) => (
                <button
                  key={result.tool.id}
                  type="button"
                  onClick={() => handleSelect(result.tool.id)}
                  className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-secondary"
                >
                  <span className="block font-semibold text-foreground">{result.tool.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {result.tool.categories.map((id: string) => categoryCopy(locale, id)?.name || id).join(", ")}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">{t("tools.noneTitle")}</p>
          )}
        </div>
      )}
    </div>
  )
}
