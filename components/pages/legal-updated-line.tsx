"use client"

import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n/config"

export function LegalUpdatedLine({ template, locale }: { template: string; locale: Locale }) {
  const [line, setLine] = useState(template.replace("{date}", "…"))

  useEffect(() => {
    const date = new Date().toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")
    setLine(template.replace("{date}", date))
  }, [locale, template])

  return <p className="text-gray-600 mb-8">{line}</p>
}
