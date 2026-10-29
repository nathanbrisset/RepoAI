"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { useDirectory } from "@/components/directory/directory-provider"
import {
  DEFAULT_SWIPE_FILTERS,
  filterSwipeDeck,
  shuffleDeck,
  type SwipeFilters,
} from "@/lib/ai-match-swipe/filters"
import { SwipeFiltersScreen } from "./swipe-filters-screen"
import { SwipeDeckScreen } from "./swipe-deck-screen"
import { SwipeStackScreen } from "./swipe-stack-screen"
import { Shuriken } from "@/components/directory/shuriken"

type Step = "filters" | "deck" | "stack"

export function AiMatchSwipeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { records, toggleSave, isSaved, setSavedOpen } = useDirectory()
  const [step, setStep] = useState<Step>("filters")
  const [filters, setFilters] = useState<SwipeFilters>(DEFAULT_SWIPE_FILTERS)
  const [keptIds, setKeptIds] = useState<string[]>([])
  const [deck, setDeck] = useState<typeof records>([])
  const [deckIndex, setDeckIndex] = useState(0)

  const resetSession = useCallback(() => {
    setStep("filters")
    setFilters(DEFAULT_SWIPE_FILTERS)
    setKeptIds([])
    setDeck([])
    setDeckIndex(0)
  }, [])

  useEffect(() => {
    if (!open) {
      resetSession()
    }
  }, [open, resetSession])

  const keptTools = useMemo(
    () => keptIds.map((id) => records.find((r) => r.id === id)).filter(Boolean) as typeof records,
    [keptIds, records],
  )

  function startDeck(nextFilters: SwipeFilters) {
    const kept = new Set(keptIds)
    const filtered = shuffleDeck(filterSwipeDeck(records, nextFilters).filter((tool) => !kept.has(tool.id)))
    setFilters(nextFilters)
    setDeck(filtered)
    setDeckIndex(0)
    if (filtered.length === 0) {
      setStep(kept.size > 0 ? "stack" : "filters")
      return
    }
    setStep("deck")
  }

  function handleKeep(id: string) {
    setKeptIds((current) => (current.includes(id) ? current : [...current, id]))
    advanceDeck()
  }

  function handleSkip() {
    advanceDeck()
  }

  function advanceDeck() {
    setDeckIndex((index) => {
      const nextIndex = index + 1
      if (nextIndex >= deck.length) {
        window.setTimeout(() => setStep("stack"), 180)
      }
      return nextIndex
    })
  }

  function openStackInScroll() {
    keptIds.forEach((id) => {
      if (!isSaved(id)) toggleSave(id)
    })
    setSavedOpen(true)
    onOpenChange(false)
  }

  const currentTool = deck[deckIndex]
  const deckProgress = deck.length > 0 ? Math.min(deckIndex + 1, deck.length) : 0

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[85] bg-foreground/50 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed inset-0 z-[85] flex flex-col bg-card text-card-foreground outline-none",
            "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
            "md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:h-[min(92dvh,760px)] md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:shadow-2xl md:ring-2 md:ring-border",
          )}
          aria-describedby={undefined}
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 md:px-6">
            <Shuriken className="size-4 shrink-0 text-accent" />
            <Dialog.Title className="min-w-0 flex-1 font-display text-lg leading-tight md:text-xl">{t.swipeModalTitle}</Dialog.Title>
            <Dialog.Close
              className="grid size-11 shrink-0 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background"
              aria-label={t.close}
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {step === "filters" ? (
              <SwipeFiltersScreen
                filters={filters}
                onChange={setFilters}
                onStart={() => startDeck(filters)}
                emptyAfterFilter={Boolean(filters.categoryId) && filterSwipeDeck(records, filters).length === 0}
              />
            ) : null}
            {step === "deck" && currentTool ? (
              <SwipeDeckScreen
                tool={currentTool}
                progressCurrent={deckProgress}
                progressTotal={deck.length}
                keptCount={keptIds.length}
                onSkip={() => handleSkip()}
                onKeep={() => handleKeep(currentTool.id)}
                onEditFilters={() => setStep("filters")}
              />
            ) : null}
            {step === "stack" ? (
              <SwipeStackScreen
                tools={keptTools}
                onOpenStack={openStackInScroll}
                onKeepSwiping={() => startDeck(filters)}
                onClose={() => onOpenChange(false)}
              />
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
