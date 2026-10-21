import { z } from "zod"
import taxonomy from "@/content/taxonomy.json"

/** Public category ids, plus legacy ids kept only for fiches the reassignment table does not include. */
export const CATEGORY_IDS = [
  ...taxonomy.categories.map((category) => category.id),
  ...taxonomy.legacyIds,
] as [string, ...string[]]

export const toolStatusSchema = z.enum(["active", "inactive", "renamed", "sunset", "duplicate-of"])

export const pricingModelSchema = z.enum([
  "free",
  "freemium",
  "paid",
  "open-source",
  "enterprise",
  "usage-based",
  "one-time",
])

export const pricingLabelSchema = z.enum([
  "Free",
  "Freemium",
  "Premium",
  "Open source",
  "Enterprise",
  "Usage-based",
  "One-time",
])

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
  categories: z.array(z.enum(CATEGORY_IDS)).min(1),
  tags: z.array(z.string().min(1)).min(1),
  pricing: z
    .object({
      model: pricingModelSchema.optional(),
      label: pricingLabelSchema.optional(),
      note: z.string().optional(),
      verified: z.boolean(),
      sourceUrl: z.string().url().optional(),
      uncertain: z.boolean().optional(),
    })
    .superRefine((value, ctx) => {
      if (value.uncertain) return
      if (!value.model) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["model"], message: "required unless the price is uncertain" })
      if (!value.label) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["label"], message: "required unless the price is uncertain" })
    }),
  logo: z.string(),
  image: z.string(),
  dateAdded: isoDate.nullable(),
  dateAddedNote: z.string().optional(),
  lastVerified: isoDate.nullable(),
  sources: z.array(z.string().url()).optional(),
  features: z.array(z.string().min(1)).optional(),
  howToUse: z.array(howToStepSchema).optional(),
})

export type CatalogTool = z.infer<typeof toolSchema>
