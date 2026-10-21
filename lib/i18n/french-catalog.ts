import { z } from "zod"
import { howToStepSchema } from "@/lib/tool-schema"
import frToolsJson from "@/content/i18n/fr-tools.json"

/**
 * French fields for a fiche. They may live on the tool JSON itself
 * (summary_fr, shortDescription_fr, description_fr, tags_fr, …)
 * or in content/i18n/fr-tools.json. Missing fields fall back to English.
 */
export const frenchToolFieldsSchema = z.object({
  summary_fr: z.string().min(1).optional(),
  shortDescription_fr: z.string().min(1).optional(),
  description_fr: z.string().min(1).optional(),
  tags_fr: z.array(z.string().min(1)).optional(),
  features_fr: z.array(z.string().min(1)).optional(),
  howToUse_fr: z.array(howToStepSchema).optional(),
  statusNote_fr: z.string().min(1).optional(),
  dateAddedNote_fr: z.string().min(1).optional(),
  pricingNote_fr: z.string().min(1).optional(),
})

export type FrenchToolFields = z.infer<typeof frenchToolFieldsSchema>

const parsed = z.record(z.string(), frenchToolFieldsSchema).parse(frToolsJson)

export const frenchToolsById: Record<string, FrenchToolFields> = parsed
