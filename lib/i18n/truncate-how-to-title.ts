const DEFAULT_MAX = 90

/** Abbreviations that must not be cut mid-token when truncating on a word boundary. */
const PROTECTED_ABBREVS = new Set(["excl.", "etc.", "e.g.", "i.e.", "vs.", "fig.", "approx."])

function tokenEndingAt(text: string, endIndex: number): string {
  let start = endIndex
  while (start > 0 && /[\w.]/.test(text[start - 1])) start--
  return text.slice(start, endIndex + 1).toLowerCase()
}

/** First sentence boundary, but do not stop on abbreviation periods (e.g. excl.). */
export function firstSentenceForHowTo(text: string): string {
  const trimmed = text.trim()
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i]
    if (c !== "." && c !== "!" && c !== "?") continue
    const token = tokenEndingAt(trimmed, i)
    if (PROTECTED_ABBREVS.has(token)) continue
    const next = trimmed[i + 1]
    if (i === trimmed.length - 1 || (next && /\s/.test(next))) {
      return trimmed.slice(0, i + 1).trim()
    }
  }
  return trimmed
}

function openParensBefore(text: string, index: number): number {
  let count = 0
  for (let i = 0; i < index; i++) {
    if (text[i] === "(") count++
  }
  return count
}

function closeParensBefore(text: string, index: number): number {
  let count = 0
  for (let i = 0; i < index; i++) {
    if (text[i] === ")") count++
  }
  return count
}

function endsInsideUnclosedParen(text: string): boolean {
  let depth = 0
  for (const ch of text) {
    if (ch === "(") depth++
    else if (ch === ")") depth = Math.max(0, depth - 1)
  }
  return depth > 0
}

function cutOnWordBoundary(slice: string, max: number): string {
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace <= Math.floor(max * 0.45)) return slice.trim()
  const candidate = slice.slice(0, lastSpace).trim()
  const tail = slice.slice(lastSpace + 1).trim().toLowerCase()
  if (PROTECTED_ABBREVS.has(tail) || PROTECTED_ABBREVS.has(`${tail}...`)) {
    return candidate
  }
  return candidate
}

/**
 * Shorten a How-To step title without leaving unclosed parentheses or splitting protected abbreviations.
 */
export function truncateHowToTitle(text: string, max = DEFAULT_MAX): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed

  let sliceEnd = max
  const slice = trimmed.slice(0, sliceEnd)
  const open = openParensBefore(trimmed, sliceEnd)
  const close = closeParensBefore(trimmed, sliceEnd)

  if (open > close) {
    const lastOpen = slice.lastIndexOf("(")
    if (lastOpen > 0) {
      sliceEnd = lastOpen
    } else {
      const closing = trimmed.indexOf(")", sliceEnd)
      if (closing !== -1 && closing < max + 40) {
        return `${trimmed.slice(0, closing + 1).trim()}...`
      }
    }
  }

  const bounded = cutOnWordBoundary(trimmed.slice(0, sliceEnd), max)
  let result = bounded.endsWith("...") ? bounded : `${bounded}...`
  if (endsInsideUnclosedParen(result.replace(/\.\.\.$/, ""))) {
    const lastOpen = result.lastIndexOf("(")
    if (lastOpen > 0) {
      result = `${result.slice(0, lastOpen).trim()}...`
    }
  }
  return result
}
