import type { DirectoryRecord } from "./data"

export async function fetchDirectoryRecords(query: string): Promise<DirectoryRecord[]> {
  const response = await fetch(`/api/directory/records?${query}`, { credentials: "same-origin" })
  if (!response.ok) return []
  return (await response.json()) as DirectoryRecord[]
}

export async function fetchDirectorySearch(query: string, limit = 8): Promise<DirectoryRecord[]> {
  const q = query.trim()
  if (q.length < 2) return []
  const response = await fetch(
    `/api/directory/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    { credentials: "same-origin" },
  )
  if (!response.ok) return []
  return (await response.json()) as DirectoryRecord[]
}
