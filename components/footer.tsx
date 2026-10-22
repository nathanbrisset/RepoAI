"use client"

import LocaleLink from "./locale-link"
import { useT } from "./locale-provider"

export default function Footer() {
  const t = useT()

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">AITools.ninja</h3>
            <p className="text-gray-600 mb-2">{t("footer.tagline")}</p>
          </div>

          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">{t("footer.categories")}</h3>
            <ul className="space-y-2">
              <li>
                <LocaleLink href="/categories/text" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.text")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/categories/image" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.image")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/categories/audio" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.audio")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/categories/productivity" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.productivity")}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/categories/coding" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t("footer.coding")}
                </LocaleLink>
              </li>
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
