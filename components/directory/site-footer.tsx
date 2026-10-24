"use client"

import { ArrowRight } from "lucide-react"
import { categoryCatalog } from "@/lib/category-meta"
import { categoryCopy } from "@/lib/i18n/messages"
import LocaleLink from "@/components/locale-link"
import { useLocale, useT } from "@/components/locale-provider"
import { Shuriken } from "./shuriken"
import { useDirectory } from "./directory-context"

export function SiteFooter() {
  const t = useT()
  const locale = useLocale()
  const { compare } = useDirectory()

  return (
    <footer className={`bg-foreground text-background ${compare.length > 0 ? "pb-28" : ""}`}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-14 md:px-6 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-display text-3xl leading-tight text-balance md:text-5xl">{t("directory.footerTitle")}</h2>
            <p className="leading-relaxed text-background/70">{t("directory.footerBody")}</p>
          </div>
          <LocaleLink
            href="/submit"
            className="group flex h-14 items-center gap-2 self-start rounded-full bg-accent px-7 font-semibold text-accent-foreground transition hover:-translate-y-1 md:self-auto"
          >
            {t("directory.footerSubmit")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </LocaleLink>
        </div>

        <nav aria-label={t("footer.categories")} className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-background/70">
          {categoryCatalog.map((category) => (
            <LocaleLink key={category.id} href={`/categories/${category.id}`} className="hover:text-background hover:underline">
              {categoryCopy(locale, category.id)?.name || category.name}
            </LocaleLink>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-background/15 pt-6 text-sm text-background/60 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2 font-display text-base text-background">
            <Shuriken className="size-4 text-accent" />
            aitools.ninja
          </span>
          <nav aria-label={t("footer.company")} className="flex flex-wrap gap-x-4 gap-y-2">
            <LocaleLink href="/about" className="hover:text-background hover:underline">
              {t("footer.about")}
            </LocaleLink>
            <LocaleLink href="/contact" className="hover:text-background hover:underline">
              {t("footer.contact")}
            </LocaleLink>
            <LocaleLink href="/privacy" className="hover:text-background hover:underline">
              {t("footer.privacy")}
            </LocaleLink>
            <LocaleLink href="/terms" className="hover:text-background hover:underline">
              {t("footer.terms")}
            </LocaleLink>
          </nav>
          <p>{t("directory.footerBlurb")}</p>
        </div>
      </div>
    </footer>
  )
}
