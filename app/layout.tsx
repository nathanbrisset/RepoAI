import type React from "react"
import type { Metadata } from "next"
import { Dela_Gothic_One, Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { CompareSpacer, CompareTray } from "@/components/directory/compare-tray"
import { SavedDrawer } from "@/components/directory/saved-drawer"
import { SiteFooter } from "@/components/directory/site-footer"
import { SiteHeader } from "@/components/directory/site-header"
import { YouTubeChannelBanner } from "@/components/directory/youtube-channel-banner"
import { ToolDialog } from "@/components/directory/tool-dialog"
import { LocaleSiteShell } from "@/components/locale-site-shell"
import { directoryChips, directoryRecords } from "@/lib/directory/data"
import { PAGE_LOCALE_EN, PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { buildPageMetadata } from "@/lib/i18n/metadata"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
})

export const dynamic = "force-static"

export function generateMetadata(): Metadata {
  return buildPageMetadata(PAGE_LOCALE_EN, "/")
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const chipsEn = directoryChips(PAGE_LOCALE_EN)
  const chipsFr = directoryChips(PAGE_LOCALE_FR)
  const totalEn = directoryRecords(PAGE_LOCALE_EN).length
  const totalFr = directoryRecords(PAGE_LOCALE_FR).length

  return (
    <html lang="en" className={`${geist.variable} ${dela.variable}`} suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <LocaleSiteShell chipsEn={chipsEn} chipsFr={chipsFr} totalEn={totalEn} totalFr={totalFr}>
          <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <YouTubeChannelBanner />
              <main className="flex-grow overflow-x-hidden">{children}</main>
              <CompareSpacer />
              <SiteFooter />
            </div>
            <ToolDialog />
            <SavedDrawer />
            <CompareTray />
            <CookieConsent />
          </ThemeProvider>
        </LocaleSiteShell>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
