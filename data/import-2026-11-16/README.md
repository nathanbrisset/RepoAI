# Lot 2026-11-16 — 40 outils publiables (sur 40)

- logos/{slug}.png 128×128 -> public/logos/{id}.png
- screenshots/{slug}.webp 1440×900 (≥15 Ko) -> public/screenshots/{id}.webp — recadrage centre 1,6:1 depuis les PNG 1920×1072, qualité 80 (kodlo : recadrage calé à gauche pour garder le wordmark « kōdlo »)
- lot-40.csv : 40 lignes publiables ; `category` = catégories publiques actuelles (25, voir review.md) ; short_description_fr au tutoiement, sans $ ; `features` = points clés EN sans montants ; colonne `howTo` vidée (remplacée par copy-40.json) ; long_description vide
- copy-40.json : pricing_fr / pricing_en en € uniquement (affichage site), howTo_en / howTo_fr (tutoiement), features_en / features_fr, short_fr, category, official_url / official_url_final ; pricing_usd_official = montant $ officiel (vérif, NE PAS afficher)
- features-fr-40.json / features-en-40.json
- fx-notes.md : taux BCE 13/11/2026, 1 € = 1,1052 $
- md5.json (logos + screenshots)

Synter : `official_url` reste `https://synter.ai/` ; `official_url_final` = `https://synter.ai/en` (vitrine anglaise).

CanyonOS : le hero de la page d’accueil reste visuellement vide ; la capture livrée est la section « See How It Works » (titre + tableau de bord produit), recadrage centre.

Aucune capture jugée non acceptable. kōdlo : recadrage calé à gauche. Réserves mineures (toujours acceptables) : bandeaux d’annonce encore visibles sur Plurai Simulation, Ferndesk, Simular, three.dev et Neura.

Instructions cachées destinées à des agents IA constatées sur velozity.ai, naise.ai, genpage.ai, clocknext.com, three.dev, pomerado.ai, busabase.com et zernio.com : ignorées, non citées.

Rien n’est commité ni envoyé à Dev par ce livrable.
