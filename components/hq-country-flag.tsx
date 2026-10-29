import { flagEmoji, isValidHqCountry } from "@/lib/hq-country"

type Props = {
  iso2?: string
  className?: string
  ariaLabel: string
}

export default function HqCountryFlag({ iso2, className = "", ariaLabel }: Props) {
  if (!isValidHqCountry(iso2) || !ariaLabel) return null
  const emoji = flagEmoji(iso2)
  if (!emoji) return null
  return (
    <span
      className={`inline-flex items-center text-2xl leading-none ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {emoji}
    </span>
  )
}
