"use client"

import { ExternalLink, Youtube } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { showYouTubeChannelBanner, youtubeChannelUrl } from "@/lib/site/youtube-channel"

export function YouTubeChannelBanner() {
  const locale = useLocale()
  const t = directoryCopy(locale)

  if (!showYouTubeChannelBanner()) return null

  return (
    <div className="border-b border-border bg-primary/[0.06]">
      <div className="mx-auto flex max-w-[1600px] justify-center px-4 py-2.5 md:px-6">
        <a
          href={youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Youtube className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{t.youtubeChannelBanner}</span>
          <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
          <span className="sr-only">{t.youtubeChannelBannerSr}</span>
        </a>
      </div>
    </div>
  )
}
