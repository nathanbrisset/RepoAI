"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { DirectoryRecord } from "@/lib/directory/data"

export function ToolLogo({ tool, className }: { tool: Pick<DirectoryRecord, "name" | "logo" | "image">; className?: string }) {
  const [failed, setFailed] = useState(false)
  const src = tool.logo || tool.image
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-foreground text-lg font-bold text-background ring-1 ring-border",
        className,
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          className="size-7 object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        tool.name.charAt(0).toUpperCase()
      )}
    </span>
  )
}

const RECENT_DAYS = 21

export function isRecentAddition(dateAdded: string, today: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateAdded) || !/^\d{4}-\d{2}-\d{2}$/.test(today)) return false
  const then = Date.parse(`${dateAdded}T00:00:00.000Z`)
  const now = Date.parse(`${today}T00:00:00.000Z`)
  if (Number.isNaN(then) || Number.isNaN(now)) return false
  const ageDays = Math.round((now - then) / 86400000)
  return ageDays >= 0 && ageDays <= RECENT_DAYS
}
