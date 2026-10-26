"use client"

import { Flame, Sparkles, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { useDirectory } from "./directory-provider"

export type SortMode = "trending" | "new" | "top"

const sortOptions: { id: SortMode; icon: typeof Flame }[] = [
  { id: "trending", icon: Flame },
  { id: "new", icon: Sparkles },
  { id: "top", icon: Trophy },
]

type CategoryChipsBarProps = {
  activeCategory?: string
  /** When true, highlight the active category / « Everything » like on the catalogue. */
  highlightActive?: boolean
  onSelectCategory: (categoryId: string | null) => void
  showSort?: boolean
  activeSort?: SortMode
  onSelectSort?: (sort: SortMode) => void
  className?: string
}

export function CategoryChipsBar({
  activeCategory = "",
  highlightActive = false,
  onSelectCategory,
  showSort = false,
  activeSort = "trending",
  onSelectSort,
  className,
}: CategoryChipsBarProps) {
  const t = directoryCopy(useLocale())
  const { chips, total } = useDirectory()
  const sortLabel = { trending: t.sortTrending, new: t.sortNew, top: t.sortTop }
  const everythingActive = highlightActive && !activeCategory

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <nav aria-label={t.categoriesLabel} className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          aria-pressed={everythingActive}
          className={cn(
            "flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium",
            everythingActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground ring-1 ring-border hover:-translate-y-0.5",
          )}
        >
          {t.everything}
          <span className={cn("text-xs tabular-nums", everythingActive ? "text-primary-foreground/70" : "text-muted-foreground")}>{total}</span>
        </button>
        {chips.map((chip) => {
          const active = highlightActive && chip.id === activeCategory
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelectCategory(chip.id)}
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
      {showSort && onSelectSort ? (
        <div role="radiogroup" aria-label={t.sortLabel} className="hidden shrink-0 items-center gap-1 rounded-full bg-card p-1 ring-1 ring-border lg:flex">
          {sortOptions.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={activeSort === id}
              onClick={() => onSelectSort(id)}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-full px-3 text-sm font-medium",
                activeSort === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {sortLabel[id]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
