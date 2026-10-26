"use client"

import { useMemo, useState, type ReactNode } from "react"
import { automationCards, type AutomationCard } from "@/lib/directory/automation-guides"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { cn } from "@/lib/utils"
import { AutomationToolCard } from "./automation-tool-card"

function pinFirst(cards: AutomationCard[]) {
  const pinned = cards.filter((card) => card.pinned)
  const rest = cards.filter((card) => !card.pinned)
  return { pinned, rest }
}

export function AutomationsGuide() {
  const t = directoryCopy(useLocale())
  const cards = automationCards(useLocale())
  const [filter, setFilter] = useState("all")
  const subcategories = useMemo(() => {
    const seen = new Map<string, { id: string; label: string; count: number }>()
    for (const card of cards) {
      const current = seen.get(card.subcategoryId)
      if (current) current.count += 1
      else seen.set(card.subcategoryId, { id: card.subcategoryId, label: card.subcategory, count: 1 })
    }
    return [...seen.values()]
  }, [cards])
  const visible = filter === "all" ? cards : cards.filter((card) => card.subcategoryId === filter)
  const { pinned, rest } = pinFirst(visible)
  const activeLabel = subcategories.find((item) => item.id === filter)?.label

  return (
    <div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-1" role="toolbar" aria-label={t.automationFilter}>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {t.guideFilterAll}
          <span className="ml-2 text-xs opacity-70">{cards.length}</span>
        </FilterChip>
        {subcategories.map((item) => (
          <FilterChip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
            <span className="ml-2 text-xs opacity-70">{item.count}</span>
          </FilterChip>
        ))}
      </div>

      {filter === "all" ? (
        <div className="mt-10 flex flex-col gap-8">
          <section className="flex flex-col gap-8">
            <h2 className="font-display text-3xl">{t.pinnedHeading}</h2>
            {pinned.map((tool) => (
              <AutomationToolCard key={tool.id} tool={tool} t={t} />
            ))}
          </section>
          <section className="flex flex-col gap-8">
            <h2 className="font-display text-3xl">{t.guideHeading}</h2>
            {rest.map((tool) => (
              <AutomationToolCard key={tool.id} tool={tool} t={t} />
            ))}
          </section>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-8">
          <h2 className="font-display text-3xl">{activeLabel}</h2>
          {pinned.map((tool) => (
            <AutomationToolCard key={tool.id} tool={tool} t={t} />
          ))}
          {rest.map((tool) => (
            <AutomationToolCard key={tool.id} tool={tool} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-sm font-semibold",
        active ? "bg-foreground text-background" : "bg-card ring-1 ring-border",
      )}
    >
      {children}
    </button>
  )
}
