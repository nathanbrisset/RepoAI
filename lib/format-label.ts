/** Turn raw catalog tokens such as content_creation or safe_AI into readable labels. */
export function formatLabel(value: string): string {
  const spaced = value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()

  if (!spaced) return value

  const titled = spaced.replace(/\b\w/g, (char) => char.toUpperCase())

  return titled
    .replace(/\bAi\b/g, "AI")
    .replace(/\bApi\b/g, "API")
    .replace(/\bSeo\b/g, "SEO")
    .replace(/\bUi\b/g, "UI")
    .replace(/\bUx\b/g, "UX")
    .replace(/\bQa\b/g, "Q&A")
}
