"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { DirectoryChip, DirectoryRecord } from "@/lib/directory/data"
import { fetchDirectoryRecords } from "@/lib/directory/client-records"

const SCROLL_KEY = "aitools-scroll"
const COMPARE_KEY = "aitools-compare"
const COMPARE_LIMIT = 4

type DirectoryContextValue = {
  records: DirectoryRecord[]
  chips: DirectoryChip[]
  total: number
  categoryLabel: (id: string) => string
  recordById: (id: string) => DirectoryRecord | undefined
  ensureRecords: (ids: string[]) => Promise<void>
  loadAllRecords: () => Promise<void>
  recordsReady: boolean
  allRecordsLoaded: boolean
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
  chips,
  total,
  today,
  children,
}: {
  chips: DirectoryChip[]
  total: number
  today: string
  children: React.ReactNode
}) {
  const [byId, setById] = useState<Map<string, DirectoryRecord>>(new Map())
  const [allRecordsLoaded, setAllRecordsLoaded] = useState(false)
  const [recordsReady, setRecordsReady] = useState(false)
  const loadingAllRef = useRef(false)
  const pendingIdsRef = useRef<Set<string>>(new Set())
  const [saved, setSaved] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [savedOpen, setSavedOpen] = useState(false)
  const [ready, setReady] = useState(false)

  const records = useMemo(() => Array.from(byId.values()), [byId])
  const labels = useMemo(() => new Map(chips.map((chip) => [chip.id, chip.label])), [chips])

  const mergeRecords = useCallback((incoming: DirectoryRecord[]) => {
    if (incoming.length === 0) return
    setById((current) => {
      const next = new Map(current)
      for (const record of incoming) next.set(record.id, record)
      return next
    })
  }, [])

  const ensureRecords = useCallback(
    async (ids: string[]) => {
      const missing = [...new Set(ids.filter(Boolean))].filter((id) => !byId.has(id) && !pendingIdsRef.current.has(id))
      if (missing.length === 0) return
      for (const id of missing) pendingIdsRef.current.add(id)
      try {
        const fetched = await fetchDirectoryRecords(`ids=${encodeURIComponent(missing.join(","))}`)
        mergeRecords(fetched)
      } finally {
        for (const id of missing) pendingIdsRef.current.delete(id)
      }
    },
    [byId, mergeRecords],
  )

  const loadAllRecords = useCallback(async () => {
    if (allRecordsLoaded || loadingAllRef.current) return
    loadingAllRef.current = true
    try {
      const fetched = await fetchDirectoryRecords("all=1")
      mergeRecords(fetched)
      setAllRecordsLoaded(true)
    } finally {
      loadingAllRef.current = false
    }
  }, [allRecordsLoaded, mergeRecords])

  useEffect(() => {
    setSaved(readList(SCROLL_KEY))
    setCompare(readList(COMPARE_KEY).slice(0, COMPARE_LIMIT))
    const fromUrl = new URLSearchParams(window.location.search).get("tool")
    if (fromUrl) setOpenId(fromUrl)
    setReady(true)
    setRecordsReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(SCROLL_KEY, JSON.stringify(saved))
  }, [saved, ready])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(COMPARE_KEY, JSON.stringify(compare))
  }, [compare, ready])

  useEffect(() => {
    if (!ready) return
    const ids = [...new Set([...saved, ...compare, ...(openId ? [openId] : [])])]
    if (ids.length > 0) void ensureRecords(ids)
  }, [ready, saved, compare, openId, ensureRecords])

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
      void ensureRecords([id])
      setOpenId(id)
      setSavedOpen(false)
      writeToolParam(id)
    },
    [ensureRecords],
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
      ensureRecords,
      loadAllRecords,
      recordsReady,
      allRecordsLoaded,
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
      ensureRecords,
      loadAllRecords,
      recordsReady,
      allRecordsLoaded,
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
