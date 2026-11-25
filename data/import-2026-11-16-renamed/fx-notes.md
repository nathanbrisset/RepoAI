# Conversion des prix — mini-lot renamed (16 novembre 2026)

- **Source:** ECB eurofxref-daily (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)
- **Date du taux:** 2026-11-13 (même taux que le lot 1 du 16 novembre)
- **Taux USD:** 1 EUR = 1,1052 USD  (donc 1 USD = 0,904814 EUR)
- **Taux GBP:** 1 EUR = 0,83559 GBP  (donc 1 GBP = 1,196759 EUR) — aucun prix GBP dans ce lot.
- **Arrondi:** à l’euro le plus proche, 0,5 arrondi au-dessus (`ROUND_HALF_UP`), uniquement pour les montants officiels en USD.
- Les champs `pricing_en` et `pricing_fr` n’affichent que des euros, sans $ ni « ≈ ». Le montant officiel dans la devise d’origine est dans `pricing_usd_official`.
- **Async** : prix officiels déjà en EUR (API de paiement qui alimente la page tarifs pour cette région). `converted_from_usd=false`, `official_currency=EUR`. Les montants en centimes (19,99 €, etc.) sont repris tels quels, sans nouvel arrondi.
- **Arena** et **Opera AI** : pas de montant payant public à convertir pour le produit lui-même.

## Table de conversion USD (montants utilisés dans ce lot)

| USD officiel | EUR exact (USD ÷ 1,1052) | EUR affiché |
|---:|---:|---:|
| 0 $ | 0.0000 € | 0 € |
| 6,67 $ | 6.0351 € | 6 € |
| 9,99 $ | 9.0391 € | 9 € |
| 14 $ | 12.6674 € | 13 € |
| 25 $ | 22.6203 € | 23 € |
| 45 $ | 40.7166 € | 41 € |
| 79,99 $ | 72.3760 € | 72 € |
| 140 $ | 126.6739 € | 127 € |

## Outils convertis depuis l’USD

- **3 outils** avec au moins un montant USD converti : Autosheet, Treblo, Anarlog.
- **1 outil** déjà en EUR : Async.
- **2 outils** sans montant payant public à convertir pour le produit lui-même : Arena (plateforme publique gratuite ; AI Evaluations sur devis), Opera AI (gratuit dans le navigateur).
