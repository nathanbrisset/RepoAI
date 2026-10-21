"use client"

import { useEffect, useState } from "react"
import { readConsent, writeConsent } from "@/lib/consent"

const choiceButton =
  "flex-1 md:flex-none min-w-[9.5rem] px-4 py-2 text-sm font-semibold rounded-md border transition-colors"

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    setShowBanner(readConsent() === null)
  }, [])

  if (!showBanner) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="flex-1 text-sm text-gray-700">
          We use Google Analytics only if you accept. Rejecting is one click and keeps analytics off.
          Read the{" "}
          <a href="/privacy" className="text-purple-700 underline">
            privacy policy
          </a>
          .
        </p>
        <div className="flex w-full md:w-auto gap-3">
          <button
            type="button"
            onClick={() => {
              writeConsent("declined")
              setShowBanner(false)
            }}
            className={`${choiceButton} bg-white text-gray-900 border-gray-900 hover:bg-gray-100`}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => {
              writeConsent("accepted")
              setShowBanner(false)
            }}
            className={`${choiceButton} bg-gray-900 text-white border-gray-900 hover:bg-gray-800`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
