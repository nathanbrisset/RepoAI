import {
  COLLECTION_DEFS,
  COMPARE_PRESETS,
  DOJO_PICK_IDS,
  FEATURED_STACK_IDS,
  RECIPE_DEFS,
} from "./collections"

/** Higher score = more often highlighted in editorial surfaces (Dojo, stacks, collections). */
const cache = { map: null as Map<string, number> | null }

export function editorialRankById(): Map<string, number> {
  if (cache.map) return cache.map
  const scores = new Map<string, number>()
  const add = (id: string, points: number) => {
    scores.set(id, (scores.get(id) || 0) + points)
  }

  DOJO_PICK_IDS.forEach((id, index) => add(id, 120 - index * 4))
  FEATURED_STACK_IDS.forEach((id, index) => add(id, 90 - index * 3))

  for (const collection of COLLECTION_DEFS) {
    collection.ids.forEach((id, index) => add(id, 28 - Math.min(index, 8)))
  }

  for (const recipe of RECIPE_DEFS) {
    recipe.steps.forEach((step, index) => add(step.id, 18 - Math.min(index, 4)))
  }

  for (const pair of COMPARE_PRESETS) {
    pair.forEach((id) => add(id, 12))
  }

  cache.map = scores
  return scores
}

export function editorialScore(id: string): number {
  return editorialRankById().get(id) || 0
}

export function compareEditorialRank(aId: string, bId: string): number {
  const diff = editorialScore(bId) - editorialScore(aId)
  if (diff !== 0) return diff
  return aId.localeCompare(bId)
}
