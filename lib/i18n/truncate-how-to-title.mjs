/** @typedef {import('./truncate-how-to-title.ts').truncateHowToTitle} truncateHowToTitle */

const DEFAULT_MAX = 90

const PROTECTED_ABBREVS = new Set(["excl.", "etc.", "e.g.", "i.e.", "vs.", "fig.", "approx."])

function tokenEndingAt(text, endIndex) {
  let start = endIndex
  while (start > 0 && /[\w.]/.test(text[start - 1])) start--
  return text.slice(start, endIndex + 1).toLowerCase()
}

export function firstSentenceForHowTo(text) {
  const trimmed = String(text).trim()
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

function openParensBefore(text, index) {
  let count = 0
  for (let i = 0; i < index; i++) {
    if (text[i] === "(") count++
  }
  return count
}

function closeParensBefore(text, index) {
  let count = 0
  for (let i = 0; i < index; i++) {
    if (text[i] === ")") count++
  }
  return count
}

function endsInsideUnclosedParen(text) {
  let depth = 0
  for (const ch of text) {
    if (ch === "(") depth++
    else if (ch === ")") depth = Math.max(0, depth - 1)
  }
  return depth > 0
}

function cutOnWordBoundary(slice, max) {
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace <= Math.floor(max * 0.45)) return slice.trim()
  const candidate = slice.slice(0, lastSpace).trim()
  const tail = slice.slice(lastSpace + 1).trim().toLowerCase()
  if (PROTECTED_ABBREVS.has(tail) || PROTECTED_ABBREVS.has(`${tail}...`)) {
    return candidate
  }
  return candidate
}

export function truncateHowToTitle(text, max = DEFAULT_MAX) {
  const trimmed = String(text).trim()
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

  let bounded = cutOnWordBoundary(trimmed.slice(0, sliceEnd), max)
  bounded = bounded.replace(/[,;:!–\-]+$/u, "").trim()
  let result = bounded.endsWith("...") ? bounded : `${bounded}...`
  if (endsInsideUnclosedParen(result.replace(/\.\.\.$/, ""))) {
    const lastOpen = result.lastIndexOf("(")
    if (lastOpen > 0) {
      result = `${result.slice(0, lastOpen).trim()}...`
    }
  }
  return result
}
