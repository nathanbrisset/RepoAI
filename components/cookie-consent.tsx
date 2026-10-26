"use client"

import { useState, useEffect } from "react"
import LocaleLink from "./locale-link"
import { useT } from "./locale-provider"
import { readConsent, writeConsent } from "@/lib/consent"

export default function CookieConsent() {
  const t = useT()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!readConsent()) setShowBanner(true)
  }, [])

  const handleAccept = () => {
    writeConsent("accepted")
    setShowBanner(false)
  }

  const handleDecline = () => {
    writeConsent("declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[60] flex justify-center px-2 sm:bottom-3 sm:px-4">
      <div className="pointer-events-auto flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:gap-3 sm:p-3">
        <p className="flex-1 text-xs leading-snug text-muted-foreground sm:text-sm sm:leading-normal">
          {t("cookie.body")}{" "}
          <LocaleLink href="/privacy" className="font-semibold text-primary hover:underline">
            {t("cookie.privacy")}
          </LocaleLink>{" "}
          {t("cookie.more")}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground sm:px-4 sm:py-2 sm:text-sm"
          >
            {t("cookie.decline")}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground sm:px-4 sm:py-2 sm:text-sm"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  )
}
