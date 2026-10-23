"use client"

import LocaleLink from "./locale-link"
import { useLocale, useT } from "./locale-provider"
import { categoryCatalog, categoryName } from "@/lib/category-meta"
import { categoryCopy } from "@/lib/i18n/messages"

export default function Footer() {
  const t = useT()
  const locale = useLocale()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">AITools.ninja</h3>
            <p className="mb-2 text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">{t("footer.categories")}</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categoryCatalog.map((category) => (
                <li key={category.id}>
                  <LocaleLink href={`/categories/${category.id}`} className="text-link hover:underline">
                    {categoryCopy(locale, category.id)?.name || categoryName(category.id)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              <li>
                <LocaleLink href="/about" className="text-link hover:underline">
                  {t("footer.about")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/submit" className="text-link hover:underline">
                  {t("footer.submit")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/contact" className="text-link hover:underline">
                  {t("footer.contact")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/privacy" className="text-link hover:underline">
                  {t("footer.privacy")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/terms" className="text-link hover:underline">
                  {t("footer.terms")}
                </LocaleLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col items-center">
          <p className="text-gray-600 text-center">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
