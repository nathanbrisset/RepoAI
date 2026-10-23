"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import SearchBar from "./search-bar"
import { useLocale, useT } from "./locale-provider"
import { categoryCatalog } from "@/lib/category-meta"
import { heroWordsFor } from "@/lib/i18n/messages"
import { localizeHref } from "@/lib/i18n/paths"
import type { CatalogSearchRecord } from "@/lib/i18n/search-records"

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <path fill="#fff" d="M16 5.2 17.7 14.3 26.8 16 17.7 17.7 16 26.8 14.3 17.7 5.2 16 14.3 14.3Z" />
    </svg>
  )
}

export default function HomeHero({
  records,
  toolIds,
}: {
  records: CatalogSearchRecord[]
  toolIds: string[]
}) {
  const t = useT()
  const locale = useLocale()
  const router = useRouter()
  const words = useMemo(
    () => heroWordsFor(locale, categoryCatalog.map((category) => category.id)),
    [locale]
  )
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setIndex(0)
  }, [locale])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduceMotion(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (reduceMotion || words.length < 2) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      setIndex((current) => (current + 1) % words.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [reduceMotion, words.length])

  const word = words[index] || words[0] || ""

  const throwShuriken = () => {
    if (toolIds.length === 0) return
    const id = toolIds[Math.floor(Math.random() * toolIds.length)]
    router.push(localizeHref(locale, `/tool/${id}`))
  }

  return (
    <section className="px-4 pb-6 pt-12 md:pb-10 md:pt-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="mb-5 text-sm text-muted-foreground">{t("home.eyebrow", { count: records.length })}</p>
        <h1 className="text-4xl font-extrabold leading-[1.05] text-navy sm:text-6xl md:text-7xl">
          <span className="block">{t("home.heroLine1")}</span>
          <span className="mt-1 block">
            {t("home.heroLine2")}{" "}
            <span className="relative inline-block text-link">
              <span key={`${locale}-${index}`} className={index > 0 && !reduceMotion ? "hero-word inline-block" : "inline-block"}>
                {word}
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-[0.12em] rounded-full bg-cta" aria-hidden="true" />
            </span>
          </span>
        </h1>

        <div className="mt-8 w-full">
          <SearchBar variant="hero" records={records} className="mx-auto" />
        </div>

        <button
          type="button"
          onClick={throwShuriken}
          disabled={toolIds.length === 0}
          className="mt-5 inline-flex items-center gap-3 rounded-full bg-cta py-2 pl-2 pr-5 text-left text-cta-foreground shadow-soft transition hover:brightness-95 disabled:opacity-60"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
            <Mark className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">{t("home.shuriken")}</span>
            <span className="block text-xs text-white/85">{t("home.shurikenHint")}</span>
          </span>
        </button>
      </div>
    </section>
  )
}
