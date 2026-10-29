/**
 * Site display currency is EUR. Catalog source notes often use USD list prices;
 * we show the same numeric amounts with € / EUR wording (symbol swap, not FX).
 */

const DOLLAR_WORD = /\bdollars?\b/gi

/** Replace US currency markers in user-facing price copy. Idempotent for already-EUR text. */
export function formatDisplayPrice(text: string): string {
  const hasUsdWord = /\bUSD\b/i.test(text)
  const hasDollarWord = /\bdollars?\b/i.test(text)
  if (!text.includes("$") && !hasUsdWord && !hasDollarWord) {
    return text
  }

  let out = text.replace(/\bUSD\b/gi, "EUR")
  out = out.replace(DOLLAR_WORD, (match) => {
    const lower = match.toLowerCase()
    if (lower === "dollar") return "euro"
    if (lower === "dollars") return "euros"
    return match
  })
  out = out.replace(/\$/g, "€")
  return out
}

function mapOptionalStrings(values: string[] | undefined): string[] | undefined {
  if (!values?.length) return values
  return values.map(formatDisplayPrice)
}

function mapHowToUse(steps: ToolHowToStep[] | undefined): ToolHowToStep[] | undefined {
  if (!steps?.length) return steps
  return steps.map((step) => ({
    ...step,
    title: formatDisplayPrice(step.title),
    description: formatDisplayPrice(step.description),
  }))
}

type ToolHowToStep = {
  title: string
  description: string
  links?: { label: string; url: string }[]
}

type ToolLike = {
  description: string
  longDescription?: string
  dateAddedNote?: string
  statusNote?: string
  pricingNote_fr?: string
  features?: string[]
  howToUse?: ToolHowToStep[]
  pricing?: {
    details?: string
  }
}

/** Apply EUR display formatting to every user-visible text field on a localized tool. */
export function applyDisplayCurrencyToTool<T extends ToolLike>(tool: T): T {
  return {
    ...tool,
    description: formatDisplayPrice(tool.description),
    longDescription: tool.longDescription ? formatDisplayPrice(tool.longDescription) : tool.longDescription,
    dateAddedNote: tool.dateAddedNote ? formatDisplayPrice(tool.dateAddedNote) : tool.dateAddedNote,
    statusNote: tool.statusNote ? formatDisplayPrice(tool.statusNote) : tool.statusNote,
    pricingNote_fr: tool.pricingNote_fr ? formatDisplayPrice(tool.pricingNote_fr) : tool.pricingNote_fr,
    features: mapOptionalStrings(tool.features),
    howToUse: mapHowToUse(tool.howToUse),
    pricing: tool.pricing
      ? {
          ...tool.pricing,
          details: tool.pricing.details ? formatDisplayPrice(tool.pricing.details) : tool.pricing.details,
        }
      : tool.pricing,
  }
}
