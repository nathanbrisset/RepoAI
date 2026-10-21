# Tool catalog

The site reads this folder. One fiche is one file: `content/tools/{id}.json`. Do not put tools back into `lib/data.tsx`.

After you add or edit a file, run:

```bash
node scripts/catalog-index.mjs
```

That checks every file with the same rules as `lib/tool-schema.ts` and rewrites `content/tools/index.ts`. The index is generated. Do not edit it by hand.

`affiliateUrl` stays `""` until a real affiliate URL is recorded. The Visit button uses it only when it is non-empty, and otherwise uses `url`.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | File name without `.json`. Lowercase letters, digits, `-` or `_`. This is the URL `/tool/{id}`. Do not rename an id that is already online. |
| `name` | yes | Product name as on the official site. |
| `url` | yes | Official `https` URL after redirects. |
| `affiliateUrl` | yes | `""` or an `https` affiliate URL. |
| `status` | yes | `active`, `renamed`, `sunset`, or `duplicate-of`. |
| `successorId` | no | Another fiche id. Required in practice for `duplicate-of`. |
| `statusNote` | no | Why the status is not `active`. Shown on the fiche. |
| `summary` | yes | Short line for the card. |
| `description` | yes | Longer text for the fiche. No shared template sentence. |
| `categories` | yes | One or more of `text`, `image`, `audio`, `video`, `coding`, `marketing`, `productivity`, `data-processing`, `design`. |
| `tags` | yes | Readable words. No `snake_case`. |
| `pricing.model` | yes | `free`, `freemium`, `paid`, or `open-source`. |
| `pricing.label` | yes | `Free`, `Freemium`, `Premium`, or `Open source`. This is what the filters use. |
| `pricing.verified` | yes | `true` only if you opened a pricing page on `pricing.sourceUrl`. |
| `pricing.note` | no | What you actually saw, including the date. |
| `pricing.sourceUrl` | no | Page you checked. |
| `logo` | yes | Site path such as `/logos/{id}.png`, or `""`. |
| `image` | yes | Screenshot under `public/`, or `""`. |
| `dateAdded` | yes | `YYYY-MM-DD` or `null` if the real add date is unknown. |
| `dateAddedNote` | no | Why the date changed or is missing. |
| `lastVerified` | yes | `YYYY-MM-DD` when you checked the fiche, or `null` if you only migrated it. |
| `sources` | no | URLs you used. |
| `features` | no | Strings. |
| `howToUse` | no | `{ title, description, links? }`. |

Do not add `visits` or `rating`. The old numbers were not measured.

## Where the old copies went

The live site was `lib/data.tsx` on `restore3-new` (287 fiches). That array was the source for this folder.

These were not merged in, because they contradict that file:

- `lib/data.tsx` on `main` is an older, smaller list.
- `tools.json` and `tools.fixed.json` (when present) had dates into 2030 and repeated ids, and no page imported them.
- `data/ai-tools.ts` was a research list (NotebookLM and others) that no page imported. NotebookLM is now `notebooklm.json`, under the name the current Google page uses.
- `lib/data copie.tsx`, `lib/tools-data.ts`, and `lib/data.tsx.bak` were extra copies.

Choices made while migrating:

- Same official URL twice used to hide the extra card with `duplicate-of`. A later validated pass changed that for the rows it listed: those pages stay online with `status: "sunset"` and `successorId` when another fiche is the successor. Otter.ai keeps `otterai` and sunsets `otter`. DataRobot Code sunsets toward DataRobot. Both INK fiches sunset, and neither points at the other.
- `dateAdded` before 2019-01-01 was cleared. Those values were company dates, not dates this directory added the tool.
- A price label copied from the old file has `pricing.verified: false` and `lastVerified: null` unless a note says otherwise.
- `sunset` means the product is closed or the URL no longer opens the product. The page stays. `renamed` means the old name now redirects somewhere else.

## Validated import (2026-10-21)

Two files were applied onto this folder. Empty cells did not blank existing text. `id`, `image`, `features`, and `howToUse` were kept on updates. New fiches have no `visits` and no `rating`.

- Lot v3: new products, plus updates of flagship fiches. Where a lot row is the same product as a file already here, that file was updated. Midjourney’s `url` and `logo` were left as stored, because that row had neither a final URL nor a logo.
- Audit of the older 135-fiche list: each row was matched to this catalog by name or URL. Removes set `sunset` and do not delete the JSON. `successorId` is set only when the successor is another fiche in this folder.

## Adding a fiche

1. Copy a recent file, for example `content/tools/grok.json`.
2. Set a new `id`, and save it as `content/tools/{id}.json`.
3. Fill `url`, `summary`, `description`, `categories`, `tags`, and `pricing`.
4. Set `affiliateUrl` to `""`.
5. Set `dateAdded` to the day you add it, and `lastVerified` to the day you checked the official page.
6. Set `pricing.verified` to `true` only with `pricing.sourceUrl`.
7. Run `node scripts/catalog-index.mjs`.
