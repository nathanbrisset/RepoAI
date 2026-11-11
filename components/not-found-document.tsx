import Image from "next/image"
import LocaleLink from "@/components/locale-link"
import type { Locale } from "@/lib/i18n/config"
import { translate } from "@/lib/i18n/messages"

export function NotFoundDocument({ locale }: { locale: Locale }) {
  const title = translate(locale, "notFound.title")
  const back = translate(locale, "notFound.back")
  const home = translate(locale, "notFound.home")

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-6 py-16">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row">
        <div className="flex flex-1 justify-center">
          <Image
            src="/brand/aitools-ninja-logo.png"
            alt="AItools.ninja"
            width={756}
            height={318}
            priority
            className="h-auto w-full max-w-sm"
          />
        </div>
        <div className="flex flex-1 flex-col items-start">
          <h1 className="mb-6 font-display text-3xl text-foreground">{title}</h1>
          <div className="flex flex-wrap gap-4">
            <LocaleLink href="/" className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground">
              {home}
            </LocaleLink>
            <LocaleLink
              href="/"
              className="rounded-full bg-secondary px-6 py-3 text-lg font-semibold text-foreground"
            >
              {back}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  )
}
