"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { CONSENT_EVENT, readConsent } from "@/lib/consent"

const GA_ID = "G-R4T2NYFMFC"

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(readConsent() === "accepted")
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
