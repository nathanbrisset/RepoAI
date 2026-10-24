"use client"

import { Suspense } from "react"
import { Plus } from "lucide-react"
import SearchBar from "./search-bar"
import LanguageSwitcher from "./language-switcher"
import LocaleLink from "./locale-link"
import type { CatalogSearchRecord } from "@/lib/i18n/search-records"
import { categoryCatalog } from "@/lib/category-meta"
import { categoryCopy } from "@/lib/i18n/messages"
import { stripLocale } from "@/lib/i18n/paths"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLocale, useT } from "./locale-provider"

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <path fill="#fff" d="M16 5.2 17.7 14.3 26.8 16 17.7 17.7 16 26.8 14.3 17.7 5.2 16 14.3 14.3Z" />
    </svg>
  )
}

export default function Header({ searchRecords }: { searchRecords: CatalogSearchRecord[] }) {
  const t = useT()
  const locale = useLocale()
  const pathname = usePathname() || "/"
  const bare = stripLocale(pathname)
  const activeCategory = bare.startsWith("/categories/")
    ? decodeURIComponent(bare.slice("/categories/".length).split("/")[0] || "")
    : ""
  const counts = new Map<string, number>()
  for (const record of searchRecords) {
    for (const category of record.categories) {
      counts.set(category, (counts.get(category) || 0) + 1)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center gap-3 py-3">
          <LocaleLink href="/" className="flex min-w-0 items-center gap-2 text-navy">
            <Mark className="h-8 w-8 shrink-0" />
            <span className="truncate text-lg font-extrabold tracking-tight">{t("header.brand")}</span>
          </LocaleLink>

          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar className="mx-auto" records={searchRecords} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <LocaleLink
              href="/submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-secondary"
            >
              <Plus className="h-4 w-4" />
              <span>{t("header.submit")}</span>
            </LocaleLink>
            <Suspense fallback={<span className="inline-block w-14" />}>
              <LanguageSwitcher />
            </Suspense>
          </div>

          <div className="w-full md:hidden">
            <SearchBar records={searchRecords} />
          </div>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <LocaleLink
            href="/"
            aria-current={bare === "/" ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              bare === "/"
                ? "border-navy bg-navy text-navy-foreground"
                : "border-border bg-card text-foreground hover:bg-secondary"
            )}
          >
            {t("header.everything")}
            <span className={bare === "/" ? "text-white/70" : "text-muted-foreground"}>{searchRecords.length}</span>
          </LocaleLink>
          {categoryCatalog.map((category) => (
            <CategoryPill
              key={category.id}
              href={`/categories/${category.id}`}
              active={activeCategory === category.id}
              label={categoryCopy(locale, category.id)?.name || category.name}
              count={counts.get(category.id) || 0}
            />
          ))}
        </div>
      </div>
    </header>
  )
}

function CategoryPill({
  href,
  active,
  label,
  count,
}: {
  href: string
  active: boolean
  label: string
  count: number
}) {
  return (
    <LocaleLink
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium",
        active ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-foreground hover:bg-secondary"
      )}
    >
      {label}
      <span className={active ? "text-white/70" : "text-muted-foreground"}>{count}</span>
    </LocaleLink>
  )
}
