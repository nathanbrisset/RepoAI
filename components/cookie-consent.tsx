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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            {t("cookie.body")}{" "}
            <LocaleLink href="/privacy" className="text-blue-600 hover:underline">
              {t("cookie.privacy")}
            </LocaleLink>{" "}
            {t("cookie.more")}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {t("cookie.decline")}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  )
}
