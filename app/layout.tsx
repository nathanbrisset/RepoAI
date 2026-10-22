import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { LocaleProvider } from "@/components/locale-provider"
import { getLocale, getRequestPathname } from "@/lib/i18n/get-locale"
import { buildPageMetadata } from "@/lib/i18n/metadata"
import { searchRecordsForLocale } from "@/lib/i18n/search-records"

const inter = Inter({ subsets: ["latin"] })

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
  const searchRecords = searchRecordsForLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <LocaleProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <Header searchRecords={searchRecords} />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CookieConsent />
            </div>
          </ThemeProvider>
        </LocaleProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
