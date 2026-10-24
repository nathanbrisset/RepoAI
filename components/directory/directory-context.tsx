"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { categoryCatalog } from "@/lib/category-meta"
import { DOJO_PICKS } from "@/lib/directory/picks"
import type { DirectoryTool } from "@/lib/directory/tools"
import { useLocale } from "@/components/locale-provider"
import { localizeHref, stripLocale } from "@/lib/i18n/paths"

export type SortMode = "trending" | "new" | "top"

const STORAGE_KEY = "aitools-scroll"
const categoryIds = new Set(categoryCatalog.map((category) => category.id))

type Filters = {
  query: string
  category: string
  sort: SortMode
}

type DirectoryContextValue = {
  tools: DirectoryTool[]
  byId: Map<string, DirectoryTool>
  query: string
  category: string
  sort: SortMode
  collectionId: string | null
  saved: string[]
  savedOpen: boolean
  setSavedOpen: (open: boolean) => void
  detailOpen: boolean
  activeTool: DirectoryTool | null
  compare: string[]
  onHome: boolean
  setQuery: (value: string) => void
  setCategory: (id: string) => void
  setSort: (mode: SortMode) => void
  applyCollection: (id: string) => void
  clearFilters: () => void
  toggleSave: (id: string) => void
  toggleCompare: (id: string) => void
  removeCompare: (id: string) => void
  openTool: (id: string) => void
  setDetailOpen: (open: boolean) => void
  goHome: (next?: Partial<Filters>) => void
}

const DirectoryContext = createContext<DirectoryContextValue | null>(null)

export function useDirectory() {
  const value = useContext(DirectoryContext)
  if (!value) throw new Error("Directory context missing")
  return value
}

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search)
  const sortParam = params.get("sort")
  const category = params.get("category") || "all"
  return {
    query: params.get("q") || "",
    category: category === "all" || categoryIds.has(category) ? category : "all",
    sort: sortParam === "new" || sortParam === "top" ? sortParam : "trending",
  }
}

function writeFilters(filters: Filters) {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query)
  if (filters.category !== "all") params.set("category", filters.category)
  if (filters.sort !== "trending") params.set("sort", filters.sort)
  const qs = params.toString()
  const base = `${window.location.pathname}`
  window.history.replaceState(null, "", qs ? `${base}?${qs}` : base)
}

export function DirectoryProvider({
  tools,
  children,
}: {
  tools: DirectoryTool[]
  children: React.ReactNode
}) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname() || "/"
  const onHome = stripLocale(pathname) === "/"
  const [query, setQueryState] = useState("")
  const [category, setCategoryState] = useState("all")
  const [sort, setSortState] = useState<SortMode>("trending")
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [saved, setSaved] = useState<string[]>([])
  const [savedReady, setSavedReady] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [detailOpen, setDetailOpenState] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [compare, setCompare] = useState<string[]>([])
  const filters = useRef<Filters>({ query: "", category: "all", sort: "trending" })

  const byId = useMemo(() => new Map(tools.map((tool) => [tool.id, tool])), [tools])
  const onHomeRef = useRef(onHome)
  const localeRef = useRef(locale)
  const routerRef = useRef(router)
  onHomeRef.current = onHome
  localeRef.current = locale
  routerRef.current = router

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setSaved(parsed.filter((id): id is string => typeof id === "string" && byId.has(id)))
        }
      }
    } catch {
      // Ignore a broken local stash. The scroll starts empty.
    }
    setSavedReady(true)
  }, [byId])

  useEffect(() => {
    if (!savedReady) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  }, [saved, savedReady])

  useEffect(() => {
    if (!onHome) return
    const next = readFilters()
    filters.current = next
    setQueryState(next.query)
    setCategoryState(next.category)
    setSortState(next.sort)
    setCollectionId(null)
  }, [onHome, pathname])

  const commit = useCallback((partial: Partial<Filters>, history: boolean) => {
    const next = { ...filters.current, ...partial }
    filters.current = next
    setQueryState(next.query)
    setCategoryState(next.category)
    setSortState(next.sort)
    if (history && stripLocale(window.location.pathname) === "/") writeFilters(next)
  }, [])

  const goHome = useCallback((next?: Partial<Filters>) => {
    const filtersNext = { ...filters.current, ...next }
    const params = new URLSearchParams()
    if (filtersNext.query) params.set("q", filtersNext.query)
    if (filtersNext.category !== "all") params.set("category", filtersNext.category)
    if (filtersNext.sort !== "trending") params.set("sort", filtersNext.sort)
    const qs = params.toString()
    routerRef.current.push(localizeHref(localeRef.current, qs ? `/?${qs}` : "/"))
  }, [])

  const setQuery = useCallback((next: string) => {
    setCollectionId(null)
    if (!onHomeRef.current) {
      goHome({ query: next, category: "all" })
      return
    }
    commit({ query: next }, true)
  }, [commit, goHome])

  const setCategory = useCallback((id: string) => {
    const safe = id === "all" || categoryIds.has(id) ? id : "all"
    setCollectionId(null)
    if (!onHomeRef.current) {
      goHome({ category: safe, query: "" })
      return
    }
    commit({ category: safe }, true)
  }, [commit, goHome])

  const setSort = useCallback((mode: SortMode) => {
    if (!onHomeRef.current) {
      goHome({ sort: mode, query: "", category: "all" })
      return
    }
    commit({ sort: mode }, true)
  }, [commit, goHome])

  const applyCollection = useCallback((id: string) => {
    if (!DOJO_PICKS.some((pick) => pick.id === id)) return
    if (!onHomeRef.current) {
      goHome({ query: "", category: "all" })
      return
    }
    setCollectionId(id)
    commit({ query: "", category: "all" }, true)
  }, [commit, goHome])

  const clearFilters = useCallback(() => {
    setCollectionId(null)
    if (!onHomeRef.current) {
      goHome({ query: "", category: "all", sort: "trending" })
      return
    }
    commit({ query: "", category: "all", sort: "trending" }, true)
  }, [commit, goHome])

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]))
  }, [])

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }, [])

  const removeCompare = useCallback((id: string) => {
    setCompare((prev) => prev.filter((item) => item !== id))
  }, [])

  const openTool = useCallback((id: string) => {
    setActiveId(id)
    setDetailOpen(true)
  }, [])

  const setDetailOpen = useCallback((open: boolean) => {
    setDetailOpenState(open)
    if (!open) setActiveId(null)
  }, [])

  const activeTool = activeId ? byId.get(activeId) || null : null

  const value = useMemo<DirectoryContextValue>(() => ({
    tools,
    byId,
    query,
    category,
    sort,
    collectionId,
    saved,
    savedOpen,
    setSavedOpen,
    detailOpen,
    activeTool,
    compare,
    onHome,
    setQuery,
    setCategory,
    setSort,
    applyCollection,
    clearFilters,
    toggleSave,
    toggleCompare,
    removeCompare,
    openTool,
    setDetailOpen,
    goHome,
  }), [
    tools,
    byId,
    query,
    category,
    sort,
    collectionId,
    saved,
    savedOpen,
    detailOpen,
    activeTool,
    compare,
    onHome,
    setQuery,
    setCategory,
    setSort,
    applyCollection,
    clearFilters,
    toggleSave,
    toggleCompare,
    removeCompare,
    openTool,
    setDetailOpen,
    goHome,
  ])

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>
}
