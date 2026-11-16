# Import pack — renamed lot 2026-11-16 (6 tools)

All catalogue copy and assets for this PR live here. **To refresh copy after a new deliverable**, replace the files below (same names) and re-run the import — no script changes required unless `renamed-map.json` changes.

## Layout

| Path | Role |
|------|------|
| `lot-6.csv` | One row per new slug (categories, tags, URLs) |
| `copy-6.json` | EUR pricing, howTo, `short_fr`, `official_url_final`, `renamed_from` |
| `features-en-6.json` / `features-fr-6.json` | Feature bullets per slug |
| `md5.json` | Logo + screenshot checksums |
| `renamed-map.json` | `{ "new-slug": "old-slug" }` |
| `deliver/logos/*.png` | 128×128 → `public/logos/{id}.png` |
| `deliver/screenshots/*.webp` | → `public/screenshots/{id}.webp` |
| `peer-lot-2026-11-16-40-slugs.json` | Collision guard (PR #52); keep unless PM replaces |
| `peer-lot-2026-11-16-lot2-slugs.json` | Collision guard (PR #55); keep unless PM replaces |

## Re-import (copy-only refresh)

```bash
# 1. Drop in the corrected deliver-6 files (csv, json, md5, logos/, screenshots/, etc.)

node scripts/import-lot-2026-11-16-renamed.mjs
npm run visitor-copy:check
```

The script:

- Overwrites the six **successor** fiches in `content/tools/{id}.json` and FR overlay keys in `content/i18n/fr-tools.json`
- Re-copies assets and verifies MD5
- Re-applies `renamed` + `successorId` on the six **old** slugs (idempotent)
- Updates `renamedToolRedirects` in `next.config.js` from `renamed-map.json` (idempotent)
- Runs `scripts/catalog-index.mjs` (regenerates `content/tools/index.ts`, `lib/generated/local-logos.ts`)

It does **not** need to be edited for a copy swap. Structural changes (new slugs, map changes) require script/redirect review.

## Dry run

```bash
node scripts/import-lot-2026-11-16-renamed.mjs --dry-run
```