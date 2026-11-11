import fs from "node:fs"
import path from "node:path"
import taxonomy from "../content/taxonomy.json"
import toolIds from "../content/tool-ids.json"
import { resolvedCollections } from "../lib/directory/data"
import { editorialGuideSlugs } from "../lib/directory/editorial-guides"

const snap = {
  toolIds,
  categoryIds: taxonomy.categories.map((category) => category.id),
  guideSlugs: editorialGuideSlugs(),
  collectionSlugsEn: resolvedCollections("en").map((collection) => collection.slug),
  collectionSlugsFr: resolvedCollections("fr").map((collection) => collection.slug),
}

const out = path.join(import.meta.dirname, "..", "lib/routing/known-paths-snapshot.json")
fs.writeFileSync(out, `${JSON.stringify(snap)}\n`)
console.log(`Wrote ${out} (${snap.collectionSlugsEn.length} EN collection slugs)`)
