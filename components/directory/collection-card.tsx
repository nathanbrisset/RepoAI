"use client"

import { ArrowRight } from "lucide-react"
import type { DirectoryTool } from "@/lib/directory/tools"
import { useT } from "@/components/locale-provider"
import { ToolLogo } from "./tool-logo"

export function CollectionCard({
  title,
  blurb,
  tools,
  onSelect,
}: {
  title: string
  blurb: string
  tools: DirectoryTool[]
  onSelect: () => void
}) {
  const t = useT()
  if (tools.length < 2) return null
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex min-h-[280px] w-full flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-foreground p-5 text-left text-background transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-foreground/25 motion-safe:hover:rotate-[0.35deg]"
    >
      <span className="relative z-10 w-fit rounded-full border border-accent px-2.5 py-1 text-xs font-semibold tracking-widest text-accent uppercase">
        {t("directory.pickBadge")}
      </span>
      <div className="flex">
        {tools.map((tool, index) => (
          <span key={tool.id} className="-ml-3 first:ml-0" style={{ transitionDelay: `${index * 60}ms` }}>
            <ToolLogo tool={tool} className="size-12 bg-cream text-foreground ring-4 ring-foreground" />
          </span>
        ))}
      </div>
      <div className="relative z-10 flex flex-col gap-1.5">
        <h3 className="font-display text-xl leading-tight text-balance">{title}</h3>
        <p className="text-sm leading-relaxed text-background/70">{blurb}</p>
      </div>
      <span className="flex items-center gap-2 text-sm font-semibold">
        {tools.map((tool) => tool.name).join(" + ")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </button>
  )
}
