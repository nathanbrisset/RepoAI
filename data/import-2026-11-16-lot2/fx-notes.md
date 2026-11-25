# Conversion des prix — lot 2, 30 outils (16 novembre 2026)

- **Source:** ECB eurofxref-daily (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)
- **Date du taux:** 2026-11-13
- **Taux USD:** 1 EUR = 1,1052 USD  (donc 1 USD = 0.904814 EUR)
- **Taux GBP:** 1 EUR = 0,83559 GBP  (donc 1 GBP = 1.196759 EUR)
- **Récupéré:** 2026-11-16 vers 10:16 Europe/Madrid. Le taux du lundi 16 novembre n’était pas encore publié (la BCE le diffuse en général vers 16:00 CET) ; le dernier taux de référence est celui du vendredi 13 novembre 2026, le même que pour le lot 1 du jour.
- **Arrondi:** à l’euro le plus proche, 0,5 arrondi au-dessus (`ROUND_HALF_UP`), uniquement pour les montants convertis depuis l’USD ou la GBP.
- Les champs `pricing_en` et `pricing_fr` n’affichent que des euros, sans $, £, USD, GBP ni « ≈ ». Le montant officiel dans la devise d’origine est dans `pricing_usd_official`.
- Les prix déjà officiels en euros (Kickresume, Resume.io, Slidesgo, Upscale.media) sont affichés tels quels, y compris les centimes, sans nouvel arrondi.
- Les micro-montants USD qui arrondiraient à 0 €, ou qui seraient trompeurs une fois arrondis (tarifs au crédit Palette et Audo, tarifs au jour Teal), restent seulement dans `pricing_usd_official`.

## Table de conversion USD (montants utilisés dans ce lot)

| USD officiel | EUR exact (USD ÷ 1,1052) | EUR affiché |
|---:|---:|---:|
| 0 $ | 0.0000 € | 0 € |
| 0,01 $ | 0.0090 € | 0 € |
| 0,15 $ | 0.1357 € | 0 € |
| 0,65 $ | 0.5881 € | 1 € |
| 0,87 $ | 0.7872 € | 1 € |
| 0,96 $ | 0.8686 € | 1 € |
| 1 $ | 0.9048 € | 1 € |
| 2,5 $ | 2.2620 € | 2 € |
| 3 $ | 2.7144 € | 3 € |
| 5 $ | 4.5241 € | 5 € |
| 5,83 $ | 5.2751 € | 5 € |
| 5,99 $ | 5.4198 € | 5 € |
| 6 $ | 5.4289 € | 5 € |
| 8 $ | 7.2385 € | 7 € |
| 8,33 $ | 7.5371 € | 8 € |
| 9 $ | 8.1433 € | 8 € |
| 9,9 $ | 8.9577 € | 9 € |
| 9,99 $ | 9.0391 € | 9 € |
| 10 $ | 9.0481 € | 9 € |
| 11,67 $ | 10.5592 € | 11 € |
| 11,99 $ | 10.8487 € | 11 € |
| 12,5 $ | 11.3102 € | 11 € |
| 13 $ | 11.7626 € | 12 € |
| 14,99 $ | 13.5632 € | 14 € |
| 16 $ | 14.4770 € | 14 € |
| 19 $ | 17.1915 € | 17 € |
| 19,9 $ | 18.0058 € | 18 € |
| 19,99 $ | 18.0872 € | 18 € |
| 20 $ | 18.0963 € | 18 € |
| 23,99 $ | 21.7065 € | 22 € |
| 24 $ | 21.7155 € | 22 € |
| 26,66 $ | 24.1223 € | 24 € |
| 29 $ | 26.2396 € | 26 € |
| 29,98 $ | 27.1263 € | 27 € |
| 29,99 $ | 27.1354 € | 27 € |
| 30 $ | 27.1444 € | 27 € |
| 36 $ | 32.5733 € | 33 € |
| 37 $ | 33.4781 € | 33 € |
| 40 $ | 36.1925 € | 36 € |
| 40,66 $ | 36.7897 € | 37 € |
| 49 $ | 44.3359 € | 44 € |
| 49,9 $ | 45.1502 € | 45 € |
| 49,95 $ | 45.1954 € | 45 € |
| 49,99 $ | 45.2316 € | 45 € |
| 50 $ | 45.2407 € | 45 € |
| 59 $ | 53.3840 € | 53 € |
| 60 $ | 54.2888 € | 54 € |
| 70 $ | 63.3370 € | 63 € |
| 72 $ | 65.1466 € | 65 € |
| 79 $ | 71.4803 € | 71 € |
| 80 $ | 72.3851 € | 72 € |
| 89,95 $ | 81.3880 € | 81 € |
| 97 $ | 87.7669 € | 88 € |
| 99,99 $ | 90.4723 € | 90 € |
| 100 $ | 90.4814 € | 90 € |
| 120 $ | 108.5776 € | 109 € |
| 140 $ | 126.6739 € | 127 € |
| 149 $ | 134.8172 € | 135 € |
| 150 $ | 135.7220 € | 136 € |
| 160 $ | 144.7702 € | 145 € |
| 199 $ | 180.0579 € | 180 € |
| 200 $ | 180.9627 € | 181 € |
| 215 $ | 194.5349 € | 195 € |
| 240 $ | 217.1553 € | 217 € |
| 245 $ | 221.6793 € | 222 € |
| 360 $ | 325.7329 € | 326 € |
| 640 $ | 579.0807 € | 579 € |
| 1200 $ | 1085.7763 € | 1086 € |
| 1000000 $ | 904813.6084 € | 904814 € |

## Table de conversion GBP (Teachmate)

| GBP officiel | EUR exact (GBP ÷ 0,83559) | EUR affiché |
|---:|---:|---:|
| 2 £ | 2.3935 € | 2 € |
| 4,99 £ | 5.9718 € | 6 € |
| 7,99 £ | 9.5621 € | 10 € |
| 59,88 £ | 71.6619 € | 72 € |
| 72 £ | 86.1667 € | 86 € |
| 414,75 £ | 496.3559 € | 496 € |

## Outils par devise officielle

- **25 outils** avec au moins un montant USD converti.
- **4 outils** déjà tarifés en euros, non convertis : Upscale.media (`upscale-media`), Kickresume (`kickresume`), Resume.io (`resume-io`), Slidesgo (`slidesgo`).
- **1 outil** converti depuis la GBP : Teachmate (`teachmate`).
- **Teal** : les tarifs officiels au jour (0,96 $ et 0,87 $) arrondiraient tous les deux à 1 €/jour ; ils restent dans `pricing_usd_official`. L’affichage reprend les totaux de période (12 € / semaine, 26 € / 30 jours, 71 € / 90 jours).
- **Palette.fm** et **Audo** : tarifs officiels au crédit trop petits ou trompeurs en euros entiers, détail seulement dans `pricing_usd_official`.
- **Slidesgo** : prix officiels EUR confirmés (la page peut aussi afficher une locale USD, non utilisée ici).
- **Finaloop** : le plafond officiel de revenu 1 M$ est converti en euros, comme les autres montants officiels en dollars.

