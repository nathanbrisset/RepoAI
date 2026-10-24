"use client"

import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { useT } from "@/components/locale-provider"
import { Shuriken } from "./shuriken"
import { ToolLogo } from "./tool-logo"
import { useDirectory } from "./directory-context"

export function SavedDrawer() {
  const t = useT()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { savedOpen, setSavedOpen, saved, byId, toggleSave, openTool } = useDirectory()
  const tools = saved.map((id) => byId.get(id)).filter((tool) => Boolean(tool))

  useEffect(() => {
    if (!savedOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSavedOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [savedOpen, setSavedOpen])

  if (!savedOpen || typeof document === "undefined") return null

  const description =
    tools.length === 0
      ? t("directory.scrollEmpty")
      : tools.length === 1
        ? t("directory.scrollCountOne")
        : t("directory.scrollCount", { count: tools.length })

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label={t("directory.close")} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSavedOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute top-0 right-0 bottom-0 flex w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300"
      >
        <div className="flex items-center justify-between gap-4 border-b p-6">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="font-display text-2xl">
              {t("directory.myScroll")}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setSavedOpen(false)}
            className="grid size-10 place-items-center rounded-full bg-muted transition hover:bg-foreground hover:text-background"
            aria-label={t("directory.close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {tools.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid size-20 place-items-center rounded-full bg-muted text-primary">
              <Shuriken className="size-10 motion-safe:animate-[spin_6s_linear_infinite]" />
            </span>
            <p className="font-display text-lg">{t("directory.scrollEmptyTitle")}</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t("directory.scrollHint")}</p>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
            {tools.map((tool) => (
              <li key={tool!.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border">
                <button
                  type="button"
                  onClick={() => {
                    setSavedOpen(false)
                    openTool(tool!.id)
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <ToolLogo tool={tool!} />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{tool!.name}</span>
                    <span className="truncate text-sm text-muted-foreground">{tool!.tagline}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleSave(tool!.id)}
                  aria-label={t("directory.removeSaved", { name: tool!.name })}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  )
}
