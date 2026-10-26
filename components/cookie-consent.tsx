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
    <div className="fixed bottom-0 left-0 right-0 z-[75] border-t border-border bg-card p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            {t("cookie.body")}{" "}
            <LocaleLink href="/privacy" className="font-semibold text-primary hover:underline">
              {t("cookie.privacy")}
            </LocaleLink>{" "}
            {t("cookie.more")}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDecline}
            className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground"
          >
            {t("cookie.decline")}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  )
}
