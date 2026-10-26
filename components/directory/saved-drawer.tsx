"use client"

import { X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { useDirectory } from "./directory-provider"
import { Shuriken } from "./shuriken"
import { ToolLogo } from "./tool-logo"

export function SavedDrawer() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { savedOpen, setSavedOpen, saved, recordById, openTool, toggleSave } = useDirectory()
  const tools = saved.map((id) => recordById(id)).filter((tool) => Boolean(tool))

  return (
    <Dialog.Root open={savedOpen} onOpenChange={setSavedOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-foreground/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-0 right-0 bottom-0 z-[70] flex w-full max-w-md flex-col bg-background shadow-2xl outline-none">
          <div className="flex items-center justify-between gap-4 border-b p-6">
            <div>
              <Dialog.Title className="font-display text-2xl">{t.scrollTitle}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                {tools.length === 0
                  ? t.scrollEmpty
                  : fill(tools.length === 1 ? t.scrollCountOne : t.scrollCountMany, { count: tools.length })}
              </Dialog.Description>
            </div>
            <Dialog.Close className="grid size-10 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background" aria-label={t.close}>
              <X className="size-5" />
            </Dialog.Close>
          </div>
          {tools.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-muted text-primary">
                <Shuriken className="size-10" />
              </span>
              <p className="font-display text-lg">{t.scrollEmptyTitle}</p>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t.scrollHint}</p>
            </div>
          ) : (
            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
              {tools.map((tool) =>
                tool ? (
                  <li key={tool.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border">
                    <button type="button" onClick={() => openTool(tool.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <ToolLogo tool={tool} />
                      <span className="min-w-0">
                        <span className="block font-semibold">{tool.name}</span>
                        <span className="block truncate text-sm text-muted-foreground">{tool.description}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSave(tool.id)}
                      aria-label={fill(t.removeSaved, { name: tool.name })}
                      className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
