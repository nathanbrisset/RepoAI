# Conversion des prix — lot 3, 15 outils (16 novembre 2026)

- **Source:** ECB eurofxref-daily (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)
- **Date du taux:** 2026-11-13
- **Taux USD:** 1 EUR = 1,1052 USD  (donc 1 USD = 0.904814 EUR)
- **Taux GBP:** 1 EUR = 0,83559 GBP  (donc 1 GBP = 1.196759 EUR) — aucun prix GBP à convertir dans ce lot (Wooclap publie aussi un montant £ dans le payload, non utilisé pour l’affichage, car le tarif officiel affiché est déjà en euros).
- **Récupéré:** 2026-11-16 vers 10:44 Europe/Madrid. Le taux du lundi 16 novembre n’était pas encore publié (la BCE le diffuse en général vers 16:00 CET) ; le dernier taux de référence est celui du vendredi 13 novembre 2026, le même que pour les lots 1 et 2 du jour.
- **Arrondi:** à l’euro le plus proche, 0,5 arrondi au-dessus (`ROUND_HALF_UP`), uniquement pour les montants convertis depuis l’USD.
- Les champs `pricing_en` et `pricing_fr` n’affichent que des euros, sans $, £, USD, GBP ni « ≈ ». Le montant officiel dans la devise d’origine est dans `pricing_usd_official`.
- Les prix déjà officiels en euros (SkinVision, Doofinder, Landbot pour l’UE, Wooclap) sont affichés tels quels, y compris les centimes, sans nouvel arrondi.
- Les micro-montants USD qui arrondiraient à 0 €, ou qui seraient trompeurs une fois arrondis (tarifs à la photo de Virtual Staging AI, notamment 0,53 $ → 0 €), restent seulement dans `pricing_usd_official`.

## Table de conversion USD (montants utilisés dans ce lot)

| USD officiel | EUR exact (USD ÷ 1,1052) | EUR affiché |
|---:|---:|---:|
| 0 $ | 0.0000 € | 0 € |
| 0,53 $ | 0.4796 € | 0 € |
| 0,65 $ | 0.5881 € | 1 € |
| 0,95 $ | 0.8596 € | 1 € |
| 1 $ | 0.9048 € | 1 € |
| 2,67 $ | 2.4159 € | 2 € |
| 8 $ | 7.2385 € | 7 € |
| 9 $ | 8.1433 € | 8 € |
| 12 $ | 10.8578 € | 11 € |
| 16 $ | 14.4770 € | 14 € |
| 19 $ | 17.1915 € | 17 € |
| 20 $ | 18.0963 € | 18 € |
| 29 $ | 26.2396 € | 26 € |
| 39 $ | 35.2877 € | 35 € |
| 45 $ | 40.7166 € | 41 € |
| 60 $ | 54.2888 € | 54 € |
| 79 $ | 71.4803 € | 71 € |
| 80 $ | 72.3851 € | 72 € |
| 99 $ | 89.5765 € | 90 € |
| 100 $ | 90.4814 € | 90 € |
| 144 $ | 130.2932 € | 130 € |
| 192 $ | 173.7242 € | 174 € |
| 199 $ | 180.0579 € | 180 € |
| 228 $ | 206.2975 € | 206 € |
| 299 $ | 270.5393 € | 271 € |
| 300 $ | 271.4441 € | 271 € |
| 468 $ | 423.4528 € | 423 € |
| 720 $ | 651.4658 € | 651 € |
| 799 $ | 722.9461 € | 723 € |
| 948 $ | 857.7633 € | 858 € |
| 2499 $ | 2261.1292 € | 2261 € |
| 50000 $ | 45240.6804 € | 45241 € |
| 5000000 $ | 4524068.0420 € | 4524068 € |

## Outils par devise officielle

- **11 outils** avec au moins un montant USD converti : Upheal, Yoodli, Big Interview, Virtual Staging AI, Meilisearch, Weaviate, Twenty, Chatwoot, Langfuse, Helicone, AppFlowy.
- **4 outils** déjà tarifés en euros, non convertis : SkinVision (`skinvision`), Doofinder (`doofinder`), Landbot (`landbot`, tarifs UE), Wooclap (`wooclap`).
- **Landbot** : la page indique explicitement l’EUR pour les clients dans l’UE, l’USD sinon. L’affichage reprend les tarifs de liste UE en euros. Les tarifs hors UE restent dans `pricing_usd_official`.
- **Wooclap** : prix officiels déjà en euros, facturés à l’année et hors TVA. Des montants USD / GBP / CAD figurent aussi dans le payload de la page : non utilisés pour ce catalogue européen.
- **Virtual Staging AI** : le mensuel et l’annuel officiels utilisent le même tarif mensuel (l’annuel est facturé 12×). Les totaux annuels officiels (192 $ / 228 $ / 468 $ / 948 $) sont convertis. Les tarifs à la photo restent dans les notes officielles.
- **Twenty** : le plafond officiel « from 50 k$/year » d’Enterprise est converti en euros, comme les autres montants officiels en dollars. Les totaux annuels du basculeur −25 % n’ont pas été itemisés : non inventés, donc non convertis.
- **Helicone** : le plafond officiel de financement 5 M$ mentionné pour le crédit startups est converti en euros, comme les autres montants officiels en dollars. Ce n’est pas un tarif d’offre.
- **Yoodli** : seuls les 8 $/mois et 20 $/mois facturés à l’année sont convertis. Pas de prix de liste mensuel distinct à convertir.

