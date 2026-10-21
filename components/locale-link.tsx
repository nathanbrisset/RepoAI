"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { localizeHref } from "@/lib/i18n/paths"
import { useLocale } from "./locale-provider"

type LocaleLinkProps = ComponentProps<typeof Link>

export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale()
  const localized = typeof href === "string" ? localizeHref(locale, href) : href
  return <Link href={localized} {...props} />
}
