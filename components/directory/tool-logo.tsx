"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { DirectoryTool } from "@/lib/directory/tools"

export function ToolLogo({ tool, className }: { tool: DirectoryTool; className?: string }) {
  const [failed, setFailed] = useState(false)
  const initial = tool.name.trim().charAt(0).toUpperCase() || "?"
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-foreground text-lg font-bold text-background ring-1 ring-border",
        className,
      )}
    >
      {tool.logo && !failed ? (
        <img
          src={tool.logo}
          alt=""
          className="size-7 object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        initial
      )}
    </span>
  )
}
