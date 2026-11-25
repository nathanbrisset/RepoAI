# Lot 4, 2026-11-16 — 8 outils publiables (sur 8)

- logos/{slug}.png 128×128 -> public/logos/{id}.png
- screenshots/{slug}.webp 1440×900 (≥15 Ko) -> public/screenshots/{id}.webp — recadrage centre 1,6:1 depuis les PNG 1920×1072, qualité 80 (aucun recadrage calé à gauche : les 8 wordmarks et titres tiennent dans le cadre centre)
- lot-8.csv : 8 lignes publiables ; `category` = catégories publiques actuelles (25, taxonomy `/tmp/r3n/content/taxonomy.json`, identique à qa47) ; short_description (EN) et short_description_fr remplis (textes de copy-8.json, tutoiement, sans $ ni £) ; `features` = points clés EN sans montants ; colonne `howTo` vidée (remplacée par copy-8.json) ; long_description vide ; `hqCountry` rempli uniquement pour les 6 sièges confirmés (GitGuardian France, Count United Kingdom, Wren AI United States, UX Pilot United States, BigML United States, AMBOSS Germany). Algolia et AI or Not restent vides.
- copy-8.json : pricing_fr / pricing_en en € uniquement (affichage site), howTo_en / howTo_fr (tutoiement), features_en / features_fr, short_en / short_fr, category, official_url / official_url_final ; pricing_usd_official = montant officiel en $ (vérif, NE PAS afficher)
- features-fr-8.json / features-en-8.json
- fx-notes.md : taux BCE 13/11/2026, 1 € = 1,1052 $ et 1 € = 0,83559 £
- md5.json (logos + screenshots)

Wren AI : `official_url` reste `https://getwren.ai/` ; `official_url_final` = `https://www.getwren.ai/`.
AMBOSS : `official_url` reste `https://www.amboss.com/` ; `official_url_final` = `https://www.amboss.com/int`.

AMBOSS : formulation prudente uniquement (ressource d’apprentissage et de référence, pas un substitut à un médecin), en EN et en FR.

Aucune capture jugée non acceptable. Recadrage centre pour les 8. Réserves mineures (toujours acceptables) : ruban d’annonce AMBOSS (« AMBOSS AI (LISA) outperforms… », bouton de fermeture laissé en place) ; barre d’annonce Algolia (webinar Shopify B2B) ; barre d’annonce Wren AI (SC26 Chicago, 17–19 nov.) ; panneau d’inscription intégré au hero BigML (pas une popup) ; carte de démo Wren AI affichant le métrique d’exemple « $4.2M » (chrome produit, pas un tarif).

Instructions cachées destinées à des agents IA constatées lors des captures sur gitguardian.com, algolia.com et getwren.ai : ignorées, non citées.

Rien n’est commité ni envoyé à Dev par ce livrable.
