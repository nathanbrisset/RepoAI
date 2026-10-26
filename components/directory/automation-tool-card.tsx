"use client"

import { useState, type ReactNode } from "react"
import LocaleLink from "@/components/locale-link"
import type { AutomationCard } from "@/lib/directory/automation-guides"
import type { DirectoryCopy } from "@/lib/i18n/directory-copy"

function Logo({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-foreground text-2xl font-bold text-background ring-1 ring-border">
      {src && !failed ? (
        <img src={src} alt="" className="size-10 object-contain" onError={() => setFailed(true)} />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  )
}

function Badge({ children }: { children: string }) {
  return <span className="rounded-full bg-background px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-border">{children}</span>
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold leading-snug">{children}</dd>
    </div>
  )
}

function EditorialBlock({ label, body }: { label: string; body: string }) {
  return (
    <section className="flex min-h-52 flex-col rounded-3xl bg-foreground p-5 text-background md:p-6">
      <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-accent">{label}</h3>
      <p className="mt-4 text-base leading-relaxed md:text-lg">{body}</p>
    </section>
  )
}

export function AutomationToolCard({ tool, t }: { tool: AutomationCard; t: DirectoryCopy }) {
  const badges = [
    tool.pricingBadge,
    tool.openSource ? t.openSourceBadge : "",
    tool.selfHost ? t.selfHostBadge : "",
    tool.onPrem ? t.onPremBadge : "",
  ].filter(Boolean)

  return (
    <article id={tool.id} className="scroll-mt-24 rounded-[2rem] bg-card p-6 text-card-foreground ring-1 ring-border md:p-8">
      <div className="flex items-start gap-4">
        <Logo name={tool.name} src={tool.logo} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-4xl leading-none md:text-5xl">{tool.name}</h2>
            {tool.pinned ? (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">{t.pinnedBadge}</span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-xl leading-relaxed">{tool.pitch}</p>

      <dl className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-2 xl:grid-cols-4">
        <Meta label={t.whoFor}>{tool.audience}</Meta>
        <Meta label={t.pricingMeta}>
          <span className="block">{tool.pricingBadge || t.dash}</span>
          {tool.priceFrom ? <span className="mt-1 block text-sm font-medium text-muted-foreground">{tool.priceFrom}</span> : null}
        </Meta>
        <Meta label={t.worksWith}>{tool.worksWith || t.worksWithUnknown}</Meta>
        <Meta label={t.subcategoryLabel}>
          <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-1 text-sm text-accent">{tool.subcategory}</span>
        </Meta>
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <EditorialBlock label={t.useLabel} body={tool.use} />
        <EditorialBlock label={t.whyLabel} body={tool.why} />
        <EditorialBlock label={t.howLabel} body={tool.how} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {tool.url ? (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
          >
            {t.officialSite}
          </a>
        ) : null}
        <LocaleLink href={`/tool/${tool.id}`} className="inline-flex items-center rounded-full px-5 py-2.5 font-semibold ring-1 ring-border">
          {t.catalogueFiche}
        </LocaleLink>
      </div>
    </article>
  )
}
