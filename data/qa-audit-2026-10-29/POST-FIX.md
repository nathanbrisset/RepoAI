# QA audit post-fix summary (PR #28)

## Root cause of “fixed locally but preview unchanged”

1. **Wrong success metric** — grep only matched *old* filler strings; apply passes replaced them with *new* generic lines QA still flags.
2. **French in EN** — lot-2 CSV use cases are French; they were pasted into EN `summary` / `features`.
3. **`fr-tools.json` gaps** — missing overlay → `/fr` fell back to English via `localizeTool`.
4. **`features_fr` missing** — FR Features tab used English `tool.features`.
5. **Logos** — wrong domain (GitHub favicon → octocat for Goose).
6. **Screenshots** — JSON `image` left set after deleting files → broken `<img>`.

## Served-content verification (QA-aligned)

Uses `scripts/verify-served-fiches.mjs` (catalog merge + `qa-filler-patterns.mjs`, same phrases as retest #2 gap CSV).

```bash
node scripts/verify-served-fiches.mjs
```

**Retest #2 push (after purge):**

| Check | QA retest #2 | Local sim (803 active) |
| --- | ---: | ---: |
| Filler (FR or EN) | 342 | **0** |
| EN mixed French | 95 | **0** |
| FR About English | — | **0** |
| FR Features English | ~222 | **0** |
| Broken screenshot refs | 9 | **0** |

## Scripts (retest #2)

| Script | Role |
| --- | --- |
| `scripts/qa-filler-patterns.mjs` | Shared filler regex list (QA retest #2) |
| `scripts/pr28-retest2-purge.mjs` | Purge filler, rebuild EN features, clear broken/weak screenshots |
| `scripts/fix-en-french-summary.mjs` | Translate FR use cases out of EN summary/features |
| `scripts/backfill-served-features-fr.mjs` | Translate `features_fr` when FR tab still English |
| `scripts/fix-logos-validated.mjs` | Goose logo from `block/goose` docs assets; ChatCode from app favicon |
| `scripts/verify-served-fiches.mjs` | QA-aligned served metrics |

## Logos / screenshots

- **Goose**: `documentation/static/img/logo_light.png` (not GitHub octocat).
- **ChatCode**: favicon from `chatcodeai.vercel.app`.
- Cleared `image` when file missing or ≤6.5KB (weak): chatgpt-atlas, freshdesk-freddy, lavender, liner, opera-aria, ramp, spotter, wan, zerogpt, doubao, sora, jenni-ai, kaiber, chatcode.
