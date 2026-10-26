"use client"

import { ArrowRight } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { Shuriken } from "./shuriken"

export function SiteFooter() {
  const locale = useLocale()
  const t = directoryCopy(locale)

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-14 md:px-6 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">{t.footerCta}</h2>
            <p className="leading-relaxed text-background/70">{t.footerBody}</p>
          </div>
          <LocaleLink href="/submit" className="group flex h-14 items-center gap-2 self-start rounded-full bg-accent px-7 font-semibold text-accent-foreground hover:-translate-y-1 md:self-auto">
            {t.footerSubmit}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </LocaleLink>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-background/80">
          {t.footerLinks.map((link) => (
            <LocaleLink key={link.href} href={link.href} className="hover:text-background">
              {link.label}
            </LocaleLink>
          ))}
        </nav>
        <div className="flex flex-col gap-4 border-t border-background/15 pt-6 text-sm text-background/60 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2 font-display text-base text-background">
            <Shuriken className="size-4 text-accent" />
            AItools.ninja
          </span>
          <p>{t.footerTagline}</p>
        </div>
      </div>
    </footer>
  )
}
