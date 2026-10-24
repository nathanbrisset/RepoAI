"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { freePlan, startingPrice } from "@/lib/directory/compare-fields"
import { COMPARE_PRESETS } from "@/lib/directory/picks"
import { formatCatalogDay, type DirectoryTool } from "@/lib/directory/tools"
import { categoryCopy } from "@/lib/i18n/messages"
import { localizeHref } from "@/lib/i18n/paths"
import { useLocale, useT } from "@/components/locale-provider"
import { ToolLogo } from "@/components/directory/tool-logo"

function parseSlugs(value: string, byId: Map<string, DirectoryTool>) {
  const seen = new Set<string>()
  const ids: string[] = []
  for (const part of value.split(",")) {
    const id = part.trim()
    if (!id || seen.has(id) || !byId.has(id)) continue
    seen.add(id)
    ids.push(id)
    if (ids.length === 4) break
  }
  return ids
}

export function CompareClient({ tools }: { tools: DirectoryTool[] }) {
  const t = useT()
  const locale = useLocale()
  const params = useSearchParams()
  const byId = useMemo(() => new Map(tools.map((tool) => [tool.id, tool])), [tools])
  const [slugs, setSlugs] = useState(() => parseSlugs(params.get("tools") || "", byId))
  const [highlight, setHighlight] = useState(false)
  const selected = slugs.map((id) => byId.get(id)).filter((tool): tool is DirectoryTool => Boolean(tool))

  function update(next: string[]) {
    const clean = parseSlugs(next.join(","), byId)
    setSlugs(clean)
    const href = localizeHref(locale, clean.length ? `/compare?tools=${clean.join(",")}` : "/compare")
    window.history.replaceState(null, "", href)
  }

  const presets = COMPARE_PRESETS.map((preset) => preset.filter((id) => byId.has(id))).filter((preset) => preset.length >= 2)

  const rows = useMemo(() => {
    const definitions: { key: string; label: string; value: (tool: DirectoryTool) => string | null }[] = [
      { key: "pricing", label: t("directory.rowPricing"), value: (tool) => tool.pricingLabel || null },
      { key: "starting", label: t("directory.rowStarting"), value: (tool) => startingPrice(tool.pricingDetails) },
      {
        key: "free",
        label: t("directory.rowFree"),
        value: (tool) => {
          const plan = freePlan(tool)
          if (plan === "yes") return t("directory.yes")
          if (plan === "no") return t("directory.no")
          return null
        },
      },
      { key: "best", label: t("directory.rowBest"), value: (tool) => tool.tagline || null },
      {
        key: "features",
        label: t("directory.rowFeatures"),
        value: (tool) => (tool.features.length ? tool.features.join(" · ") : null),
      },
      {
        key: "checked",
        label: t("directory.rowChecked"),
        value: (tool) => formatCatalogDay(tool.lastVerified, locale) || null,
      },
    ]
    return definitions
      .map((row) => {
        const values = selected.map((tool) => row.value(tool))
        return { ...row, values }
      })
      .filter((row) => row.values.some(Boolean))
  }, [selected, t, locale])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("directory.compareKicker")}</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">{t("directory.compareTitle")}</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">{t("directory.compareIntro")}</p>
        </div>
        <label className="flex items-center gap-3 rounded-full bg-card px-4 py-3 text-sm font-semibold ring-1 ring-border">
          <input type="checkbox" checked={highlight} onChange={(event) => setHighlight(event.target.checked)} />
          {t("directory.highlight")}
        </label>
      </div>

      {selected.length < 2 && (
        <div className="mt-10 rounded-3xl bg-card p-8 ring-1 ring-border">
          <h2 className="font-display text-2xl">{t("directory.pickTwoTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("directory.pickTwoBody")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.join("-")}
                type="button"
                onClick={() => update(preset)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                {preset.map((id) => byId.get(id)?.name || id).join(" vs ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.length >= 2 && (
        <div className="mt-10 overflow-x-auto rounded-3xl bg-card ring-1 ring-border">
          <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `170px repeat(${selected.length}, minmax(190px, 1fr))` }}>
            <div className="sticky left-0 z-10 bg-card p-4" />
            {selected.map((tool) => (
              <div key={tool.id} className="border-l bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <ToolLogo tool={tool} />
                    <div>
                      <h2 className="font-display text-lg leading-tight">{tool.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {tool.categories[0] ? categoryCopy(locale, tool.categories[0])?.name || tool.categories[0] : ""}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => update(slugs.filter((id) => id !== tool.id))} aria-label={t("directory.removeFromCompare", { name: tool.name })}>
                    <X className="size-4" />
                  </button>
                </div>
                {tool.url ? (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex h-9 items-center justify-center gap-2 rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                  >
                    {t("directory.visitWebsite")}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ))}
            {rows.map((row) => {
              const filled = row.values.map((value) => value || "")
              const differs = new Set(filled).size > 1
              return (
                <div key={row.key} className="contents">
                  <div className="sticky left-0 z-[1] border-t bg-card p-4 text-sm font-semibold">{row.label}</div>
                  {row.values.map((value, index) => (
                    <div
                      key={selected[index].id}
                      className={cn(
                        "border-t border-l p-4 text-sm text-muted-foreground",
                        highlight && differs && "bg-accent/15 text-foreground",
                      )}
                    >
                      {value || t("directory.dash")}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        <label className="flex max-w-md flex-col gap-2 text-sm font-semibold">
          {t("directory.addTool")}
          <select
            className="h-12 rounded-full bg-card px-4 font-medium ring-1 ring-border"
            value=""
            onChange={(event) => {
              if (event.target.value) update([...slugs, event.target.value])
            }}
          >
            <option value="">{t("directory.addTool")}</option>
            {tools
              .filter((tool) => !slugs.includes(tool.id))
              .map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-2xl">{t("directory.popular")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {presets.map((preset) => (
            <button
              key={preset.join("-")}
              type="button"
              onClick={() => update(preset)}
              className="flex items-center justify-between rounded-2xl bg-card p-4 text-left ring-1 ring-border hover:-translate-y-0.5"
            >
              <span className="font-semibold">{preset.map((id) => byId.get(id)?.name || id).join(" vs ")}</span>
              <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
