import taxonomy from "@/content/taxonomy.json"

export type CategoryMeta = {
  id: string
  code: string
  name: string
  description: string
  about: string
}

export const categoryCatalog = taxonomy.categories as CategoryMeta[]

const names = new Map(categoryCatalog.map((category) => [category.id, category.name]))

export function categoryName(id: string) {
  return names.get(id) || id
}
