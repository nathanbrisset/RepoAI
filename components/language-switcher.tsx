"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Check, ChevronDown, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { localizeHref, stripLocale } from "@/lib/i18n/paths"
import { useLocale, useT } from "./locale-provider"

function writeLocaleCookie(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useT()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()
  const barePath = stripLocale(pathname)
  const query = searchParams?.toString()

  const choose = (next: Locale) => {
    if (next === locale) return
    writeLocaleCookie(next)
    const href = localizeHref(next, barePath)
    // Middleware rewrites /fr onto the English route, so a client navigation
    // updates the URL without re-rendering the layout that reads x-locale.
    window.location.assign(query ? `${href}?${query}` : href)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2 text-gray-700"
          aria-label={t("language.label")}
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">{locale === "fr" ? "FR" : "EN"}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem onSelect={() => choose("en")} className="justify-between">
          {t("language.en")}
          {locale === "en" ? <Check className="h-4 w-4" /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => choose("fr")} className="justify-between">
          {t("language.fr")}
          {locale === "fr" ? <Check className="h-4 w-4" /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
