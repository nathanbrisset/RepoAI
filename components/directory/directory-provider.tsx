"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { DirectoryChip, DirectoryRecord } from "@/lib/directory/data"

const SCROLL_KEY = "aitools-scroll"
const COMPARE_KEY = "aitools-compare"
const COMPARE_LIMIT = 4

type DirectoryContextValue = {
  records: DirectoryRecord[]
  chips: DirectoryChip[]
  total: number
  categoryLabel: (id: string) => string
  recordById: (id: string) => DirectoryRecord | undefined
  saved: string[]
  compare: string[]
  isSaved: (id: string) => boolean
  isComparing: (id: string) => boolean
  toggleSave: (id: string) => void
  toggleCompare: (id: string) => void
  removeCompare: (id: string) => void
  openId: string | null
  openTool: (id: string) => void
  closeTool: () => void
  savedOpen: boolean
  setSavedOpen: (open: boolean) => void
  today: string
}

const DirectoryContext = createContext<DirectoryContextValue | null>(null)

function readList(key: string) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]")
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []
  } catch {
    return []
  }
}

function writeToolParam(id: string | null) {
  const params = new URLSearchParams(window.location.search)
  if (id) params.set("tool", id)
  else params.delete("tool")
  const query = params.toString()
  const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
  window.history.replaceState(null, "", next)
}

export function DirectoryProvider({
  records,
  chips,
  total,
  today,
  children,
}: {
  records: DirectoryRecord[]
  chips: DirectoryChip[]
  total: number
  today: string
  children: React.ReactNode
}) {
  const [saved, setSaved] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [savedOpen, setSavedOpen] = useState(false)
  const [ready, setReady] = useState(false)

  const known = useMemo(() => new Set(records.map((record) => record.id)), [records])
  const byId = useMemo(() => new Map(records.map((record) => [record.id, record])), [records])
  const labels = useMemo(() => new Map(chips.map((chip) => [chip.id, chip.label])), [chips])

  useEffect(() => {
    setSaved(readList(SCROLL_KEY).filter((id) => known.has(id)))
    setCompare(readList(COMPARE_KEY).filter((id) => known.has(id)).slice(0, COMPARE_LIMIT))
    const fromUrl = new URLSearchParams(window.location.search).get("tool")
    if (fromUrl && known.has(fromUrl)) setOpenId(fromUrl)
    setReady(true)
  }, [known])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(SCROLL_KEY, JSON.stringify(saved))
  }, [saved, ready])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(COMPARE_KEY, JSON.stringify(compare))
  }, [compare, ready])

  const toggleSave = useCallback((id: string) => {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]))
  }, [])

  const toggleCompare = useCallback((id: string) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= COMPARE_LIMIT) return current
      return [...current, id]
    })
  }, [])

  const removeCompare = useCallback((id: string) => {
    setCompare((current) => current.filter((item) => item !== id))
  }, [])

  const openTool = useCallback(
    (id: string) => {
      if (!known.has(id)) return
      setOpenId(id)
      setSavedOpen(false)
      writeToolParam(id)
    },
    [known],
  )

  const closeTool = useCallback(() => {
    setOpenId(null)
    writeToolParam(null)
  }, [])

  const value = useMemo<DirectoryContextValue>(
    () => ({
      records,
      chips,
      total,
      categoryLabel: (id: string) => labels.get(id) || id,
      recordById: (id: string) => byId.get(id),
      saved,
      compare,
      isSaved: (id: string) => saved.includes(id),
      isComparing: (id: string) => compare.includes(id),
      toggleSave,
      toggleCompare,
      removeCompare,
      openId,
      openTool,
      closeTool,
      savedOpen,
      setSavedOpen,
      today,
    }),
    [
      records,
      chips,
      total,
      labels,
      byId,
      saved,
      compare,
      toggleSave,
      toggleCompare,
      removeCompare,
      openId,
      openTool,
      closeTool,
      savedOpen,
      today,
    ],
  )

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>
}

export function useDirectory() {
  const value = useContext(DirectoryContext)
  if (!value) throw new Error("useDirectory must be used inside DirectoryProvider")
  return value
}
