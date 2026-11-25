/** ECB 2026-11-13: 1 EUR = 1.1052 USD */
export const EUR_PER_USD = 1.1052

export function usdToEur(usd) {
  const n = Number(usd)
  if (Number.isNaN(n)) return null
  return Math.round((n / EUR_PER_USD) * 100) / 100
}

/** Replace $X in strings with €Y using ECB rate (2-decimal €). */
export function replaceUsdAmountsInText(text) {
  return text.replace(/\$(\d{1,4}(?:\.\d{1,2})?)/g, (_, usd) => {
    const eur = usdToEur(usd)
    return eur == null ? `$${usd}` : `${eur.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`.replace(/\u00a0/g, " ")
  })
}