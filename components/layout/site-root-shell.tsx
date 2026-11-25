import type React from "react"
import type { Locale } from "@/lib/i18n/config"
import { ThemeProvider } from "@/components/theme-provider"
import CookieConsent from "@/components/cookie-consent"
import { CompareSpacer, CompareTray } from "@/components/directory/compare-tray"
import { SavedDrawer } from "@/components/directory/saved-drawer"
import { SiteFooter } from "@/components/directory/site-footer"
import { SiteHeader } from "@/components/directory/site-header"
import { YouTubeChannelBanner } from "@/components/directory/youtube-channel-banner"
import { ToolDialog } from "@/components/directory/tool-dialog"
import { LocaleSiteShell } from "@/components/locale-site-shell"
import type { DirectoryChip } from "@/lib/directory/data"

export function SiteRootShell({
  locale,
  chips,
  total,
  children,
}: {
  locale: Locale
  chips: DirectoryChip[]
  total: number
  children: React.ReactNode
}) {
  return (
    <LocaleSiteShell locale={locale} chips={chips} total={total}>
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
  )
}
