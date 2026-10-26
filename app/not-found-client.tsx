"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useT } from "@/components/locale-provider"

export default function NotFound() {
  const router = useRouter()
  const t = useT()

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-6 py-16">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row">
        <div className="flex flex-1 justify-center">
          <Image src="/ninja-logo.png" alt={t("notFound.logoAlt")} width={420} height={420} priority className="h-auto w-full max-w-sm" />
        </div>
        <div className="flex flex-1 flex-col items-start">
          <h1 className="mb-6 font-display text-3xl text-foreground">{t("notFound.title")}</h1>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full bg-secondary px-6 py-3 text-lg font-semibold text-foreground"
            >
              {t("notFound.back")}
            </button>
            <LocaleLink href="/" className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground">
              {t("notFound.home")}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  )
}
