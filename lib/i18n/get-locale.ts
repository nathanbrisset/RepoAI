import { headers } from "next/headers"
import { defaultLocale, isLocale, type Locale } from "./config"

export async function getLocale(): Promise<Locale> {
  const headerStore = await headers()
  const value = headerStore.get("x-locale")
  return isLocale(value) ? value : defaultLocale
}

export async function getRequestPathname(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get("x-pathname") || "/"
}
