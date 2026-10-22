import type { Category } from "./types"
import { categoryIcon } from "./category-icons"
import { categoryCatalog } from "./category-meta"
import { listedTools, getToolById as findTool, allTools } from "./catalog"

export { allTools }

// The 24 categories from the taxonomy table. Copy is taken from that table.
export const categories: Category[] = categoryCatalog.map((category) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  about: category.about,
  icon: categoryIcon(category.id),
}))

// The directory is loaded from content/tools/*.json.
// mockTools hides sunset, renamed, inactive, and duplicate-of cards. allTools still includes them.
export const mockTools = listedTools
export const tools = listedTools

export async function getToolById(id: string) {
  return findTool(id)
}
