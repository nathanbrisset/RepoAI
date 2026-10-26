"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { COMPARE_PRESETS } from "@/lib/directory/collections"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { formatCatalogDate } from "@/lib/i18n/localize-tool"
import { localizeHref } from "@/lib/i18n/paths"
import type { DirectoryRecord } from "@/lib/directory/data"
import { useDirectory } from "./directory-provider"
import { ToolLogo } from "./tool-logo"

type RowKey = "pricing" | "note" | "free" | "best" | "features" | "categories" | "checked"

function valueFor(tool: DirectoryRecord, key: RowKey, categoryLabel: (id: string) => string, locale: "en" | "fr", dash: string, yes: string, no: string, notChecked: string) {
  if (key === "pricing") return tool.pricingUncertain || !tool.pricingLabel ? dash : tool.pricingLabel
  if (key === "note") return tool.pricingNote?.trim() || ""
  if (key === "free") {
    if (tool.pricingUncertain || !tool.pricingModel) return dash
    return tool.pricingModel === "free" || tool.pricingModel === "freemium" || tool.pricingModel === "open-source" ? yes : no
  }
  if (key === "best") return tool.description
  if (key === "features") return tool.features.length ? tool.features.join(", ") : ""
  if (key === "categories") return tool.categories.map((id) => categoryLabel(id)).join(", ")
  return tool.lastVerified ? formatCatalogDate(tool.lastVerified, locale) : notChecked
}

export function CompareClient() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { records, recordById, categoryLabel } = useDirectory()
  const [highlight, setHighlight] = useState(false)
  const [adder, setAdder] = useState("")

  const slugs = (searchParams.get("tools") || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id, index, list) => id && recordById(id) && list.indexOf(id) === index)
    .slice(0, 4)

  const selected = slugs.map((id) => recordById(id)).filter((tool): tool is DirectoryRecord => Boolean(tool))

  function update(next: string[]) {
    const unique = next.filter((id, index) => recordById(id) && next.indexOf(id) === index).slice(0, 4)
    const href = unique.length ? `/compare?tools=${unique.join(",")}` : "/compare"
    router.replace(localizeHref(locale, href), { scroll: false })
  }

  const rows: { key: RowKey; label: string }[] = [
    { key: "pricing", label: t.rowPricing },
    { key: "note", label: t.rowNote },
    { key: "free", label: t.rowFree },
    { key: "best", label: t.rowBest },
    { key: "features", label: t.rowFeatures },
    { key: "categories", label: t.rowCategories },
    { key: "checked", label: t.rowChecked },
  ]

  const rendered = rows
    .map((row) => ({
      ...row,
      values: selected.map((tool) => valueFor(tool, row.key, categoryLabel, locale, t.dash, t.yes, t.no, t.notChecked)),
    }))
    .filter((row) => row.values.some((value) => value && value !== t.dash))

  const presets = COMPARE_PRESETS.map((preset) => preset.filter((id) => recordById(id))).filter((preset) => preset.length >= 2)

  const addable = useMemo(() => {
    const needle = adder.trim().toLowerCase()
    if (needle.length < 2) return []
    return records.filter((tool) => !slugs.includes(tool.id) && tool.name.toLowerCase().includes(needle)).slice(0, 6)
  }, [adder, records, slugs])

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 md:px-8">
      <LocaleLink href="/" className="font-display text-lg">
        AItools<span className="text-accent">.</span>ninja
      </LocaleLink>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t.compareKicker}</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">{t.compareTitle}</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">{t.compareIntro}</p>
        </div>
        <label className="flex items-center gap-3 rounded-full bg-card px-4 py-3 text-sm font-semibold ring-1 ring-border">
          <input type="checkbox" checked={highlight} onChange={(event) => setHighlight(event.target.checked)} />
          {t.highlight}
        </label>
      </div>

      {selected.length < 2 ? (
        <div className="mt-10 rounded-3xl bg-card p-8 ring-1 ring-border">
          <h2 className="font-display text-2xl">{t.pickTwoTitle}</h2>
          <p className="mt-2 text-muted-foreground">{t.pickTwoBody}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button key={preset.join("-")} type="button" onClick={() => update([...preset])} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                {preset.map((id) => recordById(id)?.name).join(" vs ")}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selected.length >= 2 ? (
        <div className="mt-10 overflow-x-auto rounded-3xl bg-card ring-1 ring-border">
          <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `180px repeat(${selected.length}, minmax(190px, 1fr))` }}>
            <div className="sticky left-0 z-10 bg-card p-4" />
            {selected.map((tool) => (
              <div key={tool.id} className="border-l bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <ToolLogo tool={tool} />
                    <div>
                      <h2 className="font-display text-lg leading-tight">{tool.name}</h2>
                      <p className="text-xs text-muted-foreground">{categoryLabel(tool.categories[0] || "")}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => update(slugs.filter((id) => id !== tool.id))} aria-label={t.compareRemove.replace("{name}", tool.name)}>
                    <X className="size-4" />
                  </button>
                </div>
                {tool.url ? (
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex h-9 items-center justify-center gap-2 rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {t.visitName.replace("{name}", tool.name)}
                    <ArrowUpRight className="size-3" />
                  </a>
                ) : null}
                <LocaleLink href={`/tool/${tool.id}`} className="mt-2 block text-center text-xs font-semibold text-primary">
                  {t.fullPage}
                </LocaleLink>
              </div>
            ))}
            {rendered.map((row) => {
              const distinct = new Set(row.values).size > 1
              return (
                <div key={row.key} className="contents">
                  <div className="sticky left-0 z-[1] border-t bg-card p-4 text-sm font-semibold">{row.label}</div>
                  {row.values.map((value, index) => (
                    <div key={`${row.key}-${selected[index].id}`} className={`border-t border-l p-4 text-sm text-muted-foreground ${highlight && distinct ? "bg-accent/10" : ""}`}>
                      {value || t.dash}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {selected.length > 0 && selected.length < 4 ? (
        <div className="relative mt-8 max-w-md">
          <label className="text-sm font-semibold" htmlFor="add-compare">{t.addTool}</label>
          <input
            id="add-compare"
            value={adder}
            onChange={(event) => setAdder(event.target.value)}
            className="mt-2 h-12 w-full rounded-full bg-card px-5 ring-1 ring-border outline-none"
          />
          {addable.length > 0 ? (
            <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl bg-card p-2 shadow-xl ring-1 ring-border">
              {addable.map((tool) => (
                <li key={tool.id}>
                  <button
                    type="button"
                    className="block w-full rounded-xl px-3 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      update([...slugs, tool.id])
                      setAdder("")
                    }}
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-14">
        <h2 className="font-display text-2xl">{t.popularComparisons}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {presets.map((preset) => (
            <button key={preset.join("-")} type="button" onClick={() => update([...preset])} className="flex items-center justify-between rounded-2xl bg-card p-4 text-left ring-1 ring-border hover:-translate-y-0.5">
              <span className="font-semibold">{preset.map((id) => recordById(id)?.name).join(" vs ")}</span>
              <ArrowUpRight className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
