"use client"

import { useCallback, useRef, useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DirectoryRecord } from "@/lib/directory/data"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { useDirectory } from "@/components/directory/directory-provider"
import { ToolLogo } from "@/components/directory/tool-logo"
import { Shuriken } from "@/components/directory/shuriken"

const SWIPE_THRESHOLD = 72

type Props = {
  tool: DirectoryRecord
  progressCurrent: number
  progressTotal: number
  keptCount: number
  onSkip: () => void
  onKeep: () => void
  onEditFilters: () => void
}

export function SwipeDeckScreen({ tool, progressCurrent, progressTotal, keptCount, onSkip, onKeep, onEditFilters }: Props) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { categoryLabel } = useDirectory()
  const [offsetX, setOffsetX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const pointerId = useRef<number | null>(null)

  const category = categoryLabel(tool.categories[0] || "")
  const price = tool.pricingUncertain ? "" : tool.pricingLabel

  const resetCard = useCallback(() => {
    setOffsetX(0)
    setDragging(false)
    pointerId.current = null
  }, [])

  const commitSwipe = useCallback(
    (x: number) => {
      if (x > SWIPE_THRESHOLD) {
        setOffsetX(420)
        window.setTimeout(() => {
          onKeep()
          resetCard()
        }, 180)
        return
      }
      if (x < -SWIPE_THRESHOLD) {
        setOffsetX(-420)
        window.setTimeout(() => {
          onSkip()
          resetCard()
        }, 180)
        return
      }
      resetCard()
    },
    [onKeep, onSkip, resetCard],
  )

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    pointerId.current = event.pointerId
    startX.current = event.clientX - offsetX
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== event.pointerId) return
    setOffsetX(event.clientX - startX.current)
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== event.pointerId) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    commitSwipe(offsetX)
  }

  const keepHint = Math.min(1, Math.max(0, offsetX / SWIPE_THRESHOLD))
  const skipHint = Math.min(1, Math.max(0, -offsetX / SWIPE_THRESHOLD))

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onEditFilters}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-muted px-4 text-sm font-semibold"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          {t.swipeEditFilters}
        </button>
        <p className="sr-only">
          {t.swipeProgress.replace("{current}", String(progressCurrent)).replace("{total}", String(progressTotal))}
        </p>
        <span className="text-sm font-semibold tabular-nums text-muted-foreground" aria-hidden="true">
          {progressCurrent}/{progressTotal}
        </span>
      </div>
      <div
        className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={progressCurrent}
        aria-valuemin={1}
        aria-valuemax={progressTotal}
        aria-label={t.swipeProgress.replace("{current}", String(progressCurrent)).replace("{total}", String(progressTotal))}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${progressTotal > 0 ? (progressCurrent / progressTotal) * 100 : 0}%` }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-md flex-1 touch-pan-y">
        <div
          key={tool.id}
          role="group"
          aria-roledescription={t.swipeCardRole}
          aria-label={tool.name}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: `translateX(${offsetX}px) rotate(${offsetX * 0.04}deg)`,
            transition: dragging ? "none" : "transform 180ms ease",
          }}
          className={cn(
            "absolute inset-x-0 top-0 flex min-h-[320px] flex-col rounded-[1.75rem] bg-card p-5 shadow-xl ring-2 ring-border select-none",
            "touch-none",
          )}
        >
          <div
            className="pointer-events-none absolute left-4 top-4 rounded-full border-2 border-destructive px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive"
            style={{ opacity: skipHint }}
          >
            {t.swipeSkipLabel}
          </div>
          <div
            className="pointer-events-none absolute right-4 top-4 rounded-full border-2 border-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700"
            style={{ opacity: keepHint }}
          >
            {t.swipeKeepLabel}
          </div>

          <div className="flex items-start gap-4">
            <ToolLogo tool={tool} className="size-14 text-2xl" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl leading-tight">{tool.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{[category, price].filter(Boolean).join(" · ")}</p>
            </div>
            <Shuriken className="size-4 shrink-0 text-accent/80" />
          </div>
          <p className="mt-4 line-clamp-[8] text-base leading-relaxed text-foreground/90">{tool.description}</p>
          {tool.tags.length > 0 ? (
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {tool.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">{t.swipeGestureHint}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          aria-label={t.swipeSkipAria}
          onClick={() => {
            setOffsetX(-420)
            window.setTimeout(() => {
              onSkip()
              resetCard()
            }, 160)
          }}
          className="flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-muted text-base font-bold ring-1 ring-border"
        >
          <X className="size-5" aria-hidden="true" />
          {t.swipeSkipLabel}
        </button>
        <button
          type="button"
          aria-label={t.swipeKeepAria}
          onClick={() => {
            setOffsetX(420)
            window.setTimeout(() => {
              onKeep()
              resetCard()
            }, 160)
          }}
          className="flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20"
        >
          {t.swipeKeepLabel}
        </button>
      </div>
      {keptCount > 0 ? (
        <p className="mt-2 text-center text-xs font-semibold text-accent">
          {t.swipeKeptCount.replace("{count}", String(keptCount))}
        </p>
      ) : null}
    </div>
  )
}
