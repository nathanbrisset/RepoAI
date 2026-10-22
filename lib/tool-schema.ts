import { z } from "zod"

/** Category ids already used by the site routes. Do not invent new ids without adding a category entry. */
export const CATEGORY_IDS = [
  "text",
  "image",
  "audio",
  "video",
  "coding",
  "marketing",
  "productivity",
  "data-processing",
  "design",
] as const

export const toolStatusSchema = z.enum(["active", "renamed", "sunset", "duplicate-of"])

export const pricingModelSchema = z.enum(["free", "freemium", "paid", "open-source"])

export const pricingLabelSchema = z.enum(["Free", "Freemium", "Premium", "Open source"])

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const howToStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      })
    )
    .optional(),
})

/**
 * One file in content/tools/{id}.json.
 * affiliateUrl is optional and unused. Visit links use url.
 * lastVerified is the day the fiche was checked, or null when it was only migrated.
 */
export const toolSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/),
  name: z.string().min(1),
  url: z.string().url(),
  affiliateUrl: z.union([z.literal(""), z.string().url()]).optional(),
  status: toolStatusSchema,
  successorId: z.string().optional(),
  statusNote: z.string().optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  /** French short text. shortDescription_fr is the same field under the name used in briefs. */
  summary_fr: z.string().min(1).optional(),
  shortDescription_fr: z.string().min(1).optional(),
  description_fr: z.string().min(1).optional(),
  categories: z.array(z.enum(CATEGORY_IDS)).min(1),
  tags: z.array(z.string().min(1)).min(1),
  tags_fr: z.array(z.string().min(1)).optional(),
  pricing: z.object({
    model: pricingModelSchema,
    label: pricingLabelSchema,
    note: z.string().optional(),
    note_fr: z.string().min(1).optional(),
    verified: z.boolean(),
    sourceUrl: z.string().url().optional(),
  }),
  logo: z.string(),
  image: z.string(),
  dateAdded: isoDate.nullable(),
  dateAddedNote: z.string().optional(),
  lastVerified: isoDate.nullable(),
  sources: z.array(z.string().url()).optional(),
  features: z.array(z.string().min(1)).optional(),
  features_fr: z.array(z.string().min(1)).optional(),
  howToUse: z.array(howToStepSchema).optional(),
  howToUse_fr: z.array(howToStepSchema).optional(),
  statusNote_fr: z.string().min(1).optional(),
  dateAddedNote_fr: z.string().min(1).optional(),
})

export type CatalogTool = z.infer<typeof toolSchema>
