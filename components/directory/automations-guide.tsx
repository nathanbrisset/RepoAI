"use client"

import { Suspense, useMemo, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { automationCards, type AutomationCard } from "@/lib/directory/automation-guides"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { cn } from "@/lib/utils"
import { AutomationDetail, AutomationToolCard } from "./automation-tool-card"

const ATTRS = ["free", "oss", "self", "onprem"] as const
const SORTS = ["recommended", "price", "recent", "az"] as const

type Attr = (typeof ATTRS)[number]
type SortId = (typeof SORTS)[number]

function hasAttr(card: AutomationCard, attr: Attr) {
  if (attr === "free") return card.freeOffer
  if (attr === "oss") return card.openSource
  if (attr === "self") return card.selfHost
  return card.onPrem
}

function matchesAttrs(card: AutomationCard, attrs: Attr[]) {
  return attrs.every((attr) => hasAttr(card, attr))
}

function matchesSubs(card: AutomationCard, subs: string[]) {
  return subs.length === 0 || subs.includes(card.subcategoryId)
}

function parseList(value: string | null) {
  return (value || "").split(",").map((item) => item.trim()).filter(Boolean)
}

function compareCards(a: AutomationCard, b: AutomationCard, sort: SortId, locale: string) {
  if (sort === "az") return a.name.localeCompare(b.name, locale) || a.order - b.order
  if (sort === "price") {
    if (a.priceRank == null && b.priceRank == null) return a.order - b.order
    if (a.priceRank == null) return 1
    if (b.priceRank == null) return -1
    return a.priceRank - b.priceRank || a.order - b.order
  }
  if (sort === "recent") {
    if (!a.dateAdded && !b.dateAdded) return a.order - b.order
    if (!a.dateAdded) return 1
    if (!b.dateAdded) return -1
    return b.dateAdded.localeCompare(a.dateAdded) || a.order - b.order
  }
  return a.order - b.order
}

export function AutomationsGuide() {
  return (
    <Suspense fallback={<div className="mt-6 h-40" />}>
      <AutomationsGuideInner />
    </Suspense>
  )
}

function AutomationsGuideInner() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()
  const cards = automationCards(locale)
  const subs = parseList(searchParams.get("sub"))
  const attrs = parseList(searchParams.get("attr")).filter((attr): attr is Attr => ATTRS.includes(attr as Attr))
  const sortParam = searchParams.get("sort")
  const sort: SortId = SORTS.includes(sortParam as SortId) ? (sortParam as SortId) : "recommended"
  const openId = searchParams.get("tool")
  const openTool = cards.find((card) => card.id === openId) || null

  const subcategories = useMemo(() => {
    const seen = new Map<string, string>()
    for (const card of cards) seen.set(card.subcategoryId, card.subcategory)
    return [...seen.entries()].map(([id, label]) => ({ id, label }))
  }, [cards])

  function write(updates: Record<string, string | null>, scroll = false) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key)
      else params.set(key, value)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll })
  }

  function toggle(key: "sub" | "attr", id: string, current: string[]) {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    write({ [key]: next.length ? next.join(",") : null })
  }

  const attrLabels: Record<Attr, string> = {
    free: t.attrFree,
    oss: t.attrOss,
    self: t.attrSelf,
    onprem: t.attrOnprem,
  }
  const sortLabels: Record<SortId, string> = {
    recommended: t.sortRecommended,
    price: t.sortPrice,
    recent: t.sortRecent,
    az: t.sortAz,
  }

  const subCount = (id: string) => cards.filter((card) => card.subcategoryId === id && matchesAttrs(card, attrs)).length
  const attrCount = (attr: Attr) => cards.filter((card) => matchesSubs(card, subs) && matchesAttrs(card, attrs.filter((item) => item !== attr)) && hasAttr(card, attr)).length
  const allCount = cards.filter((card) => matchesAttrs(card, attrs)).length
  const filtersActive = subs.length > 0 || attrs.length > 0

  const matching = cards.filter((card) => matchesSubs(card, subs) && matchesAttrs(card, attrs))
  const pinned = matching.filter((card) => card.pinned).sort((a, b) => ["n8n", "zapier", "make"].indexOf(a.id) - ["n8n", "zapier", "make"].indexOf(b.id))
  const rest = matching.filter((card) => !card.pinned).sort((a, b) => compareCards(a, b, sort, locale))

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mt-3 border-b border-border bg-background/95 px-4 py-1.5 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-1" role="toolbar" aria-label={t.automationFilter}>
          <FilterChip active={subs.length === 0} count={allCount} onClick={() => write({ sub: null })}>
            {t.guideFilterAll}
          </FilterChip>
          {subcategories.map((item) => {
            const count = subCount(item.id)
            const active = subs.includes(item.id)
            return (
              <FilterChip key={item.id} active={active} count={count} disabled={!active && count === 0} onClick={() => toggle("sub", item.id, subs)}>
                {item.label}
              </FilterChip>
            )
          })}
        </div>
        <div className="mt-1.5 flex items-center gap-2 overflow-x-auto">
          <div className="flex shrink-0 gap-2" role="toolbar" aria-label={t.attributesLabel}>
            {ATTRS.map((attr) => {
              const count = attrCount(attr)
              const active = attrs.includes(attr)
              return (
                <FilterChip key={attr} active={active} count={count} disabled={!active && count === 0} onClick={() => toggle("attr", attr, attrs)}>
                  {attrLabels[attr]}
                </FilterChip>
              )
            })}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <span className="sr-only">{t.sortGuideLabel}</span>
              <select
                value={sort}
                onChange={(event) => write({ sort: event.target.value === "recommended" ? null : event.target.value })}
                className="rounded-full bg-card px-3 py-2 ring-1 ring-border"
              >
                {SORTS.map((id) => (
                  <option key={id} value={id}>
                    {sortLabels[id]}
                  </option>
                ))}
              </select>
            </label>
            {filtersActive ? (
              <button type="button" onClick={() => write({ sub: null, attr: null })} className="rounded-full px-3 py-2 text-sm font-semibold ring-1 ring-border">
                {t.resetFilters}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {matching.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-card p-6 ring-1 ring-border">
          <p className="font-semibold">{t.emptyGuideTitle}</p>
          <button type="button" onClick={() => write({ sub: null, attr: null })} className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <>
          {pinned.length > 0 ? (
            <section className="mt-2 rounded-3xl bg-foreground p-2 text-background md:p-3">
              <h2 className="font-display text-base leading-none md:text-xl">{t.pinnedHeading}</h2>
              <div className="mt-1.5 grid grid-cols-1 gap-2 lg:grid-cols-3">
                {pinned.map((tool) => (
                  <AutomationToolCard key={tool.id} tool={tool} t={t} onOpen={(id) => write({ tool: id })} featured />
                ))}
              </div>
            </section>
          ) : null}
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((tool) => (
              <AutomationToolCard key={tool.id} tool={tool} t={t} onOpen={(id) => write({ tool: id })} />
            ))}
          </div>
        </>
      )}
      <AutomationDetail tool={openTool} t={t} onClose={() => write({ tool: null })} />
    </div>
  )
}

function FilterChip({
  active,
  count,
  disabled = false,
  onClick,
  children,
}: {
  active: boolean
  count: number
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-foreground text-background" : "bg-card ring-1 ring-border",
      )}
    >
      {children}
      <span className="ml-2 text-xs tabular-nums opacity-70"> {count}</span>
    </button>
  )
}
