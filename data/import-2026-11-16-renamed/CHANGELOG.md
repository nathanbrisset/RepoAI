# Changelog — deliver-6

## 2026-11-16 — short_en / short_description (EN)

`lot-6.csv` had an empty `short_description` (EN) for all 6 tools, and `copy-6.json` had `short_fr` but no `short_en`. Lots 1 and 2 ship a filled EN short in the CSV.

- Added a `short_en` field to `copy/copy-6.json` and `deliver-6/copy-6.json` for each of the 6 tools.
- Filled `lot-6.csv` `short_description` from those EN shorts.
- Style and length follow lot-40.csv EN shorts (one or two factual sentences, no $ / £ / USD). Each short mirrors the existing `short_fr` (what the product does, free/paid shape) and was checked against the official sites already cited in `copy/review.md`.
- Former names are stated in EN as required: Autosheet (formerly GPT for Work), Treblo (formerly Sonauto), Async (formerly Podcastle), Anarlog (formerly Hyprnote), Arena (formerly LMArena), Opera AI (formerly Opera Aria).
- Arena: EN uses “formerly LMArena”; FR is unchanged and still has “(ex-LMArena)”. Display name remains Arena (PM decision).
- `short_fr` texts were not edited.
- `md5.json` still covers logos and screenshots only (asset bytes unchanged); the file was rewritten with the same hashes.
- `long_description` is empty in this CSV, and also empty in lot-40.csv (40/40) and lot-30.csv (30/30), so that is left empty on purpose.

Nothing else in the pack was changed (logos, webps, features, fx-notes, renamed-map, official URLs, Autosheet `hqCountry`).
