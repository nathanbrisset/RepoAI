# Catalogue full pack — PR report (29 Oct 2026)

Branch: `cursor/catalogue-full-pack` → `restore3-new`

## Summary

| Metric | Count |
| --- | ---: |
| Tool JSON files | 667 |
| Listed (discovery) fiches | 606 |
| New/updated from audit pack JSON | 141 applied (136 new files + 5 overwrites) |
| Maintenance merges/retirements | 6 duplicate-of, 13 inactive, 3 renames in place |
| French batch entries | 141 (`content/i18n/batches/fr-audit-pack.json`) |
| Categories | 25 (+ **AI Detection** / Détection IA) |

Target ~600 listed fiches: **606** (includes complementary list from audit).

## Priority 1–4 coverage

- **P1 (15):** All addressed. **Sora** reactivated at `https://sora.com/` (was sunset; product page returns bot walls to automated fetch). **Microsoft Copilot** is now a distinct consumer fiche (`copilot.microsoft.com`), no longer `duplicate-of` M365 Copilot.
- **P2 (~37) + FR (11):** Included in `audit-pack-tools.json` (e.g. LMArena, Flowise, Zendesk AI, Antidote, Doctrine, …).
- **Complementary (~73):** Included (Doubao, AutoGPT, Copyleaks, Darktrace, Pennylane, …). Audit listed ~80; all complementary rows from the docx were added except where a fiche already existed unchanged.
- **Maintenance:** Amazon Q Developer, Agentforce rename, Salesloft Drift, Codiga sunset, DeepCode→Snyk, watsonx.ai, Jasper Art→Jasper, `/tool/claude` + `/tool/gemini` with redirects from legacy slugs, data-science tools **inactive** + **data-science** collection.

## Skipped / gaps

| Item | Reason |
| --- | --- |
| Homepage Gemini Notebook deep link | Out of scope for catalogue JSON (noted in audit; no change in this PR). |
| FR default at site root | Product decision unchanged (EN root, `/fr`). |
| Mass slug underscore→hyphen migration | Not bulk-renamed; redirects added only where this pack touched ids. |

## Screenshots

Full pass run on 29 Oct 2026:

```bash
node scripts/screenshots/capture.mjs --missing --concurrency 3
```

Result: **431** successful captures, **16** failed (login/captcha/error/empty fallbacks on a subset, e.g. ChatGPT Atlas, TurboScribe, ZeroGPT, Wan). Remaining active fiches without a published hero image should be listed with `node -e` on empty `image` fields before merge if stricter QA is required.

## Build

- `npm run build` — **green** (after `catalog-index.mjs` fix for ids starting with a digit, e.g. `10web`).

## Production

**Not merged. Not deployed.**
