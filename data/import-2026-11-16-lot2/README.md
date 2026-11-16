# Lot 2, 2026-11-16 — 30 outils publiables (sur 30)

- logos/{slug}.png 128×128 -> public/logos/{id}.png
- screenshots/{slug}.webp 1440×900 (≥15 Ko) -> public/screenshots/{id}.webp — recadrage centre 1,6:1 depuis les PNG 1920×1072, qualité 80 (slidesgo : recadrage calé à gauche pour garder le wordmark « SLIDESGO »)
- lot-30.csv : 30 lignes publiables ; `category` = catégories publiques actuelles (25, voir review.md) ; short_description_fr au tutoiement, sans $ ni £ ; `features` = points clés EN sans montants ; colonne `howTo` vidée (remplacée par copy-30.json) ; long_description vide
- copy-30.json : pricing_fr / pricing_en en € uniquement (affichage site), howTo_en / howTo_fr (tutoiement), features_en / features_fr, short_fr, category, official_url / official_url_final ; pricing_usd_official = montant officiel en $ ou £ (vérif, NE PAS afficher)
- features-fr-30.json / features-en-30.json
- fx-notes.md : taux BCE 13/11/2026, 1 € = 1,1052 $ et 1 € = 0,83559 £
- md5.json (logos + screenshots)

Kickresume : `official_url` reste `https://www.kickresume.com/` ; `official_url_final` = `https://www.kickresume.com/en/`.
JoggAI : `official_url` reste `https://jogg.ai/` ; `official_url_final` = `https://www.jogg.ai/`.

Toutes les 30 captures ont été inspectées visuellement (le batch 1 n’avait pas rouvert les PNG après enregistrement). Aucune retake nécessaire : pas de popup (y compris le popup app mobile Rezi, absent sur la capture), pas de bandeau cookies, pas de formulaire de connexion ni captcha, pas de page d’erreur, pas de titre en cours de frappe, pas de vitrine non anglaise.

Aucune capture jugée non acceptable. Slidesgo : recadrage calé à gauche. Réserves mineures (toujours acceptables) : bandeaux promo encore visibles sur Upscale.media, Audo et Puzzle ; bulles de chat en bas à droite sur Generated Photos, AskYourPDF et Transkriptor ; petits widgets en coins sur Puzzle ; barre Facebook en tête sur Eduaide.

Instructions cachées destinées à des agents IA constatées sur textcortex.com, linguix.com, askyourpdf.com, transkriptor.com et puzzle.io : ignorées, non citées.

Rien n’est commité ni envoyé à Dev par ce livrable.
