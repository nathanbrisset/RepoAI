export const CONSENT_KEY = "cookieConsent"
export const CONSENT_EVENT = "cookie-consent-changed"

export type ConsentChoice = "accepted" | "declined"

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null
  const value = window.localStorage.getItem(CONSENT_KEY)
  if (value === "accepted" || value === "declined") return value
  return null
}

export function writeConsent(choice: ConsentChoice) {
  window.localStorage.setItem(CONSENT_KEY, choice)
  if (choice === "declined") clearAnalyticsCookies()
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))

  for (const name of names) {
    if (name !== "_ga" && name !== "_gid" && !name.startsWith("_ga_")) continue
    document.cookie = `${name}=; Max-Age=0; path=/`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.aitools.ninja`
  }
}
