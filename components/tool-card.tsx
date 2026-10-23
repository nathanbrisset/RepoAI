"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Tool } from "@/lib/types"
import { categoryName } from "@/lib/category-meta"
import { categoryCopy, pricingLabel, statusLabel } from "@/lib/i18n/messages"
import { localizeTool } from "@/lib/i18n/localize-tool"
import LocaleLink from "./locale-link"
import { useLocale, useT } from "./locale-provider"

interface ToolCardProps {
  tool: Tool
}

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

function isNewTool(dateAdded?: string) {
  if (!dateAdded) return false
  const added = Date.parse(`${dateAdded}T00:00:00Z`)
  if (Number.isNaN(added)) return false
  const age = Date.now() - added
  return age >= 0 && age <= NEW_WINDOW_MS
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase()
}

export default function ToolCard({ tool }: ToolCardProps) {
  const locale = useLocale()
  const t = useT()
  const localized = localizeTool(tool, locale)
  const [logoFailed, setLogoFailed] = useState(false)
  const logo = localized.logo && !logoFailed ? localized.logo : ""
  const status = localized.status && localized.status !== "active" ? statusLabel(locale, localized.status) : ""
  const recent = !status && isNewTool(tool.dateAdded)
  const price = !tool.pricing?.uncertain && tool.isPremium ? pricingLabel(locale, tool.isPremium) : ""
  const category = localized.categories[0]
    ? categoryCopy(locale, localized.categories[0])?.name || categoryName(localized.categories[0])
    : ""
  const tags = (localized.tags || []).slice(0, 2)
  const meta = [price, category].filter(Boolean).join(" · ")

  return (
    <LocaleLink
      href={`/tool/${localized.id}`}
      className="group flex h-full flex-col rounded-[1.35rem] border border-border bg-card p-4 text-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-secondary">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-8 w-8 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="text-xs font-bold text-navy">{initials(localized.name)}</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <h3 className="truncate text-lg font-extrabold tracking-tight text-navy">{localized.name}</h3>
            {status ? (
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {status}
              </span>
            ) : null}
            {recent ? (
              <span suppressHydrationWarning className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-cta">
                {t("home.badgeNew")}
              </span>
            ) : null}
          </span>
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{localized.description}</p>

      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm text-muted-foreground">
        <span className="truncate">{meta}</span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-navy/70 transition group-hover:text-link" />
      </div>
    </LocaleLink>
  )
}
