import type { Metadata } from "next"
import { Dela_Gothic_One, Geist } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"
import { NotFoundDocument } from "@/components/not-found-document"
import { SiteRootShell } from "@/components/layout/site-root-shell"
import { directoryChips, directoryRecords } from "@/lib/directory/data"
import { localeFromPathname } from "@/lib/i18n/locale-detect"
import { PAGE_LOCALE_EN, PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { translate } from "@/lib/i18n/messages"
import { OG_IMAGE_ALT, OG_IMAGE_HEIGHT, OG_IMAGE_PATH, OG_IMAGE_WIDTH, SITE_URL } from "@/lib/seo"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
})

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers()
  const pathname =
    headerStore.get("x-pathname") || headerStore.get("x-next-url") || headerStore.get("next-url") || "/"
  const locale = localeFromPathname(pathname) === "fr" ? PAGE_LOCALE_FR : PAGE_LOCALE_EN
  const ogImageUrl = `${SITE_URL}${OG_IMAGE_PATH}`
  return {
    metadataBase: new URL(SITE_URL),
    title: translate(locale, "meta.notFoundTitle"),
    description: translate(locale, "meta.notFoundDescription"),
    robots: { index: false, follow: true },
    openGraph: {
      images: [
        { url: ogImageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  }
}

export default async function GlobalNotFound() {
  const headerStore = await headers()
  const pathname =
    headerStore.get("x-pathname") || headerStore.get("x-next-url") || headerStore.get("next-url") || "/"
  const isFrench = localeFromPathname(pathname) === "fr"
  const locale = isFrench ? PAGE_LOCALE_FR : PAGE_LOCALE_EN
  const chips = directoryChips(locale)
  const total = directoryRecords(locale).length
  const lang = isFrench ? "fr" : "en"

  return (
    <html lang={lang} className={`${geist.variable} ${dela.variable}`} suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <SiteRootShell locale={locale} chips={chips} total={total}>
          <NotFoundDocument locale={locale} />
        </SiteRootShell>
      </body>
    </html>
  )
}
