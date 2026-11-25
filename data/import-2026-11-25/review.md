# Trace de relecture — lot du 25 novembre 2026

Date : 2026-11-25, Europe/Madrid (UTC+1).
Sources : `/workspace/aitools-research/2026-11-25-lot.csv` et `2026-11-25-lot-notes.md` (Chercheur). Checkout lecture seule `/tmp/r3n-1125` (restore3-new @ 36f64287).
Captures : `/workspace/aitools-assets/lot-2026-11-25/screenshots/` (25 PNG 1920×1072, manifest.md, toutes ok).

## Décisions

- 24 publiables, 1 hold (Glassmail). Aucun remplacement depuis la réserve (TestSprite, Agenda Hero, SparrowDesk, Webless, OpenVorld) : Glassmail n’est pas un outil mort, c’est un doute de prix.
- 5 produits relancés conservés : Modem, tday.com, Fleetify, Incredible, Scribase.
- AlterContacts : hqCountry vide (demande PM).
- Promos labellisées, jamais comme prix de liste : Motionflare, Granular, Toone, Clam, plus DeskMagic (barre officielle −40 % jusqu’au 1er déc., hors liste initiale Chercheur). Glassmail en hold.
- Taux BCE du 24/11/2026 (dernier jour ouvrable), 1 € = 1,0963 $, arrondi half-up. Prix officiels déjà en € repris tels quels (Chat with Work, Toone, frwrd.to).
- Catégories : libellés publics des 25 entrées de taxonomy.json ; plusieurs remaps notés dans copy-24.json et le README.
- FR entièrement au tutoiement (les drafts CSV avaient du vouvoiement sur de nombreux shorts). « rendez-vous » conservé (nom composé, pas un vouvoiement).
- Garde-fou PR #67 appliqué aux champs affichés (y compris « not invented » / « pas inventé » et « USD » retirés des textes visibles).
- Micro-montants qui arrondissent à 0 € : non affichés.
- Totaux annuels : seulement ceux officiellement publiés (Chat with Work Personal ×10, Granular 129 $, Manufact Pro 3 000 $, Toone 79,99 €, Dippr Enterprise dès 6 000 $). AlterContacts −20 % et Adside prépaiement : pas de total inventé.

## Contrôles

- Logos 128×128 PNG, sources officielles. Modem, Teaflask, Fleetify et tensorViz repris depuis les SVG officiels (les premières versions étaient une icône 48 px, un favicon 32 px, une image Open Graph, une image sociale).
- WebP 1440×900 q80, tous ≥15 Ko. Dippr : recadrage gauche. Les 23 autres : centre.
- 0 collision catalogue (1 224 fiches) / lots déjà livrés.
- Pas de $, £, USD dans les champs affichés. Tutoiement FR. Catégories publiques. md5.json renseigné.

## Ce qui n’est pas dans ce livrable

- Logo et capture Glassmail : restent dans `_work` (hold).
- Aucun commit, aucun envoi à Dev depuis ce pack.
