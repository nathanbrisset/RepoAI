# Lot 3, 2026-11-16 — 15 outils publiables (sur 15)

- logos/{slug}.png 128×128 -> public/logos/{id}.png
- screenshots/{slug}.webp 1440×900 (≥15 Ko) -> public/screenshots/{id}.webp — recadrage centre 1,6:1 depuis les PNG 1920×1072, qualité 80 (appflowy : recadrage calé à gauche pour garder le wordmark « appflowy »)
- lot-15.csv : 15 lignes publiables ; `category` = catégories publiques actuelles (25, voir review.md) ; short_description (EN) rempli ; short_description_fr au tutoiement, sans $ ni £ ; `features` = points clés EN sans montants ; colonne `howTo` vidée (remplacée par copy-15.json) ; long_description vide ; `hqCountry` rempli uniquement pour les 6 sièges confirmés (SkinVision Netherlands, Doofinder Spain, Landbot Spain, Meilisearch France, Weaviate Netherlands, Wooclap Belgium)
- copy-15.json : pricing_fr / pricing_en en € uniquement (affichage site), howTo_en / howTo_fr (tutoiement), features_en / features_fr, short_fr, category, official_url / official_url_final ; pricing_usd_official = montant officiel en $ (vérif, NE PAS afficher)
- features-fr-15.json / features-en-15.json
- fx-notes.md : taux BCE 13/11/2026, 1 € = 1,1052 $ et 1 € = 0,83559 £
- md5.json (logos + screenshots)

Doofinder : `official_url` reste `https://www.doofinder.com/` ; `official_url_final` = `https://www.doofinder.com/en/`.
Big Interview : `official_url` reste `https://biginterview.com/` ; `official_url_final` = `https://www.biginterview.com/`.

SkinVision : formulation prudente uniquement (évaluation de risque, conseil de voir un médecin, pas un diagnostic), en EN et en FR.

Aucune capture jugée non acceptable. AppFlowy : recadrage calé à gauche. Réserves mineures (toujours acceptables) : bandeaux d’annonce encore visibles (Doofinder, Landbot, Meilisearch, Weaviate, Helicone, Wooclap, Yoodli, Langfuse, AppFlowy) ; barre de restriction UE/EEE/UK sur Virtual Staging AI ; bulle de chat Yoodli ; icônes cookies / Preferences (Upheal, Big Interview) ; démo hero Doofinder en cours d’animation.

Instructions cachées destinées à des agents IA constatées sur landbot.io et appflowy.com, ainsi que sur des pages 404 de weaviate.io : ignorées, non citées.

Rien n’est commité ni envoyé à Dev par ce livrable.
