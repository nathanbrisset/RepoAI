"use client"

import Image from "next/image"
import LocaleLink from "./locale-link"
import { useLocale, useT } from "./locale-provider"
import { categoryCatalog, categoryName } from "@/lib/category-meta"
import { categoryCopy } from "@/lib/i18n/messages"

export default function Footer() {
  const t = useT()
  const locale = useLocale()

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <LocaleLink href="/" className="mb-4 inline-flex">
              <Image src="/brand/aitools-ninja-logo.png" alt="AItools.ninja" width={756} height={318} className="h-auto w-48" />
            </LocaleLink>
            <p className="text-gray-600 mb-2">{t("footer.tagline")}</p>
          </div>

          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">{t("footer.categories")}</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categoryCatalog.map((category) => (
                <li key={category.id}>
                  <LocaleLink href={`/categories/${category.id}`} className="text-gray-600 hover:text-gray-900 transition-colors">
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
                <LocaleLink href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.about")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/submit" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.submit")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.contact")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.privacy")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
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
