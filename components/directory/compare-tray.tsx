"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Plus, X } from "lucide-react"
import { CONSENT_EVENT, readConsent } from "@/lib/consent"
import { localizeHref } from "@/lib/i18n/paths"
import { useLocale, useT } from "@/components/locale-provider"
import { ToolLogo } from "./tool-logo"
import { useDirectory } from "./directory-context"

export function CompareTray() {
  const t = useT()
  const locale = useLocale()
  const { compare, byId, removeCompare } = useDirectory()
  const selected = compare.map((id) => byId.get(id)).filter((tool) => Boolean(tool))
  const [aboveConsent, setAboveConsent] = useState(false)

  useEffect(() => {
    const sync = () => setAboveConsent(readConsent() === null)
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  if (!selected.length) return null

  return (
    <aside
      className={`fixed inset-x-3 z-40 mx-auto max-w-4xl rounded-3xl bg-foreground p-3 text-background shadow-2xl ring-1 ring-background/20 md:inset-x-6 md:p-4 ${aboveConsent ? "bottom-36 md:bottom-24" : "bottom-3"}`}
      aria-label={t("directory.compareTray")}
    >
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-accent-foreground">{selected.length}</span>
          <span className="hidden sm:inline">{t("directory.compare")}</span>
        </div>
        {selected.map((tool) => (
          <div key={tool!.id} className="flex shrink-0 items-center gap-2 rounded-2xl bg-background/10 py-1.5 pr-2 pl-1.5">
            <ToolLogo tool={tool!} className="size-8 rounded-lg bg-background text-sm text-foreground" />
            <span className="max-w-24 truncate text-xs font-semibold sm:max-w-32">{tool!.name}</span>
            <button
              type="button"
              onClick={() => removeCompare(tool!.id)}
              aria-label={t("directory.removeFromCompare", { name: tool!.name })}
              className="grid size-6 place-items-center rounded-full hover:bg-background/20"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - selected.length) }).map((_, index) => (
          <span key={index} className="grid size-11 shrink-0 place-items-center rounded-2xl border border-dashed border-background/30">
            <Plus className="size-4 opacity-50" />
          </span>
        ))}
        <a
          href={localizeHref(locale, `/compare?tools=${selected.map((tool) => tool!.id).join(",")}`)}
          aria-disabled={selected.length < 2}
          className={`ml-auto flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground ${selected.length < 2 ? "pointer-events-none opacity-40" : ""}`}
        >
          {t("directory.compareNow")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </aside>
  )
}
