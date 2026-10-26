"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import LocaleLink from "@/components/locale-link"
import type { AutomationCard } from "@/lib/directory/automation-guides"
import type { DirectoryCopy } from "@/lib/i18n/directory-copy"

function Logo({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-foreground text-lg font-bold text-background ring-1 ring-border">
      {src && !failed ? (
        <img src={src} alt="" className="size-7 object-contain" onError={() => setFailed(true)} />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  )
}

function Badge({ children }: { children: string }) {
  return <span className="shrink-0 whitespace-nowrap rounded-full bg-background px-2 py-0.5 text-[11px] font-bold tracking-wide ring-1 ring-border">{children}</span>
}

export function automationBadges(tool: AutomationCard, t: DirectoryCopy) {
  return [tool.pricingBadge, tool.openSource ? t.openSourceBadge : "", tool.selfHost ? t.selfHostBadge : "", tool.onPrem ? t.onPremBadge : ""].filter(Boolean)
}

function OfficialLink({ tool, t, className }: { tool: AutomationCard; t: DirectoryCopy; className?: string }) {
  if (!tool.url) return null
  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={className}>
      {t.officialSite}
    </a>
  )
}

export function AutomationToolCard({
  tool,
  t,
  onOpen,
  featured = false,
}: {
  tool: AutomationCard
  t: DirectoryCopy
  onOpen: (id: string) => void
  featured?: boolean
}) {
  const badges = automationBadges(tool, t)
  return (
    <article className={`flex h-full flex-col rounded-2xl p-2.5 ring-1 ring-border ${featured ? "bg-background text-foreground" : "bg-card text-card-foreground"}`}>
      <button type="button" onClick={() => onOpen(tool.id)} className="flex flex-1 flex-col text-left">
        <div className="flex items-center gap-2">
          <Logo name={tool.name} src={tool.logo} />
          <h3 className="font-display text-xl leading-none">{tool.name}</h3>
        </div>
        <div className="mt-1.5 flex gap-1 overflow-x-auto lg:flex-wrap lg:overflow-visible">
          {badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-4 md:leading-5">{tool.pitch}</p>
        {featured && tool.bestFor ? (
          <p className="mt-1 line-clamp-1 text-sm leading-5">
            <span className="font-bold text-accent">{t.bestForLabel}. </span>
            {tool.bestFor}
          </p>
        ) : null}
        <dl className="mt-1.5 grid gap-0.5 text-sm leading-5">
          <div className="flex gap-2">
            <dt className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t.whoFor}</dt>
            <dd className="line-clamp-1 font-semibold">{tool.audience}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t.pricingMeta}</dt>
            <dd className="text-xs font-semibold leading-4">{tool.price}</dd>
          </div>
        </dl>
      </button>
      <OfficialLink tool={tool} t={t} className="mt-2 inline-flex text-sm font-semibold text-primary" />
    </article>
  )
}

function Block({ label, body, accent = false }: { label: string; body: string; accent?: boolean }) {
  return (
    <section className={accent ? "rounded-2xl bg-foreground p-4 text-background" : "rounded-2xl bg-card p-4 text-card-foreground ring-1 ring-border"}>
      <h3 className={`text-xs font-bold uppercase tracking-[0.18em] ${accent ? "text-accent" : "text-muted-foreground"}`}>{label}</h3>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
    </section>
  )
}

export function AutomationDetail({
  tool,
  t,
  onClose,
}: {
  tool: AutomationCard | null
  t: DirectoryCopy
  onClose: () => void
}) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!tool) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current()
    }
    const y = window.scrollY
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
      window.scrollTo(0, y)
    }
  }, [tool?.id])

  if (!tool) return null
  const badges = automationBadges(tool, t)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label={t.closeDetail} onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="automation-detail-title" className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-background p-5 text-foreground shadow-2xl md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Logo name={tool.name} src={tool.logo} />
            <div>
              <h2 id="automation-detail-title" className="font-display text-4xl leading-none">{tool.name}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-border">
            {t.closeDetail}
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          <Block label={t.useLabel} body={tool.use} />
          <Block label={t.whyLabel} body={tool.why} accent />
          <Block label={t.howLabel} body={tool.how} />
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <Meta label={t.worksWith}>{tool.worksWith || t.worksWithUnknown}</Meta>
          <Meta label={t.subcategoryLabel}>{tool.subcategory}</Meta>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          <OfficialLink tool={tool} t={t} className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" />
          <LocaleLink href={`/tool/${tool.id}`} className="inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-border">
            {t.catalogueFiche}
          </LocaleLink>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold leading-snug">{children}</dd>
    </div>
  )
}
