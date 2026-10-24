import { cn } from "@/lib/utils"

export function Shuriken({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="currentColor"
      fillRule="evenodd"
    >
      <path d="M12 0.5 L14.6 9.4 L23.5 12 L14.6 14.6 L12 23.5 L9.4 14.6 L0.5 12 L9.4 9.4 Z M12 10.2 a1.8 1.8 0 1 0 0 3.6 a1.8 1.8 0 1 0 0 -3.6 Z" />
    </svg>
  )
}
