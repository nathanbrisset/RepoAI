"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useT } from "@/components/locale-provider"

export default function NotFound() {
  const router = useRouter()
  const t = useT()

  return (
    <div style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 900 }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Image src="/ninja-logo.png" alt={t("notFound.logoAlt")} width={960} height={960} priority />
        </div>
        <div style={{ flex: 1, paddingLeft: 40, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{t("notFound.title")}</h1>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => router.back()}
              style={{ padding: "12px 28px", fontSize: 18, borderRadius: 8, background: "#eee", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              {t("notFound.back")}
            </button>
            <LocaleLink href="/" style={{ padding: "12px 28px", fontSize: 18, borderRadius: 8, background: "#0070f3", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
              {t("notFound.home")}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  )
}
