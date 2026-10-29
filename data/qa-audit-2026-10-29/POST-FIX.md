# QA audit post-fix summary (PR #28)

## Root cause of “fixed locally but preview unchanged”

1. **Wrong success metric** — grep only matched *old* filler strings; the first apply pass replaced them with *new* generic lines QA still flags.
2. **French in EN** — lot-2 CSV use cases are French; they were pasted into EN `summary` / `features` (e.g. `11x: SDR IA autonome`).
3. **`fr-tools.json` not populated** — 181 active tools had **no** French overlay → `/fr` About/meta used English via `localizeTool` fallback.
4. **`features_fr` missing** — FR Features tab fell back to English `tool.features` for ~231 tools.
5. **Logos** — download saved **HTML 404** bodies as `.png` (goose, codegen, whisper, chatcode).
6. **Screenshots** — capture published **logo-on-grey fallbacks** as “success”.

## Served-content verification (run on branch)

```bash
node scripts/verify-served-fiches.mjs
```

Latest local simulation (matches runtime merge: tool JSON + `fr-tools.json` + `localizeTool`):

| Check | Approx. count (803 active) |
| --- | ---: |
| FR About still English | **0** |
| FR Features still English (heuristic) | ~134 (often loanwords / colon labels) |
| EN About mixed French | **25** |
| Tools with any generic filler phrase | **48** |

## Fixes added (retest push)

| Script | Role |
| --- | --- |
| `apply-served-content-fix.mjs` | Lot-2 EN from `data/lot2-use-case-en.json`, clean descriptions, host-specific bullets, sync inline FR → `fr-tools.json` |
| `backfill-fr-tools-missing.mjs` | French About/Features overlay for 181 missing tools |
| `repair-fr-tools.mjs` | Strip filler/English from existing `fr-tools` rows |
| `fix-logos-validated.mjs` | PNG/JPEG magic-byte check before write |
| `capture.mjs` | **No logo fallback** written on failed capture |
| `verify-served-fiches.mjs` | Served-copy sanity check (not raw JSON grep) |

## Logos

Validated PNG for goose, codegen, whisper, chatcode (`file public/logos/*.png`).

## Screenshots still honest skips

No logo-on-grey published on failure. Remaining weak/missing: chatgpt-atlas, civitai, clio, doubao, freshdesk-freddy, jenni-ai, kaiber, lavender, liner, opera-aria, ramp, spotter, wan, zerogpt, chatcode, sora, manus (see retest CSV).
