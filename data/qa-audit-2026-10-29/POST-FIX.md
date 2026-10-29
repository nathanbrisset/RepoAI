# QA audit post-fix summary (branch)

Compared to prod audit on 2026-10-29 (`uploads/fiches-full-summary_0faa.json`).

## Text & i18n

| Metric | Before (801 live) | After (active tools, local check) |
| --- | ---: | ---: |
| Template filler in tool JSON | 356 | **0** |
| Lot 2 EN mixed with FR | ~100 | Rewritten from CSV use cases |
| `fr-tools.json` entries | ~248 fully OK | **435** entries; **332** gained `features_fr` backfill |

Scripts: `apply-fiche-quality-audit.mjs`, `backfill-features-fr.mjs`, `merge-fr-tools.mjs` (now merges `fr-audit-pack.json` + `fr-7-qa-canonical.json`).

## Logos

- Wired `/logos/{id}` with correct `.png`/`.jpg` for lot 2.
- Re-fetched product logos: chatcode, google-flow, google-opal, goose, codegen, comfyui, semantic-kernel, whisper, drift (9 fetches, 0 failures).

## Screenshots

- Playwright pass on **125** ids (missing + small placeholders): **112** real captures published in this batch; **13** kept fallback (login/captcha/404/empty).

### Could not publish a real homepage capture (honest list)

| id | reason |
| --- | --- |
| chatgpt-atlas | login wall |
| civitai | captcha |
| clio | captcha |
| freshdesk-freddy | HTTP 404 |
| lavender | empty/uniform page |
| liner | HTTP 410 |
| opera-aria | HTTP 404 |
| ramp | captcha |
| spotter | HTTP 404 |
| wan | empty page |
| zerogpt | captcha |
| doubao | login (prior audit) |
| jenni-ai | blank page (prior audit) |
| kaiber | error page (prior audit) |
| chatcode | weak/empty capture (~6 Ko) |
| sora | discontinuation / black screen (product status) |

~22 active tools still under 15 Ko (logo fallback or sparse pages) — run `npm run catalog:qa` for CI detail.

## Canonical FR copy (examples)

`content/i18n/batches/fr-7-qa-canonical.json`: claude, gemini, chatgpt features, pennylane, mammouth, goose, wan, sora FR fields, etc.
