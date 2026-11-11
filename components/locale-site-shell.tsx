"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { LocaleProvider } from "@/components/locale-provider"
import { defaultLocale, type Locale } from "@/lib/i18n/config"
import { localeFromPathname } from "@/lib/i18n/locale-detect"
import { DirectoryProvider } from "@/components/directory/directory-provider"
import type { DirectoryChip } from "@/lib/directory/data"

function localeFromPath(pathname: string): Locale {
  const detected = localeFromPathname(pathname || "/")
  return detected === "fr" ? "fr" : defaultLocale
}

export function LocaleSiteShell({
  chipsEn,
  chipsFr,
  totalEn,
  totalFr,
  children,
}: {
  chipsEn: DirectoryChip[]
  chipsFr: DirectoryChip[]
  totalEn: number
  totalFr: number
  children: React.ReactNode
}) {
  const pathname = usePathname() || "/"
  const locale = localeFromPath(pathname)
  const chips = locale === "fr" ? chipsFr : chipsEn
  const total = locale === "fr" ? totalFr : totalEn

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LocaleProvider locale={locale}>
      <DirectoryProvider chips={chips} total={total} today={new Date().toISOString().slice(0, 10)}>
        {children}
      </DirectoryProvider>
    </LocaleProvider>
  )
}
