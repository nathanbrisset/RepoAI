"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchBar from "./search-bar"
import LanguageSwitcher from "./language-switcher"
import LocaleLink from "./locale-link"
import type { CatalogSearchRecord } from "@/lib/i18n/search-records"
import { useT } from "./locale-provider"

export default function Header({ searchRecords }: { searchRecords: CatalogSearchRecord[] }) {
  const t = useT()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <LocaleLink href="/" className="flex min-w-0 items-center">
          <Image src="/brand/aitools-ninja-logo.png" alt="AItools.ninja" width={756} height={318} priority className="h-auto w-40" />
        </LocaleLink>

        <nav className="hidden md:flex items-center space-x-6">
          <LocaleLink href="/categories" className="text-gray-600 hover:text-gray-900">
            {t("header.categories")}
          </LocaleLink>
          <LocaleLink href="/submit" className="text-gray-600 hover:text-gray-900">
            {t("header.submit")}
          </LocaleLink>
          <LocaleLink href="/about" className="text-gray-600 hover:text-gray-900">
            {t("header.about")}
          </LocaleLink>
          <Suspense fallback={<span className="inline-block w-14" />}>
            <LanguageSwitcher />
          </Suspense>
          <div className="flex items-center space-x-3">
            <SearchBar className="bg-transparent" records={searchRecords} />
          </div>
        </nav>

        <div className="flex items-center space-x-2 md:hidden">
          <Suspense fallback={<span className="inline-block w-14" />}>
            <LanguageSwitcher />
          </Suspense>
          <SearchBar className="bg-transparent" records={searchRecords} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("header.openMenu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <LocaleLink href="/categories" className="text-lg font-medium" onClick={() => setOpen(false)}>
                  {t("header.categories")}
                </LocaleLink>
                <LocaleLink href="/submit" className="text-lg font-medium" onClick={() => setOpen(false)}>
                  {t("header.submit")}
                </LocaleLink>
                <LocaleLink href="/about" className="text-lg font-medium" onClick={() => setOpen(false)}>
                  {t("header.about")}
                </LocaleLink>
                <Suspense fallback={<span className="inline-block w-14" />}>
            <LanguageSwitcher />
          </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
