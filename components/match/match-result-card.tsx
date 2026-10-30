"use client"

import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import type { Locale } from "@/lib/i18n/config"
import { localizeTool } from "@/lib/i18n/localize-tool"
import { pricingLabel, translate } from "@/lib/i18n/messages"
import type { Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

function Logo({ name, src, inverted }: { name: string; src?: string; inverted?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl text-lg font-bold ring-1",
        inverted ? "bg-background text-foreground ring-background/30" : "bg-foreground text-background ring-border",
      )}
    >
      {src ? (
        <img src={src} alt="" className="size-7 object-contain" loading="lazy" decoding="async" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  )
}

export function MatchResultCard({
  rank,
  tool,
  reason,
  featured = false,
  locale: localeProp,
}: {
  rank: number
  tool: Tool
  reason: string
  featured?: boolean
  locale?: Locale
}) {
  const localeFromCtx = useLocale()
  const locale = localeProp ?? localeFromCtx
  const dir = directoryCopy(locale)
  const t = (key: string) => translate(locale, key)
  const localized = localizeTool(tool, locale)
  const logo = localized.logo || localized.image
  const price =
    localized.pricing?.label ||
    (localized.isPremium ? pricingLabel(locale, localized.isPremium) : "") ||
    localized.pricing?.details ||
    ""

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl p-4 ring-1 sm:p-5",
        featured ? "bg-foreground text-background ring-foreground" : "bg-card text-card-foreground ring-border",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
            featured ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground",
          )}
          aria-hidden="true"
        >
          {rank}
        </span>
        <div className="flex min-w-0 flex-1 gap-3">
          <Logo name={localized.name} src={logo} inverted={featured} />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl leading-tight">
              <LocaleLink
                href={`/tool/${localized.id}`}
                className={cn("hover:underline underline-offset-2", featured ? "text-background" : "text-foreground")}
              >
                {localized.name}
              </LocaleLink>
            </h3>
            {price ? (
              <p className={cn("mt-1 text-xs font-semibold", featured ? "text-accent" : "text-muted-foreground")}>{price}</p>
            ) : null}
          </div>
        </div>
      </div>
      {localized.description ? (
        <p className={cn("mt-3 line-clamp-3 text-sm leading-relaxed", featured ? "text-background/85" : "text-muted-foreground")}>
          {localized.description}
        </p>
      ) : null}
      {reason ? (
        <section className={cn("mt-4 rounded-xl p-3", featured ? "bg-background/10" : "bg-secondary/90")}>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">{t("recommendation.whyMatch")}</h4>
          <p className="mt-1.5 text-sm leading-relaxed">{reason}</p>
        </section>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <LocaleLink
          href={`/tool/${localized.id}`}
          className={cn("text-sm font-semibold underline-offset-2 hover:underline", featured ? "text-accent" : "text-primary")}
        >
          {dir.catalogueFiche}
        </LocaleLink>
        {localized.url ? (
          <a
            href={localized.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("text-sm font-semibold underline-offset-2 hover:underline", featured ? "text-accent" : "text-primary")}
          >
            {dir.officialSite}
          </a>
        ) : null}
      </div>
    </article>
  )
}
