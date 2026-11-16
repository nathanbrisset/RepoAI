"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Local draft for a query-string field: edits are immediate; URL updates are debounced.
 * Re-syncs from urlValue after navigation (e.g. back/forward), not after our own commit.
 */
export function useDebouncedUrlDraft(
  urlValue: string,
  commit: (value: string) => void,
  debounceMs = 250,
) {
  const [draft, setDraft] = useState(urlValue)
  const skipNextUrlSync = useRef(false)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      setDraft(urlValue)
      return
    }
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false
      return
    }
    setDraft(urlValue)
  }, [urlValue])

  const stableCommit = useCallback(
    (value: string) => {
      skipNextUrlSync.current = true
      commit(value)
    },
    [commit],
  )

  useEffect(() => {
    if (draft === urlValue) return
    const handle = window.setTimeout(() => {
      stableCommit(draft)
    }, debounceMs)
    return () => window.clearTimeout(handle)
  }, [draft, urlValue, debounceMs, stableCommit])

  return { draft, setDraft }
}