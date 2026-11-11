"use client"

import { LocaleProvider } from "@/components/locale-provider"
import type { Locale } from "@/lib/i18n/config"
import { DirectoryProvider } from "@/components/directory/directory-provider"
import type { DirectoryChip } from "@/lib/directory/data"

export function LocaleSiteShell({
  locale,
  chips,
  total,
  children,
}: {
  locale: Locale
  chips: DirectoryChip[]
  total: number
  children: React.ReactNode
}) {
  return (
    <LocaleProvider locale={locale}>
      <DirectoryProvider chips={chips} total={total}>
        {children}
      </DirectoryProvider>
    </LocaleProvider>
  )
}
