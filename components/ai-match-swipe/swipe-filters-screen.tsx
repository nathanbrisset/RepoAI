"use client"

import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { pricingLabel } from "@/lib/i18n/messages"
import { PRICE_FILTERS } from "@/lib/price-filter"
import { useDirectory } from "@/components/directory/directory-provider"
import type { SwipeFilters, SwipeLanguage, SwipeLearning, SwipePlatform, SwipeUseCase } from "@/lib/ai-match-swipe/filters"

const PLATFORMS: SwipePlatform[] = ["web", "mobile", "desktop", "api", "extension"]
const LEARNING: SwipeLearning[] = ["easy", "medium", "advanced"]
const USE_CASES: SwipeUseCase[] = [
  "content_creation",
  "image_generation",
  "video_editing",
  "audio_processing",
  "data_analysis",
  "coding_assistance",
  "research",
  "marketing",
  "productivity",
  "design",
]
const LANGUAGES: SwipeLanguage[] = ["en", "fr", "multilingual"]

type Props = {
  filters: SwipeFilters
  onChange: (filters: SwipeFilters) => void
  onStart: () => void
  emptyAfterFilter: boolean
}

export function SwipeFiltersScreen({ filters, onChange, onStart, emptyAfterFilter }: Props) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { chips } = useDirectory()
  const canStart = Boolean(filters.categoryId)

  function patch(partial: Partial<SwipeFilters>) {
    onChange({ ...filters, ...partial })
  }

  function toggleChip<T extends string>(field: keyof SwipeFilters, value: T, current: T | null) {
    patch({ [field]: current === value ? null : value } as Partial<SwipeFilters>)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <p className="text-sm text-muted-foreground">{t.swipeFiltersIntro}</p>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {t.swipeCategoryLabel} <span className="text-destructive">*</span>
          </h2>
          <div className="-mx-1 mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => {
              const selected = filters.categoryId === chip.id
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => patch({ categoryId: selected ? "" : chip.id })}
                  className={cn(
                    "min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ring-border",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted/50",
                  )}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        </section>

        <FilterSection title={t.priceFilters}>
          <ChipRow>
            {PRICE_FILTERS.map((price) => (
              <FilterChip
                key={price}
                label={pricingLabel(locale, price)}
                pressed={filters.pricing === price}
                onClick={() => toggleChip("pricing", price, filters.pricing)}
              />
            ))}
          </ChipRow>
        </FilterSection>

        <FilterSection title={t.swipePlatformLabel}>
          <ChipRow>
            {PLATFORMS.map((platform) => (
              <FilterChip
                key={platform}
                label={t.swipePlatforms[platform]}
                pressed={filters.platform === platform}
                onClick={() => toggleChip("platform", platform, filters.platform)}
              />
            ))}
          </ChipRow>
        </FilterSection>

        <FilterSection title={t.swipeLearningLabel}>
          <ChipRow>
            {LEARNING.map((level) => (
              <FilterChip
                key={level}
                label={t.swipeLearning[level]}
                pressed={filters.learning === level}
                onClick={() => toggleChip("learning", level, filters.learning)}
              />
            ))}
          </ChipRow>
        </FilterSection>

        <FilterSection title={t.swipeUseCaseLabel}>
          <ChipRow>
            {USE_CASES.map((useCase) => (
              <FilterChip
                key={useCase}
                label={t.swipeUseCases[useCase]}
                pressed={filters.useCase === useCase}
                onClick={() => toggleChip("useCase", useCase, filters.useCase)}
              />
            ))}
          </ChipRow>
        </FilterSection>

        <FilterSection title={t.swipeLanguageLabel}>
          <ChipRow>
            {LANGUAGES.map((language) => (
              <FilterChip
                key={language}
                label={t.swipeLanguages[language]}
                pressed={filters.language === language}
                onClick={() => toggleChip("language", language, filters.language)}
              />
            ))}
          </ChipRow>
        </FilterSection>

        <FilterSection title={t.swipeJobLabel}>
          <textarea
            value={filters.jobText}
            onChange={(event) => patch({ jobText: event.target.value })}
            placeholder={t.swipeJobPlaceholder}
            rows={3}
            className="mt-2 w-full min-h-[88px] resize-y rounded-2xl bg-muted/40 px-4 py-3 text-base ring-1 ring-border outline-none focus:ring-2 focus:ring-primary"
          />
        </FilterSection>

        {emptyAfterFilter ? (
          <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground" role="status">
            {t.swipeEmptyDeck}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!canStart || emptyAfterFilter}
          onClick={onStart}
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-base font-bold text-accent-foreground shadow-lg shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t.swipeStartCta}
        </button>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{title}</h2>
      {children}
    </section>
  )
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="-mx-1 mt-3 flex flex-wrap gap-2">{children}</div>
}

function FilterChip({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ring-border",
        pressed ? "bg-primary text-primary-foreground" : "bg-muted/50",
      )}
    >
      {label}
    </button>
  )
}
