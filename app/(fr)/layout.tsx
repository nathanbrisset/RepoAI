import type React from "react"
import { Dela_Gothic_One, Geist } from "next/font/google"
import "../globals.css"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { SiteRootShell } from "@/components/layout/site-root-shell"
import { directoryChips, directoryRecords } from "@/lib/directory/data"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
})

export const dynamic = "force-static"

export default function FrRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const chips = directoryChips(PAGE_LOCALE_FR)
  const total = directoryRecords(PAGE_LOCALE_FR).length

  return (
    <html lang="fr" className={`${geist.variable} ${dela.variable}`} suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <SiteRootShell locale={PAGE_LOCALE_FR} chips={chips} total={total}>
          {children}
        </SiteRootShell>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
