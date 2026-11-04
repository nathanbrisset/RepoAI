/**
 * YouTube channel promo under the site header.
 * Hidden when the flag is off or the channel URL is empty — set both to show it.
 * Canonical URL: https://www.youtube.com/@aitoolsninja_fr (channel id UCO19g7Ba3jv5j9DdXrV8L8w), not @aitoolsninja.
 */
export const youtubeChannelBannerEnabled =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_BANNER_ENABLED === "true"

export const youtubeChannelUrl = (process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL ?? "").trim()

export function showYouTubeChannelBanner(): boolean {
  return youtubeChannelBannerEnabled && youtubeChannelUrl.length > 0
}
