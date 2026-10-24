import type React from "react"
import type { Metadata } from "next"
import { Dela_Gothic_One, Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { LocaleProvider } from "@/components/locale-provider"
import { CompareTray } from "@/components/directory/compare-tray"
import { DirectoryProvider } from "@/components/directory/directory-context"
import { SavedDrawer } from "@/components/directory/saved-drawer"
import { SiteFooter } from "@/components/directory/site-footer"
import { SiteHeader } from "@/components/directory/site-header"
import { ToolDialog } from "@/components/directory/tool-dialog"
import { listedTools } from "@/lib/catalog"
import { toDirectoryTool } from "@/lib/directory/tools"
import { getLocale, getRequestPathname } from "@/lib/i18n/get-locale"
import { toolForLocale } from "@/lib/i18n/localize-tool"
import { buildPageMetadata } from "@/lib/i18n/metadata"

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
})

const dela = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela",
  display: "swap",
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
  const tools = listedTools.map((tool) => toDirectoryTool(toolForLocale(tool, locale)))

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geist.variable} ${dela.variable} font-sans`}>
        <LocaleProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <DirectoryProvider tools={tools}>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-grow">{children}</main>
                <SiteFooter />
                <ToolDialog />
                <SavedDrawer />
                <CompareTray />
                <CookieConsent />
              </div>
            </DirectoryProvider>
          </ThemeProvider>
        </LocaleProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
