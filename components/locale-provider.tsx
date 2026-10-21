"use client"

import { createContext, useContext } from "react"
import { defaultLocale, type Locale } from "@/lib/i18n/config"
import { translate, type MessageVars } from "@/lib/i18n/messages"

const LocaleContext = createContext<Locale>(defaultLocale)

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useT() {
  const locale = useLocale()
  return (key: string, vars?: MessageVars) => translate(locale, key, vars)
}
