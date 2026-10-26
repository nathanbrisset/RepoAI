import type React from "react"
import type { Metadata } from "next"
import { Dela_Gothic_One, Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { LocaleProvider } from "@/components/locale-provider"
import { CompareSpacer, CompareTray } from "@/components/directory/compare-tray"
import { DirectoryProvider } from "@/components/directory/directory-provider"
import { SavedDrawer } from "@/components/directory/saved-drawer"
import { SiteFooter } from "@/components/directory/site-footer"
import { SiteHeader } from "@/components/directory/site-header"
import { ToolDialog } from "@/components/directory/tool-dialog"
import { directoryChips, directoryRecords } from "@/lib/directory/data"
import { getLocale, getRequestPathname } from "@/lib/i18n/get-locale"
import { buildPageMetadata } from "@/lib/i18n/metadata"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
})

export async function generateMetadata(): Promise<Metadata> {
  const [locale, pathname] = await Promise.all([getLocale(), getRequestPathname()])
  return buildPageMetadata(locale, pathname)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const records = directoryRecords(locale)
  const chips = directoryChips(locale)

  return (
    <html lang={locale} className={`${geist.variable} ${dela.variable}`} suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <LocaleProvider locale={locale}>
          <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
            <DirectoryProvider records={records} chips={chips} total={records.length} today={new Date().toISOString().slice(0, 10)}>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-grow overflow-x-hidden">{children}</main>
                <CompareSpacer />
                <SiteFooter />
              </div>
              <ToolDialog />
              <SavedDrawer />
              <CompareTray />
              <CookieConsent />
            </DirectoryProvider>
          </ThemeProvider>
        </LocaleProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
